import { useCallback, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import './App.css';
import { PartTray } from './components/PartTray';
import { PartView } from './components/PartView';
import { PosterBoard } from './components/PosterBoard';
import { ResultModal } from './components/ResultModal';
import { ScorePanel } from './components/ScorePanel';
import { PARTS, getPartById } from './data/parts';
import { usePartDrag } from './hooks/usePartDrag';
import type { Placement, Point, ScoreResult } from './types';
import { calculateScore } from './utils/score';
import { shuffle } from './utils/shuffle';

interface Report {
  result: ScoreResult;
  /** 答え合わせを押した時点の配置 */
  placements: Placement[];
}

function createTrayOrder(): string[] {
  return shuffle(PARTS.map((part) => part.id));
}

function App() {
  const posterRef = useRef<HTMLDivElement>(null);
  const trayRef = useRef<HTMLDivElement>(null);

  // ポスター上のパーツ（あとから動かしたものほど手前に表示される）
  const [placements, setPlacements] = useState<Placement[]>([]);
  // 置き場での並び順（正解の並びが分からないようシャッフル）
  const [trayOrder, setTrayOrder] = useState<string[]>(createTrayOrder);
  const [report, setReport] = useState<Report | null>(null);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);

  // 配置（同じパーツは一度外してから追加するので、複数置かれることはない）
  const handlePlace = useCallback((partId: string, position: Point) => {
    setPlacements((prev) => [
      ...prev.filter((p) => p.partId !== partId),
      { partId, ...position },
    ]);
  }, []);

  // 置き場に戻す
  const handleReturn = useCallback((partId: string) => {
    setPlacements((prev) => prev.filter((p) => p.partId !== partId));
  }, []);

  const getPartSize = useCallback((partId: string) => {
    const part = getPartById(partId);
    return { width: part?.width ?? 0.1, height: part?.height ?? 0.1 };
  }, []);

  const { drag, startDrag } = usePartDrag({
    posterRef,
    trayRef,
    getPartSize,
    onPlace: handlePlace,
    onReturn: handleReturn,
  });

  const handleTrayPointerDown = (e: ReactPointerEvent<HTMLElement>, partId: string) =>
    startDrag(e, partId, 'tray');
  const handlePosterPointerDown = (e: ReactPointerEvent<HTMLElement>, partId: string) =>
    startDrag(e, partId, 'poster');

  const handleCheck = () => {
    const result = calculateScore(PARTS, placements);
    setReport({ result, placements });
    setIsResultOpen(true);
    setBestScore((prev) => (prev === null ? result.total : Math.max(prev, result.total)));
    setAttempts((prev) => prev + 1);
  };

  const handleReset = () => {
    setPlacements([]);
    setTrayOrder(createTrayOrder());
    setReport(null);
    setIsResultOpen(false);
  };

  const handleCloseResult = useCallback(() => setIsResultOpen(false), []);

  const trayPartIds = trayOrder.filter(
    (id) => !placements.some((p) => p.partId === id),
  );
  const dragPart = drag ? getPartById(drag.partId) : undefined;
  const draggingId = drag?.partId ?? null;

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">
          <span aria-hidden="true">🔥</span> AIポスター福笑い{' '}
          <span aria-hidden="true">🔥</span>
        </h1>
        <p className="app__lead">
          生成AIが作った広告ポスター「極盛り爆炎ラーメン」がバラバラに！
          パーツを元の位置に戻して、完成度を競おう。
        </p>
        <ol className="howto">
          <li>置き場のパーツをポスターへドラッグ（スマホはタッチ）</li>
          <li>置いたパーツは何度でも動かせる・置き場に戻せる</li>
          <li>「答え合わせ」で採点＆正解ポスターを確認</li>
        </ol>
        <p className="howto-short">パーツをポスターにドラッグして、元の位置に戻そう！</p>
      </header>

      <main className="app__main">
        <section className="stage" aria-label="ポスター配置エリア">
          <div className="stage__inner">
            <PosterBoard
              placements={placements}
              draggingId={draggingId}
              posterRef={posterRef}
              onPartPointerDown={handlePosterPointerDown}
            />
          </div>
        </section>

        <div className="side">
          <PartTray
            partIds={trayPartIds}
            draggingId={draggingId}
            trayRef={trayRef}
            onPartPointerDown={handleTrayPointerDown}
          />
          <ScorePanel
            placedCount={placements.length}
            totalCount={PARTS.length}
            lastScore={report?.result.total ?? null}
            bestScore={bestScore}
            attempts={attempts}
            hasResult={report !== null}
            onCheck={handleCheck}
            onReset={handleReset}
            onShowResult={() => setIsResultOpen(true)}
          />
        </div>
      </main>

      {/* ドラッグ中に指・マウスについてくるパーツ */}
      {drag && dragPart && (
        <div
          className="drag-ghost"
          style={{
            left: drag.x - drag.offsetX - drag.width / 2,
            top: drag.y - drag.offsetY - drag.height / 2,
            width: drag.width,
            height: drag.height,
          }}
        >
          <PartView part={dragPart} />
        </div>
      )}

      {isResultOpen && report && (
        <ResultModal
          result={report.result}
          placements={report.placements}
          onClose={handleCloseResult}
        />
      )}
    </div>
  );
}

export default App;