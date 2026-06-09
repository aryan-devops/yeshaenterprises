import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | YESHA Connect",
  description: "YESHA Connect Project Tracking Dashboard",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 font-sans antialiased">
      {children}
    </div>
  );
}
