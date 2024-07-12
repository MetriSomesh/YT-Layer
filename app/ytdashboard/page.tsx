"use client";
import { useEffect, useState, useCallback } from "react";
import { useRecoilState } from "recoil";
import axios from "axios";
import { getSession } from "next-auth/react";
import { DashAppbar } from "@/components/DashAppbar";
import { VideoCard } from "@/components/VideoCard";
import { ChannelCard } from "@/components/ChannelCard";
import { EditorCard } from "@/components/EditorCard";
import { newYtNotificationState } from "../state/newYtNotificationState";
import { ytnotificationState } from "../state/ytnotificationState";
import { assignedEditorInfoState } from "../state/assignedEditorInfoState";
import { videoPublicIdState } from "../state/videoPublicIdState";
import { userIdState } from "../state/userState";
import { youtuberIdState } from "../state/youtuberIdState";

const LOADING_TIMEOUT = 20000;
const NOTIFICATION_INTERVAL = 30000;

export default function DashBoard() {
  const [newYtNotification, setNewYtNotification] = useRecoilState(
    newYtNotificationState
  );
  const [ytNotification, setYtNotification] =
    useRecoilState(ytnotificationState);
  const [editorInfo, setEditorInfo] = useRecoilState(assignedEditorInfoState);
  const [publicId, setPublicId] = useRecoilState(videoPublicIdState);
  const [userId, setUserId] = useRecoilState(userIdState);
  const [youtuberId, setYoutuberId] = useRecoilState(youtuberIdState);
  const [loading, setLoading] = useState(true);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  const fetchYoutuberData = useCallback(
    async (id: number) => {
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
    },
    [setYoutuberId, setPublicId]
  );

  const fetchEditorInfo = useCallback(async () => {
    try {
      const editorInfo = await axios.post("/api/isEditorAssigned", {
        id: youtuberId,
      });
      if (editorInfo.data.editor) {
        setEditorInfo(editorInfo.data.editor);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching editor info:", error);
      setLoading(false);
    }
  }, [youtuberId, setEditorInfo]);

  const checkNewNotification = useCallback(async () => {
    try {
      const res = await axios.post("/api/checkytnotification", { youtuberId });
      if (res.status === 200) {
        setNewYtNotification(true);
        setYtNotification(res.data.notification);
      }
    } catch (error) {
      console.error("Error checking new notification:", error);
    }
  }, [youtuberId, setNewYtNotification, setYtNotification]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const session = await getSession();
        if (session?.user?.id) {
          setUserId(session.user.id);
          await fetchYoutuberData(parseInt(session.user.id));
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, [fetchYoutuberData, setUserId]);

  useEffect(() => {
    if (youtuberId) {
      fetchEditorInfo();
    }
  }, [youtuberId, fetchEditorInfo]);

  useEffect(() => {
    const timeoutId = setTimeout(
      () => setLoadingTimeout(true),
      LOADING_TIMEOUT
    );
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (userId) {
      const intervalId = setInterval(
        checkNewNotification,
        NOTIFICATION_INTERVAL
      );
      return () => clearInterval(intervalId);
    }
  }, [userId, checkNewNotification]);

  const renderContent = () => {
    if (loading) {
      return <LoadingComponent timeout={loadingTimeout} />;
    }
    return (
      <>
        {editorInfo?.youtuberId === youtuberId ? <VideoCard /> : <EditorCard />}
        <ChannelCard />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <DashAppbar />
      <div className="h-52" />
      <div className="w-full mt-5 flex h-56 gap-96 justify-evenly">
        <div className="w-full mt-5 flex h-56 gap-96 justify-evenly">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

const LoadingComponent = ({ timeout }: { timeout: boolean }) => (
  <div className="flex items-center justify-center w-full h-full">
    {!timeout ? (
      <div className="relative w-24 h-24">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-500 rounded-full animate-ping" />
        <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-300 rounded-full animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-200 text-xl font-semibold">
          Loading
        </div>
      </div>
    ) : (
      <div className="text-center">
        <p className="text-red-500 text-xl font-semibold mb-4">
          Something went wrong.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    )}
  </div>
);
