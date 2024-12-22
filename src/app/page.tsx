export default function Home() {
  return (
    <div className="relative w-full h-full flex min-h-screen items-center justify-center">
      <div
        id="static"
        className="absolute top-0 left-0 w-full h-full flex"
      ></div>
      <div className="relative w-fit h-fit flex text-lg sm:text-6xl text-black opacity-80 font-perfect">
        dialtone
      </div>
    </div>
  );
}
