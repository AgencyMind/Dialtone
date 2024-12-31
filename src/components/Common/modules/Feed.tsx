import { FunctionComponent, JSX } from "react";
import FeedOptions from "./FeedOptions";
import MetadataSwitch from "@/components/Feed/modules/MetadataSwitch";
import ReactionsBar from "@/components/Feed/modules/ReactionsBar";
import useFeed from "../hooks/useFeed";
import { FeedProps } from "@/components/Feed/types/feed.types";
import InfiniteScroll from "react-infinite-scroll-component";
import { Post } from "@lens-protocol/client";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";
import moment from "moment";

const Feed: FunctionComponent<FeedProps> = ({
  setImageView,
  client,
  setGifOpen,
  setScreen,
  setCurrentSession,
  currentSession,
  storageClient,
  sessionClient,
  setSignless,
  setIndexer,
  setNotification,
}): JSX.Element => {
  const {
    feedType,
    setFeedType,
    socials,
    setSocials,
    feed,
    feedLoading,
    handleMoreFeed,
    paginated,
    setFeedTypeOpen,
    feedTypeOpen,
    moreFeedLoading,
  } = useFeed(client, setCurrentSession);

  return (
    <div className="relative w-full h-full flex items-center justify-start flex-col gap-4 pb-10">
      <FeedOptions
        feedType={feedType}
        setFeedType={setFeedType}
        setSocials={setSocials}
        socials={socials}
        setFeedTypeOpen={setFeedTypeOpen}
        feedTypeOpen={feedTypeOpen}
      />
      <div className="relative w-full h-fit sm:h-full flex items-start justify-start overflow-y-scroll pb-10 rounded-md">
        <InfiniteScroll
          dataLength={
            feedLoading
              ? 20
              : moreFeedLoading
              ? feed?.length + 20
              : feed?.length
          }
          next={handleMoreFeed}
          hasMore={!paginated || feedLoading ? false : true}
          loader={<></>}
          className="relative w-full gap-4 flex flex-col items-start justify-start"
        >
          {feedLoading
            ? Array.from({ length: 20 }).map((_, key) => {
                return (
                  <div
                    key={key}
                    className="relative w-full h-[32rem] rounded-md bg-white flex flex-col animate-pulse"
                  ></div>
                );
              })
            : (moreFeedLoading
                ? [...feed, Array.from({ length: 20 })]
                : feed
              ).map((post, key) => {
                return (post as Post)?.id ? (
                  <div
                    key={key}
                    className="relative w-full h-fit rounded-md bg-white flex flex-col gap-5"
                  >
                    <div className="relative w-full h-fit px-1.5 py-1 flex items-center justify-between flex-row gap-2">
                      <div className="relative w-fit h-fit flex flex-row gap-1  items-center justify-center">
                        <div className="relative w-fit h-fit flex items-center justify-center">
                          <div className="w-6 h-6 flex relative flex items-center justify-center rounded-full bg-dark shadow-sm">
                            <Image
                              layout="fill"
                              objectFit="cover"
                              draggable={false}
                              src={`${INFURA_GATEWAY}${
                                (
                                  post as Post
                                )?.author?.metadata?.picture?.split(
                                  "ipfs://"
                                )?.[1]
                              }`}
                            />
                          </div>
                        </div>
                        <div className="relative w-fit h-fit flex items-center justify-center text-black text-xs">
                          @
                          {Number(
                            (post as Post)?.author?.username?.localName?.length
                          ) < 15
                            ? (post as Post)?.author?.username?.localName
                            : (
                                post as Post
                              )?.author?.username?.localName?.slice(0, 12) +
                              "..."}
                        </div>
                      </div>
                      <div className="relative w-fit h-fit flex text-xs text-black">
                        {moment(`${(post as Post)?.timestamp}`).fromNow()}
                      </div>
                    </div>
                    <MetadataSwitch
                      metadata={(post as Post)?.metadata?.__typename!}
                      data={(post as Post)?.metadata as any}
                      setImageView={setImageView}
                    />
                    <ReactionsBar
                      setGifOpen={setGifOpen}
                      post={post as Post}
                      setCurrentSession={setCurrentSession}
                      setScreen={setScreen}
                      currentSession={currentSession}
                      index={key}
                      sessionClient={sessionClient}
                      setIndexer={setIndexer}
                      setNotification={setNotification}
                      setSignless={setSignless}
                      storageClient={storageClient}
                    />
                  </div>
                ) : (
                  <div
                    key={key}
                    className="relative w-full h-[32rem] rounded-md bg-white flex flex-col animate-pulse"
                  ></div>
                );
              })}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default Feed;
