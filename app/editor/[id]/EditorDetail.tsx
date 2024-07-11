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
  const [youtuberId,setYoutuberId] = useRecoilState(youtuberIdState);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-gray-800 shadow-2xl rounded-lg overflow-hidden">
        <div className="relative h-40 bg-blue-600">
          <Link
            href="/addeditor"
            className="absolute top-4 left-4 text-white hover:text-gray-200 transition-colors duration-300 flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
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
          </Link>
        </div>
        <div className="relative px-6 py-10 sm:px-10">
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
            <Image
              src={editor.profile_pic}
              alt={editor.user?.username || "Editor Profile Picture"}
              width={150}
              height={150}
              className="rounded-full border-4 border-blue-500 shadow-lg"
            />
          </div>
          <div className="text-center mt-16">
            <h1 className="text-4xl font-bold text-blue-400">
              {editor.user?.username || "No Username"}
            </h1>
            <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
              {editor.description}
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-700 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-blue-400 mb-4">
                Experience
              </h2>
              <p className="text-gray-300">{editor.experience} years</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-blue-400 mb-4">
                Contact Information
              </h2>
              <p className="text-gray-300">Phone: {editor.phone_number}</p>
              <p className="text-gray-300 mt-2">
                Email: {editor.user?.email || "No Email"}
              </p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg shadow-md md:col-span-2">
              <h2 className="text-2xl font-bold text-blue-400 mb-4">
                Location
              </h2>
              <div className="flex justify-between">
                <p className="text-gray-300">Country: {editor.country}</p>
                <p className="text-gray-300">State: {editor.state}</p>
                <p className="text-gray-300">City: {editor.city}</p>
              </div>
            </div>
          </div>
          <div className="mt-10 flex justify-center">
            <button
              onClick={handleInviteClick}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 flex items-center justify-center shadow-lg"
              disabled={loading || isInvitationSent}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white mr-2"
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
