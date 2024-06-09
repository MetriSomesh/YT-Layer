import { atom } from "recoil";

export const userEmailState = atom({
  key: "userEmailState",
  default: "",
});

export const userIdState = atom({
  key: "userIdState",
  default: "",
});
