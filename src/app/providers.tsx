"use client";

import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, http } from "wagmi";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { createContext, SetStateAction, useEffect, useState } from "react";
import { chains } from "@lens-network/sdk/viem";
import { Post, PublicClient, testnet } from "@lens-protocol/client";
import {
  StorageClient,
  testnet as storageTestnet,
} from "@lens-protocol/storage-node-client";
import { LensAccount } from "@/components/Common/types/common.types";
import { EditorType } from "@/components/Feed/types/feed.types";

export const config = getDefaultConfig({
  appName: "Dialtone",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
  chains: [chains.testnet],
  transports: {
    [chains.testnet.id]: http("https://rpc.testnet.lens.dev"),
  },
  ssr: true,
});

const queryClient = new QueryClient();

export const AppContext = createContext<
  | {
      imageView: string | undefined;
      setImageView: (e: SetStateAction<string | undefined>) => void;
      lensAccount: LensAccount | undefined;
      setLensAccount: (e: SetStateAction<LensAccount | undefined>) => void;
      lensClient: PublicClient | undefined;
      storageClient: StorageClient | undefined;
      signless: boolean;
      setSignless: (e: SetStateAction<boolean>) => void;
      gifOpen: boolean;
      setGifOpen: (e: SetStateAction<boolean>) => void;
      createAccount: boolean;
      setCreateAccount: (e: SetStateAction<boolean>) => void;
      notification: string | undefined;
      setNotification: (e: SetStateAction<string | undefined>) => void;
      indexer: string | undefined;
      setIndexer: (e: SetStateAction<string | undefined>) => void;
      setCurrentSession: (
        e: SetStateAction<{
          post?: Post;
          editors: EditorType[];
          currentIndex: number;
        }>
      ) => void;
      currentSession: {
        post?: Post;
        editors: EditorType[];
        currentIndex: number;
      };
    }
  | undefined
>(undefined);

export default function Providers({ children }: { children: React.ReactNode }) {
  const [imageView, setImageView] = useState<string | undefined>();
  const [lensAccount, setLensAccount] = useState<LensAccount | undefined>();
  const [lensClient, setLensClient] = useState<PublicClient | undefined>();
  const [indexer, setIndexer] = useState<string | undefined>();
  const [createAccount, setCreateAccount] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | undefined>();
  const [signless, setSignless] = useState<boolean>(false);
  const [gifOpen, setGifOpen] = useState<boolean>(false);
  const [currentSession, setCurrentSession] = useState<{
    post?: Post;
    editors: EditorType[];
    currentIndex: number;
  }>({
    editors: [],
    currentIndex: 0,
  });
  const storageClient = StorageClient.create(storageTestnet);

  useEffect(() => {
    if (!lensClient) {
      setLensClient(
        PublicClient.create({
          environment: testnet,
          storage: window.localStorage,
        })
      );
    }
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <AppContext.Provider
            value={{
              imageView,
              setImageView,
              lensAccount,
              setLensAccount,
              lensClient,
              storageClient,
              indexer,
              setIndexer,
              notification,
              setNotification,
              createAccount,
              setCreateAccount,
              currentSession,
              setCurrentSession,
              gifOpen,
              setGifOpen,
              signless,
              setSignless,
            }}
          >
            {children}
          </AppContext.Provider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
