"use client";
import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { userIdState } from "@/states/userState";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { youtuberIdState } from "@/app/state/youtuberIdState";

interface User {
  id: number;
  username: string;
  email: string;
}

interface Editor {
  id: number;
  profile_pic: string;
  description: string;
  experience: string;
  phone_number: string;
  country: string;
  state: string;
  city: string;
  user: User | null; // Allow user to be null
}

interface EditorDetailProps {
  editor: Editor;
}

const EditorDetail: React.FC<EditorDetailProps> = ({ editor }) => {
  const [userId, setUserId] = useRecoilState(userIdState);
  const [isInvitationSent, setIsInvitationSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusCode, setStatusCode] = useState(false);
  // const youtuberId = useRecoilValue(youtuberIdState);
  const youtuberId = parseInt(localStorage.getItem("youtuberId") || "");

  const handleInviteClick = async () => {
    setLoading(true);
    try {
      const channelInfo = await axios.post("/api/getChannelInfo", {
        id: youtuberId,
      });
      if (channelInfo) {
        const newInvitation = await axios.post("/api/sendinvitation", {
          youtuberId: youtuberId,
          editorId: editor.id,
          message: `${channelInfo.data.channelInfo.title} has invited you! `,
          status: "pending",
        });

        if (newInvitation.status === 200) {
          const channelConnect = await axios.post("/api/connectChannel", {
            id: youtuberId,
          });

          if (channelConnect.status === 200) {
            setIsInvitationSent(true);
          }
        } else if (newInvitation.status === 201) {
          setStatusCode(true);
          setIsInvitationSent(true);
        }
      }
    } catch (error) {
      console.error(`Error occurred: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-12 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-border bg-card">
        <div className="timeline-ruler relative h-32 border-b border-border bg-card">
          <Link
            href="/addeditor"
            className="font-label absolute left-4 top-4 flex items-center text-xs tracking-widest text-muted-foreground transition-colors hover:text-foreground"
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            Back to Search
            {youtuberId}
          </Link>
          <div className="absolute bottom-0 left-0 flex h-6 w-full">
            <div className="w-[18%] bg-zinc-800" />
            <div className="w-[26%] bg-zinc-700" />
            <div className="w-[12%] bg-primary" />
            <div className="w-[30%] bg-zinc-800" />
            <div className="w-[14%] bg-zinc-700" />
          </div>
        </div>
        <div className="relative px-6 py-10 sm:px-10">
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
            <Image
              src={editor.profile_pic}
              alt={editor.user?.username || "Editor Profile Picture"}
              width={150}
              height={150}
              className="rounded-full border-4 border-primary shadow-lg"
            />
          </div>
          <div className="mt-16 text-center">
            <p className="font-label text-xs tracking-[0.3em] text-primary">
              EDITOR PROFILE
            </p>
            <h1 className="font-display mt-3 text-4xl font-bold tracking-tight">
              {editor.user?.username || "No Username"}
            </h1>
            <p className="mx-auto mt-2 max-w-2xl leading-relaxed text-muted-foreground">
              {editor.description}
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-secondary p-6">
              <h2 className="font-label text-xs tracking-[0.3em] text-muted-foreground">
                EXPERIENCE
              </h2>
              <p className="font-display mt-3 text-2xl font-bold">
                {editor.experience} years
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-secondary p-6">
              <h2 className="font-label text-xs tracking-[0.3em] text-muted-foreground">
                CONTACT INFORMATION
              </h2>
              <p className="mt-3 text-muted-foreground">
                Phone: {editor.phone_number}
              </p>
              <p className="mt-2 text-muted-foreground">
                Email: {editor.user?.email || "No Email"}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-secondary p-6 md:col-span-2">
              <h2 className="font-label text-xs tracking-[0.3em] text-muted-foreground">
                LOCATION
              </h2>
              <div className="mt-3 flex flex-wrap justify-between gap-2 text-muted-foreground">
                <p>Country: {editor.country}</p>
                <p>State: {editor.state}</p>
                <p>City: {editor.city}</p>
              </div>
            </div>
          </div>
          <div className="mt-10 flex justify-center">
            <button
              onClick={handleInviteClick}
              className="flex items-center justify-center rounded-full bg-primary px-8 py-3 font-bold text-white transition-transform hover:scale-[1.03] disabled:opacity-70"
              disabled={loading || isInvitationSent}
            >
              {loading ? (
                <svg
                  className="mr-2 h-5 w-5 animate-spin text-white"
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
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : null}
              {loading
                ? "Sending Invitation..."
                : isInvitationSent
                ? statusCode
                  ? "Already invited!"
                  : "Invitation sent!"
                : "Invite Editor"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorDetail;
