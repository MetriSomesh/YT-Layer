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
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (!videoDelivery) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">No video data available.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="aspect-w-16 aspect-h-9 mb-4">
          <video
            src={videoDelivery.secure_url}
            controls
            className="rounded-lg w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/3">
            <h1 className="text-2xl font-bold mb-2">{videoDelivery.title}</h1>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-400">
                {Math.floor(videoDelivery.duration / 60)}:
                {(videoDelivery.duration % 60).toString().padStart(2, "0")} |{" "}
                {videoDelivery.format.toUpperCase()}
              </div>
              {isYoutuber && (
                <div className="flex space-x-4">
                  <Button
                    className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleUploadToYoutube}
                    disabled={uploadLoading || discardLoading}
                  >
                    {uploadLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    ) : (
                      <FaYoutube className="mr-2" />
                    )}
                    <span>Upload to YouTube</span>
                  </Button>

                  <Button
                    className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleDiscardVideo}
                    disabled={uploadLoading || discardLoading}
                  >
                    {discardLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    ) : (
                      <FaTrash className="mr-2" />
                    )}
                    <span>Discard Video</span>
                  </Button>
                </div>
              )}
            </div>
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <p className="text-sm mb-2">{videoDelivery.descrption}</p>
              <div className="flex flex-wrap gap-2">
                {videoDelivery.tags.split(",").map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-700 text-xs px-2 py-1 rounded-full"
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
