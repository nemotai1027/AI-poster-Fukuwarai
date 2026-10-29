interface Props {
  placedCount: number;
  totalCount: number;
  lastScore: number | null;
  bestScore: number | null;
  attempts: number;
  hasResult: boolean;
  onCheck: () => void;
  onReset: () => void;
  onShowResult: () => void;
}

export function ScorePanel({
  placedCount,
  totalCount,
  lastScore,
  bestScore,
  attempts,
  hasResult,
  onCheck,
  onReset,
  onShowResult,
}: Props) {
  return (
    <div className="panel scorepanel">
      <h2 className="panel__title">スコア</h2>

      <div className="score__main" aria-live="polite">
        <span className="score__value">{lastScore ?? '--'}</span>
        <span className="score__unit">点</span>
      </div>

      <dl className="score__stats">
        <div>
          <dt>配置済み</dt>
          <dd>
            {placedCount}/{totalCount}
          </dd>
        </div>
        <div>
          <dt>ベスト</dt>
          <dd>{bestScore ?? '--'}</dd>
        </div>
        <div>
          <dt>挑戦回数</dt>
          <dd>{attempts}</dd>
        </div>
      </dl>

      <div className="scorepanel__buttons">
        <button type="button" className="btn btn--primary" onClick={onCheck}>
          答え合わせ
        </button>
        <button type="button" className="btn btn--secondary" onClick={onReset}>
          リセット
        </button>
      </div>

      {hasResult && (
        <button type="button" className="btn btn--ghost" onClick={onShowResult}>
          前回の結果をもう一度見る
        </button>
      )}
    </div>
  );
}