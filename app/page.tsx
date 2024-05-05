import Image from "next/image";

export default function Home() {
  return (
    <div className="h-screen w-screen">
      <div className="flex justify-center flex-col h-screen">
        <div className="flex justify-center">
          <div>
            <div className="mb-10">
              <button>Continue as Youtuber</button>
            </div>
            <div>
              <button>Continue as Editor</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
