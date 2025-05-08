import React from "react"
import { cn } from "@/lib/utils"

interface MainProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

export const Main = ({ fixed, className, ...props }: MainProps) => {
  return (
    <main
      className={cn(
        'peer-[.header-fixed]/header:mt-22',
        'px-4 py-6 bg-secondary',
        fixed && 'fixed-main flex flex-col flex-grow overflow-hidden',

        "max-w-full w-full ml-auto",
        "peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)+4rem)]",
        "peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width)+4rem))]",
        "transition-[width] ease-linear duration-200",
        className
      )}
      {...props}
    />
  )
}

Main.displayName = "Main"
