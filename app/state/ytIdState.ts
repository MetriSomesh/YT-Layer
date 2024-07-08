// src/state/userState.ts
import { atom } from "recoil";

export const ytIdState = atom<number | null>({
  key: "ytIdState",
  default: null,
});
