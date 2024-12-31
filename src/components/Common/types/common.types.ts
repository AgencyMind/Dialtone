import { EditorType } from "@/components/Feed/types/feed.types";
import {
  Account,
  Post,
  PublicClient,
  SessionClient,
} from "@lens-protocol/client";
import { StorageClient } from "@lens-protocol/storage-node-client";
import { SetStateAction } from "react";

export interface Screen {
  title: string;
  description: string;
}

export type ScreenSwitchProps = {
  screen: Screen;
  storageClient: StorageClient;
  setSignless: (e: SetStateAction<boolean>) => void;
  setIndexer: (e: SetStateAction<string | undefined>) => void;
  setNotification: (e: SetStateAction<string | undefined>) => void;
  setGifOpen: (e: SetStateAction<boolean>) => void;
  setImageView: (e: SetStateAction<string | undefined>) => void;
  lensClient: PublicClient | undefined;
  sessionClient: SessionClient | undefined;
  setScreen: (e: SetStateAction<Screen>) => void;
  setCurrentSession: (
    e: SetStateAction<{
      post?: Post;
      editors: EditorType[];
      currentIndex: number
    }>
  ) => void;
  currentSession: {
    post?: Post;
    editors: EditorType[];
    currentIndex: number
  };
};

export enum Social {
  Lens = "Lens",
  Bluesky = "Bluesky",
  Farcaster = "Farcaster",
}

export type FeedOptionsProps = {
  socials: Social[];
  setSocials: (e: SetStateAction<Social[]>) => void;
  feedType: string;
  setFeedType: (e: SetStateAction<string>) => void;
  feedTypeOpen: boolean;
  setFeedTypeOpen: (e: SetStateAction<boolean>) => void;
};

export interface LensAccount {
  account?: Account;
  sessionClient?: SessionClient;
}
