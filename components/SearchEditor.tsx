"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect, ChangeEvent } from "react";

// Define the profile type
interface Profile {
  id: number;
  name: string;
  description: string;
}

// const mockProfiles: Profile[] = [
//   { id: 1, name: "Editor One", description: "Profile of Editor One" },
//   { id: 2, name: "Editor Two", description: "Profile of Editor Two" },
//   { id: 3, name: "Editor Three", description: "Profile of Editor Three" },
//   { id: 4, name: "Editor Four", description: "Profile of Editor Four" },
//   { id: 5, name: "Editor Five", description: "Profile of Editor Five" },
//   { id: 6, name: "Editor Six", description: "Profile of Editor Six" },
//   { id: 7, name: "Editor Seven", description: "Profile of Editor Seven" },
//   { id: 8, name: "Editor Eight", description: "Profile of Editor Eight" },
//   { id: 9, name: "Editor Nine", description: "Profile of Editor Nine" },
//   { id: 10, name: "Editor Ten", description: "Profile of Editor Ten" },
// ];

const mockProfiles: Profile[] = [];

export const SearchEditors = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const router = useRouter();
  useEffect(() => {
    // Fetch the top 10 editor profiles initially
    setProfiles(mockProfiles);
  }, []);

  const handleSearch = async (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    // const filteredProfiles = mockProfiles.filter((profile) =>
    //   profile.name.toLowerCase().includes(event.target.value.toLowerCase())
    // );
    // setProfiles(filteredProfiles);

    // var res = await axios.post("http://localhost:3000/api/searcheditor", {
    //   searchTerm,
    // });
  };
  const handleKeyPress = async (e: any) => {
    if (e.keyCode === 13) {
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
    }
  };

  const handleCardClick = (id: number) => {
    router.push(`/editor/${id}`);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
        Search for Editors
      </h1>
      <div className="max-w-md mx-auto mb-8">
        <input
          type="text"
          placeholder="Search via email address or phone number..."
          value={searchTerm}
          onChange={handleSearch}
          onKeyDown={handleKeyPress}
          className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            onClick={() => handleCardClick(profile.id)}
            className="bg-white p-6 border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
          >
            <h2 className="text-2xl font-bold mb-2 text-gray-900">
              {profile.name}
            </h2>
            <p className="text-gray-700">{profile.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
