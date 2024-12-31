import { CurrentSession, Screen } from "@/components/Common/types/common.types";
import { Post } from "@lens-protocol/client";
import { SetStateAction } from "react";

export type MemoriesProps = {
  setScreen: (e: SetStateAction<Screen>) => void;
  setCurrentSession: (e: SetStateAction<CurrentSession>) => void;
  currentSession: CurrentSession;
};

export type Memory = {
  id: string;
  post: Post;
};
