"use client";
import { ChannelCard } from "@/components/ChannelCard";
import { DashAppbar } from "@/components/DashAppbar";
import { EditorCard } from "@/components/EditorCard";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { newYtNotificationState } from "../state/newYtNotificationState";
import axios from "axios";
import { youtuberIdState } from "../state/youtuberIdState";
import { getSession } from "next-auth/react";
import { userIdState } from "../state/userState";
import { ytnotificationState } from "../state/ytnotificationState";
import { VideoCard } from "@/components/VideoCard";
import { assignedEditorInfoState } from "../state/assignedEditorInfoState";
import { videoPublicIdState } from "../state/videoPublicIdState";
import { motion } from "framer-motion";

export default function DashBoard() {
  const [newYtNotification, setNewYtNotification] = useRecoilState(
    newYtNotificationState
  );
  const [youtuberId, setYoutuberId] = useRecoilState(youtuberIdState);
  const [userId, setUserId] = useRecoilState(userIdState);
  const [ytNotification, setYtNotification] =
    useRecoilState(ytnotificationState);
  const [editorInfo, setEditorInfo] = useRecoilState(assignedEditorInfoState);
  const [publicId, setPublicId] = useRecoilState(videoPublicIdState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const session = await getSession();
        if (session && session.user && session.user.id) {
          setUserId(session.user.id);
          const id = parseInt(session.user.id || "");

          const getYoutuberId = await axios.post(
            "http://localhost:3000/api/getYoutuberId",
            { id }
          );
          if (getYoutuberId.status === 200) {
            setYoutuberId(getYoutuberId.data.youtuber);

            const pubId = await axios.post(
              "http://localhost:3000/api/getPublicId",
              { youtuberId: getYoutuberId.data.youtuber }
            );
            if (pubId.status === 200) {
              setPublicId(pubId.data.publicId);
            }
          }
        }
      
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchEditor = async () => {
      try {
        const editorInfo = await axios.post(
          "http://localhost:3000/api/isEditorAssigned",
          { id: youtuberId }
        );
        if (editorInfo.data.editor) {
          setEditorInfo(editorInfo.data.editor);
          console.log(editorInfo.data.editor);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error fetching editor info:", error);
      }
    };

    if (youtuberId) {
      fetchEditor();
    }
  }, [youtuberId]);

  const checkNewNotification = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/checkytnotification",
        { youtuberId }
      );
      if (res.status === 200) {
        setNewYtNotification(true);
        setYtNotification(res.data.notification);
        console.log(res.data.notification);
      }
    } catch (error) {
      console.error("Error checking new notification:", error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (userId !== null) {
        await checkNewNotification();
        console.log(userId);
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, [userId, youtuberId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <DashAppbar />
      <div className="h-52"></div>
      <div className="w-full mt-5 flex h-56 gap-96 justify-evenly">
        <div className="w-full mt-5 flex h-56 gap-96 justify-evenly">
          {!loading ? (
            <>
              {editorInfo?.youtuberId === youtuberId ? (
                <VideoCard />
              ) : (
                <EditorCard />
              )}
              <ChannelCard />
            </>
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <div className="relative w-24 h-24">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-500 rounded-full animate-ping"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-300 rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-200 text-xl font-semibold">
                  Loading
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
