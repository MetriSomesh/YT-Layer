"use client";

import axios from "axios";
import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useRecoilValue } from "recoil";
import { youtuberIdState } from "@/app/state/youtuberIdState";

interface Profile {
  id: number;
  name: string;
  description: string;
}

const mockProfiles: Profile[] = [];

export const SearchEditors = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const youtuberId = useRecoilValue(youtuberIdState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setProfiles(mockProfiles);
  }, []);

  const handleSearch = async (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    console.log(youtuberId);
  };

  const handleKeyPress = async (e: any) => {
    if (e.keyCode === 13) {
      setLoading(true);
      var res = await axios.post("/api/searcheditor", {
        searchTerm,
      });

      const editor = res.data.editor;
      const foundProfile: Profile = {
        id: editor.editor.id,
        name: editor.username,
        description: editor.editor.description,
      };

      const updatedProfiles = [...profiles, foundProfile];
      setProfiles(updatedProfiles);
      setLoading(false);
    }
  };

  const handleCardClick = (id: number) => {
    router.push(`/editor/${id}`);
  };

  return (
    <div className="min-h-screen bg-background px-4 py-12 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="font-label text-center text-xs tracking-[0.3em] text-muted-foreground">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-primary align-middle" />
          FIND YOUR EDITOR
        </p>
        <h1 className="font-display mt-4 text-center text-4xl font-bold tracking-tight md:text-5xl">
          Discover talented <span className="text-primary">editors</span>.
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-center leading-relaxed text-muted-foreground">
          Search by email or phone number, open a profile, and send an
          invitation.
        </p>
        <div className="mx-auto mb-12 mt-10 max-w-xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Search via email address or phone number..."
              value={searchTerm}
              onChange={handleSearch}
              onKeyDown={handleKeyPress}
              className="w-full rounded-full border border-input bg-input p-4 pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <svg
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="flex w-full items-center justify-center py-16">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <span className="font-label ml-4 text-xs tracking-[0.3em] text-muted-foreground">
                PLEASE WAIT
              </span>
            </div>
          ) : (
            <>
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  onClick={() => handleCardClick(profile.id)}
                  className="cursor-pointer rounded-2xl border border-border bg-card p-6 transition-colors hover:-translate-y-1 hover:border-primary"
                >
                  <h2 className="font-display text-2xl font-bold">
                    {profile.name}
                  </h2>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    {profile.description}
                  </p>
                  <div className="mt-6 flex justify-end">
                    <span className="font-label inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1 text-[11px] tracking-widest text-foreground">
                      VIEW PROFILE
                    </span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
        {profiles.length === 0 && (
          <p className="mt-8 text-center text-muted-foreground">
            No editors found. Try searching for an editor.
          </p>
        )}
      </div>
    </div>
  );
};
