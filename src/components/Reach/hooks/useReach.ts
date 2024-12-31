import { SetStateAction, useEffect, useState } from "react";
import {
  AccountStats,
  MainContentFocus,
  PageSize,
  Post,
  SessionClient,
} from "@lens-protocol/client";
import { fetchAccountStats, fetchPosts } from "@lens-protocol/client/actions";
import { EditorType } from "@/components/Feed/types/feed.types";
import { StorageClient } from "@lens-protocol/storage-node-client";
import createPost from "../../../../graphql/lens/mutations/createPost";
import { v4 as uuidv4 } from "uuid";
import { CurrentSession, LensAccount } from "@/components/Common/types/common.types";

const useReach = (
  lensAccount: LensAccount | undefined,
  client: SessionClient,
  setCurrentSession: (
    e: SetStateAction<CurrentSession>
  ) => void,
  storageClient: StorageClient,
  setSignless: (e: SetStateAction<boolean>) => void,
  setNotification: (e: SetStateAction<string | undefined>) => void,
  setIndexer: (e: SetStateAction<string | undefined>) => void,
  gifOpen: { id: string; gif: string; open: boolean }
) => {
  const [feed, setFeed] = useState<Post[]>([]);
  const [postContent, setPostContent] = useState<string>("");
  const [paginated, setPaginated] = useState<string | undefined>();
  const [postLoading, setPostLoading] = useState<boolean>(false);
  const [feedLoading, setFeedLoading] = useState<boolean>(false);
  const [moreFeedLoading, setMoreFeedLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<AccountStats | undefined>();

  const handleFeed = async () => {
    if (!client || !lensAccount) return;
    setFeedLoading(true);
    try {
      const res = await fetchPosts(client, {
        pageSize: PageSize.Ten,
        filter: {
          authors: lensAccount?.account?.address,
        },
      });

      if (res.isOk()) {
        setFeed((res?.value?.items || []) as Post[]);
        setCurrentSession((prev) => ({
          ...prev,
          editors: Array.from(
            { length: (res?.value?.items || []).length },
            (_) => EditorType.Video
          ),
        }));
        setPaginated(res?.value?.pageInfo?.next);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setFeedLoading(false);
  };

  const handleMoreFeed = async () => {
    if (!client) return;
    setMoreFeedLoading(true);
    try {
      const res = await fetchPosts(client, {
        pageSize: PageSize.Ten,
        filter: {
          authors: lensAccount?.account?.address,
        },
      });

      if (res.isOk()) {
        setFeed([...feed, ...((res?.value?.items || []) as Post[])]);
        setCurrentSession((prev) => ({
          ...prev,
          editors: [
            ...prev.editors,
            ...Array.from(
              { length: (res?.value?.items || []).length },
              (_) => EditorType.Video
            ),
          ],
        }));
        setPaginated(res?.value?.pageInfo?.next);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setMoreFeedLoading(false);
  };

  const handlePost = async () => {
    if (postContent?.trim() == "") return;
    setPostLoading(true);
    try {
      let focus = MainContentFocus.TextOnly;
      let schema = "https://json-schemas.lens.dev/posts/text/3.0.0.json";
      let image = {};
      if (gifOpen?.id == "post-reach") {
        focus = MainContentFocus.Image;
        schema = "https://json-schemas.lens.dev/posts/image/3.0.0.json";
        image = {
          type: "image/png",
          item: gifOpen?.gif,
        };
      }

      const { uri } = await storageClient.uploadAsJson({
        $schema: schema,
        lens: {
          mainContentFocus: focus,
          title: postContent?.slice(0, 10),
          content: postContent,
          id: uuidv4(),
          locale: "en",
          ...image,
          tags: ["dialtone"],
        },
      });

      const res = await createPost(
        {
          contentUri: uri,
        },
        client!
      );

      if (
        (res as any)?.reason?.includes(
          "Signless experience is unavailable for this operation. You can continue by signing the sponsored request."
        )
      ) {
        setSignless?.(true);
      } else if ((res as any)?.hash) {
        setPostContent("");
        setIndexer?.("Post Indexing");
      } else {
        setNotification?.("Something went wrong :( Try again?");
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setPostLoading(false);
  };

  const handleUserData = async () => {
    try {
      const res = await fetchAccountStats(client, {
        account: lensAccount?.account?.address,
      });

      if (res?.isOk()) {
        setUserData(res?.value as AccountStats);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (client) {
      handleFeed();
      handleUserData();
    }
  }, [lensAccount, client]);

  return {
    feed,
    feedLoading,
    handleMoreFeed,
    paginated,
    moreFeedLoading,
    handlePost,
    postLoading,
    postContent,
    userData,
    setPostContent,
  };
};

export default useReach;
