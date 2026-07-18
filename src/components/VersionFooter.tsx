import { useMemo } from "react";
import { packageVersion } from "@/lib/version";

export function VersionFooter({ fixed = true }: { fixed?: boolean }) {
  const version = useMemo(() => packageVersion(), []);
  return (
    <div
      className={`${fixed ? "fixed bottom-0 left-0 right-0 z-50" : ""} w-full text-center py-1 text-[10px] text-slate-400/70 select-none pointer-events-none bg-transparent`}
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0.25rem)" }}
      aria-label={`Versión ${version}`}
    >
      v{version}
    </div>
  );
}

