import type { ReactNode, RefObject } from 'react';

interface Props {
  children?: ReactNode;
  posterRef?: RefObject<HTMLDivElement | null>;
}

/** ポスターの背景（炎と星のコミック背景）。パーツはこの上に重ねます。 */
export function PosterFrame({ children, posterRef }: Props) {
  return (
    <div className="poster" ref={posterRef}>
      <div className="poster__bg" aria-hidden="true">
        <img
          className="poster__bgimage"
          src={`${import.meta.env.BASE_URL}poster-bg.png`}
          alt=""
          draggable={false}
        />
      </div>
      {children}
    </div>
  );
}