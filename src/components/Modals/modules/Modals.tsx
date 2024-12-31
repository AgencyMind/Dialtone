"use client";
import { AppContext } from "@/app/providers";
import { FunctionComponent, JSX, useContext } from "react";
import ImageViewer from "./ImageViewer";
import { useAccount } from "wagmi";
import CreateAccount from "./CreateAccount";
import Indexer from "./Indexer";
import Notification from "./Notification";
import Gif from "./Gif";
import Signless from "./Signless";

const Modals: FunctionComponent = (): JSX.Element => {
  const context = useContext(AppContext);
  const { address } = useAccount();
  return (
    <>
      {context?.gifOpen && <Gif setGifOpen={context?.setGifOpen} />}
      {context?.indexer && (
        <Indexer indexer={context?.indexer} setIndexer={context?.setIndexer} />
      )}
      {context?.imageView && (
        <ImageViewer
          imageView={context?.imageView}
          setImageView={context?.setImageView}
        />
      )}
      {context?.notification && (
        <Notification
          notification={context?.notification}
          setNotification={context?.setNotification}
        />
      )}
      {context?.signless && (
        <Signless
          lensAccount={context?.lensAccount}
          setSignless={context?.setSignless}
        />
      )}
      {context?.createAccount && (
        <CreateAccount
          address={address}
          setLensAccount={context?.setLensAccount}
          lensAccount={context?.lensAccount}
          setCreateAccount={context?.setCreateAccount}
          setIndexer={context?.setIndexer}
          storageClient={context?.storageClient!}
        />
      )}
    </>
  );
};

export default Modals;
