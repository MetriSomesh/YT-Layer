"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FaThumbsUp, FaThumbsDown, FaShare, FaDownload } from "react-icons/fa";

interface VideoDelivery {
  publicId: string;
  format: string;
  secure_url: string;
  playbackUrl: string;
  duration: number;
  title: string;
  description: string;
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

const VideoPlayerPage = ({ params }: { params: { publicId: string } }) => {
  const [videoDelivery, setVideoDelivery] = useState<VideoDelivery | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!params.publicId) return;
      setIsLoading(true);
      try {
        const data = await fetchVideoDelivery(params.publicId);
        setVideoDelivery(data);
      } catch (error) {
        console.error("Error fetching video delivery:", error);
        setError("Failed to load video. Please try again later.");
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
              {/* <div className="flex space-x-4">
                <button className="flex items-center space-x-1 hover:text-blue-500">
                  <FaThumbsUp /> <span>Like</span>
                </button>
                <button className="flex items-center space-x-1 hover:text-blue-500">
                  <FaThumbsDown /> <span>Dislike</span>
                </button>
                <button className="flex items-center space-x-1 hover:text-blue-500">
                  <FaShare /> <span>Share</span>
                </button>
                <button className="flex items-center space-x-1 hover:text-blue-500">
                  <FaDownload /> <span>Download</span>
                </button>
              </div> */}
            </div>
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <p className="text-sm mb-2">{videoDelivery.description}</p>
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
