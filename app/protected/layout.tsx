import { AuthButton } from "@/components/auth-button";
import Link from "next/link";
import { Suspense } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-screen flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 w-full flex flex-col">
        <nav className="w-full flex justify-center border-b border-b-slate-200 bg-white h-14 shrink-0">
          <div className="w-full flex justify-between items-center px-6 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href="/">not-jira</Link>
            </div>
            <Suspense>
              <AuthButton />
            </Suspense>
          </div>
        </nav>
        <div className="flex-1 min-h-0 flex flex-col gap-4 px-6 py-4">
          {children}
        </div>
      </div>
    </main>
  );
}
