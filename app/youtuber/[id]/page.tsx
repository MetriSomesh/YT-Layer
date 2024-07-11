"use client";
import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { channelInfoState } from "../../../app/state/channelInfoState";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { currentInvitationState } from "@/app/state/currentInvitationState";
import axios from "axios";

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
  const [currentInvitation, setCurrentInvitation] = useRecoilState(
    currentInvitationState
  );
  const [loadingAccept, setLoadingAccept] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const [actionCompleted, setActionCompleted] = useState<string | null>(null);

  const handleAcceptClick = async (invitationId: number | null) => {
    setLoadingAccept(true);
    setLoadingReject(false);
    try {
       const ytNotification = await axios.post(
        "/api/sendytnotification",
        {
          invitationId: invitationId,
          status: "Accepted",
        }
      );
      if (ytNotification.status == 200) {
      const response = await axios.post(
        "/api/acceptinvitation",
        {
          invitationId: invitationId,
          status: "Accepted",
        }
      );
      if (response.status === 200) {
        setActionCompleted("accepted");
      }
    }
    } catch (error) {
      console.error("Error accepting invitation:", error);
    } finally {
      setLoadingAccept(false);
    }
  };

  const handleRejectClick = async (invitationId: number | null) => {
    setLoadingReject(true);
    setLoadingAccept(false);
    try {
      const ytNotification = await axios.post(
        "/api/sendytnotification",
        {
          invitationId: invitationId,
          status: "Rejected",
        }
      );
      if (ytNotification.status == 200) {
        const response = await axios.post(
          "/api/rejectinvitation",
          {
            invitationId: invitationId,
            status: "Rejected",
          }
        );
        if (response.status === 200) {
          setActionCompleted("rejected");
        }
      }
    } catch (error) {
      console.error("Error rejecting invitation:", error);
    } finally {
      setLoadingReject(false);
    }
  };

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
          {actionCompleted ? (
            <div className="text-xl text-green-400">
              Invitation{" "}
              {actionCompleted === "accepted" ? "accepted" : "rejected"}{" "}
              successfully.
            </div>
          ) : (
            <>
              <Button
                className="bg-green-500 hover:bg-green-600"
                onClick={() => handleAcceptClick(currentInvitation)}
                disabled={loadingReject || loadingAccept}
              >
                {loadingAccept ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C6.477 0 2 4.477 2 10.5S6.477 21 12 21v-2a8 8 0 01-8-8z"
                    ></path>
                  </svg>
                ) : (
                  "Accept"
                )}
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-600"
                onClick={() => handleRejectClick(currentInvitation)}
                disabled={loadingAccept || loadingReject}
              >
                {loadingReject ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C6.477 0 2 4.477 2 10.5S6.477 21 12 21v-2a8 8 0 01-8-8z"
                    ></path>
                  </svg>
                ) : (
                  "Reject"
                )}
              </Button>
            </>
          )}
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
