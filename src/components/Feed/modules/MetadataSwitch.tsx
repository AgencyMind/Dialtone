import { FunctionComponent, JSX } from "react";
import { ImageMetadata, VideoMetadata } from "@lens-protocol/client";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";
import { MetadataSwitchProps } from "../types/feed.types";

const MetadataSwitch: FunctionComponent<MetadataSwitchProps> = ({
  metadata,
  data,
  setImageView,
}): JSX.Element => {
  switch (metadata) {
    case "VideoMetadata":
      return (
        <div className="relative w-full h-full flex flex-col gap-2 items-start justify-start">
          {`${INFURA_GATEWAY}${
            ((data as VideoMetadata)?.video?.item as string)?.split(
              "ipfs://"
            )?.[1]
          }` && (
            <div className="relative w-full h-fit flex items-start justify-start">
              <video
                className={`object-cover relative w-full ${
                  setImageView ? "h-[20rem]" : "h-20"
                }  flex items-start justify-start rounded-md`}
                autoPlay={false}
                controls
              >
                <source
                  src={`${INFURA_GATEWAY}${
                    ((data as VideoMetadata)?.video?.item as string)?.split(
                      "ipfs://"
                    )?.[1]
                  }`}
                />
              </video>
            </div>
          )}
          <div
            className={`relative w-full h-fit flex items-start justify-start bg-[#212121] ${
              setImageView ? "p-4" : "p-px"
            }`}
          >
            <div
              className={`relative w-full h-fit flex rounded-md bg-[#2F2F2F] ${
                setImageView ? "p-3" : "p-px"
              }`}
            >
              <div
                className={`relative w-full h-fit flex rounded-lg border border-vil bg-dBlue overflow-y-scroll text-sun ${
                  setImageView ? "max-h-44 p-6 text-sm" : "max-h-20 p-1 text-xs"
                }`}
              >
                {(data as VideoMetadata)?.content as string}
              </div>
            </div>
          </div>
        </div>
      );
    case "ImageMetadata":
      return (
        <div className="relative w-full h-full flex flex-col gap-2 items-start justify-start">
          {`${INFURA_GATEWAY}${
            ((data as ImageMetadata)?.image?.item as string)?.split(
              "ipfs://"
            )?.[1]
          }` && (
            <div className="relative w-full h-fit flex items-start justify-start">
              <div
                className={`object-cover relative w-full ${
                  setImageView ? "h-[20rem] cursor-pointer" : "h-20"
                }  flex items-start justify-start rounded-md`}
                onClick={() =>
                  setImageView?.(
                    `${INFURA_GATEWAY}${
                      ((data as ImageMetadata)?.image?.item as string)?.split(
                        "ipfs://"
                      )?.[1]
                    }`
                  )
                }
              >
                <Image
                  layout="fill"
                  className="rounded-md"
                  src={`${INFURA_GATEWAY}${
                    ((data as ImageMetadata)?.image?.item as string)?.split(
                      "ipfs://"
                    )?.[1]
                  }`}
                  objectFit="cover"
                  draggable={false}
                />
              </div>
            </div>
          )}
          <div
            className={`relative w-full h-fit flex items-start justify-start bg-[#212121] ${
              setImageView ? "p-4" : "p-px"
            }`}
          >
            <div
              className={`relative w-full h-fit flex rounded-md bg-[#2F2F2F] ${
                setImageView ? "p-3" : "p-px"
              }`}
            >
              <div
                className={`relative w-full h-fit flex rounded-lg border border-vil bg-dBlue overflow-y-scroll text-sun ${
                  setImageView ? "max-h-44 p-6 text-sm" : "max-h-20 p-1 text-xs"
                }`}
              >
                {(data as ImageMetadata)?.content as string}
              </div>
            </div>
          </div>
        </div>
      );

    case "TextOnlyMetadata":
    case "StoryMetadata":
    case "ArticleMetadata":
      return (
        <div
          className={`relative w-full h-fit flex items-start justify-start bg-[#212121] ${
            setImageView ? "p-4" : "p-px"
          }`}
        >
          <div
            className={`relative w-full h-fit flex rounded-md bg-[#2F2F2F] ${
              setImageView ? "p-3" : "p-px"
            }`}
          >
            <div
              className={`relative w-full h-fit flex rounded-lg border border-vil bg-dBlue overflow-y-scroll text-sun ${
                setImageView ? "max-h-44 p-6 text-sm" : "max-h-20 p-1 text-xs"
              }`}
            >
              {(data as ImageMetadata)?.content as string}
            </div>
          </div>
        </div>
      );

    default:
      return <div></div>;
  }
};

export default MetadataSwitch;
