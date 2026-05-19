export const ChestImages = {
  normal: require('./chests/chest_normal.png'),
  rare: require('./chests/chest_rare.png'),
  epic: require('./chests/chest_epic.png'),
  legendary: require('./chests/chest_legendary.png'),
} as const;

export type ChestType = keyof typeof ChestImages;

export const BoostImages = {
  speed: require('./boosts/boost_speed.png'),
  shield: require('./boosts/boost_shield.png'),
  radar: require('./boosts/boost_radar.png'),
  xp: require('./boosts/boost_xp.png'),
  unlimited: require('./boosts/boost_unlimited.png'),
  area_lock: require('./boosts/boost_area_lock.png'),
  daily_x2: require('./boosts/boost_daily_x2.png'),
  energy: require('./boosts/boost_energy.png'),
  areaLock: require('./boosts/boost_area_lock.png'),
  dailyX2: require('./boosts/boost_daily_x2.png'),
} as const;

export type BoostType = keyof typeof BoostImages;

export const CoinImages = {
  pack2500: require('./coins/coin_pack_2500.png'),
  pack6500: require('./coins/coin_pack_6500.png'),
  pack15000: require('./coins/coin_pack_15000.png'),
  pack35000: require('./coins/coin_pack_35000.png'),
  pack75000: require('./coins/coin_pack_75000.png'),
  pack_2500: require('./coins/coin_pack_2500.png'),
  pack_6500: require('./coins/coin_pack_6500.png'),
  pack_15000: require('./coins/coin_pack_15000.png'),
  pack_35000: require('./coins/coin_pack_35000.png'),
  pack_75000: require('./coins/coin_pack_75000.png'),
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
  first: require('./podiums/podium_1st.png'),
  second: require('./podiums/podium_2nd.png'),
  third: require('./podiums/podium_3rd.png'),
} as const;

export type PodiumType = keyof typeof PodiumImages;
