"use client";
import { ChannelCard } from "@/components/ChannelCard";

import { EditorCard } from "@/components/EditorCard";
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

export default function DashBoard() {
  const [hasNewNotifications, setHasNewNotifications] =
    useRecoilState(newnotificationState);
  const [userId, setUserId] = useRecoilState(userIdState);
  const [editorId, setEditorId] = useRecoilState(editorIdState);
  const [ytId, setYtId] = useRecoilState(ytIdState);
  const [publicId, setPublicId] = useRecoilState(videoPublicIdState);

  const checkNewInvitation = async () => {
    const res = await axios.post("http://localhost:3000/api/checkinvitation", {
      editorId: editorId,
    });
    if (res.status === 200) {
      setHasNewNotifications(true);
    }
  };
  useEffect(() => {
    const fetchUserId = async () => {
      const session = await getSession();
      if (session && session.user && session.user.id) {
        setUserId(session.user.id);
        const id = parseInt(session.user.id || "");
        const getEditorId = await axios.post(
          "http://localhost:3000/api/getEditorId",
          {
            id: id,
          }
        );
        if (getEditorId.status === 200) {
          setEditorId(getEditorId.data.editor);
          const pubId = await axios.post(
            "http://localhost:3000/api/getPublicId",
            {
              editorId: getEditorId.data.editor,
            }
          );
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
      const ytId = await axios.post("http://localhost:3000/api/getytid", {
        id: editorId,
      });

      if (ytId.data.youtuber) {
        console.log(ytId.data.youtuber);
        setYtId(ytId.data.youtuber);
      }
    };
    fetchYoutuberId();
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
    <div className="h-screen bg-slate-200">
      <EDashAppbar />
      <div className="h-52"></div>
      <div className="w-full  mt-5 flex h-56 gap-96 justify-evenly">
        <UploadVideoCard />
      </div>
    </div>
  );
}
