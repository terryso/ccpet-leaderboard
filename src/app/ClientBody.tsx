"use client";

import { useEffect, useState } from "react";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration and prevent mismatches
  useEffect(() => {
    setIsHydrated(true);
    // Remove any extension-added classes during hydration
    document.body.className = "antialiased h-full overflow-hidden";
  }, []);

  // Prevent hydration mismatch by ensuring consistent rendering
  if (!isHydrated) {
    return <div className="antialiased h-full overflow-hidden">{children}</div>;
  }

  return <div className="antialiased h-full overflow-hidden">{children}</div>;
}
