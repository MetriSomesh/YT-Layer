// src/state/userState.ts
import { atom } from "recoil";

export const youtuberIdState = atom<number | null>({
  key: "youtuberIdState",
  default: null,
});
