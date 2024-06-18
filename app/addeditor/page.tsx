import { DashAppbar } from "@/components/DashAppbar";
import { SearchEditors } from "@/components/SearchEditor";

export default function AddEditor() {
  return (
    <div className="h-full bg-gray-100">
      <DashAppbar />
      <SearchEditors />
    </div>
  );
}
