import { SessionClient } from "@lens-protocol/client";
import { StorageClient } from "@lens-protocol/storage-node-client";
import { SetStateAction } from "react";

export interface MemeData {
  memeToken: string;
  memeImage: string;
  memeTitle: string;
  memeTags: string;
}

export interface MemeDetails {
  memeToken: string;
  memeImage: Blob | undefined;
  memeTitle: string;
  memeTags: string;
}

export interface TokenData {
  token: string;
  image: string;
  price: string;
  tokenPair: string;
}

export type MemesProps = {
  storageClient: StorageClient;
  setSignless: (e: SetStateAction<boolean>) => void;
  setIndexer: (e: SetStateAction<string | undefined>) => void;
  setNotification: (e: SetStateAction<string | undefined>) => void;
  sessionClient: SessionClient;
  address: `0x${string}` | undefined,
};
