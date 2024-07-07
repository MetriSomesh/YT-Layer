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

export default function DashBoard() {
  const [newYtNotification, setNewYtNotification] = useRecoilState(
    newYtNotificationState
  );
  const [youtuberId, setYoutuberId] = useRecoilState(youtuberIdState);
  const [userId, setUserId] = useRecoilState(userIdState);
  const [ytNotification, setYtNotification] =
    useRecoilState(ytnotificationState);
  const [editorInfo, setEditorInfo] = useRecoilState(assignedEditorInfoState);
  useEffect(() => {
    const fetchUserId = async () => {
      const session = await getSession();
      if (session && session.user && session.user.id) {
        setUserId(session.user.id);
        const id = parseInt(session.user.id || "");
        const getYoutuberId = await axios.post(
          "http://localhost:3000/api/getYoutuberId",
          {
            id: id,
          }
        );
        if (getYoutuberId.status === 200) {
          setYoutuberId(getYoutuberId.data.youtuber);
        }
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchEditor = async () => {
      const editorInfo = await axios.post(
        "http://localhost:3000/api/isEditorAssigned",
        {
          id: youtuberId,
        }
      );

      if (editorInfo.data.editor) {
        setEditorInfo(editorInfo.data.editor);
        console.log(editorInfo.data.editor);
      }
    };

    fetchEditor();
  }, [youtuberId]);

  const checkNewNotification = async () => {
    const res = await axios.post(
      "http://localhost:3000/api/checkytnotification",
      {
        youtuberId: youtuberId,
      }
    );
    if (res.status === 200) {
      setNewYtNotification(true);
      setYtNotification(res.data.notification);
      console.log(res.data.notification);
    }
  };

  useEffect(() => {
    setInterval(async () => {
      if (userId !== null) {
        checkNewNotification();
        console.log(userId);
      }
    }, 30000);
    //10000f
  }, [youtuberId]);

  return (
    <div className="h-screen bg-slate-200">
      <DashAppbar />
      <div className="h-52"></div>
      <div className="w-full  mt-5 flex h-56 gap-96 justify-evenly">
        {editorInfo?.youtuberId === youtuberId ? <VideoCard /> : <EditorCard />}

        <ChannelCard />
      </div>
    </div>
  );
}
