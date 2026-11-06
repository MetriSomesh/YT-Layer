import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export const Appbar = () => {
  const router = useRouter();
  const session = useSession();
  return (
    <div className="border-b border-border bg-background text-foreground">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <span className="font-label text-sm font-bold tracking-[0.3em]">
          YT<span className="text-primary">/</span>LAYER
        </span>
        <button
          onClick={() => {
            router.push("/api/auth/signin");
          }}
          className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-white transition-transform hover:scale-[1.03]"
        >
          Signin
        </button>
      </div>
      <p className="font-label mx-auto max-w-6xl truncate px-6 pb-3 text-[10px] tracking-widest text-muted-foreground">
        {JSON.stringify(session.data)}
      </p>
    </div>
  );
};
