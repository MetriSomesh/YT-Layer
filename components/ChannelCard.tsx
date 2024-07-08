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

export const ChannelCard = () => {
  const [channelLink, setChannelLink] = useRecoilState(channelLinkState);

  return (
    <Card className="w-[400px] text-center">
      <CardHeader className="mt-2">
        <CardTitle className="justify-center mb-2">View Channel</CardTitle>
        <CardDescription className="mt-2">
          Take a look at your Youtube Channel and check statistics from here
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button
          className="mt-2 w-[90px]"
          onClick={() => {
            window.open(`https://youtube.com/channel/${channelLink}`, "_blank");
          }}
        >
          View
        </Button>
      </CardContent>
    </Card>
  );
};
