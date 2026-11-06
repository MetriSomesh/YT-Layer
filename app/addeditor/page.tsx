import { DashAppbar } from "@/components/DashAppbar";
import { SearchEditors } from "@/components/SearchEditor";

export default function AddEditor() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SearchEditors />
    </div>
  );
}
