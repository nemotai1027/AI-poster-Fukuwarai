import type { PartDefinition } from '../types';

interface Props {
  part: PartDefinition;
}

/**
 * パーツ1個の見た目。
 * imageSrc があれば画像、なければ仮の図形・文字を表示します。
 * 親要素いっぱいに広がり、中の文字サイズはパーツ自身の大きさに合わせて変わります。
 */
export function PartView({ part }: Props) {
  return (
    <div className="part-view">
      {part.imageSrc ? (
        <img
          className="part-view__image"
          src={part.imageSrc}
          alt={part.name}
          draggable={false}
        />
      ) : (
        <div className={`pv-body pv-${part.id}`} role="img" aria-label={part.name}>
          {part.label.split('\n').map((line, index) => (
            <span key={index} className="pv-line">
              {line}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}