import type { PartDefinition } from '../types';
const BASE = import.meta.env.BASE_URL;

/** ポスターの縦横比（幅 / 高さ）。ポスター画像は 1024 x 1536 = 2:3 */
export const POSTER_ASPECT = 2 / 3;

/**
 * 座標・サイズはすべてポスターに対する割合（0〜1）。
 * 元のポスター画像（1024x1536）から切り出した位置をそのまま使っています。
 */
export const PARTS: PartDefinition[] = [
  {
    id: 'goku',
    name: '「極盛り」',
    label: '極盛り',
    imageSrc: `${BASE}parts/goku.png`,
    width: 0.6416,
    height: 0.1966,
    correct: { x: 0.3462, y: 0.1094 },
    z: 6,
  },
  {
    id: 'bakuen',
    name: '「爆炎ラーメン」',
    label: '爆炎ラーメン',
    imageSrc: `${BASE}parts/bakuen.png`,
    width: 0.9443,
    height: 0.237,
    correct: { x: 0.4956, y: 0.2702 },
    z: 7,
  },
  {
    id: 'kikan',
    name: '期間限定スタンプ',
    label: '期間限定',
    imageSrc: `${BASE}parts/kikan.png`,
    width: 0.2812,
    height: 0.1901,
    correct: { x: 0.834, y: 0.1068 },
    z: 8,
  },
  {
    id: 'copy',
    name: 'キャッチコピー',
    label: '一口食べれば、もう止まらない！',
    imageSrc: `${BASE}parts/copy.png`,
    width: 0.6934,
    height: 0.2161,
    correct: { x: 0.3467, y: 0.418 },
    z: 2,
  },
  {
    id: 'bowl',
    name: 'ラーメンの写真',
    label: '🍜',
    imageSrc: `${BASE}parts/bowl.png`,
    width: 0.8926,
    height: 0.5195,
    correct: { x: 0.5244, y: 0.5918 },
    z: 1,
  },
  {
    id: 'burst',
    name: '辛さの限界に挑戦！',
    label: '辛さの限界に挑戦！',
    imageSrc: `${BASE}parts/burst.png`,
    width: 0.3154,
    height: 0.1908,
    correct: { x: 0.8423, y: 0.7503 },
    z: 5,
  },
  {
    id: 'banner',
    name: '濃厚スープの帯',
    label: '濃厚スープと特製香辛料の究極の一杯',
    imageSrc: `${BASE}parts/banner.png`,
    width: 0.542,
    height: 0.1706,
    correct: { x: 0.2769, y: 0.8997 },
    z: 3,
  },
  {
    id: 'price',
    name: '価格',
    label: '税込 1,280円',
    imageSrc: `${BASE}parts/price.png`,
    width: 0.5068,
    height: 0.1686,
    correct: { x: 0.7417, y: 0.9131 },
    z: 4,
  },
];

const partMap = new Map(PARTS.map((part) => [part.id, part]));

export function getPartById(id: string): PartDefinition | undefined {
  return partMap.get(id);
}

/** パーツ自身の縦横比（幅 / 高さ）を実寸ベースで返す */
export function getPartAspect(part: PartDefinition): number {
  return (part.width * POSTER_ASPECT) / part.height;
}