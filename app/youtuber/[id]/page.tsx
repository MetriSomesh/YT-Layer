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

const YoutuberDetailPage = () => {
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
      const ytNotification = await axios.post("/api/sendytnotification", {
        invitationId: invitationId,
        status: "Accepted",
      });
      if (ytNotification.status == 200) {
        const response = await axios.post("/api/acceptinvitation", {
          invitationId: invitationId,
          status: "Accepted",
        });
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
      const ytNotification = await axios.post("/api/sendytnotification", {
        invitationId: invitationId,
        status: "Rejected",
      });
      if (ytNotification.status == 200) {
        const response = await axios.post("/api/rejectinvitation", {
          invitationId: invitationId,
          status: "Rejected",
        });
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
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-foreground">
        <p className="font-label text-xs tracking-[0.3em] text-muted-foreground">
          YOUTUBER NOT FOUND
        </p>
        <p className="font-display mt-4 text-3xl font-bold tracking-tight">
          No channel here.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen bg-background p-6 text-foreground">
      <Card className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-8 shadow-none">
        <a
          href="/eddashboard"
          className="font-label text-xs tracking-widest text-primary hover:underline"
        >
          &larr; Back to Dashboard
        </a>
        <div className="mt-8 text-center">
          {channelInfo.ChannelPic && (
            <img
              src={channelInfo.ChannelPic}
              alt={channelInfo.title || "Channel Picture"}
              className="mx-auto rounded-full border-4 border-primary"
              width={150}
              height={150}
            />
          )}
          <p className="font-label mt-6 text-xs tracking-[0.3em] text-muted-foreground">
            CHANNEL INVITATION
          </p>
          <h1 className="font-display mt-3 text-4xl font-bold tracking-tight">
            {channelInfo.title || "No Channel Title"}
          </h1>
          <p className="mx-auto mt-2 max-w-2xl leading-relaxed text-muted-foreground">
            {channelInfo.description}
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-secondary p-6 text-center">
            <h2 className="font-label text-xs tracking-[0.3em] text-muted-foreground">
              SUBSCRIBERS
            </h2>
            <p className="font-display mt-3 text-2xl font-bold">
              {channelInfo.subscriberCount || "N/A"}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-secondary p-6 text-center">
            <h2 className="font-label text-xs tracking-[0.3em] text-muted-foreground">
              VIEWS
            </h2>
            <p className="font-display mt-3 text-2xl font-bold">
              {channelInfo.viewCount || "N/A"}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-secondary p-6 text-center">
            <h2 className="font-label text-xs tracking-[0.3em] text-muted-foreground">
              VIDEOS
            </h2>
            <p className="font-display mt-3 text-2xl font-bold">
              {channelInfo.videoCount || "N/A"}
            </p>
          </div>
        </div>
        <div className="mt-10 flex justify-center space-x-4">
          {actionCompleted ? (
            <div className="font-label text-sm tracking-widest text-primary">
              INVITATION{" "}
              {actionCompleted === "accepted" ? "ACCEPTED" : "REJECTED"}{" "}
              SUCCESSFULLY
            </div>
          ) : (
            <>
              <Button
                className="rounded-full bg-primary px-6 py-2 font-bold text-white hover:bg-primary"
                onClick={() => handleAcceptClick(currentInvitation)}
                disabled={loadingReject || loadingAccept}
              >
                {loadingAccept ? (
                  <svg
                    className="h-5 w-5 animate-spin text-white"
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
                className="rounded-full border border-border bg-transparent px-6 py-2 font-bold text-foreground hover:border-foreground hover:bg-secondary"
                onClick={() => handleRejectClick(currentInvitation)}
                disabled={loadingAccept || loadingReject}
              >
                {loadingReject ? (
                  <svg
                    className="h-5 w-5 animate-spin text-foreground"
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
        <div className="mt-6 flex justify-center">
          <a
            href={`https://youtube.com/channel/${channelInfo.channelId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-label text-xs tracking-widest text-primary hover:underline"
          >
            VIEW CHANNEL
          </a>
        </div>
      </Card>
    </div>
  );
};

export default YoutuberDetailPage;
