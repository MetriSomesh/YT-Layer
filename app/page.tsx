"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.7, ease: EASE },
  };
}

export default function Home() {
  const router = useRouter();

  const pickRole = (role: "YOUTUBER" | "EDITOR") => {
    localStorage.setItem("userType", role);
    router.push("/signup");
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <button
            onClick={() => router.push("/")}
            className="font-label text-sm font-bold tracking-[0.3em]"
          >
            YT<span className="text-primary">/</span>LAYER
          </button>
          <nav className="hidden items-center gap-8 font-label text-xs tracking-widest text-muted-foreground md:flex">
            <a href="#roles" className="transition-colors hover:text-foreground">
              ROLES
            </a>
            <a href="#how" className="transition-colors hover:text-foreground">
              HOW IT WORKS
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/signin")}
              className="rounded-full border border-border px-5 py-2 text-sm font-medium transition-colors hover:border-foreground"
            >
              Sign in
            </button>
            <button
              onClick={() => router.push("/signup")}
              className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-white transition-transform hover:scale-[1.03]"
            >
              Start creating
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        <section className="pb-16 pt-20 md:pt-28">
          <motion.p
            {...fadeUp(0)}
            className="font-label text-xs tracking-[0.3em] text-muted-foreground"
          >
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-primary align-middle" />
            CREATOR X EDITOR PLATFORM
          </motion.p>
          <motion.h1
            {...fadeUp(0.08)}
            className="font-display mt-6 max-w-4xl text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl"
          >
            The layer between a YouTuber and their{" "}
            <span className="text-primary">editor</span>.
          </motion.h1>
          <motion.p
            {...fadeUp(0.16)}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
          >
            You shoot the video. Your editor cuts it. YT Layer is the
            workspace in between: invitations, uploads, review, and one click
            publish to YouTube.
          </motion.p>
          <motion.p
            {...fadeUp(0.22)}
            className="font-label mt-12 text-xs tracking-widest text-muted-foreground"
          >
            CHOOSE YOUR ROLE TO BEGIN
          </motion.p>

          <motion.div
            {...fadeUp(0.28)}
            className="relative mt-6 overflow-hidden rounded-xl border border-border bg-card"
          >
            <div className="timeline-ruler flex h-10 items-end border-b border-border px-4 pb-2 font-label text-[10px] tracking-widest text-muted-foreground">
              <span>00:00</span>
              <span className="ml-auto">00:30</span>
              <span className="ml-auto">01:00</span>
            </div>
            <div className="flex h-14">
              <div className="w-[18%] bg-zinc-800" />
              <div className="w-[26%] bg-zinc-700" />
              <div className="w-[12%] bg-primary" />
              <div className="w-[30%] bg-zinc-800" />
              <div className="w-[14%] bg-zinc-700" />
            </div>
            <motion.div
              className="absolute top-0 h-full w-[2px] bg-primary"
              animate={{ left: ["4%", "92%", "4%"] }}
              transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
            />
            <div className="flex items-center justify-between border-t border-border px-4 py-2 font-label text-[10px] tracking-widest text-muted-foreground">
              <span>REC 00:00:12:04</span>
              <span>VIDEO.MP4 / 4K / 24FPS</span>
            </div>
          </motion.div>
        </section>

        <section id="roles" className="grid gap-6 pb-20 md:grid-cols-2">
          <motion.button
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease: EASE }}
            whileHover={{ y: -6 }}
            onClick={() => pickRole("YOUTUBER")}
            className="group rounded-2xl border border-border bg-card p-8 text-left transition-colors hover:border-primary"
          >
            <p className="font-label text-xs tracking-[0.3em] text-primary">
              FOR CREATORS
            </p>
            <h2 className="font-display mt-4 text-3xl font-bold">
              Continue as YouTuber
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Hire an editor, send the footage, review the cut, publish to
              your channel. Your channel keeps moving while you shoot the next
              video.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-label text-xs tracking-widest text-foreground">
              ENTER AS YOUTUBER
              <span className="transition-transform group-hover:translate-x-1">
                &rarr;
              </span>
            </span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.43, duration: 0.7, ease: EASE }}
            whileHover={{ y: -6 }}
            onClick={() => pickRole("EDITOR")}
            className="group rounded-2xl border border-border bg-card p-8 text-left transition-colors hover:border-primary"
          >
            <p className="font-label text-xs tracking-[0.3em] text-primary">
              FOR EDITORS
            </p>
            <h2 className="font-display mt-4 text-3xl font-bold">
              Continue as Editor
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Get hired by channels, cut their footage, deliver the finished
              video, and get paid for your craft. Your work, your portfolio,
              your clients.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-label text-xs tracking-widest text-foreground">
              ENTER AS EDITOR
              <span className="transition-transform group-hover:translate-x-1">
                &rarr;
              </span>
            </span>
          </motion.button>
        </section>

        <section id="how" className="border-t border-border py-20">
          <p className="font-label text-xs tracking-[0.3em] text-muted-foreground">
            HOW IT WORKS
          </p>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            <div>
              <p className="font-display text-5xl font-bold text-primary">01</p>
              <h3 className="font-display mt-4 text-xl font-bold">Invite</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                The YouTuber invites an editor to the channel. No passwords
                shared, the connection runs on Google sign in.
              </p>
            </div>
            <div>
              <p className="font-display text-5xl font-bold text-primary">02</p>
              <h3 className="font-display mt-4 text-xl font-bold">
                Cut and upload
              </h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                The editor uploads the finished video and thumbnail to the
                workspace for review.
              </p>
            </div>
            <div>
              <p className="font-display text-5xl font-bold text-primary">03</p>
              <h3 className="font-display mt-4 text-xl font-bold">Publish</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                The YouTuber reviews the cut and publishes straight to YouTube
                in one click.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 font-label text-xs tracking-widest text-muted-foreground md:flex-row md:items-center md:justify-between">
          <span>
            YT<span className="text-primary">/</span>LAYER
          </span>
          <span>BUILT FOR CREATORS AND EDITORS</span>
        </div>
      </footer>
    </div>
  );
}
