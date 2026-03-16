import { AuthButton } from "@/components/auth-button";
import Link from "next/link";
import { Suspense } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 w-full flex flex-col">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-10">
          <div className="w-full flex justify-between items-center px-6 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href="/">not-jira</Link>
            </div>
            <Suspense>
              <AuthButton />
            </Suspense>
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-4 px-6 py-4">{children}</div>
      </div>
    </main>
  );
}
