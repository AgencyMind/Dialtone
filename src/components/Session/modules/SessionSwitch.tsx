import { EditorType } from "@/components/Feed/types/feed.types";
import { FunctionComponent, JSX } from "react";
import { SessionSwitchProps } from "../types/session.types";
import Wheel from "@uiw/react-color-wheel";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Menu from "./Menu";
import useImage from "../hooks/useImage";
import Image from "next/legacy/image";
import { FILTERS, INFURA_GATEWAY } from "@/lib/constants";
import useVideo from "../hooks/useVideo";

const SessionSwitch: FunctionComponent<SessionSwitchProps> = ({
  currentSession,
  setCurrentSession,
  setTextContent,
  postLoading,
  textContent,
  expand,
}): JSX.Element => {
  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleUpload,
    canvasRef,
    image,
    clearImage,
    setBrushColor,
    brushColor,
    setBrushSize,
    brushSize,
    parentRef,
  } = useImage(postLoading, setCurrentSession);
  const { initImage, setInitImage, filter, setFilter, videoRef } = useVideo();
  switch (currentSession?.editors?.[currentSession?.currentIndex]) {
    case EditorType.Audio:
      return (
        <div className="relative w-full h-full flex items-center justify-center text-xs font-digi text-black">
          Audio coming soon.
        </div>
      );
    case EditorType.Image:
      return (
        <div
          className="relative w-full h-full items-center justify-center flex gap-4 flex-col border border-sea rounded-md text-xs font-digi text-black"
          ref={parentRef}
          key={`parent-${expand.toString()}`}
        >
          <canvas
            ref={canvasRef}
            width={"100%"}
            height={"100%"}
            key={`canvas-${expand.toString()}`}
            style={{ width: parentRef.current?.clientWidth, height: parentRef.current?.clientHeight }}
            onMouseDown={() => handleMouseDown()}
            onMouseUp={() => handleMouseUp()}
            onMouseMove={(e) => handleMouseMove(e as any)}
          />
          {!image && (
            <label
              className={`absolute cursor-pointer top-0 left-0 flex w-full h-full items-center justify-center`}
              title="Upload Image"
            >
              <div className="relative w-fit h-fit">Upload Image.</div>
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={(e) => handleUpload(e)}
                hidden
                required
                multiple={false}
                className="relative w-full h-full cursor-pointer"
              />
            </label>
          )}
          {image && (
            <div className="absolute top-3 right-3 flex flex-row gap-2 text-xs text-black font-digi w-fit h-fit">
              <label
                className={`relative px-3 py-1 flex items-center justify-center text-black w-28 h-8 cursor-pointer active:scale-95`}
              >
                <div className="absolute top-0 left-0 flex w-28 h-8">
                  <Image
                    src={`${INFURA_GATEWAY}QmRU57vbmZm7EbKrJksFD6SfyLkZ2qUwfZHqXzy8XJvZAH`}
                    layout="fill"
                    objectFit="fill"
                    draggable={false}
                  />
                </div>
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={(e) => !postLoading && handleUpload(e)}
                  hidden
                  required
                  disabled={postLoading}
                  multiple={false}
                  className="relative w-full h-full cursor-pointer"
                />
                <div className="relative flex w-fit h-fit font-digi">
                  New Image
                </div>
              </label>
              <div
                className={`relative px-3 py-1 flex items-center justify-center text-black w-28 h-8 cursor-pointer active:scale-95`}
                onClick={() => !postLoading && clearImage()}
              >
                <div className="absolute top-0 left-0 flex w-28 h-8">
                  <Image
                    src={`${INFURA_GATEWAY}QmRU57vbmZm7EbKrJksFD6SfyLkZ2qUwfZHqXzy8XJvZAH`}
                    layout="fill"
                    objectFit="fill"
                    draggable={false}
                  />
                </div>

                <div className="relative flex w-fit h-fit font-digi">
                  Delete Image
                </div>
              </div>
            </div>
          )}
          {image && (
            <div className="absolute bottom-3 left-3 flex flex-row gap-2 text-xs text-black font-digi w-fit h-fit items-center justify-center">
              <Wheel
                color={brushColor}
                onChange={(color) =>
                  setBrushColor({ ...brushColor, ...color.hsva })
                }
                width={40}
                height={40}
              />
              <label className="relative w-20 h-fit flex">
                <input
                  type="range"
                  className="custom-range"
                  min="1"
                  max="20"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                />
              </label>
            </div>
          )}
        </div>
      );

    case EditorType.Text:
      return (
        <div className="relative w-full h-full items-start justify-start flex gap-4 flex-col">
          <EditorProvider
            slotBefore={<Menu />}
            content={textContent}
            editorProps={{
              attributes: {
                class:
                  "border w-full h-full overflow-y-scroll border-sea p-2 focus:outline-none",
              },
            }}
            key={expand.toString()}
            editable={!postLoading}
            extensions={[
              Color.configure({ types: [TextStyle.name, ListItem.name] }),
              TextStyle,
              StarterKit.configure({
                bulletList: {
                  keepMarks: true,
                  keepAttributes: false,
                },
                orderedList: {
                  keepMarks: true,
                  keepAttributes: false,
                },
              }),
            ]}
            onUpdate={({ editor }) => setTextContent(editor.getHTML())}
          ></EditorProvider>
        </div>
      );

    default:
      return (
        <div className="relative w-full h-full items-center justify-between flex gap-4 flex-row border border-sea rounded-md text-xs">
          <div className="relative w-32 h-full flex items-start justify-between gap-3 flex flex-col p-2">
            <div className="relative w-full h-fit flex flex-row gap-2 justify-between items-center gap-2 text-xxs text-black">
              <div className="relative flex w-fit h-fit flex flex-col gap-2 items-center justify-center">
                <div className="relative flex w-6 h-6 flex rounded-full cursor-pointer bg-[#A13CFF]"></div>
                <div className="relative w-fit h-fit flex text-center">
                  Record Live
                </div>
              </div>
              <div className="relative flex w-fit h-fit flex flex-col gap-2 items-center justify-center">
                <div className="relative flex w-7 h-7 flex cursor-pointer">
                  <Image
                    draggable={false}
                    layout="fill"
                    objectFit="cover"
                    src={`${INFURA_GATEWAY}QmQN4awzCdSdQvoTRKbSKPd1njyzey7JzREZ1edKPCUQeq`}
                  />
                </div>
                <div className="relative w-fit h-fit flex text-center">
                  Edit Video
                </div>
              </div>
            </div>
            <div className="relative w-full h-full flex items-start justify-start">
              <div className="relative w-28 h-fit flex items-start justify-start gap-2 flex-col font-digi text-sun text-xxs text-center">
                {FILTERS.map((fil, index) => {
                  return (
                    <div
                      onClick={() => setFilter(fil)}
                      key={index}
                      className={`cursor-pointer hover:opacity-70 relative w-full h-fit px-2 py-1 items-center justify-center flex bg-darker rounded-full ${
                        fil == filter && "border-2 border-sun"
                      }`}
                    >
                      {fil}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="relative w-full h-fit flex flex-col gap-2 justify-between items-center gap-2">
              <div className="relative w-fit h-fit flex text-xxs text-center">
                Create your <br /> own filters.
              </div>
              <label
                className={`relative cursor-pointer flex w-full h-40 border border-sea rounded-md items-center justify-center`}
                title="Upload Image"
              >
                {initImage ? (
                  <Image
                    className="rounded-md w-full h-full"
                    objectFit="cover"
                    layout="fill"
                    src={URL.createObjectURL(initImage)}
                    draggable={false}
                  />
                ) : (
                  <div className="relative flex w-fit h-fit uppercase font-digi text-black">
                    upload image
                  </div>
                )}
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={(e) =>
                    e.target.files?.[0] && setInitImage(e.target.files?.[0])
                  }
                  hidden
                  required
                  multiple={false}
                  className="relative w-full h-full cursor-pointer"
                />
              </label>
            </div>
          </div>
          <div className="relative w-full h-full flex items-start justify-between gap-3 flex-col p-2">
            <div className="relative w-full h-full bg-darker rounded-md flex">
              <video
                ref={videoRef}
                className="absolute top-0 left-0 w-full h-full object-cover rounded-md"
                playsInline
                muted
              ></video>
            </div>
            <div className="relative w-full h-full bg-darker rounded-md flex"></div>
          </div>
        </div>
      );
  }
};

export default SessionSwitch;
