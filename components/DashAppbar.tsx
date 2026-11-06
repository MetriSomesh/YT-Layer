"use client";
import { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { userIdState } from "../app/state/userState";
import { getSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import notificationIcon from "../assets/notification.svg";
import Image from "next/image";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { newnotificationState } from "@/app/state/newnotificationState";
import { youtuberIdState } from "@/app/state/youtuberIdState";
import { ytnotificationState } from "@/app/state/ytnotificationState";
import { newYtNotificationState } from "@/app/state/newYtNotificationState";
import { channelInfoState } from "@/app/state/channelInfoState";
import { channelProfilePicState } from "@/app/state/channelProfilePicState";
import { channelLinkState } from "@/app/state/channelLinkState";

export const DashAppbar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [userId, setUserId] = useRecoilState(userIdState);
  const youtuberId = useRecoilValue(youtuberIdState);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [newYtNotification, setNewYtNotification] = useRecoilState(
    newYtNotificationState
  );
  const [channelLink, setChannelLink] = useRecoilState(channelLinkState);
  const [channelInfo, setChannelInfo] = useRecoilState(channelInfoState);
  const [ytNotification, setYtNotification] =
    useRecoilState(ytnotificationState);
  const [profilePic, setProfilePic] = useRecoilState(channelProfilePicState);
  const Spinner = () => (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  const hasNewNotification = async () => {
    if (newYtNotification) {
      setLoading(true);
      try {
      } catch (error) {
        console.error("Failed to fetch invitations:", error);
      } finally {
        setLoading(false);
      }
    }
    setNewYtNotification(false);
  };

  useEffect(() => {
    const createChannel = async () => {
      if (youtuberId !== null) {
        return;
      }
      const newChannel = await axios.post("/api/channelinfo", {
        youtuberId: youtuberId,
      });

      if (newChannel) {
        console.log(newChannel);
      }
    };
    createChannel();
  }, [youtuberId]);

  useEffect(() => {
    if (profilePic !== null) {
      return;
    }
    const getProfile = async () => {
      const profilePic = await axios.post("/api/getYtProfilePic", {
        id: youtuberId,
      });

      if (profilePic.status === 200) {
        setProfilePic(profilePic.data.channelPic);
        setChannelLink(profilePic.data.channelLink);
      }
    };
    getProfile();
  }, [youtuberId]);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/signin");
  };

  const handleOkButton = async (notificationId: number | null) => {
    const deleteNotification = await axios.post("/api/deleteytnotification", {
      notificationId: notificationId,
    });
    if (deleteNotification.status === 200) {
      console.log("notification deleted");
    }
  };

  return (
    <nav className="border-b border-border bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex h-16 items-center justify-between">
          <button
            onClick={() => router.push("/ytdashboard")}
            className="font-label text-sm font-bold tracking-[0.3em]"
          >
            YT<span className="text-primary">/</span>LAYER
          </button>
          <div className="flex items-center space-x-4">
            <DropdownMenu onOpenChange={hasNewNotification}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-muted-foreground hover:bg-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <Image
                    src={notificationIcon}
                    alt="Notifications"
                    className="w-6 h-6"
                  />
                  {newYtNotification && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-primary ring-2 ring-background"></span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mt-2 w-80 rounded-xl border border-border bg-card shadow-lg">
                <DropdownMenuLabel className="font-label px-4 py-3 text-xs tracking-[0.3em] text-muted-foreground">
                  NOTIFICATIONS
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border" />
                {loading ? (
                  <div className="flex justify-center items-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <DropdownMenuGroup>
                    {ytNotification ? (
                      <DropdownMenuItem
                        className={`p-4 hover:bg-secondary ${
                          ytNotification?.viewed
                            ? "text-muted-foreground"
                            : "font-semibold text-foreground"
                        }`}
                        onClick={() => {}}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage
                              src={ytNotification.editor.profile_pic || ""}
                            />
                            <AvatarFallback className="bg-secondary text-foreground">
                              ED
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm">{`Your invitation is ${ytNotification.status} by ${ytNotification.editor.country}`}</p>
                          </div>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOkButton(ytNotification.id);
                              router.refresh();
                            }}
                            className="ml-auto bg-secondary text-foreground hover:bg-muted"
                          >
                            Ok
                          </Button>
                        </div>
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem className="p-4 text-muted-foreground">
                        No notifications
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <Avatar>
                    <AvatarImage src={profilePic || ""} />
                    <AvatarFallback className="bg-secondary text-foreground">
                      YT
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mt-2 w-56 rounded-xl border border-border bg-card shadow-lg">
                <DropdownMenuLabel className="font-label px-4 py-3 text-xs tracking-[0.3em] text-muted-foreground">
                  PROFILE
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer px-4 py-2 text-foreground hover:bg-secondary">
                    Edit Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer px-4 py-2 text-foreground hover:bg-secondary"
                    onClick={handleSignOut}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};
