"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function AuthButton() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState<string | null | undefined>(undefined);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, []);

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  }

  if (email === undefined) return null;

  if (!email) {
    return (
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Link href="/auth/login">Sign in</Link>
        </Button>
        <Button size="sm">
          <Link href="/auth/sign-up">Sign up</Link>
        </Button>
      </div>
    );
  }

  const initials = email[0].toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-sm font-semibold text-slate-700 hover:bg-slate-400 transition-colors focus:outline-none"
        aria-label="User menu"
      >
        {initials}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
          <div className="px-3 py-2 text-xs text-slate-500 truncate">
            {email}
          </div>
          <div className="border-t border-slate-100 my-1" />
          <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
            My Profile
          </button>
          <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
            Settings
          </button>
          <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
            {"What's New"}
          </button>
          <div className="border-t border-slate-100 my-1" />
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
