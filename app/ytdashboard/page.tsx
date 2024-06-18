"use client";
import { ChannelCard } from "@/components/ChannelCard";
import { DashAppbar } from "@/components/DashAppbar";
import { EditorCard } from "@/components/EditorCard";
import { useState } from "react";

export default function DashBoard() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  return (
    <div className="h-screen bg-slate-200">
      <DashAppbar />
      <div className="h-52"></div>
      <div className="w-full  mt-5 flex h-56 gap-96 justify-evenly">
        <EditorCard />

        <ChannelCard />
      </div>
    </div>
  );
}
