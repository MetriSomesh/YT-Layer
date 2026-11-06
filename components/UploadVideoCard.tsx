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
    <Card className="w-full max-w-md rounded-2xl border border-border bg-card text-center shadow-none transition-colors hover:border-primary">
      <CardHeader className="mt-2">
        <div className="mb-4 flex justify-center">
          <FaVideo className="text-4xl text-primary" />
        </div>
        <CardTitle className="font-display justify-center text-2xl font-bold">
          Upload Video
        </CardTitle>
        <CardDescription className="mt-2">
          From here upload edited video to our server, later will be uploaded on
          YouTube
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {message && <p className="mb-4 text-sm text-destructive">{message}</p>}
        <Button
          className="mt-2 w-[160px] rounded-full bg-primary font-bold text-white transition-transform hover:scale-[1.03] hover:bg-primary"
          onClick={handleUpload}
        >
          Upload
        </Button>
      </CardContent>
    </Card>
  );
}
