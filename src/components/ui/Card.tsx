import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
  as?: "div" | "article" | "li";
  children: React.ReactNode;
  hover?: boolean;
}

export function Card({ className, as: Tag = "div", children, hover = true }: CardProps) {
  return (
    <Tag
      className={cn(
        "bg-white border border-[#C8D8EA] rounded-card p-6 shadow-card",
        hover && "transition-shadow duration-200 hover:shadow-cardHover",
        className
      )}
    >
      {children}
    </Tag>
  );
}
