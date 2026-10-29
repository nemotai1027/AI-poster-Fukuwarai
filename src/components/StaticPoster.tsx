import { getPartById } from '../data/parts';
import type { Placement } from '../types';
import { PlacedPart } from './PlacedPart';
import { PosterFrame } from './PosterFrame';

interface Props {
  placements: Placement[];
}

/** 操作できない表示専用ポスター（答え合わせ画面で使用） */
export function StaticPoster({ placements }: Props) {
  return (
    <PosterFrame>
      {placements.map((placement) => {
        const part = getPartById(placement.partId);
        if (!part) return null;
        return (
          <PlacedPart
            key={placement.partId}
            part={part}
            x={placement.x}
            y={placement.y}
          />
        );
      })}
    </PosterFrame>
  );
}