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
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-500"></div>
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
      try {
        const response = await axios.post(
          "http://localhost:3000/api/getinvitation",
          {
            editorId: editorId,
          }
        );

        if (response.status === 200) {
          console.log("Fetched invitations:", response.data.invitation);
          setAllInvitations(response.data.invitation.invitation);
        }
      } catch (error) {
        console.error("Error fetching invitations:", error);
      }
    };
    if (editorId) {
      fetchAllInvitations();
    }
  }, [editorId]);

  const handleViewClick = async (invitationId: number) => {
    setCurrentInvitation(invitationId);
    const markInvitation = await axios.post(
      "http://localhost:3000/api/invimarkasread",
      {
        invitationId: invitationId,
      }
    );

    if (markInvitation.status !== 200) {
      const markInvitation = await axios.post(
        "http://localhost:3000/api/invimarkasread",
        {
          invitationId: invitationId,
        }
      );
      if (markInvitation.status === 200) {
        console.log("marked invitation as read in second attempt");
      }
    } else {
      console.log("marked invitation as read");
    }
  };

  const hasNewNotification = async () => {
    if (hasNewNotifications) {
      setLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:3000/api/getinvitation",
          {
            editorId: editorId,
          }
        );
        if (response.status === 200) {
          setAllInvitations((prevInvitations) => {
            if (!prevInvitations) return response.data.invitation.invitation;
            return [...prevInvitations, ...response.data.invitation.invitation];
          });
        }
      } catch (error) {
        console.error("Failed to fetch invitations:", error);
      } finally {
        setLoading(false);
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
    <nav className="border-gray-200 bg-gray-900 h-20 mx-auto flex items-center justify-between w-full">
      <div className="md:max-w-screen-2xl mx-auto flex items-center justify-between w-full">
        <div className="text-white text-lg">YT-Layer</div>
        <div className="items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse flex gap-5">
          <DropdownMenu onOpenChange={hasNewNotification}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Image src={notificationIcon} alt="Notifications" />

                {hasNewNotifications && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72">
              <DropdownMenuLabel>Invitations</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {loading ? (
                <Spinner />
              ) : (
                <DropdownMenuGroup>
                  {allInvitations && allInvitations.length > 0 ? (
                    allInvitations.map((inv, index) => (
                      <DropdownMenuItem
                        className={`gap-4 ${
                          inv.viewed ? "text-gray-500" : "font-bold text-white"
                        }`}
                        key={index}
                        onClick={() => {}}
                      >
                        <Avatar>
                          <AvatarImage
                            src={inv.channel.ChannelPic || undefined}
                          />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span>{inv.message}</span>
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
                              navigateToYoutuberDetail(inv.channel.channelId);
                            }
                          }}
                          className="ml-auto"
                        >
                          View
                        </Button>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <DropdownMenuItem>No invitations</DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Image src={profile} alt="profile" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Profile</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};
