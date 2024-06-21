// app/editor/[id]/EditorDetail.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

interface EditorDetailProps {
  editor: {
    user: {
      username: string;
      email: string;
    };
    // profile_pic: string;
    description: string;
    experience: string;
    phone_number: string;
    country: string;
    state: string;
    city: string;
  };
}

const EditorDetail: React.FC<EditorDetailProps> = ({ editor }) => {
  const handleInviteClick = () => {
    // Handle the invite action here, e.g., send an invite request to the server
    alert("Invite sent!");
  };

  return (
    <div className="container mx-auto p-6 min-h-screen min-w-ful bg-gray-900 text-gray-100">
      <div className="bg-gray-800 shadow-md rounded-lg p-8">
        <Link href="/addeditor" className="text-blue-400 hover:text-blue-500">
          Back to Search
        </Link>
        <div className="text-center mt-6">
          {/* <Image
            src={editor.profile_pic}
            alt={editor.user.username}
            width={150}
            height={150}
            className="rounded-full mx-auto border-4 border-blue-500"
          /> */}
          <h1 className="text-4xl font-bold mt-4 text-blue-400">
            {editor.user.username}
          </h1>
          <p className="text-gray-300 mt-2">{editor.description}</p>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-blue-400">Experience</h2>
            <p className="text-gray-300 mt-2">{editor.experience}</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-blue-400">
              Contact Information
            </h2>
            <p className="text-gray-300 mt-2">Phone: {editor.phone_number}</p>
            <p className="text-gray-300">Email: {editor.user.email}</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-blue-400">Location</h2>
            <p className="text-gray-300 mt-2">Country: {editor.country}</p>
            <p className="text-gray-300">State: {editor.state}</p>
            <p className="text-gray-300">City: {editor.city}</p>
          </div>
        </div>
        <div className="mt-10 flex justify-center">
          <button
            onClick={handleInviteClick}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
          >
            Invite
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorDetail;
