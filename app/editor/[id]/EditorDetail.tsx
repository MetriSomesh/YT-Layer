"use client";
import React from "react";
import { useRecoilState } from "recoil";
import { userIdState } from "@/states/userState";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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

  const handleInviteClick = async () => {
    setLoading(true);
    try {
      const uId = parseInt(userId);
      const res = await axios.post("http://localhost:3000/api/getYoutuberId", {
        id: uId,
      });
      const youtuberId = parseInt(res.data.youtuber);

      const channelInfo = await axios.post(
        "http://localhost:3000/api/getChannelInfo",
        {
          id: youtuberId,
        }
      );
      if (channelInfo) {
        const newInvitation = await axios.post(
          "http://localhost:3000/api/sendinvitation",
          {
            youtuberId: youtuberId,
            editorId: editor.id,
            message: `${channelInfo.data.channelInfo.title} has invited you! `,
            status: "pending",
          }
        );

        if (newInvitation.status === 200) {
          const channelConnect = await axios.post(
            "http://localhost:3000/api/connectChannel",
            {
              id: youtuberId,
            }
          );

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
    <div className="mx-auto p-6 min-h-screen bg-gray-900 text-gray-100">
      <div className="bg-gray-800 shadow-md rounded-lg p-8">
        <Link href="/addeditor" className="text-blue-400 hover:text-blue-500">
          Back to Search
        </Link>
        <div className="text-center mt-6">
          {userId}
          <Image
            src={editor.profile_pic}
            alt={editor.user?.username || "Editor Profile Picture"}
            width={150}
            height={150}
            className="rounded-full mx-auto border-4 border-blue-500"
          />
          <h1 className="text-4xl font-bold mt-4 text-blue-400">
            {editor.user?.username || "No Username"}
          </h1>
          <p className="text-gray-300 mt-2">{editor.description}</p>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-blue-400">Experience</h2>
            <p className="text-gray-300 mt-2">{editor.experience}</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-blue-400">
              Contact Information
            </h2>
            <p className="text-gray-300 mt-2">Phone: {editor.phone_number}</p>
            <p className="text-gray-300">
              Email: {editor.user?.email || "No Email"}
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-blue-400">Location</h2>
            <p className="text-gray-300 mt-2">Country: {editor.country}</p>
            <p className="text-gray-300">State: {editor.state}</p>
            <p className="text-gray-300">City: {editor.city}</p>
          </div>
        </div>
        <div className="mt-10 flex justify-center">
          <button
            onClick={handleInviteClick}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
            disabled={loading || isInvitationSent}
          >
            {loading ? (
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
                  d="M4 12a8 8 0 018-8v4l3.29-3.29A7.97 7.97 0 0116 12H4z"
                ></path>
              </svg>
            ) : isInvitationSent ? (
              statusCode ? (
                "Already invited!"
              ) : (
                "Invitation sent!"
              )
            ) : (
              "Invite"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorDetail;
