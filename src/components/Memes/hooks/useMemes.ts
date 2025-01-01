import { SetStateAction, useEffect, useState } from "react";
import { MemeData, MemeDetails, TokenData } from "../types/memes.types";
import { createWalletClient, custom, PublicClient } from "viem";
import { chains } from "@lens-network/sdk/viem";
import { INFURA_GATEWAY, MEME_DATA_CONTRACT } from "@/lib/constants";
import MemeDatabaseAbi from "@abis/MemeDatabase.json";
import { StorageClient } from "@lens-protocol/storage-node-client";
import { v4 as uuidv4 } from "uuid";
import createPost from "../../../../graphql/lens/mutations/createPost";
import { MainContentFocus, SessionClient } from "@lens-protocol/client";
import { getMemes } from "../../../../graphql/queries/getMemes";

const useMemes = (
  publicClient: PublicClient,
  address: `0x${string}` | undefined,
  storageClient: StorageClient,
  setSignless: (e: SetStateAction<boolean>) => void,
  setNotification: (e: SetStateAction<string | undefined>) => void,
  setIndexer: (e: SetStateAction<string | undefined>) => void,
  client: SessionClient
) => {
  const [postMemeLoading, setPostMemeLoading] = useState<boolean>(false);
  const [createMemeLoading, setCreateMemeLoading] = useState<boolean>(false);
  const [paginated, setPaginated] = useState<number>(0);
  const [memesLoading, setMemesLoading] = useState<boolean>(false);
  const [tokensLoading, setTokensLoading] = useState<boolean>(false);
  const [videoTokensLoading, setVideoTokensLoading] = useState<boolean>(false);
  const [moreMemesLoading, setMoreMemesLoading] = useState<boolean>(false);
  const [memeData, setMemeData] = useState<MemeData[]>([]);
  const [tokenData, setTokenData] = useState<TokenData[]>([]);
  const [videoTokenData, setVideoTokenData] = useState<TokenData[]>([]);
  const [memeSelected, setMemeSelected] = useState<MemeData | undefined>();
  const [postContent, setPostContent] = useState<string>("");
  const [newMeme, setNewMeme] = useState<MemeDetails>({
    memeToken: "",
    memeImage: undefined,
    memeTitle: "",
    memeTags: "",
  });

  const handlePostMeme = async () => {
    setPostMemeLoading(true);
    try {
      const focus = MainContentFocus.Image;
      const schema = "https://json-schemas.lens.dev/posts/image/3.0.0.json";
      const image = {
        type: "image/png",
        item: memeSelected?.memeImage,
      };

      const { uri } = await storageClient.uploadAsJson({
        $schema: schema,
        lens: {
          mainContentFocus: focus,
          title: postContent?.slice(0, 10),
          content: postContent,
          id: uuidv4(),
          ...image,
          locale: "en",
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
    setPostMemeLoading(false);
  };

  const handleCreateMeme = async () => {
    if (!newMeme.memeImage) return;
    setCreateMemeLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: chains.testnet,
        transport: custom((window as any).ethereum),
      });

      const responseImage = await fetch("/api/ipfs", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: newMeme.memeImage,
      });

      let responseImageJSON = await responseImage.json();

      const response = await fetch("/api/ipfs", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          token: newMeme.memeToken,
          image: "ipfs://" + responseImageJSON?.cid,
          title: newMeme.memeTitle,
          tags: newMeme.memeTags,
        }),
      });

      let responseJSON = await response.json();

      const { request } = await publicClient.simulateContract({
        address: MEME_DATA_CONTRACT,
        abi: MemeDatabaseAbi,
        functionName: "addMeme",
        chain: chains.testnet,
        args: ["ipfs://" + responseJSON?.cid],
        account: address,
      });

      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({
        hash: res,
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setCreateMemeLoading(false);
  };

  const handleMemeData = async () => {
    setMemesLoading(true);
    try {
      const data = await getMemes(paginated);

      const newData: MemeData[] = await Promise.all(
        data?.data?.memeAddeds?.map(async (meme: any) => {
          let metadata = meme?.metadata;

          if (!metadata) {
            const newMetadata = await fetch(
              `${INFURA_GATEWAY}/ipfs/${meme.data.split("ipfs://")?.[1]}`
            );
            metadata = await newMetadata.json();
          }

          return {
            memeToken: metadata?.token,
            memeImage: metadata?.image,
            memeTitle: metadata?.title,
            memeTags: metadata?.tags,
          };
        })
      );

      setPaginated(data?.data?.memeAddeds?.length == 20 ? paginated + 20 : 0);
      setMemeData(newData);

      await handleTokenData();
    } catch (err: any) {
      console.error(err.message);
    }
    setMemesLoading(false);
  };

  const handleTokenData = async () => {
    setTokensLoading(true);
    try {
    } catch (err: any) {
      console.error(err.message);
    }
    setTokensLoading(false);
  };

  const handleVideoData = async () => {
    setVideoTokensLoading(true);
    try {
    } catch (err: any) {
      console.error(err.message);
    }
    setVideoTokensLoading(false);
  };

  const handleMoreMemes = async () => {
    if (paginated < 1) return;
    setMoreMemesLoading(true);
    try {
      const data = await getMemes(paginated);

      const newData: MemeData[] = await Promise.all(
        data?.data?.memeAddeds?.map(async (meme: any) => {
          let metadata = meme?.metadata;

          if (!metadata) {
            const newMetadata = await fetch(
              `${INFURA_GATEWAY}/ipfs/${meme.data.split("ipfs://")?.[1]}`
            );
            metadata = await newMetadata.json();
          }

          return {
            memeToken: metadata?.token,
            memeImage: metadata?.image,
            memeTitle: metadata?.title,
            memeTags: metadata?.tags,
          };
        })
      );

      setMemeData([...memeData, ...newData]);

      setPaginated(data?.data?.memeAddeds?.length == 20 ? paginated + 20 : 0);
    } catch (err: any) {
      console.error(err.message);
    }
    setMoreMemesLoading(false);
  };

  useEffect(() => {
    if (memeData?.length < 1) {
      handleMemeData();
      handleVideoData();
    }
  }, []);

  return {
    memesLoading,
    memeData,
    tokenData,
    tokensLoading,
    videoTokenData,
    videoTokensLoading,
    postMemeLoading,
    handlePostMeme,
    memeSelected,
    setMemeSelected,
    postContent,
    setPostContent,
    createMemeLoading,
    handleCreateMeme,
    newMeme,
    setNewMeme,
    handleMoreMemes,
    moreMemesLoading
  };
};

export default useMemes;
