export const ChestImages = {
  normal: require('./boosts/sandik_normal.png'),
  rare: require('./boosts/sandik_rare.png'),
  epic: require('./boosts/sandik_epik.png'),
  legendary: require('./boosts/sandik_legend.png'),
} as const;

export type ChestType = keyof typeof ChestImages;

export const BoostImages = {
  speed: require('./boosts/boots_card.png'),
  shield: require('./boosts/kalkan_card.png'),
  radar: require('./boosts/radar_card.png'),
  xp: require('./boosts/gem600.png'),
  unlimited: require('./boosts/ayricalik.png'),
  area_lock: require('./boosts/kalkan_card.png'),
  daily_x2: require('./boosts/gem1500.png'),
  energy: require('./boosts/gem200.png'),
  areaLock: require('./boosts/kalkan_card.png'),
  dailyX2: require('./boosts/gem1500.png'),
} as const;

export type BoostType = keyof typeof BoostImages;

export const CoinImages = {
  pack2500: require('./boosts/coin_2500.png'),
  pack6500: require('./boosts/coin_6500.png'),
  pack15000: require('./boosts/coin_15000.png'),
  pack35000: require('./boosts/coin_35000.png'),
  pack75000: require('./boosts/coin_75000.png'),
  pack_2500: require('./boosts/coin_2500.png'),
  pack_6500: require('./boosts/coin_6500.png'),
  pack_15000: require('./boosts/coin_15000.png'),
  pack_35000: require('./boosts/coin_35000.png'),
  pack_75000: require('./boosts/coin_75000.png'),
} as const;

export type CoinType = keyof typeof CoinImages;

export const UIImages = {
  coin: require('./ui/icon_coin.png'),
  gem: require('./ui/icon_gem.png'),
} as const;

export type UIType = keyof typeof UIImages;

export const AvatarImages = {
  rookie: require('./avatars/avatar_rookie.png'),
  soldier: require('./avatars/avatar_soldier.png'),
  pilot: require('./avatars/avatar_pilot.png'),
  sniper: require('./avatars/avatar_sniper.png'),
  elite: require('./avatars/avatar_elite.png'),
} as const;

export type AvatarType = keyof typeof AvatarImages;

export const TrailImages = {
  ice: require('./trails/trail_ice.png'),
  fire: require('./trails/trail_fire.png'),
  plasma: require('./trails/trail_plasma.png'),
  acid: require('./trails/trail_acid.png'),
} as const;

export type TrailType = keyof typeof TrailImages;

export const FrameImages = {
  cyan: require('./frames/frame_cyan.png'),
  gold: require('./frames/frame_gold.png'),
  purple: require('./frames/frame_purple.png'),
  red: require('./frames/frame_red.png'),
} as const;

export type FrameType = keyof typeof FrameImages;

export const PodiumImages = {
  first: require('./podiums/kursu.png'),
  second: require('./podiums/kursu.png'),
  third: require('./podiums/kursu.png'),
} as const;

export type PodiumType = keyof typeof PodiumImages;
