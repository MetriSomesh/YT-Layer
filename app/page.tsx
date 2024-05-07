"use client";
import Image from "next/image";
import editorImage from "../assets/editor.png";
import { useRouter } from "next/navigation";
import YoutuberIcon from "../components/YoutubeIcon";
export default function Home() {
  const router = useRouter();
  return (
    <div className="h-screen w-screen">
      <div className="flex justify-center flex-col h-screen">
        <div className="flex justify-center">
          <div>
            <div className="mb-10">
              <button
                onClick={() => {
                  localStorage.setItem("userType", "YOUTUBER");
                  router.push("/signup");
                }}
                className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none flex items-center gap-3"
                type="button"
              >
                <YoutuberIcon />
                Continue as Youtuber
              </button>
            </div>
            <div className="mb-10">
              <button
                onClick={() => {
                  localStorage.setItem("userType", "EDITOR");
                  router.push("/signup");
                }}
                className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none flex items-center gap-3"
                type="button"
              >
                <div className="h-9 w-9 filter brightness-0 invert">
                  <Image
                    src={editorImage}
                    alt="Editor Image"
                    className="h-full w-full"
                  />
                </div>
                Continue as Editor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
