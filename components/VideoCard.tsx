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
import { useRecoilState } from "recoil";

export function VideoCard() {
  const router = useRouter();
  const [publicId, setPublicId] = useRecoilState(videoPublicIdState);
  return (
    <Card className="w-[400px] text-center">
      <CardHeader className="mt-2">
        <CardTitle className="justify-center mb-2">Video Controller</CardTitle>
        <CardDescription className="mt-2">
          Watch video edited by editor and take actions according to the
          expectations
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button
          className="mt-2 w-[90px]"
          onClick={() => {
            router.push(`/video/${publicId}?isYoutuber=true`);
          }}
        >
          View
        </Button>
      </CardContent>
    </Card>
  );
}
