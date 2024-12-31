import { Screen } from "@/components/Common/types/common.types";
import {
  ImageMetadata,
  Post,
  PublicClient,
  SessionClient,
  TextOnlyMetadata,
  VideoMetadata,
} from "@lens-protocol/client";
import { StorageClient } from "@lens-protocol/storage-node-client";
import { SetStateAction } from "react";

export type FeedProps = {
  setImageView: (e: SetStateAction<string | undefined>) => void;
  client: PublicClient | SessionClient | undefined;
  setGifOpen: (e: SetStateAction<boolean>) => void;
  setScreen: (e: SetStateAction<Screen>) => void;
  storageClient: StorageClient;
  sessionClient: SessionClient;
  setSignless: (e: SetStateAction<boolean>) => void;
  setIndexer: (e: SetStateAction<string | undefined>) => void;
  setNotification: (e: SetStateAction<string | undefined>) => void;
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

export type MetadataSwitchProps = {
  metadata: string;
  data: TextOnlyMetadata | ImageMetadata | VideoMetadata;
  setImageView?: (e: SetStateAction<string | undefined>) => void;
};

export type ReactionsBarProps = {
  setScreen: (e: SetStateAction<Screen>) => void;
  setGifOpen: (e: SetStateAction<boolean>) => void;
  setCurrentSession: (
    e: SetStateAction<{
      post?: Post;
      editors: EditorType[];
      currentIndex: number
    }>
  ) => void;
  post: Post;
  currentSession: {
    post?: Post;
    editors: EditorType[];
    currentIndex: number
  };
  index: number;
  storageClient: StorageClient;
  sessionClient: SessionClient;
  setSignless: (e: SetStateAction<boolean>) => void;
  setIndexer: (e: SetStateAction<string | undefined>) => void;
  setNotification: (e: SetStateAction<string | undefined>) => void;
};

export enum EditorType {
  Image = "image",
  Video = "video",
  Text = "text",
  Audio = "audio",
}
