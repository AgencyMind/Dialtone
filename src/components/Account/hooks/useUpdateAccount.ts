import { LensAccount } from "@/components/Common/types/common.types";
import { STORAGE_NODE } from "@/lib/constants";
import { fetchAccount } from "@lens-protocol/client/actions";
import { StorageClient } from "@lens-protocol/storage-node-client";
import { SetStateAction, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import updateAccount from "../../../../graphql/lens/mutations/updateAccount";
import pollResult from "@/lib/helpers/pollResult";

const useUpdateAccount = (
  lensAccount: LensAccount | undefined,
  storageClient: StorageClient,
  setLensAccount: (e: SetStateAction<LensAccount | undefined>) => void
) => {
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [aiKey, setAiKey] = useState<string | undefined>("");
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [updatedAccount, setUpdatedAccount] = useState<{
    pfp?: string | Blob | undefined;
    cover?: string | Blob | undefined;
    bio: string;
    name: string;
  }>({
    bio: lensAccount?.account?.metadata?.bio || "",
    name: lensAccount?.account?.metadata?.name || "",
  });

  const handleAIKey = async () => {
    setAiLoading(true);
    try {
    } catch (err: any) {
      console.error(err.message);
    }
    setAiLoading(false);
  };

  const handleUpdateAccount = async () => {
    if (!lensAccount?.sessionClient) return;
    setUpdateLoading(true);
    try {
      let picture = {},
        cover = {};

      if (updatedAccount?.pfp && updatedAccount.pfp instanceof Blob) {
        const res = await fetch("/api/ipfs", {
          method: "POST",
          body: updatedAccount?.pfp,
        });
        const json = await res.json();

        const { uri } = await storageClient.uploadAsJson({
          type: "image/png",
          item: "ipfs://" + json?.cid,
        });

        picture = {
          picture: uri,
        };
      }

      if (updatedAccount?.cover && updatedAccount.cover instanceof Blob) {
        const res = await fetch("/api/ipfs", {
          method: "POST",
          body: updatedAccount?.cover,
        });
        const json = await res.json();

        const { uri } = await storageClient.uploadAsJson({
          type: "image/png",
          item: "ipfs://" + json?.cid,
        });

        cover = {
          cover: uri,
        };
      }

      const { uri } = await storageClient.uploadAsJson({
        $schema: "https://json-schemas.lens.dev/account/1.0.0.json",
        lens: {
          id: uuidv4(),
          name: updatedAccount?.name,
          bio: updatedAccount?.bio,
          ...picture,
          ...cover,
        },
      });

      const accountResponse = await updateAccount(
        {
          metadataUri: uri,
        },
        lensAccount?.sessionClient
      );

      if ((accountResponse as any)?.hash) {
        if (
          await pollResult(
            (accountResponse as any)?.hash,
            lensAccount?.sessionClient
          )
        ) {
          const result = await fetchAccount(lensAccount?.sessionClient, {
            address: lensAccount?.account?.address,
          });

          let picture = "";
          const cadena = await fetch(
            `${STORAGE_NODE}/${
              (result as any)?.metadata?.picture?.split("lens://")?.[1]
            }`
          );

          if (cadena) {
            const json = await cadena.json();
            picture = json.item;
          }

          if ((result as any)?.__typename == "Account") {
            setLensAccount?.({
              ...lensAccount,
              account: {
                ...(result as any),
                metadata: {
                  ...(result as any)?.metadata,
                  picture,
                },
              },
            });
          }
        } else {
          console.error(accountResponse);
          setUpdateLoading(false);
          return;
        }
      } else {
        console.error(accountResponse);
        setUpdateLoading(false);
        return;
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setUpdateLoading(false);
  };

  return {
    updatedAccount,
    setUpdatedAccount,
    handleUpdateAccount,
    updateLoading,
    aiKey,
    setAiKey,
    handleAIKey,
    aiLoading,
  };
};

export default useUpdateAccount;
