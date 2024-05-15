import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export const Appbar = () => {
  const router = useRouter();
  const session = useSession();
  return (
    <div>
      <button
        onClick={() => {
          router.push("/api/auth/signin");
        }}
      >
        Signin
      </button>
      {JSON.stringify(session)}
    </div>
  );
};
