"use client";

import Image from "next/image";
import editorImage from "../assets/editor.png";
import { useRouter } from "next/navigation";
import YoutuberIcon from "../components/YoutubeIcon";
import { Appbar } from "@/components/Appbar";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* <Appbar /> */}
      <main className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
        <h1 className="text-5xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Welcome to YT-Layer
        </h1>
        <p className="text-xl mb-12 text-center max-w-2xl">
          Empower your YouTube journey. Choose your role and start creating
          amazing content today.
        </p>
        <div className="flex flex-col sm:flex-row gap-8">
          <button
            onClick={() => {
              localStorage.setItem("userType", "YOUTUBER");
              router.push("/signup");
            }}
            className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-purple-600 rounded-full overflow-hidden hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600"
          >
            <span className="relative z-10 flex items-center">
              <YoutuberIcon />
              Continue as Youtuber
            </span>
            <span className="absolute inset-0 bg-purple-800 transform translate-y-full transition-transform duration-200 ease-out group-hover:translate-y-0"></span>
          </button>
          <button
            onClick={() => {
              localStorage.setItem("userType", "EDITOR");
              router.push("/signup");
            }}
            className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-pink-600 rounded-full overflow-hidden hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-600"
          >
            <span className="relative z-10 flex items-center">
              <Image
                src={editorImage}
                alt="Editor Icon"
                width={24}
                height={24}
                className="mr-2 filter invert"
              />
              Continue as Editor
            </span>
            <span className="absolute inset-0 bg-pink-800 transform translate-y-full transition-transform duration-200 ease-out group-hover:translate-y-0"></span>
          </button>
        </div>
      </main>
    </div>
  );
}
