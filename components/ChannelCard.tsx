import { channelLinkState } from "@/app/state/channelLinkState";
import { useRecoilState } from "recoil";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FaYoutube } from "react-icons/fa";

export const ChannelCard = () => {
  const [channelLink, setChannelLink] = useRecoilState(channelLinkState);

  return (
    <Card className="w-full max-w-md rounded-2xl border border-border bg-card text-center shadow-none transition-colors hover:border-primary">
      <CardHeader className="mt-2">
        <div className="mb-4 flex justify-center">
          <FaYoutube className="text-4xl text-primary" />
        </div>
        <CardTitle className="font-display justify-center text-2xl font-bold">
          View Channel
        </CardTitle>
        <CardDescription className="mt-2">
          Take a look at your Youtube Channel and check statistics from here
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button
          className="mt-2 w-[160px] rounded-full bg-primary font-bold text-white transition-transform hover:scale-[1.03] hover:bg-primary"
          onClick={() => {
            window.open(`https://youtube.com/channel/${channelLink}`, "_blank");
          }}
        >
          View Channel
        </Button>
      </CardContent>
    </Card>
  );
};
