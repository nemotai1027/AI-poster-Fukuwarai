import type { PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { getPartById } from '../data/parts';
import type { Placement } from '../types';
import { PlacedPart } from './PlacedPart';
import { PosterFrame } from './PosterFrame';

interface Props {
  placements: Placement[];
  /** ドラッグ中のパーツID（ポスター上では非表示にする） */
  draggingId: string | null;
  posterRef: RefObject<HTMLDivElement | null>;
  onPartPointerDown: (e: ReactPointerEvent<HTMLElement>, partId: string) => void;
}

/** パーツを配置・移動できるポスター */
export function PosterBoard({
  placements,
  draggingId,
  posterRef,
  onPartPointerDown,
}: Props) {
  return (
    <PosterFrame posterRef={posterRef}>
      {placements.map((placement) => {
        const part = getPartById(placement.partId);
        if (!part) return null;
        return (
          <PlacedPart
            key={placement.partId}
            part={part}
            x={placement.x}
            y={placement.y}
            hidden={draggingId === placement.partId}
            onPointerDown={(e) => onPartPointerDown(e, placement.partId)}
          />
        );
      })}
      {placements.length === 0 && (
        <p className="poster__hint">
          パーツをここに
          <br />
          ドラッグしてね！
        </p>
      )}
    </PosterFrame>
  );
}