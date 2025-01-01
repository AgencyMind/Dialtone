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
  gifOpen: {
    id: string;
    gif: string;
    open: boolean;
  };
  lensAccount: LensAccount | undefined;
  setExpand: (e: SetStateAction<boolean>) => void;
  expand: boolean;
  aiKey: string | undefined;
  storageClient: StorageClient;
  setSignless: (e: SetStateAction<boolean>) => void;
  setIndexer: (e: SetStateAction<string | undefined>) => void;
  setNotification: (e: SetStateAction<string | undefined>) => void;
  setGifOpen: (
    e: SetStateAction<{
      id: string;
      gif: string;
      open: boolean;
    }>
  ) => void;
  setImageView: (e: SetStateAction<string | undefined>) => void;
  lensClient: PublicClient | undefined;
  setScreen: (e: SetStateAction<Screen>) => void;
  setCurrentSession: (e: SetStateAction<CurrentSession>) => void;
  currentSession: CurrentSession;
};

export interface LensAccount {
  account?: Account;
  sessionClient?: SessionClient;
}

export interface CurrentSession {
  post?: Post;
  editors: EditorType[];
  currentIndex: number;
  image?: Blob | undefined;
  video?: any;
}
