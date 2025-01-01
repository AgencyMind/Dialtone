import { CurrentSession, Screen } from "@/components/Common/types/common.types";
import { Post, SessionClient } from "@lens-protocol/client";
import { SetStateAction } from "react";

export type MemoriesProps = {
  setScreen: (e: SetStateAction<Screen>) => void;
  setCurrentSession: (e: SetStateAction<CurrentSession>) => void;
  currentSession: CurrentSession;
  sessionClient: SessionClient | undefined
};

export type Memory = {
  id: string;
  post: Post;
  data: any
};
