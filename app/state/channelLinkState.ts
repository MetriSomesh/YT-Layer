// src/state/userState.ts
import { atom } from "recoil";

export const channelLinkState = atom<string | null>({
  key: "channelLinkState",
  default: null,
});
