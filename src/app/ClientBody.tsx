"use client";

import { useEffect } from "react";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  // Remove any extension-added classes during hydration
  useEffect(() => {
    // This runs only on the client after hydration
    document.body.className = "antialiased h-full overflow-hidden";
  }, []);

  return <div className="antialiased h-full overflow-hidden">{children}</div>;
}
