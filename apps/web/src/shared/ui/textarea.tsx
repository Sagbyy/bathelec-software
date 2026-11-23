import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[88px] w-full rounded-lg border border-input bg-card px-3 py-2 text-base shadow-xs transition-[color,box-shadow,border-color] placeholder:text-muted-foreground/80 hover:border-foreground/20 focus-visible:outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/15 focus-visible:ring-offset-0 aria-[invalid=true]:border-destructive disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
