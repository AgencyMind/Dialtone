import { SetStateAction, useEffect, useState } from "react";
import { Social } from "../types/common.types";
import {
  MainContentFocus,
  PageSize,
  Post,
  PostsRequest,
  PublicClient,
  SessionClient,
} from "@lens-protocol/client";
import { fetchPosts } from "@lens-protocol/client/actions";
import { FEED_TYPES } from "@/lib/constants";
import { EditorType } from "@/components/Feed/types/feed.types";

const useFeed = (
  client: SessionClient | PublicClient | undefined,
  setCurrentSession: (
    e: SetStateAction<{
      post?: Post;
      editors: EditorType[];
      currentIndex: number
    }>
  ) => void
) => {
  const [socials, setSocials] = useState<Social[]>([Social.Lens]);
  const [feedType, setFeedType] = useState<string>("for you");
  const [feed, setFeed] = useState<Post[]>([]);
  const [paginated, setPaginated] = useState<string | undefined>();
  const [feedLoading, setFeedLoading] = useState<boolean>(false);
  const [feedTypeOpen, setFeedTypeOpen] = useState<boolean>(false);
  const [moreFeedLoading, setMoreFeedLoading] = useState<boolean>(false);

  const handleFeed = async () => {
    if (!client) return;
    setFeedLoading(true);
    try {
      let postsRequest: PostsRequest = {
        pageSize: PageSize.Ten,
      };
      if (feedType == FEED_TYPES[0]) {
        postsRequest = {
          ...postsRequest,
        };
      } else if (feedType == FEED_TYPES[1]) {
        postsRequest = {
          ...postsRequest,
          filter: {
            metadata: {
              mainContentFocus: [MainContentFocus.Video],
            },
          },
        };
      } else if (feedType == FEED_TYPES[2]) {
        postsRequest = {
          ...postsRequest,
          filter: {
            metadata: {
              mainContentFocus: [MainContentFocus.Image],
            },
          },
        };
      } else {
        postsRequest = {
          ...postsRequest,
          filter: {
            metadata: {
              mainContentFocus: [
                MainContentFocus.TextOnly,
                MainContentFocus.Article,
                MainContentFocus.Story,
              ],
            },
          },
        };
      }

      const res = await fetchPosts(client, postsRequest);

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
      let postsRequest: PostsRequest = {
        pageSize: PageSize.Ten,
      };
      if (feedType == FEED_TYPES[0]) {
        postsRequest = {
          ...postsRequest,
        };
      } else if (feedType == FEED_TYPES[1]) {
        postsRequest = {
          ...postsRequest,
          filter: {
            metadata: {
              mainContentFocus: [MainContentFocus.Video],
            },
          },
        };
      } else if (feedType == FEED_TYPES[2]) {
        postsRequest = {
          ...postsRequest,
          filter: {
            metadata: {
              mainContentFocus: [MainContentFocus.Image],
            },
          },
        };
      } else {
        postsRequest = {
          ...postsRequest,
          filter: {
            metadata: {
              mainContentFocus: [
                MainContentFocus.TextOnly,
                MainContentFocus.Article,
                MainContentFocus.Story,
              ],
            },
          },
        };
      }

      const res = await fetchPosts(client, postsRequest);

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

  useEffect(() => {
    if (client) {
      handleFeed();
    }
  }, [feedType, client]);

  return {
    feedType,
    setFeedType,
    socials,
    setSocials,
    feed,
    feedLoading,
    handleMoreFeed,
    paginated,
    feedTypeOpen,
    setFeedTypeOpen,
    moreFeedLoading,
  };
};

export default useFeed;
