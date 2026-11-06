"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FaYoutube, FaTrash } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

interface VideoDelivery {
  publicId: string;
  format: string;
  secure_url: string;
  playbackUrl: string;
  duration: number;
  title: string;
  descrption: string;
  tags: string;
  thumbnail: string;
}
const fetchVideoDelivery = async (publicId: string): Promise<VideoDelivery> => {
  try {
    const response = await axios.post("/api/getvideodelivery", { publicId });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch video delivery:", error);
    throw error;
  }
};

const VideoPlayerPage = ({
  params,
  searchParams,
}: {
  params: { publicId: string };
  searchParams: { isYoutuber: string };
}) => {
  const [videoDelivery, setVideoDelivery] = useState<VideoDelivery | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const youtuerId = localStorage.getItem("youtuberId");
  const [error, setError] = useState<string | null>(null);
  const isYoutuber = searchParams.isYoutuber === "true";
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [uploadLoading, setUploadLoading] = useState(false);
  const [discardLoading, setDiscardLoading] = useState(false);

  const handleUploadToYoutube = async () => {
    if (!videoDelivery) return;

    try {
      setUploadLoading(true);
      const response = await axios.post("/api/viduploadtoyt", {
        youtuberId: parseInt(youtuerId || ""),
        videoDetails: {
          title: videoDelivery.title,
          description: videoDelivery.descrption,
          tags: videoDelivery.tags.split(",").map((tag) => tag.trim()),
          // categoryId: "22", // You might want to add this to your VideoDelivery interface
          //  privacyStatus: "private", // Or get this from user input
        },
        videoUrl: videoDelivery.secure_url,
      });

      if (response.data.success) {
        try {
          const deleteVideo = await axios.post("/api/viddelete", {
            publicId: videoDelivery?.publicId,
          });
          if (deleteVideo.data.success) {
            setUploadLoading(false);
            console.log(
              "Video uploaded successfully. Video ID:",
              response.data.videoId
            );
            toast({
              title: "Success!",
              description: "Video uploaded successfully to YouTube.",
              duration: 5000,
              variant: "default",
            });

            router.push("/ytdashboard");
          } else {
            const deleteVideo = await axios.post("/api/viddelete", {
              publicId: videoDelivery?.publicId,
            });
            setUploadLoading(false);
            console.log(
              "Video uploaded successfully. Video ID:",
              response.data.videoId
            );
            toast({
              title: "Success!",
              description: "Video uploaded successfully to YouTube.",
              duration: 5000,
              variant: "default",
            });

            router.push("/ytdashboard");
          }
        } catch (error) {
          setUploadLoading(false);
          console.error(error);
        }
      } else {
        setUploadLoading(false);
        toast({
          title: "Error",
          description: "Something went wrong please try again.",
          duration: 5000,
          variant: "destructive",
        });

        throw new Error(response.data.error || "Failed to upload video");
      }
    } catch (error) {
      setUploadLoading(false);
      toast({
        title: "Error",
        description: "Something went wrong please try again.",
        duration: 5000,
        variant: "destructive",
      });
      console.error("Error uploading video:", error);
    }
  };
  const handleDiscardVideo = async () => {
    setDiscardLoading(true);
    try {
      const deleteVideo = await axios.post("/api/viddelete", {
        publicId: videoDelivery?.publicId,
      });
      setDiscardLoading(false);
      console.log(deleteVideo.data.msg);
      router.push("/ytdashboard");
    } catch (error) {
      setDiscardLoading(false);
      toast({
        title: "Error",
        description: "Something went wrong please try again.",
        duration: 5000,
        variant: "destructive",
      });
      console.error("Erro occured: ", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!params.publicId) return;
      setIsLoading(true);
      try {
        const data = await fetchVideoDelivery(params.publicId);
        setVideoDelivery(data);
      } catch (error) {
        console.error("Error fetching video delivery:", error);
        setError("There are no video available");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [params.publicId]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <p className="font-label mt-6 text-xs tracking-[0.3em] text-muted-foreground">
          LOADING VIDEO
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="text-xl text-destructive">{error}</div>
      </div>
    );
  }

  if (!videoDelivery) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="text-xl text-muted-foreground">No video data available.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 text-foreground lg:p-8">
      <div className="mx-auto max-w-6xl">
        <p className="font-label mb-6 text-xs tracking-[0.3em] text-muted-foreground">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-primary align-middle" />
          REVIEW ROOM
        </p>
        <div className="mb-6 overflow-hidden rounded-2xl border border-border bg-card">
          <video
            src={videoDelivery.secure_url}
            controls
            className="aspect-video w-full object-cover"
          />
          <div className="timeline-ruler flex h-8 items-end border-t border-border px-4 pb-2 font-label text-[10px] tracking-widest text-muted-foreground">
            <span>00:00</span>
            <span className="ml-auto">
              {Math.floor(videoDelivery.duration / 60)}:
              {(videoDelivery.duration % 60).toString().padStart(2, "0")}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="w-full lg:w-2/3">
            <h1 className="font-display text-3xl font-bold tracking-tight">
              {videoDelivery.title}
            </h1>
            <div className="mb-4 mt-3 flex flex-wrap items-center justify-between gap-4">
              <div className="font-label text-xs tracking-widest text-muted-foreground">
                {Math.floor(videoDelivery.duration / 60)}:
                {(videoDelivery.duration % 60).toString().padStart(2, "0")} |{" "}
                {videoDelivery.format.toUpperCase()}
              </div>
              {isYoutuber && (
                <div className="flex flex-wrap gap-3">
                  <Button
                    className="flex items-center space-x-2 rounded-full bg-primary px-5 py-2 font-bold text-white hover:bg-primary"
                    onClick={handleUploadToYoutube}
                    disabled={uploadLoading || discardLoading}
                  >
                    {uploadLoading ? (
                      <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    ) : (
                      <FaYoutube className="mr-2" />
                    )}
                    <span>Upload to YouTube</span>
                  </Button>

                  <Button
                    className="flex items-center space-x-2 rounded-full border border-border bg-transparent px-5 py-2 font-bold text-foreground hover:border-foreground hover:bg-secondary"
                    onClick={handleDiscardVideo}
                    disabled={uploadLoading || discardLoading}
                  >
                    {discardLoading ? (
                      <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-foreground border-t-transparent"></div>
                    ) : (
                      <FaTrash className="mr-2" />
                    )}
                    <span>Discard Video</span>
                  </Button>
                </div>
              )}
            </div>
            <div className="mb-4 rounded-2xl border border-border bg-card p-5">
              <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                {videoDelivery.descrption}
              </p>
              <div className="flex flex-wrap gap-2">
                {videoDelivery.tags.split(",").map((tag, index) => (
                  <span
                    key={index}
                    className="font-label rounded-full border border-border bg-secondary px-3 py-1 text-[11px] tracking-widest text-foreground"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/3"></div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerPage;
