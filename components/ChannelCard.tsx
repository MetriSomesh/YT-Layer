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
    <Card className="w-[400px] text-center bg-gray-800 border-gray-700 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <CardHeader className="mt-2">
        <div className="flex justify-center mb-4">
          <FaYoutube className="text-4xl text-red-500" />
        </div>
        <CardTitle className="justify-center mb-2 text-2xl font-bold text-white">
          View Channel
        </CardTitle>
        <CardDescription className="mt-2 text-gray-400">
          Take a look at your Youtube Channel and check statistics from here
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button
          className="mt-2 w-[120px] bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-full transition-colors duration-300"
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
