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
      var res = await axios.post("http://localhost:3000/api/searcheditor", {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Discover Talented Editors
        </h1>
        <div className="max-w-xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search via email address or phone number..."
              value={searchTerm}
              onChange={handleSearch}
              onKeyDown={handleKeyPress}
              className="w-full p-4 pl-12 pr-4 text-gray-900 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="flex items-center justify-center w-full h-full">
              <div className="relative w-24 h-24">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-500 rounded-full animate-ping opacity-75"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-300 rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <svg
                    className="animate-spin h-8 w-8 text-purple-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              </div>
              <span className="ml-3 text-lg font-medium text-purple-300">
                Please wait...
              </span>
            </div>
          ) : (
            <>
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  onClick={() => handleCardClick(profile.id)}
                  className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer transform hover:-translate-y-1 hover:scale-105 "
                >
                  <h2 className="text-2xl font-bold mb-3 text-purple-400">
                    {profile.name}
                  </h2>
                  <p className="text-gray-300">{profile.description}</p>
                  <div className="mt-4 flex justify-end">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-700 text-purple-100">
                      View Profile
                    </span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
        {profiles.length === 0 && (
          <p className="text-center text-gray-400 mt-8">
            No editors found. Try searching for an editor.
          </p>
        )}
      </div>
    </div>
  );
};
