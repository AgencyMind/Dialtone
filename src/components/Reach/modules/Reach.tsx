import { FunctionComponent, JSX } from "react";
import MetadataSwitch from "@/components/Feed/modules/MetadataSwitch";
import ReactionsBar from "@/components/Feed/modules/ReactionsBar";
import InfiniteScroll from "react-infinite-scroll-component";
import { Post } from "@lens-protocol/client";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";
import moment from "moment";
import AccountData from "./AccountData";
import useReach from "../hooks/useReach";
import AccountPost from "./AccountPost";
import { ReachProps } from "../types/reach.types";

const Reach: FunctionComponent<ReachProps> = ({
  setImageView,
  setCurrentSession,
  currentSession,
  storageClient,
  sessionClient,
  lensClient,
  setSignless,
  setIndexer,
  setNotification,
  lensAccount,
  setGifOpen,
  setScreen,
  gifOpen
}): JSX.Element => {
  const {
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
  } = useReach(
    lensAccount,
    sessionClient!,
    setCurrentSession,
    storageClient,
    setSignless,
    setNotification,
    setIndexer,
    gifOpen
  );

  return (
    <div className="relative w-full h-full flex items-center justify-start flex-col gap-4 pb-10">
      <AccountData data={userData} />
      <AccountPost
        setPostContent={setPostContent}
        handlePost={handlePost}
        postLoading={postLoading}
        setGifOpen={setGifOpen}
        postContent={postContent}
      />
      <div className="relative w-full h-fit sm:h-full flex items-start justify-start overflow-y-scroll pb-10 rounded-md">
        {!feedLoading && feed?.length < 1 ? (
          <div className="relative w-full gap-4 flex flex-col items-center bg-white rounded-md justify-center h-full font-digi text-sm">
            No posts yet.
          </div>
        ) : (
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
                              (post as Post)?.author?.username?.localName
                                ?.length
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
                        gifOpen={gifOpen}
                        post={post as Post}
                        setCurrentSession={setCurrentSession}
                        setScreen={setScreen}
                        currentSession={currentSession}
                        index={key}
                        sessionClient={sessionClient! || lensClient!}
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
        )}
      </div>
    </div>
  );
};

export default Reach;
