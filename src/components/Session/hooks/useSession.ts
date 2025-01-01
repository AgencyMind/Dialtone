import { EditorType, Social } from "@/components/Feed/types/feed.types";
import { SetStateAction, useEffect, useState } from "react";
import createPost from "../../../../graphql/lens/mutations/createPost";
import { MainContentFocus, SessionClient } from "@lens-protocol/client";
import { StorageClient } from "@lens-protocol/storage-node-client";
import { v4 as uuidV4 } from "uuid";
import { createWalletClient, custom, PublicClient } from "viem";
import { chains } from "@lens-network/sdk/viem";
import { SCREENS, SESSION_DATA_CONTRACT } from "@/lib/constants";
import SessionDatabaseAbi from "@abis/SessionDatabase.json";
import { CurrentSession, Screen } from "@/components/Common/types/common.types";
import OpenAI from "openai";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { LIT_NETWORK } from "@lit-protocol/constants";

const useSession = (
  sessionClient: SessionClient,
  storageClient: StorageClient,
  setSignless: (e: SetStateAction<boolean>) => void,
  setNotification: (e: SetStateAction<string | undefined>) => void,
  setIndexer: (e: SetStateAction<string | undefined>) => void,
  publicClient: PublicClient,
  address: `0x${string}` | undefined,
  currentSession: CurrentSession,
  screen: Screen,
  aiKey: string | undefined
) => {
  const [openAI, setOpenAI] = useState<OpenAI | undefined>();
  const [socialPost, setSocialPost] = useState<Social[]>([Social.Lens]);
  const [agentLoading, setAgentLoading] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [agentChat, setAgentChat] = useState<
    OpenAI.Chat.Completions.ChatCompletion.Choice[]
  >([]);
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

      const litClient = new LitJsSdk.LitNodeClientNodeJs({
        alertWhenUnauthorized: false,
        litNetwork: LIT_NETWORK.DatilDev,
        debug: true,
      });
      await litClient.connect();

      const accessControlConditions = [
        {
          contractAddress: "",
          standardContractType: "",
          chain: "mumbai",
          method: "",
          parameters: [":userAddress"],
          returnValueTest: {
            comparator: "=",
            value: address?.toLowerCase(),
          },
        },
      ];

      const encoder = new TextEncoder();
      const { ciphertext, dataToEncryptHash } = await litClient.encrypt({
        accessControlConditions,
        dataToEncrypt: encoder.encode(
          JSON.stringify({
            postId: currentSession?.post?.id,
          })
        ),
      });

      const ipfsRes = await fetch("/api/ipfs", {
        method: "POST",
        body: JSON.stringify({
          ciphertext,
          dataToEncryptHash,
          accessControlConditions,
        }),
      });
      const json = await ipfsRes.json();

      const { request } = await publicClient.simulateContract({
        address: SESSION_DATA_CONTRACT,
        abi: SessionDatabaseAbi,
        functionName: "addNewSession",
        chain: chains.testnet,
        args: ["ipfs://" + json?.cid],
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
    if (!aiKey) return;
    setAgentLoading(true);
    try {
      let openaiclient = openAI;
      if (!openaiclient) {
        openaiclient = new OpenAI({
          apiKey: aiKey,
        });
        setOpenAI(openaiclient);
      }

      const completion = await openaiclient.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          {
            role: "user",
            content: "Write a haiku about recursion in programming.",
          },
        ],
      });

      setAgentChat(completion.choices);
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

  useEffect(() => {
    if (screen == SCREENS[1] && currentSession?.post && aiKey) {
      sendToAgent();
    }
  }, [screen, currentSession?.post, aiKey]);

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
    agentChat,
  };
};

export default useSession;
