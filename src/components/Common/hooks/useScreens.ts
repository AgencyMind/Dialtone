import { SetStateAction, useEffect, useState } from "react";
import { LensAccount, Screen } from "../types/common.types";
import { evmAddress, PublicClient } from "@lens-protocol/client";
import { createWalletClient, custom } from "viem";
import { chains } from "@lens-network/sdk/viem";
import {
  fetchAccountsAvailable,
  revokeAuthentication,
} from "@lens-protocol/client/actions";
import { SCREENS, STORAGE_NODE } from "@/lib/constants";

const useScreens = (
  address: `0x${string}` | undefined,
  lensClient: PublicClient,
  lensAccount: LensAccount | undefined,
  setLensAccount: (e: SetStateAction<LensAccount | undefined>) => void,
  setIndexer: (e: SetStateAction<string | undefined>) => void,
  setCreateAccount: (e: SetStateAction<boolean>) => void,
  aiKey: string | undefined,
  setAikey: (e: SetStateAction<string | undefined>) => void
) => {
  const [screen, setScreen] = useState<Screen>(SCREENS[0]);
  const [accountOpen, setAccountOpen] = useState<boolean>(false);
  const [lensLoading, setLensLoading] = useState<boolean>(false);
  const [expand, setExpand] = useState<boolean>(false);

  const handleGetAIKey = async () => {
    try {
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const login = async () => {
    if (!address || !lensClient) return;
    setLensLoading(true);
    try {
      const signer = createWalletClient({
        chain: chains.testnet,
        transport: custom(window.ethereum!),
        account: address,
      });

      const accounts = await fetchAccountsAvailable(lensClient, {
        managedBy: evmAddress(signer.account.address),
        includeOwned: true,
      });

      if ((accounts as any)?.value?.items?.[0]?.address) {
        const authenticated = await lensClient.login({
          accountOwner: {
            app: "0xe5439696f4057aF073c0FB2dc6e5e755392922e1",
            account: evmAddress(
              (accounts as any)?.value?.items?.[0]?.account?.address
            ),
            owner: signer.account.address?.toLowerCase(),
          },
          signMessage: (message) => signer.signMessage({ message }),
        });

        if (authenticated.isErr()) {
          console.error(authenticated.error);
          setIndexer?.("Error Authenticating");
          setLensLoading(false);
          return;
        }

        const sessionClient = authenticated.value;

        let picture = "";
        const cadena = await fetch(
          `${STORAGE_NODE}/${
            (
              accounts as any
            )?.value?.items?.[0]?.account?.metadata?.picture?.split(
              "lens://"
            )?.[1]
          }`
        );

        if (cadena) {
          const json = await cadena.json();
          picture = json.item;
        }

        setLensAccount?.({
          sessionClient,
          account: {
            ...(accounts as any)?.value?.items?.[0]?.account,
            metadata: {
              ...(accounts as any)?.value?.items?.[0]?.account?.metadata,
              picture,
            },
          },
        });
      } else {
        const authenticatedOnboarding = await lensClient.login({
          onboardingUser: {
            app: "0xe5439696f4057aF073c0FB2dc6e5e755392922e1",
            wallet: signer.account.address,
          },
          signMessage: (message) => signer.signMessage({ message }),
        });

        if (authenticatedOnboarding.isErr()) {
          console.error(authenticatedOnboarding.error);
          setIndexer?.("Error Onboarding");

          setLensLoading(false);
          return;
        }

        const sessionClient = authenticatedOnboarding.value;

        setLensAccount?.({
          sessionClient,
        });

        setCreateAccount?.(true);
      }
    } catch (err: any) {
      console.error(err.message);
    }

    setLensLoading(false);
  };

  const resumeLensSession = async () => {
    try {
      const resumed = await lensClient?.resumeSession();

      if (resumed?.isOk()) {
        const accounts = await fetchAccountsAvailable(lensClient!, {
          managedBy: evmAddress(address!),
        });

        let picture = "";
        const cadena = await fetch(
          `${STORAGE_NODE}/${
            (
              accounts as any
            )?.value?.items?.[0]?.account?.metadata?.picture?.split(
              "lens://"
            )?.[1]
          }`
        );

        if (cadena) {
          const json = await cadena.json();
          picture = json.item;
        }

        setLensAccount?.({
          account: {
            ...(accounts as any)?.value?.items?.[0]?.account,
            metadata: {
              ...(accounts as any)?.value?.items?.[0]?.account?.metadata,
              picture,
            },
          },
          sessionClient: resumed?.value,
        });
      }
    } catch (err) {
      console.error("Error al reanudar la sesión:", err);
      return null;
    }
  };

  const logout = async () => {
    setLensLoading(true);
    try {
      const auth = await lensAccount?.sessionClient?.getAuthenticatedUser();

      if (auth?.isOk()) {
        const res = await revokeAuthentication(lensAccount?.sessionClient!, {
          authenticationId: auth.value?.authentication_id,
        });

        if (res) {
          setLensAccount?.(undefined);
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setLensLoading(false);
  };

  useEffect(() => {
    if (address && lensClient && !lensAccount?.account) {
      resumeLensSession();
    }
  }, [address, lensClient]);

  useEffect(() => {
    if (!address && lensAccount?.account && lensClient) {
      logout();
    }
  }, [address]);

  useEffect(() => {
    handleGetAIKey();
  }, []);

  return {
    screen,
    setScreen,
    accountOpen,
    setAccountOpen,
    login,
    logout,
    lensLoading,
    expand,
    setExpand,
  };
};

export default useScreens;
