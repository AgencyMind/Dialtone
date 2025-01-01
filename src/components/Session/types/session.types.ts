import { CurrentSession, Screen } from "@/components/Common/types/common.types";
import { Post } from "@lens-protocol/client";
import { ChatCompletion } from "openai/resources/index.mjs";
import { SetStateAction } from "react";

export type SessionSwitchProps = {
  currentSession: CurrentSession;
  setCurrentSession: (e: SetStateAction<CurrentSession>) => void;
  textContent: string;
  postLoading: boolean;
  setTextContent: (e: SetStateAction<string>) => void;
  expand: boolean;
};

export type ActivePostProps = {
  post: Post | undefined;
  setScreen?: (e: SetStateAction<Screen>) => void;
};

export type ChatProps = {
  sendToAgent: () => Promise<void>;
  content: string;
  setContent: (e: SetStateAction<string>) => void;
  agentLoading: boolean;
  aiKey: string | undefined;
  setScreen: (e: SetStateAction<Screen>) => void;
};

export type AIResponseProps = {
  agentChat: ChatCompletion.Choice[]
};
