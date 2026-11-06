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
    <div className="min-h-screen bg-background p-8 text-foreground">
      <div className="mx-auto max-w-3xl">
        <p className="font-label text-xs tracking-[0.3em] text-muted-foreground">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-primary align-middle" />
          EDITOR WORKSPACE
        </p>
        <h1 className="font-display mt-4 text-4xl font-bold tracking-tight md:text-5xl">
          Upload <span className="text-primary">video</span>.
        </h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
          Send the finished cut and thumbnail. Your YouTuber reviews it before
          it goes to YouTube.
        </p>

        <div className="relative mt-8 overflow-hidden rounded-xl border border-border bg-card">
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
            <span>{videoFile ? videoFile.name : "NO FILE SELECTED"}</span>
            <span>VIDEO.MP4</span>
          </div>
        </div>

        {error && (
          <div className="mt-8 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="mx-auto mt-8 space-y-6">
          <div className="mx-auto space-y-6">
            {/* Video Upload */}
            <div className="rounded-2xl border-2 border-dashed border-border bg-card p-8 text-center transition-colors hover:border-primary">
              <svg
                className="mx-auto h-12 w-12 text-muted-foreground"
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
              <p className="mt-2 font-medium">Drag and drop video files to upload</p>
              <p className="mt-1 text-sm text-muted-foreground">
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
                className="mt-4 rounded-full bg-primary font-bold text-white hover:bg-primary"
                onClick={() => document.getElementById("video-upload")?.click()}
              >
                Select Files
              </Button>
              {videoFile && (
                <p className="font-label mt-4 text-xs tracking-widest text-muted-foreground">
                  {videoFile.name}
                </p>
              )}
            </div>
            {/* Thumbnail Upload */}
            <div className="space-y-2">
              <Label htmlFor="thumbnail" className="font-label text-xs tracking-widest text-muted-foreground">
                THUMBNAIL
              </Label>
              <div className="rounded-2xl border-2 border-dashed border-border bg-card p-4">
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
                  className="rounded-full bg-secondary font-bold text-foreground hover:bg-muted"
                  onClick={() => document.getElementById("thumbnail")?.click()}
                >
                  Upload Thumbnail
                </Button>
                {thumbnail && (
                  <p className="font-label mt-2 text-xs tracking-widest text-primary">
                    THUMBNAIL UPLOADED
                  </p>
                )}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="font-label text-xs tracking-widest text-muted-foreground">
                TITLE
              </Label>
              <Input
                id="title"
                placeholder="Enter video title"
                className="border-border bg-input text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="font-label text-xs tracking-widest text-muted-foreground">
                DESCRIPTION
              </Label>
              <Textarea
                id="description"
                placeholder="Enter video description"
                className="min-h-[100px] border-border bg-input text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags" className="font-label text-xs tracking-widest text-muted-foreground">
                TAGS
              </Label>
              <Input
                id="tags"
                placeholder="Add tags (comma separated)"
                className="border-border bg-input text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                onChange={(e) => setTags(e.target.value)}
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full rounded-full bg-primary py-3 font-bold text-white hover:bg-primary"
              disabled={buttonLoading}
            >
              {buttonLoading ? "Uploading..." : "Upload Video"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VideoUploadPage;
