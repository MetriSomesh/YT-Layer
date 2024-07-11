"use client";
import { videoPublicIdState } from "@/app/state/videoPublicIdState";
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
import { FaVideo } from "react-icons/fa";
import { useRecoilState } from "recoil";

export function UploadVideoCard() {
  const router = useRouter();
  const [publicId, setPublicId] = useRecoilState(videoPublicIdState);
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
          From here upload edited video to our server, letter will be uploaded
          on youtube
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button
          className="mt-2 w-[120px] bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-full transition-colors duration-300"
          onClick={() => {
            if (publicId !== null && publicId.length > 2) {
              router.push(`/video/${publicId}`);
            } else {
              router.push("/vidupload");
            }
          }}
        >
          Upload
        </Button>
      </CardContent>
    </Card>
  );
}
