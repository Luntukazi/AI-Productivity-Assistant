import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function PageHeader({ title, description, ai, children }: { title: string; description?: string; ai?: boolean; children?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
      <div>
        {ai && <p className="eyebrow">LM Smart Assistant · AI-powered</p>}
        <h1 className="text-4xl mt-1">{title}</h1>
        {description && <p className="text-muted-foreground text-sm mt-2 max-w-2xl">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export function AiNotice() {
  return <p className="text-xs text-muted-foreground border-l-2 border-gold pl-3">AI-generated content can contain mistakes. Review and edit before using it — nothing is sent automatically.</p>;
}

const statusStyles: Record<string, string> = {
  pending: "bg-warning/15 text-foreground border-warning/40",
  confirmed: "bg-gold/20 text-foreground border-gold/50",
  completed: "bg-success/15 text-foreground border-success/40",
  cancelled: "bg-muted text-muted-foreground border-border line-through",
};
export function StatusBadge({ status }: { status: string }) {
  return <Badge variant="outline" className={cn("capitalize", statusStyles[status])}>{status}</Badge>;
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="border border-dashed rounded-md p-10 text-center text-sm text-muted-foreground">{children}</div>;
}
