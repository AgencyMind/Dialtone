import { Screen } from "@/components/Common/types/common.types";
import { EditorType } from "@/components/Feed/types/feed.types";
import { Post } from "@lens-protocol/client";
import { SetStateAction } from "react";


export type SessionSwitchProps = {
  currentSession: {
    post?: Post;
    editors: EditorType[];
    currentIndex: number;
  };
  textContent: string;
  postLoading: boolean;
  setTextContent: (e: SetStateAction<string>) => void;
};

export type ActivePostProps = {
  post: Post | undefined;
  setScreen: (e: SetStateAction<Screen>) => void;
};

export type ChatProps = {
  sendToAgent: () => Promise<void>;
  content: string;
  setContent: (e: SetStateAction<string>) => void;
  agentLoading: boolean;
};

export type AIResponseProps = {
  conversation: [];
};
