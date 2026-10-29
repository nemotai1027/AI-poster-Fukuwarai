import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, RefObject } from 'react';
import type { Point } from '../types';

export type DragSource = 'tray' | 'poster';

export interface DragState {
  partId: string;
  source: DragSource;
  pointerId: number;
  /** ポインタの現在位置（画面座標） */
  x: number;
  y: number;
  /** ポインタ位置 − ゴースト中心位置 */
  offsetX: number;
  offsetY: number;
  /** ゴースト（ドラッグ中に指についてくる見た目）の大きさ(px) */
  width: number;
  height: number;
}

interface Options {
  posterRef: RefObject<HTMLDivElement | null>;
  trayRef: RefObject<HTMLDivElement | null>;
  /** パーツの大きさ（ポスターに対する割合） */
  getPartSize: (partId: string) => { width: number; height: number };
  onPlace: (partId: string, position: Point) => void;
  onReturn: (partId: string) => void;
}

function isInside(rect: DOMRect, x: number, y: number): boolean {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function usePartDrag(options: Options) {
  const [drag, setDrag] = useState<DragState | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const optionsRef = useRef(options);

  // 常に最新のオプションを参照できるようにする
  useEffect(() => {
    optionsRef.current = options;
  });

  const isDragging = drag !== null;

  // ドラッグ中だけ、window に move / up / cancel を登録する
  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: PointerEvent) => {
      const current = dragRef.current;
      if (!current || e.pointerId !== current.pointerId) return;
      const next = { ...current, x: e.clientX, y: e.clientY };
      dragRef.current = next;
      setDrag(next);
    };

    const finish = (e: PointerEvent, cancelled: boolean) => {
      const current = dragRef.current;
      if (!current || e.pointerId !== current.pointerId) return;

      const { posterRef, trayRef, onPlace, onReturn } = optionsRef.current;

      if (!cancelled) {
        const poster = posterRef.current?.getBoundingClientRect();
        const tray = trayRef.current?.getBoundingClientRect();

        if (poster && isInside(poster, e.clientX, e.clientY)) {
          // ポスター上: パーツ中心の位置を 0〜1 の割合に直して配置
          const centerX = e.clientX - current.offsetX;
          const centerY = e.clientY - current.offsetY;
          onPlace(current.partId, {
            x: clamp01((centerX - poster.left) / poster.width),
            y: clamp01((centerY - poster.top) / poster.height),
          });
        } else if (tray && isInside(tray, e.clientX, e.clientY)) {
          // 置き場の上: 置き場に戻す
          onReturn(current.partId);
        }
        // それ以外（どちらでもない場所）: 何も変えない（元の場所に戻る）
      }

      dragRef.current = null;
      setDrag(null);
    };

    const handleUp = (e: PointerEvent) => finish(e, false);
    const handleCancel = (e: PointerEvent) => finish(e, true);

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleCancel);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleCancel);
    };
  }, [isDragging]);

  const startDrag = useCallback(
    (e: ReactPointerEvent<HTMLElement>, partId: string, source: DragSource) => {
      if (dragRef.current) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;

      const poster = optionsRef.current.posterRef.current;
      if (!poster) return;
      const posterRect = poster.getBoundingClientRect();
      const size = optionsRef.current.getPartSize(partId);

      // 置き場から掴んだときはポインタ位置がパーツ中心。
      // タッチ操作では指で隠れないよう、パーツを少し上に表示する。
      let offsetX = 0;
      let offsetY = e.pointerType === 'touch' ? 40 : 0;

      if (source === 'poster') {
        // ポスター上のパーツは、掴んだ位置を保ったまま動かす
        const rect = e.currentTarget.getBoundingClientRect();
        offsetX = e.clientX - (rect.left + rect.width / 2);
        offsetY = e.clientY - (rect.top + rect.height / 2);
      }

      const next: DragState = {
        partId,
        source,
        pointerId: e.pointerId,
        x: e.clientX,
        y: e.clientY,
        offsetX,
        offsetY,
        width: size.width * posterRect.width,
        height: size.height * posterRect.height,
      };
      dragRef.current = next;
      setDrag(next);
      e.preventDefault();
    },
    [],
  );

  return { drag, startDrag };
}