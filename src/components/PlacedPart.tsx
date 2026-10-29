import type { PointerEvent as ReactPointerEvent } from 'react';
import type { PartDefinition } from '../types';
import { PartView } from './PartView';

interface Props {
  part: PartDefinition;
  /** パーツ中心の位置（ポスターに対する割合 0〜1） */
  x: number;
  y: number;
  hidden?: boolean;
  onPointerDown?: (e: ReactPointerEvent<HTMLDivElement>) => void;
}

export function PlacedPart({ part, x, y, hidden = false, onPointerDown }: Props) {
  return (
    <div
      className={`placed-part${onPointerDown ? ' placed-part--movable' : ''}`}
      style={{
        left: `${(x - part.width / 2) * 100}%`,
        top: `${(y - part.height / 2) * 100}%`,
        width: `${part.width * 100}%`,
        height: `${part.height * 100}%`,
        opacity: hidden ? 0 : 1,
      }}
      onPointerDown={onPointerDown}
    >
      <PartView part={part} />
    </div>
  );
}