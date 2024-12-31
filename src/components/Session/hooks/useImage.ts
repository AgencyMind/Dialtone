import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { hsvaToHex, HsvaColor } from "@uiw/color-convert";

const useImage = (postLoading: boolean) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [drawing, setDrawing] = useState<boolean>(false);
  const [brushColor, setBrushColor] = useState<HsvaColor>({ h: 214, s: 43, v: 90, a: 1 });
  const [brushSize, setBrushSize] = useState<number>(5);

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (postLoading) return;
    const file = event.target.files?.[0];
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        setImage(img);
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");

          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const targetWidth = (3 / 4) * canvas.width;
            const targetHeight = targetWidth * (img.height / img.width);

            const offsetX = (canvas.width - targetWidth) / 2;
            const offsetY = (canvas.height - targetHeight) / 2;

            ctx.drawImage(img, offsetX, offsetY, targetWidth, targetHeight);
          }
        }
      };
    }
  };
  const handleMouseDown = () => !postLoading && setDrawing(true);

  const handleMouseUp = () => setDrawing(false);

  const handleMouseMove = (
    event: MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (!drawing || !image || postLoading) return;
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext("2d");
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) * (canvas.width / rect.width);
      const y = (event.clientY - rect.top) * (canvas.height / rect.height);

      if (ctx) {
        ctx.fillStyle = hsvaToHex(brushColor);
        ctx.beginPath();
        ctx.arc(x, y, brushSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const clearImage = () => {
    setImage(null);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const configureCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }
  };

  useEffect(() => {
    if (canvasRef) {
      configureCanvas();
    }
  }, [canvasRef]);

  return {
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
  };
};

export default useImage;
