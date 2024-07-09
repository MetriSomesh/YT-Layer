"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface VideoDelivery {
  publicId: string;
  format: string;
  secure_url: string;
  playbackUrl: string;
  duration: number;
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
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        {error}
      </div>
    );
  }

  if (!videoDelivery) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        No video data available.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Video Player</h1>
        <div className="aspect-w-16 aspect-h-9 mb-4">
          <video
            src={videoDelivery.secure_url}
            width="100%"
            height="100%"
            controls
            className="rounded-lg"
          />
        </div>
        <div className="mt-4">
          <p>Duration: {videoDelivery.duration.toFixed(2)} seconds</p>
          <p>Format: {videoDelivery.format}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerPage;
