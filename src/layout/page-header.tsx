import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Header } from "./header"

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  className?: string
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    // <Header fixed className={cn("border-b justify-between", className)}>
    <div>

        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
    // </Header>
  )
}

