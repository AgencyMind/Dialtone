import { Social } from "@/components/Common/types/common.types";
import { SetStateAction, useState } from "react";
import createPost from "../../../../graphql/lens/mutations/createPost";
import { SessionClient } from "@lens-protocol/client";
import { StorageClient } from "@lens-protocol/storage-node-client";
import { v4 as uuidV4 } from "uuid";

const useSession = (
  sessionClient: SessionClient,
  storageClient: StorageClient,
  setSignless: (e: SetStateAction<boolean>) => void,
  setNotification: (e: SetStateAction<string | undefined>) => void,
  setIndexer: (e: SetStateAction<string | undefined>) => void
) => {
  const [socialPost, setSocialPost] = useState<Social[]>([Social.Lens]);
  const [agentLoading, setAgentLoading] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [postLoading, setPostLoading] = useState<boolean>(false);
  const [textContent, setTextContent] = useState<string>(`<p2>Start creating! ....</p2>`);

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
      const { uri } = await storageClient.uploadAsJson({
        $schema: "https://json-schemas.lens.dev/posts/text/3.0.0.json",
        lens: {
          mainContentFocus: focus,
          title: textContent?.slice(0, 10),
          content: textContent,
          id: uuidV4(),
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
    textContent
  };
};

export default useSession;
