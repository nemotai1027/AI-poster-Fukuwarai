import { POSTER_ASPECT } from '../data/parts';
import type {
  PartDefinition,
  PartScore,
  Placement,
  Point,
  Rank,
  ScoreResult,
} from '../types';

/** この距離以内なら満点（ポスター幅を1とした値） */
const FULL_SCORE_DISTANCE = 0.02;
/** この距離以上離れると0点 */
const ZERO_SCORE_DISTANCE = 0.3;

/** 2点間の距離。縦横の割合を実寸の比に直してから計算する */
function getDistance(a: Point, b: Point): number {
  const dx = a.x - b.x;
  const dy = (a.y - b.y) / POSTER_ASPECT;
  return Math.hypot(dx, dy);
}

/** 距離 → 0〜1 の点数 */
export function distanceToScore(distance: number): number {
  if (distance <= FULL_SCORE_DISTANCE) return 1;
  if (distance >= ZERO_SCORE_DISTANCE) return 0;
  return (
    1 -
    (distance - FULL_SCORE_DISTANCE) /
      (ZERO_SCORE_DISTANCE - FULL_SCORE_DISTANCE)
  );
}

export function getRank(total: number): Rank {
  if (total >= 95) {
    return { grade: 'S', title: '福笑いマスター！', comment: 'ほぼ完璧！広告デザイナーになれます。' };
  }
  if (total >= 80) {
    return { grade: 'A', title: 'ポスター職人', comment: 'かなり正確です。あと少しで完全再現！' };
  }
  if (total >= 60) {
    return { grade: 'B', title: 'なかなかの腕前', comment: '全体の雰囲気はつかめています。' };
  }
  if (total >= 35) {
    return { grade: 'C', title: 'あと一歩', comment: '正解ポスターと見比べて再挑戦！' };
  }
  return { grade: 'D', title: '前衛アート', comment: 'これはこれで斬新なポスターです。' };
}

export function calculateScore(
  parts: PartDefinition[],
  placements: Placement[],
): ScoreResult {
  const partScores: PartScore[] = parts.map((part) => {
    const placement = placements.find((p) => p.partId === part.id);
    if (!placement) {
      return { partId: part.id, placed: false, distance: null, score: 0 };
    }
    const distance = getDistance(placement, part.correct);
    return {
      partId: part.id,
      placed: true,
      distance,
      score: distanceToScore(distance),
    };
  });

  const sum = partScores.reduce((acc, s) => acc + s.score, 0);
  const total = Math.round((sum / parts.length) * 100);

  return { total, partScores, rank: getRank(total) };
}