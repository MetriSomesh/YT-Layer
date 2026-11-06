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
  const [loading, setLoading] = useState(true);
  let edi: any;

  const checkNewInvitation = async () => {
    const res = await axios.post("/api/checkinvitation", {
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
          edi = getEditorId.data.editor;
          fetchYoutuberId(edi);
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


  const fetchYoutuberId = async (editorId: any) => {
    try {
      const ytId = await axios.post("/api/getytid", {
        id: editorId,
      });

      if (ytId.status === 200 && ytId.data.youtuber) {
        console.log(ytId.data.youtuber);
        setYtId(ytId.data.youtuber);
      }
    } catch (error) {
      console.error("Error fetching YouTuber ID:", error);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-screen bg-background text-foreground">
      {loading ? (
        <motion.div
          className="flex h-screen flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="font-label text-2xl font-bold tracking-[0.3em]"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            YT<span className="text-primary">/</span>LAYER
          </motion.div>
          <motion.div
            className="mt-8 h-12 w-12 animate-spin rounded-full border-2 border-primary border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
          <motion.div
            className="font-label mt-6 text-xs tracking-[0.3em] text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            LOADING YOUR WORKSPACE
          </motion.div>
        </motion.div>
      ) : (
        <>
          <EDashAppbar />
          <main className="mx-auto max-w-6xl px-6 pb-20 pt-14">
            <p className="font-label text-xs tracking-[0.3em] text-muted-foreground">
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-primary align-middle" />
              EDITOR DASHBOARD
            </p>
            <h1 className="font-display mt-4 text-4xl font-bold tracking-tight md:text-5xl">
              Your <span className="text-primary">cutting room</span>.
            </h1>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
              Upload the finished cut, and it goes to your YouTuber for review.
            </p>

            <div className="relative mt-10 overflow-hidden rounded-xl border border-border bg-card">
              <div className="timeline-ruler flex h-8 items-end border-b border-border px-4 pb-2 font-label text-[10px] tracking-widest text-muted-foreground">
                <span>00:00</span>
                <span className="ml-auto">00:30</span>
                <span className="ml-auto">01:00</span>
              </div>
              <div className="flex h-10">
                <div className="w-[18%] bg-zinc-800" />
                <div className="w-[26%] bg-zinc-700" />
                <div className="w-[12%] bg-primary" />
                <div className="w-[30%] bg-zinc-800" />
                <div className="w-[14%] bg-zinc-700" />
              </div>
              <div className="flex items-center justify-between border-t border-border px-4 py-2 font-label text-[10px] tracking-widest text-muted-foreground">
                <span>WORKSPACE</span>
                <span>YT/LAYER</span>
              </div>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <UploadVideoCard />
            </div>
          </main>
        </>
      )}
    </div>
  );
}
