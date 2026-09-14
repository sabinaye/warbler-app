// Copied into assets/woby/ from design_handoff_warbler/assets/ — see that folder's README for
// which state each illustration is for. These are the shipping assets, not placeholders; the
// README notes vector/Lottie originals should replace them eventually for real wing/face
// animation, but the PNGs themselves are final.
export const WOBY = {
  hero: require('../../assets/woby/woby-hero.png'),
  happy: require('../../assets/woby/woby-happy.png'),
  sing: require('../../assets/woby/woby-sing.png'),
  love: require('../../assets/woby/woby-love.png'),
  fly: require('../../assets/woby/woby-fly.png'),
  tired: require('../../assets/woby/woby-tired.png'),
  cry: require('../../assets/woby/woby-cry.png'),
  oops: require('../../assets/woby/woby-oops.png'),
  angry: require('../../assets/woby/woby-angry.png'),
} as const;

export type WobyFace = keyof typeof WOBY;
