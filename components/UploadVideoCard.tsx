"use client";
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

export function UploadVideoCard() {
  const router = useRouter();
  return (
    <Card className="w-[400px] text-center">
      <CardHeader className="mt-2">
        <CardTitle className="justify-center mb-2">Upload Video</CardTitle>
        <CardDescription className="mt-2">
          From here upload edited video to our server, letter will be uploaded
          on youtube
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button
          className="mt-2 w-[90px]"
          onClick={() => {
            router.push("/vidupload");
          }}
        >
          Upload
        </Button>
      </CardContent>
    </Card>
  );
}
