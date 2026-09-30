import * as React from "react";

import { cn } from "@/lib/utils";

/** Styled native <select>: accessible and keyboard-friendly by default. */
function NativeSelect({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      data-slot="native-select"
      className={cn(
        "border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-2.5 text-sm shadow-xs outline-none",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:opacity-50",
        "dark:bg-background",
        className,
      )}
      {...props}
    />
  );
}

export { NativeSelect };
