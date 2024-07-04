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

export default function DashBoard() {
  const [notification, setNotification] = useRecoilState(notificationState);
  const [userId, setUserId] = useRecoilState(userIdState);

  const getNotification = async () => {
    const id = parseInt(userId || "");
    const editorId = await axios.post("http://localhost:3000/api/getEditorId", {
      id: id,
    });
    console.log("Editor found : ", editorId);
    const secondId = parseInt(editorId.data.editor);
    const res = await axios.post("http://localhost:3000/api/checkinvitation", {
      editorId: secondId,
    });
    if (res) {
      setNotification(res.data.invitation);
    }
  };
  useEffect(() => {
    const fetchUserId = async () => {
      const session = await getSession();
      if (session && session.user && session.user.id) {
        setUserId(session.user.id);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    setInterval(async () => {
      if (userId !== null) {
        getNotification();
        console.log(userId);
      }
    }, 10000);
    //10000f
  }, [userId]);

  return (
    <div className="h-screen bg-slate-200">
      <EDashAppbar />
      <div className="h-52">{userId}</div>
    </div>
  );
}
