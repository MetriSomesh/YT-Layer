"use client";

import { userEmailState } from "@/states/userState";
import { UserType } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRecoilState } from "recoil";

export default function AuthComp({ type }: { type: string }) {
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useRecoilState(userEmailState);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const userType =
    typeof localStorage !== "undefined" &&
    localStorage.getItem("userType") === "YOUTUBER"
      ? UserType.YOUTUBER
      : UserType.EDITOR;
  const router = useRouter();
  const config = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "application/json",
    },
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <div className="w-full max-w-md">
        <button
          onClick={() => router.push("/")}
          className="font-label mx-auto mb-10 block text-sm font-bold tracking-[0.3em]"
        >
          YT<span className="text-primary">/</span>LAYER
        </button>
        <div className="rounded-2xl border border-border bg-card p-8">
          <p className="font-label text-xs tracking-[0.3em] text-primary">
            {type === "signup"
              ? userType === UserType.YOUTUBER
                ? "JOINING AS YOUTUBER"
                : "JOINING AS EDITOR"
              : "WELCOME BACK"}
          </p>
          <h2 className="font-display mt-3 text-3xl font-bold tracking-tight">
            {type === "signup" ? "Create your account" : "Sign in"}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {type === "signup"
              ? "One account, and your workspace is ready: invite, upload, review, publish."
              : "Your workspace is waiting. Sign in to pick up where you left off."}
          </p>
          <form className="mt-8">
            <LabelledInput
              onChange={(e) => setUsername(e.target.value)}
              label="Username"
              placeholder="John Doe"
            />
            {type === "signup" && (
              <LabelledInput
                onChange={(e) => {
                  setEmail(e.target.value);
                  setUserEmail(e.target.value);
                }}
                label="Email"
                placeholder="johndoe@gmail.com"
              />
            )}
            <LabelledInput
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              type="password"
              placeholder="••••••••"
            />
            <button
              onClick={async () => {
                setLoading(true);
                const res = await axios.post(
                  "https://yt-layer-rho.vercel.app/api/signup",
                  {
                    username,
                    email,
                    password,
                    userType,
                  }
                );
                setUserEmail(email);
                if (res.status === 201) {
                  if (userType === UserType.YOUTUBER) {
                    localStorage.setItem("userEmail", email);
                    const res = axios.get(
                      "https://yt-layer-rho.vercel.app/api/googleauth"
                    );
                    const url = (await res).data.authUrl;
                    router.push(url);
                  } else {
                    localStorage.setItem("userEmail", email);
                    localStorage.setItem("userId", res.data.user.id);
                    router.push("/account");
                  }
                }
              }}
              type="button"
              className="relative mt-6 w-full overflow-hidden rounded-full bg-primary px-5 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02] disabled:opacity-70"
            >
              {" "}
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="absolute inset-0 flex items-center justify-center bg-primary">
                    <span className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  </span>
                  <span className="opacity-0">Sign In</span>
                </span>
              ) : type === "signup" ? (
                "Continue"
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {type === "signup"
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <a
              href={type === "signup" ? "/signin" : "/signup"}
              className="font-medium text-primary hover:underline"
            >
              {type === "signup" ? "Sign In" : "Sign Up"}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

interface LabelledInputType {
  label: string;
  placeholder: string;
  type?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => any;
}

function LabelledInput({
  label,
  placeholder,
  type,
  onChange,
}: LabelledInputType) {
  return (
    <div className="mb-4">
      <label className="font-label mb-2 block text-xs tracking-widest text-muted-foreground">
        {label.toUpperCase()}
      </label>
      <input
        type={type || "text"}
        className="w-full rounded-lg border border-input bg-input px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        placeholder={placeholder}
        required
        onChange={onChange}
      />
    </div>
  );
}
