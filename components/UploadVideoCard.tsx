"use client";
import { videoPublicIdState } from "@/app/state/videoPublicIdState";
import { ytIdState } from "@/app/state/ytIdState";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaArrowLeft, FaVideo } from "react-icons/fa";
import { useRecoilState, useRecoilValue } from "recoil";

export function UploadVideoCard() {
  const router = useRouter();
  const [publicId, setPublicId] = useRecoilState(videoPublicIdState);
  const ytId = useRecoilValue(ytIdState);
  const [message, setMessage] = useState("");
  const handleUpload = () => {
    if (!ytId) {
      setMessage("You're not connected to any YouTuber yet");
    } else if (publicId !== null && publicId.length > 2) {
      router.push(`/video/${publicId}`);
    } else {
      router.push("/vidupload");
    }
  };

  const handleBack = () => {
    router.push("/dashboard");
  };
  return (
    <Card className="w-[400px] text-center bg-gray-800 border-gray-700 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <CardHeader className="mt-2">
        <div className="flex justify-center mb-4">
          <FaVideo className="text-4xl text-purple-500" />
        </div>
        <CardTitle className="justify-center mb-2 text-2xl font-bold text-white">
          Upload Video
        </CardTitle>
        <CardDescription className="mt-2 text-gray-400">
          From here upload edited video to our server, later will be uploaded on
          YouTube
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {message && <p className="text-red-500 mb-4">{message}</p>}
        <Button
          className="mt-2 w-[120px] bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-full transition-colors duration-300"
          onClick={handleUpload}
        >
          Upload
        </Button>
      </CardContent>
    </Card>
  );
}
