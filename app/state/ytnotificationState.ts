import { atom } from "recoil";

interface Notification {
  id: number | null;
  youtuberId: number | null;
  editorId: number | null;
  editor: Editor;
  status: string | null;
  viewed: boolean | null;
}
interface Editor {
  id: number | null;
  userId: number | null;
  profile_pic: string | null;
  description: string | null;
  experience: string | null;
  phone_number: number | null;
  country: string | null;
  state: string | null;
  city: string | null;
  youtuberId: string | null;
}
export const ytnotificationState = atom<Notification | null>({
  key: "ytnotificationState",
  default: null,
});
