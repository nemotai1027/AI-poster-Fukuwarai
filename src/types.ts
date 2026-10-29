/** ポスター上の座標。x, y ともに 0〜1 の割合（パーツの中心位置） */
export interface Point {
  x: number;
  y: number;
}

/** パーツ1個の定義データ */
export interface PartDefinition {
  id: string;
  /** 採点結果などに表示する名前 */
  name: string;
  /** 仮パーツに表示する文字（\n で改行） */
  label: string;
  /** パーツの幅（ポスター幅に対する割合 0〜1） */
  width: number;
  /** パーツの高さ（ポスター高さに対する割合 0〜1） */
  height: number;
  /** 正解位置（パーツ中心） */
  correct: Point;
  /** 透過PNGに差し替えるときの画像パス（例: "/parts/goku.png"）。未指定なら仮パーツを表示 */
  imageSrc?: string;
    /** 元ポスターでの重なり順（大きいほど手前）。正解ポスター表示で使用 */
  z: number;
}

/** ポスター上に置かれたパーツ */
export interface Placement extends Point {
  partId: string;
}

export interface PartScore {
  partId: string;
  placed: boolean;
  /** 正解位置との距離（ポスター幅を1とした値）。未配置なら null */
  distance: number | null;
  /** 0〜1 */
  score: number;
}

export interface Rank {
  grade: string;
  title: string;
  comment: string;
}

export interface ScoreResult {
  /** 0〜100 の整数 */
  total: number;
  partScores: PartScore[];
  rank: Rank;
}