import { FILTERS } from "@/lib/constants";
import { useEffect, useRef, useState } from "react";

const useVideo = () => {
  const [initImage, setInitImage] = useState<Blob | undefined>();
  const [filter, setFilter] = useState<string>(FILTERS[0]);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const startStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };

    startStream();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return {
    initImage,
    setInitImage,
    filter,
    setFilter,
    videoRef
  };
};

export default useVideo;
