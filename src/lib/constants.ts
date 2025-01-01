import { Screen } from "@/components/Common/types/common.types";

export const INFURA_GATEWAY: string = "https://thedial.infura-ipfs.io/ipfs/";
export const IPFS_REGEX: RegExp = /\b(Qm[1-9A-Za-z]{44}|ba[A-Za-z2-7]{57})\b/;
export const STORAGE_NODE: string = "https://storage-api.testnet.lens.dev";

export const FILTERS: string[] = [
  "BOS Music Video 1",
  "BOS Music Video 2",
  "EKKO",
  "Powder",
  "Generic Anime",
  "3D Anime Mix",
  "B&W Sketch",
  "Audio To Text",
];

export const SCREENS: Screen[] = [
  {
    title: "On The Lines",
    description:
      "Your feeds from Lens, Farcaster, and Bluesky in one place. Save anything on the user owned web that catches your eye.",
  },

  {
    description:
      "Agents stimulate your thoughts with questions and hints while you edit, turning saves into content you can publish across web3 social.",
    title: "Sessions",
  },
  {
    description:
      "Don't let algorithms ghost you. Reputation grows from posts that land. Daily voting lets proven voices direct attention where it counts.",
    title: "Reach",
  },
  {
    description:
      "Quick-reaction tokens and sticker packs become tradeable assets. Communities co-monetize with creators from what spreads.",
    title: "Memes",
  },
  {
    description:
      "The past returns when you need a refresher. And with it new content to share with friends and agent sessions.",
    title: "Memories",
  },
  {
    title: "Account",
    description: "",
  },
];

export const FEED_TYPES: string[] = ["for you", "video", "image", "text"];

export const SESSION_DATA_CONTRACT: `0x${string}` = "0x012902519C28FB6a473650d01329981284C866E4";
export const MEME_DATA_CONTRACT: `0x${string}` = "0x5d00671DCb428279320b9b37F8615488A0f74c9d";
