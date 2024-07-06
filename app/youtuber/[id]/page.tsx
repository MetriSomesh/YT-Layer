"use client";
import React from "react";
import { useRecoilState } from "recoil";
import { channelInfoState } from "../../../app/state/channelInfoState";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";

interface User {
  id: number;
  username: string;
  email: string;
}

interface Channel {
  ChannelPic: string;
  title: string;
  description: string;
  subscriberCount: string;
  viewCount: string;
  videoCount: string;
}

interface Youtuber {
  id: number;
  user: User | null;
  channel: Channel | null;
}

interface YoutuberDetailProps {
  youtuber: Youtuber;
}

const YoutuberDetailPage: React.FC<YoutuberDetailProps> = ({ youtuber }) => {
  const [channelInfo, setChannelInfo] = useRecoilState(channelInfoState);

  if (!channelInfo) {
    return <div>Youtuber not found</div>;
  }

  return (
    <div className="mx-auto p-6 min-h-screen bg-gray-900 text-gray-100">
      <Card className="bg-gray-800 shadow-md rounded-lg p-8">
        <a href="/eddashboard" className="text-blue-400 hover:text-blue-500">
          Back to Dashboard
        </a>
        <div className="text-center mt-6">
          {channelInfo.ChannelPic && (
            <img
              src={channelInfo.ChannelPic}
              alt={channelInfo.title || "Channel Picture"}
              className="rounded-full mx-auto border-4 border-blue-500"
              width={150}
              height={150}
            />
          )}
          <h1 className="text-4xl font-bold mt-4 text-blue-400">
            {channelInfo.title || "No Channel Title"}
          </h1>
          <p className="text-gray-300 mt-2">{channelInfo.description}</p>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-blue-400">
              Subscriber Count
            </h2>
            <p className="text-gray-300 mt-2">
              {channelInfo.subscriberCount || "N/A"}
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-blue-400">Views Count</h2>
            <p className="text-gray-300 mt-2">
              {channelInfo.viewCount || "N/A"}
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-blue-400">Video Count</h2>
            <p className="text-gray-300 mt-2">
              {channelInfo.videoCount || "N/A"}
            </p>
          </div>
        </div>
        <div className="mt-10 flex justify-center space-x-4">
          <Button
            className="bg-green-500 hover:bg-green-600"
            // onClick={() => handleActionClick("accept")}
          >
            Accept
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600"
            // onClick={() => handleActionClick("reject")}
          >
            Reject
          </Button>
        </div>
        <div className="mt-4 flex justify-center">
          <a
            href={`https://youtube.com/channel/${channelInfo.channelId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-500"
          >
            View Channel
          </a>
        </div>
      </Card>
    </div>
  );
};

export default YoutuberDetailPage;
