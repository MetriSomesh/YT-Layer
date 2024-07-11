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
      setLoading(true);
      try {
        const session = await getSession();
        if (session && session.user && session.user.id) {
          setUserId(session.user.id);
          const id = parseInt(session.user.id || "");

          const getYoutuberId = await axios.post("/api/getYoutuberId", { id });
          if (getYoutuberId.status === 200) {
            setYoutuberId(getYoutuberId.data.youtuber);

            const pubId = await axios.post("/api/getPublicId", {
              youtuberId: getYoutuberId.data.youtuber,
            });
            if (pubId.status === 200) {
              setPublicId(pubId.data.publicId);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchEditor = async () => {
      try {
        const editorInfo = await axios.post("/api/isEditorAssigned", {
          id: youtuberId,
        });
        if (editorInfo.data.editor !== null) {
          setEditorInfo(editorInfo.data.editor);
          console.log(editorInfo.data.editor);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error fetching editor info:", error);
      }
    };
    setLoading(false);
    if (youtuberId) {
      fetchEditor();
    }
  }, [youtuberId]);

  const checkNewNotification = async () => {
    try {
      const res = await axios.post("/api/checkytnotification", { youtuberId });
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
      {loading ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <motion.div
            className="text-4xl font-bold text-purple-500 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            YT-Layer
          </motion.div>
          <motion.div
            className="w-16 h-16 border-t-4 border-purple-500 border-solid rounded-full animate-spin"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          ></motion.div>
          <motion.div
            className="mt-4 text-xl text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Please wait...
          </motion.div>
        </div>
      ) : (
        <>
          <DashAppbar />
          <div className="h-52"></div>
          <div className="w-full mt-5 flex h-56 gap-96 justify-evenly">
            {editorInfo?.youtuberId === youtuberId ? (
              <VideoCard />
            ) : (
              <EditorCard />
            )}
            <ChannelCard />
          </div>
        </>
      )}
    </div>
  );
}
