import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent, JSX } from "react";
import { ChatProps } from "../types/session.types";

export const Chat: FunctionComponent<ChatProps> = ({
  sendToAgent,
  content,
  setContent,
  agentLoading,
}): JSX.Element => {
  return (
    <div className="relative flex w-full h-fit">
      <div className="relative w-full h-40 rounded-md border border-sea bg-gris text-black text-sm p-2 flex flex-col gap-2 items-start justify-between">
        <div className="relative w-fit h-fit font-digi flex text-left">
          Message your mirror agent
        </div>
        <textarea
          onChange={(e) => setContent(e.target.value)}
          value={content}
          style={{
            resize: "none",
          }}
          className="relative w-full h-full bg-gris focus:outline-none"
        />
        <div className="relative w-full h-fit flex items-end justify-end">
          <div className="relative w-fit h-fit flex">
            {agentLoading ? (
              <div className="relative w-5 h-5 animate-spin flex">
                <Image
                  layout="fill"
                  objectFit="cover"
                  draggable={false}
                  src={`${INFURA_GATEWAY}QmNcoHPaFjhDciiHjiMNpfTbzwnJwKEZHhNfziFeQrqTkX`}
                />
              </div>
            ) : (
              <div
                className="relative w-5 h-5 flex cursor-pointer hover:opacity-70"
                onClick={() => !agentLoading && sendToAgent()}
              >
                <Image
                  layout="fill"
                  objectFit="cover"
                  draggable={false}
                  src={`${INFURA_GATEWAY}QmQGUgUcyd2Hv8XEvEQr55BJqo9Fj8U5T9qasV7wpjv24z`}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
