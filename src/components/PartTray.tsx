import type {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  RefObject,
} from 'react';
import { getPartAspect, getPartById } from '../data/parts';
import { PartView } from './PartView';

interface Props {
  /** 置き場に表示するパーツIDの一覧（表示順） */
  partIds: string[];
  draggingId: string | null;
  trayRef: RefObject<HTMLDivElement | null>;
  onPartPointerDown: (e: ReactPointerEvent<HTMLElement>, partId: string) => void;
}

export function PartTray({ partIds, draggingId, trayRef, onPartPointerDown }: Props) {
  return (
    <div className="panel tray" ref={trayRef} role="region" aria-label="パーツ置き場">
      <h2 className="panel__title">パーツ置き場（{partIds.length}個）</h2>

      {partIds.length === 0 ? (
        <p className="tray__empty">
          すべて配置しました！
          <br />
          「答え合わせ」を押してみよう。
        </p>
      ) : (
        <div className="tray__grid">
          {partIds.map((id) => {
            const part = getPartById(id);
            if (!part) return null;
            const aspect = getPartAspect(part);
            return (
              <div
                key={id}
                className={`tray-cell${aspect > 3 ? ' tray-cell--wide' : ''}`}
              >
                <div
                  className="tray-item"
                  style={{ '--aspect': aspect } as CSSProperties}
                  data-dragging={draggingId === id}
                  onPointerDown={(e) => onPartPointerDown(e, id)}
                >
                  <PartView part={part} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}