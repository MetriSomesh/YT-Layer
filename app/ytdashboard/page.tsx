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

          const getYoutuberId = await axios.post("/api/getYoutuberId", { id });
          if (getYoutuberId.status === 200) {
            setYoutuberId(getYoutuberId.data.youtuber);
            localStorage.setItem("youtuberId", getYoutuberId.data.youtuber);

            const pubId = await axios.post("/api/getPublicId", {
              youtuberId: getYoutuberId.data.youtuber,
            });
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
        const editorInfo = await axios.post("/api/isEditorAssigned", {
          id: youtuberId,
        });
        if (editorInfo.data.editor) {
          setEditorInfo(editorInfo.data.editor);
          console.log(editorInfo.data.editor);
        }
      } catch (error) {
        console.error("Error fetching editor info:", error);
      } finally {
        setLoading(false);
      }
    };

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
    <div className="min-h-screen bg-background text-foreground">
      <DashAppbar />
      <main className="mx-auto max-w-6xl px-6 pb-20 pt-14">
        <p className="font-label text-xs tracking-[0.3em] text-muted-foreground">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-primary align-middle" />
          CREATOR DASHBOARD
        </p>
        <h1 className="font-display mt-4 text-4xl font-bold tracking-tight md:text-5xl">
          Your <span className="text-primary">dashboard</span>.
        </h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
          Your editor, your latest cut, and your channel, all in one place.
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

        <div className="mt-10">
          {!loading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {editorInfo?.youtuberId === youtuberId ? (
                <VideoCard />
              ) : (
                <EditorCard />
              )}
              <ChannelCard />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <p className="font-label mt-6 text-xs tracking-[0.3em] text-muted-foreground">
                LOADING YOUR WORKSPACE
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
