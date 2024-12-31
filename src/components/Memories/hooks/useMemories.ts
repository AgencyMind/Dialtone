import { useEffect, useState } from "react";
import { Memory } from "../types/memories.types";
import { createWalletClient, custom, PublicClient } from "viem";
import { chains } from "@lens-network/sdk/viem";
import { SESSION_DATA_CONTRACT } from "@/lib/constants";
import SessionDatabaseAbi from "@abis/SessionDatabase.json";

const useMemories = (
  address: `0x${string}` | undefined,
  publicClient: PublicClient
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
    setMoreMemoriesLoading(true);
    try {
    } catch (err: any) {
      console.error(err.message);
    }
    setMoreMemoriesLoading(false);
  };

  const handleMemories = async () => {
    setMemoriesLoading(true);
    try {
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
    if (memories?.length < 1) {
      handleMemories();
    }
  }, []);

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
