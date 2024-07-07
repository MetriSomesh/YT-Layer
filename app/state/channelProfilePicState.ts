// src/state/userState.ts
import { atom } from "recoil";

export const channelProfilePicState = atom<string | null>({
  key: "channelProfilePicState",
  default: null,
});
