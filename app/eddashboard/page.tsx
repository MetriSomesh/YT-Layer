"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { userIdState } from "../state/userState";
import { getSession } from "next-auth/react";
import { EDashAppbar } from "@/components/EDDashAppBar";
import { notificationState } from "../state/notificationState";
import { newnotificationState } from "../state/newnotificationState";
import { editorIdState } from "../state/editorIdState";
import { UploadVideoCard } from "@/components/UploadVideoCard";
import { ytIdState } from "../state/ytIdState";
import { videoPublicIdState } from "../state/videoPublicIdState";
import { motion } from "framer-motion";

export default function DashBoard() {
  const [hasNewNotifications, setHasNewNotifications] =
    useRecoilState(newnotificationState);
  const [userId, setUserId] = useRecoilState(userIdState);
  const [editorId, setEditorId] = useRecoilState(editorIdState);
  const [ytId, setYtId] = useRecoilState(ytIdState);
  const [publicId, setPublicId] = useRecoilState(videoPublicIdState);
  const [loading, setLoading] = useState(false);

  const checkNewInvitation = async () => {
    const res = await axios.post("http://localhost:3000/api/checkinvitation", {
      editorId: editorId,
    });
    if (res.status === 200) {
      setHasNewNotifications(true);
    }
  };
  useEffect(() => {
    setLoading(true);
    const fetchUserId = async () => {
      const session = await getSession();
      if (session && session.user && session.user.id) {
        setUserId(session.user.id);
        const id = parseInt(session.user.id || "");
        const getEditorId = await axios.post("/api/getEditorId", {
          id: id,
        });
        if (getEditorId.status === 200) {
          setEditorId(getEditorId.data.editor);
          const pubId = await axios.post("/api/getPublicId", {
            editorId: getEditorId.data.editor,
          });
          if (pubId.status === 200) {
            setPublicId(pubId.data.publicId);
          }
        }
      }
    };

    fetchUserId();
  }, []);
  useEffect(() => {
    const fetchYoutuberId = async () => {
      const ytId = await axios.post("/api/getytid", {
        id: editorId,
      });

      if (ytId.data.youtuber) {
        setLoading(false);
        console.log(ytId.data.youtuber);
        setYtId(ytId.data.youtuber);
      }
    };
    fetchYoutuberId();
    setLoading(false);
  }, [editorId]);

  useEffect(() => {
    setInterval(async () => {
      if (userId !== null) {
        checkNewInvitation();
        console.log(userId);
      }
    }, 30000);
    //10000f
  }, [editorId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {loading ? (
        <motion.div
          className="flex flex-col items-center justify-center h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="text-4xl font-bold text-purple-500 mb-8"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            YT-Layer
          </motion.div>
          <motion.div
            className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
          <motion.div
            className="mt-4 text-xl text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Loading...
          </motion.div>
        </motion.div>
      ) : (
        <>
          <EDashAppbar />
          <div className="h-52"></div>
          <div className="w-full mt-5 flex h-56 gap-96 justify-evenly">
            <UploadVideoCard />
          </div>
        </>
      )}
    </div>
  );
}
