import { FunctionComponent, JSX } from "react";
import useMemes from "../hooks/useMemes";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";
import { MemeData, TokenData } from "../types/memes.types";

const Memes: FunctionComponent = (): JSX.Element => {
  const {
    memeData,
    memesLoading,
    tokenData,
    tokensLoading,
    videoTokenData,
    videoTokensLoading,
    postMemeLoading,
    handlePostMeme,
    postContent,
    setPostContent,
    memeSelected,
    setMemeSelected,
    createMemeLoading,
    handleCreateMeme,
    newMeme,
    setNewMeme,
  } = useMemes();
  return (
    <div className="relative w-full h-full pb-6">
      <div className="relative w-full h-full bg-white rounded-md flex flex-row gap-3 items-start justify-between p-4 border-2 border-sea">
        <div className="relative w-60 h-full flex flex-col items-start justify-between gap-3">
          <div className="relative w-full h-60 overflow-y-scroll flex flex-col gap-3">
            <div className="relative w-fit h-fit flex text-sm text-left">
              Memes as culture and currency
            </div>
            <div className="relative items-start justify-between flex w-full h-fit flex-col gap-2">
              {(tokensLoading || tokenData?.length < 1
                ? Array.from({ length: 28 })
                : tokenData
              )?.map((token, key) => {
                return (
                  <>
                    {(token as any)?.token ? (
                      <div
                        key={key}
                        className={`relative w-full h-10 rounded-md flex border border-sea bg-gris/70`}
                      >
                        <Image
                          draggable={false}
                          className="rounded-md"
                          objectFit="cover"
                          layout="fill"
                          src={`${INFURA_GATEWAY}${
                            (token as TokenData)?.image?.split("ipfs://")?.[1]
                          }`}
                        />
                      </div>
                    ) : (
                      <div
                        key={key}
                        className={`relative w-full h-10 rounded-md flex border border-sea bg-gris/70 animate-pulse`}
                      ></div>
                    )}
                  </>
                );
              })}
            </div>
          </div>
          <div className="relative w-full h-72 overflow-y-scroll flex flex-col gap-3">
            <div className="relative w-full h-fit flex flex-col gap-1.5">
              <div className="relative w-fit h-fit flex text-sm text-left">
                VIDEO MEME LIQUIDITY
              </div>
              <div className="relative w-fit h-fit flex text-xxs text-left">
                supplied by creators like you
              </div>
            </div>
            <div className="relative items-start justify-between flex w-full h-fit flex-col gap-2">
              {(videoTokensLoading || videoTokenData?.length < 1
                ? Array.from({ length: 28 })
                : videoTokenData
              )?.map((token, key) => {
                return (
                  <>
                    {(token as any)?.token ? (
                      <div
                        key={key}
                        className={`relative w-full h-10 rounded-md flex border border-sea bg-gris/70`}
                      >
                        <Image
                          draggable={false}
                          className="rounded-md"
                          objectFit="cover"
                          layout="fill"
                          src={`${INFURA_GATEWAY}${
                            (token as TokenData)?.image?.split("ipfs://")?.[1]
                          }`}
                        />
                      </div>
                    ) : (
                      <div
                        key={key}
                        className={`relative w-full h-10 rounded-md flex border border-sea bg-gris/70 animate-pulse`}
                      ></div>
                    )}
                  </>
                );
              })}
            </div>
          </div>
        </div>
        <div className="relative w-full h-full flex flex-col items-center justify-start border border-sea rounded-md bg-gris/70 p-2 gap-3">
          <div className="relative w-full h-full flex items-center justify-start flex-col gap-3">
            <div className="relative w-fit h-fit flex items-center justify-center text-center text-sm">
              TODAY'S TOP MEMES IN DIALTONE CLUBS
            </div>
            <div className="relative w-full h-[22rem] max-h-full overflow-y-scroll flex">
              <div className="relative items-start justify-between flex w-full h-fit flex-wrap gap-4">
                {(memesLoading || memeData?.length < 1
                  ? Array.from({ length: 28 })
                  : memeData
                )?.map((meme, key) => {
                  return (
                    <>
                      {(meme as any)?.memeImage ? (
                        <div
                          key={key}
                          className={`relative w-20 h-20 rounded-md flex border border-sea bg-viol ${
                            !postMemeLoading &&
                            "cursor-pointer hover:opacity-70"
                          } ${memeSelected && "opacity-50"}`}
                          onClick={() =>
                            !postMemeLoading &&
                            setMemeSelected(meme as MemeData)
                          }
                        >
                          <Image
                            draggable={false}
                            className="rounded-md"
                            objectFit="cover"
                            layout="fill"
                            src={`${INFURA_GATEWAY}${
                              (meme as MemeData)?.memeImage?.split(
                                "ipfs://"
                              )?.[1]
                            }`}
                          />
                        </div>
                      ) : (
                        <div
                          key={key}
                          className={`relative w-20 h-20 rounded-md flex border border-sea bg-viol animate-pulse`}
                        ></div>
                      )}
                    </>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="relative w-full h-full flex items-start justify-between flex-col gap-3">
            <div className="relative w-full h-full flex items-start justify-between flex-col gap-3">
              <textarea
                className="focus:outline-none flex relative w-full h-full border text-sm border-sea rounded-md p-1 bg-gris/80"
                style={{
                  resize: "none",
                }}
                placeholder="Add a note?"
                value={postContent}
                disabled={postMemeLoading}
                onChange={(e) => setPostContent(e.target.value)}
              />
              <div
                className={`relative px-3 py-1 flex items-center justify-center text-black w-28 h-8 cursor-pointer active:scale-95`}
                onClick={() => !postMemeLoading && handlePostMeme()}
              >
                <div className="absolute top-0 left-0 flex w-28 h-8">
                  <Image
                    src={`${INFURA_GATEWAY}QmRU57vbmZm7EbKrJksFD6SfyLkZ2qUwfZHqXzy8XJvZAH`}
                    layout="fill"
                    objectFit="fill"
                    draggable={false}
                  />
                </div>
                {postMemeLoading ? (
                  <div className="relative w-4 h-4 animate-spin flex">
                    <Image
                      layout="fill"
                      objectFit="cover"
                      draggable={false}
                      src={`${INFURA_GATEWAY}QmNcoHPaFjhDciiHjiMNpfTbzwnJwKEZHhNfziFeQrqTkX`}
                    />
                  </div>
                ) : (
                  <div className="relative flex w-fit h-fit font-digi">
                    Share Meme
                  </div>
                )}
              </div>
            </div>
            <div className="relative w-full h-full flex items-start justify-between flex-col gap-3">
              <div className="relative w-full h-fit flex">
                <input
                  className="relative w-full h-8 flex rounded-md bg-gris border border-sea text-sm p-1"
                  placeholder={"Catchy title?"}
                  disabled={createMemeLoading}
                  value={newMeme?.memeTitle}
                  onChange={(e) =>
                    setNewMeme({
                      ...newMeme,
                      memeTitle: e?.target?.value,
                    })
                  }
                />
              </div>
              <div className="relative w-full h-fit flex flex-row gap-2 justify-between items-center">
                <label className="relative cursor-pointer w-20 h-20 rounded-md border border-sea flex">
                  {newMeme?.memeImage && (
                    <Image
                      src={URL.createObjectURL(newMeme.memeImage)}
                      objectFit="cover"
                      layout="fill"
                      draggable={false}
                      className="rounded-md"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    hidden
                    required
                    id="files"
                    multiple={false}
                    name="pfp"
                    disabled={createMemeLoading}
                    onChange={(e) => {
                      e.stopPropagation();
                      if (!e.target.files || e.target.files.length === 0)
                        return;
                      setNewMeme({
                        ...newMeme,
                        memeImage: e?.target?.files?.[0],
                      });
                    }}
                  />
                </label>
                <div className="relative w-full h-full flex items-start flex-col justify-start gap-2">
                  <input
                    className="relative w-full h-full flex rounded-md bg-gris border border-sea text-sm p-1"
                    placeholder={"What's the meme token?"}
                    disabled={createMemeLoading}
                    value={newMeme?.memeToken}
                    onChange={(e) =>
                      setNewMeme({
                        ...newMeme,
                        memeToken: e?.target?.value,
                      })
                    }
                  />
                  <input
                    className="relative w-full h-full flex rounded-md bg-gris border border-sea text-sm p-1"
                    placeholder={"Add some tags"}
                    disabled={createMemeLoading}
                    value={newMeme?.memeTags}
                    onChange={(e) =>
                      setNewMeme({
                        ...newMeme,
                        memeTags: e?.target?.value,
                      })
                    }
                  />
                </div>
              </div>
              <div
                className={`relative px-3 py-1 flex items-center justify-center text-black w-28 h-8 cursor-pointer active:scale-95`}
                onClick={() => !createMemeLoading && handleCreateMeme()}
              >
                <div className="absolute top-0 left-0 flex w-28 h-8">
                  <Image
                    src={`${INFURA_GATEWAY}QmRU57vbmZm7EbKrJksFD6SfyLkZ2qUwfZHqXzy8XJvZAH`}
                    layout="fill"
                    objectFit="fill"
                    draggable={false}
                  />
                </div>
                {postMemeLoading ? (
                  <div className="relative w-4 h-4 animate-spin flex">
                    <Image
                      layout="fill"
                      objectFit="cover"
                      draggable={false}
                      src={`${INFURA_GATEWAY}QmNcoHPaFjhDciiHjiMNpfTbzwnJwKEZHhNfziFeQrqTkX`}
                    />
                  </div>
                ) : (
                  <div className="relative flex w-fit h-fit font-digi">
                    Create Meme
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Memes;
