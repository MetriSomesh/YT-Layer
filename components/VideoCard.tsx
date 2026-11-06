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

export function VideoCard() {
  const router = useRouter();
  const [publicId, setPublicId] = useRecoilState(videoPublicIdState);
  return (
    <Card className="w-full max-w-md rounded-2xl border border-border bg-card text-center shadow-none transition-colors hover:border-primary">
      <CardHeader className="mt-2">
        <div className="mb-4 flex justify-center">
          <FaVideo className="text-4xl text-primary" />
        </div>
        <CardTitle className="font-display justify-center text-2xl font-bold">
          Video Controller
        </CardTitle>
        <CardDescription className="mt-2">
          Watch video edited by editor and take actions according to the
          expectations
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button
          className="mt-2 w-[160px] rounded-full bg-primary font-bold text-white transition-transform hover:scale-[1.03] hover:bg-primary"
          onClick={() => {
            router.push(`/video/${publicId}?isYoutuber=true`);
          }}
        >
          View Video
        </Button>
      </CardContent>
    </Card>
  );
}
