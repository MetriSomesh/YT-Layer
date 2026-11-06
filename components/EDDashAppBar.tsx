"use client";
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { userIdState } from "../app/state/userState";
import { getSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import notificationIcon from "../assets/notification.svg";
import profile from "../assets/user.svg";
import Image from "next/image";
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
import { notificationState } from "@/app/state/notificationState";
import { newnotificationState } from "@/app/state/newnotificationState";
import { channelInfoState } from "@/app/state/channelInfoState";
import axios from "axios";
import { editorIdState } from "@/app/state/editorIdState";
import { currentInvitationState } from "@/app/state/currentInvitationState";

const Spinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export const EDashAppbar = () => {
  const [loading, setLoading] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] =
    useRecoilState(newnotificationState);
  const [userId, setUserId] = useRecoilState(userIdState);
  const [editorId, setEditorId] = useRecoilState(editorIdState);
  const [allInvitations, setAllInvitations] = useRecoilState(notificationState);
  const [channelInfo, setChannelInfo] = useRecoilState(channelInfoState);
  const [currentInvitation, setCurrentInvitation] = useRecoilState(
    currentInvitationState
  );
  const router = useRouter();

  // useEffect(() => {
  //   const fetchUserId = async () => {
  //     const session = await getSession();
  //     if (session && session.user && session.user.id) {
  //       setUserId(session.user.id);
  //     }
  //   };

  //   fetchUserId();
  // }, []);

  useEffect(() => {
    const fetchAllInvitations = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.post("/api/getinvitation", {
          editorId: editorId,
        });

        if (response.status === 200) {
          console.log("Fetched invitations:", response.data.invitation);
          setAllInvitations(response.data.invitation.invitation);
        }
      } catch (error) {
        console.error("Error fetching invitations:", error);
      } finally {
        setLoading(false); // End loading
      }
    };
    if (editorId) {
      fetchAllInvitations();
    }
  }, [editorId]);

  const handleViewClick = async (invitationId: number) => {
    setCurrentInvitation(invitationId);
    const markInvitation = await axios.post("/api/invimarkasread", {
      invitationId: invitationId,
    });

    if (markInvitation.status !== 200) {
      const markInvitation = await axios.post("/api/invimarkasread", {
        invitationId: invitationId,
      });
      if (markInvitation.status === 200) {
        console.log("marked invitation as read in second attempt");
      }
    } else {
      console.log("marked invitation as read");
    }
  };

  const hasNewNotification = async () => {
    if (hasNewNotifications) {
      setLoading(true); // Start loading
      try {
        const response = await axios.post("/api/getinvitation", {
          editorId: editorId,
        });
        if (response.status === 200) {
          setAllInvitations((prevInvitations) => {
            if (!prevInvitations) return response.data.invitation.invitation;
            return [...prevInvitations, ...response.data.invitation.invitation];
          });
        }
      } catch (error) {
        console.error("Failed to fetch invitations:", error);
      } finally {
        setLoading(false); // End loading
        setHasNewNotifications(false);
      }
    }
    setHasNewNotifications(false);
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/signin");
  };

  const navigateToYoutuberDetail = (channelId: string) => {
    router.push(`/youtuber/${channelId}`);
  };

  return (
    <nav className="border-b border-border bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex h-16 items-center justify-between">
          <button
            onClick={() => router.push("/eddashboard")}
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
                  {hasNewNotifications && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-primary ring-2 ring-background"></span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mt-2 w-80 rounded-xl border border-border bg-card shadow-lg">
                <DropdownMenuLabel className="font-label px-4 py-3 text-xs tracking-[0.3em] text-muted-foreground">
                  INVITATIONS
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border" />
                {loading ? (
                  <div className="flex justify-center items-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <DropdownMenuGroup>
                    {allInvitations && allInvitations.length > 0 ? (
                      allInvitations.map((inv, index) => (
                        <DropdownMenuItem
                          className={`p-4 hover:bg-secondary ${
                            inv.viewed
                              ? "text-muted-foreground"
                              : "font-semibold text-foreground"
                          }`}
                          key={index}
                          onClick={() => {}}
                        >
                          <div className="flex items-center space-x-3 w-full">
                            <Avatar>
                              <AvatarImage
                                src={inv.channel.ChannelPic || undefined}
                                alt="Channel"
                              />
                              <AvatarFallback className="bg-secondary text-foreground">
                                CN
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="text-sm">{inv.message}</p>
                            </div>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                setChannelInfo(inv.channel);
                                console.log(inv.channel);
                                if (!inv.viewed) {
                                  handleViewClick(inv.id || 0);
                                }
                                if (inv.channel.channelId) {
                                  setCurrentInvitation(inv.id);
                                  navigateToYoutuberDetail(
                                    inv.channel.channelId
                                  );
                                }
                              }}
                              className="ml-auto rounded-full bg-secondary px-3 py-1 font-semibold text-foreground transition-colors duration-300 hover:bg-muted"
                            >
                              View
                            </Button>
                          </div>
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <DropdownMenuItem className="p-4 text-muted-foreground">
                        No invitations
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
                    <AvatarImage src={profile} alt="Profile" />
                    <AvatarFallback className="bg-secondary text-foreground">
                      ED
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
