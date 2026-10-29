import { useEffect } from 'react';
import { PARTS, getPartById } from '../data/parts';
import type { Placement, ScoreResult } from '../types';
import { StaticPoster } from './StaticPoster';

interface Props {
  result: ScoreResult;
  /** 答え合わせを押した時点の配置 */
  placements: Placement[];
  onClose: () => void;
}

/** 正解ポスター（全パーツを正解位置に、元のポスターの重なり順で置いたもの） */
const ANSWER_PLACEMENTS: Placement[] = [...PARTS]
  .sort((a, b) => a.z - b.z)
  .map((part) => ({ partId: part.id, ...part.correct }));

export function ResultModal({ result, placements, onClose }: Props) {
  // Escape キーで閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="result-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="result-title" className="modal__title">
          答え合わせ結果
        </h2>

        <div className="result__summary">
          <div className="result__score">
            {result.total}
            <small>点</small>
          </div>
          <div className="result__rank">
            <span className="result__grade">{result.rank.grade}</span>
            <div>
              <p className="result__rank-title">{result.rank.title}</p>
              <p className="result__comment">{result.rank.comment}</p>
            </div>
          </div>
        </div>

        <div className="result__posters">
          <figure className="result__figure">
            <figcaption>あなたの配置</figcaption>
            <StaticPoster placements={placements} />
          </figure>
          <figure className="result__figure">
            <figcaption>正解ポスター</figcaption>
            <StaticPoster placements={ANSWER_PLACEMENTS} />
          </figure>
        </div>

        <ul className="result__list">
          {result.partScores.map((s) => {
            const part = getPartById(s.partId);
            const percent = Math.round(s.score * 100);
            return (
              <li key={s.partId} className="result__item">
                <span className="result__name">{part?.name ?? s.partId}</span>
                <span className="result__bar" aria-hidden="true">
                  <span style={{ width: `${percent}%` }} />
                </span>
                <span className="result__pct">{s.placed ? `${percent}点` : '未配置'}</span>
              </li>
            );
          })}
        </ul>

        <button type="button" className="btn btn--primary modal__close" onClick={onClose} autoFocus>
          閉じて再挑戦する
        </button>
      </div>
    </div>
  );
}