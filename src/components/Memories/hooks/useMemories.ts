import { useEffect, useState } from "react";
import { Memory } from "../types/memories.types";
import { createWalletClient, custom, PublicClient } from "viem";
import { chains } from "@lens-network/sdk/viem";
import { INFURA_GATEWAY, SESSION_DATA_CONTRACT } from "@/lib/constants";
import SessionDatabaseAbi from "@abis/SessionDatabase.json";
import { getSessions } from "../../../../graphql/queries/getSessions";
import { fetchPost } from "@lens-protocol/client/actions";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { LIT_NETWORK } from "@lit-protocol/constants";
import { SessionClient } from "@lens-protocol/client";

const useMemories = (
  address: `0x${string}` | undefined,
  publicClient: PublicClient,
  sessionClient: SessionClient
) => {
  const [deleteMemoryLoading, setDeleteMemoryLoading] = useState<boolean[]>([]);
  const [memoriesLoading, setMemoriesLoading] = useState<boolean>(false);
  const [moreMemoriesLoading, setMoreMemoriesLoading] =
    useState<boolean>(false);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [paginated, setPaginated] = useState<number>(0);

  const handleDeleteMemory = async (sessionId: number) => {
    if (!address) return;
    setDeleteMemoryLoading((prev) => {
      let mems = [...prev];
      const index = memories.findIndex((mem) => Number(mem.id) == sessionId);

      mems[index] = true;

      return mems;
    });
    try {
      const clientWallet = createWalletClient({
        chain: chains.testnet,
        transport: custom((window as any).ethereum),
      });

      const { request } = await publicClient.simulateContract({
        address: SESSION_DATA_CONTRACT,
        abi: SessionDatabaseAbi,
        functionName: "deleteSession",
        chain: chains.testnet,
        args: [sessionId],
        account: address,
      });

      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({
        hash: res,
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setDeleteMemoryLoading((prev) => {
      let mems = [...prev];
      const index = memories.findIndex((mem) => Number(mem.id) == sessionId);

      mems[index] = false;

      return mems;
    });
  };

  const handleMoreMemories = async () => {
    if (paginated < 1 || !address || !sessionClient) return;
    setMoreMemoriesLoading(true);
    try {
      const data = await getSessions(address, paginated);

      const newData: Memory[] = await Promise.all(
        data?.data?.sessionAddeds?.map(async (session: any) => {
          const litClient = new LitJsSdk.LitNodeClientNodeJs({
            alertWhenUnauthorized: false,
            litNetwork: LIT_NETWORK.DatilDev,
            debug: true,
          });
          await litClient.connect();

          const newMetadata = await fetch(
            `${INFURA_GATEWAY}/ipfs/${
              session.encryptedData.split("ipfs://")?.[1]
            }`
          );
          const json = await newMetadata.json();

          const decrypted = await litClient.decrypt({
            dataToEncryptHash: json.dataToEncryptHash,
            accessControlConditions: json.accessControlConditions,
            ciphertext: json.ciphertext,
            chain: "ethereum",
          });

          const decoder = new TextDecoder();

          const decodedDataString = decoder.decode(decrypted.decryptedData);

          const decodedData = JSON.parse(decodedDataString);

          let postData: any = await fetchPost(sessionClient, {
            post: decodedData?.postId,
          });

          if (postData?.isOk()) {
            postData = postData?.value;
          } else {
            postData = undefined;
          }

          return {
            post: postData,
          };
        })
      );

      setMemories([...memories, ...newData]);

      setPaginated(
        data?.data?.sessionAddeds?.length == 20 ? paginated + 20 : 0
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setMoreMemoriesLoading(false);
  };

  const handleMemories = async () => {
    if (!address || !sessionClient) return;
    setMemoriesLoading(true);
    try {
      const data = await getSessions(address, paginated);

      const newData: Memory[] = await Promise.all(
        data?.data?.sessionAddeds?.map(async (session: any) => {
          const litClient = new LitJsSdk.LitNodeClientNodeJs({
            alertWhenUnauthorized: false,
            litNetwork: LIT_NETWORK.DatilDev,
            debug: true,
          });
          await litClient.connect();

          const newMetadata = await fetch(
            `${INFURA_GATEWAY}/ipfs/${
              session.encryptedData.split("ipfs://")?.[1]
            }`
          );
          const json = await newMetadata.json();

          const decrypted = await litClient.decrypt({
            dataToEncryptHash: json.dataToEncryptHash,
            accessControlConditions: json.accessControlConditions,
            ciphertext: json.ciphertext,
            chain: "ethereum",
          });

          const decoder = new TextDecoder();

          const decodedDataString = decoder.decode(decrypted.decryptedData);

          const decodedData = JSON.parse(decodedDataString);

          let postData: any = await fetchPost(sessionClient, {
            post: decodedData?.postId,
          });

          if (postData?.isOk()) {
            postData = postData?.value;
          } else {
            postData = undefined;
          }

          return {
            post: postData,
          };
        })
      );

      setMemories(newData);

      setPaginated(
        data?.data?.sessionAddeds?.length == 20 ? paginated + 20 : 0
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setMemoriesLoading(false);
  };

  useEffect(() => {
    if (memories?.length < 1) {
      setDeleteMemoryLoading(
        Array.from({ length: memories?.length }, () => false)
      );
    }
  }, [memories]);

  useEffect(() => {
    if (memories?.length < 1 && address && sessionClient) {
      handleMemories();
    }
  }, [address, sessionClient]);

  return {
    handleMoreMemories,
    memories,
    memoriesLoading,
    moreMemoriesLoading,
    paginated,
    deleteMemoryLoading,
    handleDeleteMemory,
  };
};

export default useMemories;
