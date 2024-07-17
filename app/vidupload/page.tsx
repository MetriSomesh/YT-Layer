"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useRecoilState } from "recoil";
import { ytIdState } from "../state/ytIdState";
import { videoPublicIdState } from "../state/videoPublicIdState";
import { editorIdState } from "../state/editorIdState";
import { useRouter } from "next/navigation";

const VideoUploadPage: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [uploadThumbnail, setUploadThumbnail] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [publicId, setPublicId] = useRecoilState(videoPublicIdState);
  const [ytId, setYtId] = useRecoilState(ytIdState);
  const [editorId, setEditorId] = useRecoilState(editorIdState);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleThumbnailChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      console.log("YOUTBOER ", ytId);
      const file = e.target.files[0];
      setUploadThumbnail(file);

      try {
        const formData = new FormData();
        formData.append("image", file);
        const res = await fetch("api/picupload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        setThumbnail(data.imageUrl.toString());
      } catch (error) {
        console.error("Error uploading image:", error);
        setError("Failed to upload thumbnail. Please try again.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!videoFile || !title || !description || !thumbnail || !tags) {
      setError("Please fill out all required fields.");
      return;
    }

    setButtonLoading(true);

    const reader = new FileReader();
    reader.readAsDataURL(videoFile);
    reader.onloadend = async () => {
      const base64data = reader.result;

      try {
        const response = await axios.post(
          "/api/vidupload",
          {
            fileStr: base64data,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response.status === 200) {
          await setPublicId(response.data.data.public_id);
          console.log("SUCURE URL IS  : ", response.data.data.secure_url);
          const videoData = {
            publicId: response.data.data.public_id,
            format: response.data.data.format,
            playbackUrl: response.data.data.playback_url,
            secureUrl: response.data.data.secure_url,
            duration: response.data.data.duration,
            title: title,
            description: description,
            tags: tags,
            thumbnailUrl: thumbnail,
            youtuberId: ytId,
            editorId: editorId,
          };
          const newVideo = await axios.post(
            "/api/createvideorecord",
            videoData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (newVideo.status === 201) {
            router.push(
              `/video/${response.data.data.public_id}?isYoutuber=false`
            );
            // const pubId = response.data.data.public_id;
            // const res = await axios.post("/api/getvideodelivery", {
            //   publicId: pubId,
            // });
          }
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to upload video. Please try again.");
      } finally {
        setButtonLoading(false);
      }
    };
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Upload Video</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Video Upload */}
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="mt-2">Drag and drop video files to upload</p>
            <p className="text-sm text-gray-400 mt-1">
              Or click to select files
            </p>
            <Input
              type="file"
              accept="video/*"
              className="hidden"
              id="video-upload"
              onChange={handleFileChange}
              required
            />
            <Button
              type="button"
              className="mt-4"
              onClick={() => document.getElementById("video-upload")?.click()}
            >
              Select Files
            </Button>
            {videoFile && <p className="mt-2">{videoFile.name}</p>}
          </div>
          {/* Thumbnail Upload */}
          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail</Label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                id="thumbnail"
                onChange={handleThumbnailChange}
                required
              />
              <Button
                type="button"
                onClick={() => document.getElementById("thumbnail")?.click()}
              >
                Upload Thumbnail
              </Button>
              {thumbnail && <p className="mt-2">Thumbnail uploaded</p>}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter video title"
              className="bg-gray-800 border-gray-700"
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter video description"
              className="bg-gray-800 border-gray-700 min-h-[100px]"
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              placeholder="Add tags (comma separated)"
              className="bg-gray-800 border-gray-700"
              onChange={(e) => setTags(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={buttonLoading}>
            {buttonLoading ? "Uploading..." : "Upload Video"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VideoUploadPage;
