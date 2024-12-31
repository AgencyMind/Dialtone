import { EditorType, Social } from "@/components/Feed/types/feed.types";
import { SetStateAction, useState } from "react";
import createPost from "../../../../graphql/lens/mutations/createPost";
import { MainContentFocus, SessionClient } from "@lens-protocol/client";
import { StorageClient } from "@lens-protocol/storage-node-client";
import { v4 as uuidV4 } from "uuid";
import { createWalletClient, custom, PublicClient } from "viem";
import { chains } from "@lens-network/sdk/viem";
import { SESSION_DATA_CONTRACT } from "@/lib/constants";
import SessionDatabaseAbi from "@abis/SessionDatabase.json";
import { CurrentSession } from "@/components/Common/types/common.types";

const useSession = (
  sessionClient: SessionClient,
  storageClient: StorageClient,
  setSignless: (e: SetStateAction<boolean>) => void,
  setNotification: (e: SetStateAction<string | undefined>) => void,
  setIndexer: (e: SetStateAction<string | undefined>) => void,
  publicClient: PublicClient,
  address: `0x${string}` | undefined,
  currentSession: CurrentSession
) => {
  const [socialPost, setSocialPost] = useState<Social[]>([Social.Lens]);
  const [agentLoading, setAgentLoading] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [postLoading, setPostLoading] = useState<boolean>(false);
  const [textContent, setTextContent] = useState<string>(
    `<p2>Start creating! ....</p2>`
  );
  const [saveSessionLoading, setSaveSessionLoading] = useState<boolean>(false);

  const handleSaveSession = async () => {
    setSaveSessionLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: chains.testnet,
        transport: custom((window as any).ethereum),
      });

      const response = await fetch("/api/ipfs", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({}),
      });

      let responseJSON = await response.json();

      // encrypt session data
      let encryptedData = "ipfs://" + responseJSON?.cid;

      const { request } = await publicClient.simulateContract({
        address: SESSION_DATA_CONTRACT,
        abi: SessionDatabaseAbi,
        functionName: "addNewSession",
        chain: chains.testnet,
        args: [encryptedData],
        account: address,
      });

      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({
        hash: res,
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setSaveSessionLoading(false);
  };

  const sendToAgent = async () => {
    setAgentLoading(true);
    try {
    } catch (err: any) {
      console.error(err.message);
    }
    setAgentLoading(false);
  };

  const handlePost = async () => {
    if (textContent?.trim() == "") return;
    setPostLoading(true);
    try {
      let focus = MainContentFocus.TextOnly;
      let schema = "https://json-schemas.lens.dev/posts/text/3.0.0.json";
      let image_content = {};
      let video_content = {};
      if (
        currentSession?.image &&
        currentSession?.editors?.[currentSession?.currentIndex] ==
          EditorType.Image
      ) {
        focus = MainContentFocus.Image;
        schema = "https://json-schemas.lens.dev/posts/image/3.0.0.json";

        const response = await fetch("/api/ipfs", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: currentSession?.image,
        });

        let responseJSON = await response.json();

        image_content = {
          type: "image/png",
          item: "ipfs://" + responseJSON?.cid,
        };
      } else if (
        currentSession?.video &&
        currentSession?.editors?.[currentSession?.currentIndex] ==
          EditorType.Video
      ) {
        focus = MainContentFocus.Video;
        schema = "https://json-schemas.lens.dev/posts/video/3.0.0.json";

        const response = await fetch("/api/ipfs", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: currentSession?.video,
        });

        let responseJSON = await response.json();

        video_content = {
          type: "video/mp4",
          item: "ipfs://" + responseJSON?.cid,
        };
      }

      const { uri } = await storageClient.uploadAsJson({
        $schema: schema,
        lens: {
          mainContentFocus: focus,
          title: textContent?.slice(0, 10),
          content: textContent,
          id: uuidV4(),
          ...image_content,
          ...video_content,
          locale: "en",
          tags: ["dialtone"],
        },
      });

      const res = await createPost(
        {
          contentUri: uri,
        },
        sessionClient!
      );

      if (
        (res as any)?.reason?.includes(
          "Signless experience is unavailable for this operation. You can continue by signing the sponsored request."
        )
      ) {
        setSignless?.(true);
      } else if ((res as any)?.hash) {
        setTextContent("");
        setIndexer?.("Post Indexing");
      } else {
        setNotification?.("Something went wrong :( Try again?");
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setPostLoading(false);
  };

  return {
    socialPost,
    setSocialPost,
    agentLoading,
    sendToAgent,
    content,
    setContent,
    postLoading,
    handlePost,
    setTextContent,
    textContent,
    saveSessionLoading,
    handleSaveSession,
  };
};

export default useSession;
