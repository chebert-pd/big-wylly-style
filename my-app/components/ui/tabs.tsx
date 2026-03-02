import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

type TabsVariant = "line" | "pill" | "verticalLine" | "verticalPill"
type TabsSize = "md" | "sm"

type TabsStyleContextValue = {
  variant: TabsVariant
  size: TabsSize
}

const TabsStyleContext = React.createContext<TabsStyleContextValue>({
  variant: "line",
  size: "md",
})

const tabsListVariants = cva("inline-flex", {
  variants: {
    variant: {
      line: "items-center border-b border-border-subtle bg-background",
      pill: "items-center gap-1 p-1 rounded-lg",
      verticalLine: "flex flex-col items-stretch border-r border-border-subtle w-full",
      verticalPill: "flex flex-col items-start gap-1 p-1 rounded-lg w-fit",
    },
  },
  defaultVariants: {
    variant: "line",
  },
})

const tabsTriggerVariants = cva(
  "inline-flex items-center gap-2 whitespace-nowrap transition-colors outline-none disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-ring/50 leading-none",
  {
    variants: {
      variant: {
        line: [
          "border-b border-border-subtle",
          "text-muted-foreground",
          "hover:text-foreground",
          "data-[state=active]:border-primary",
          "data-[state=active]:text-primary",
        ].join(" "),
        pill: [
          "rounded-lg",
          "text-muted-foreground",
          "hover:text-foreground",
          "data-[state=active]:bg-accent",
          "data-[state=active]:text-accent-foreground",
        ].join(" "),
        verticalLine: [
          "relative",
          "w-full",
          "justify-between",
          "text-muted-foreground",
          "hover:text-foreground",
          "data-[state=active]:text-foreground",
          "after:absolute",
          "after:right-[-1px]",
          "after:top-0",
          "after:h-full",
          "after:w-[2px]",
          "after:bg-transparent",
          "data-[state=active]:after:bg-primary",
          "after:transition-colors",
        ].join(" "),
        verticalPill: [
          "rounded-lg",
          "text-muted-foreground",
          "hover:text-foreground",
          "data-[state=active]:bg-accent",
          "data-[state=active]:text-accent-foreground",
        ].join(" "),
      },
      size: {
        md: "py-2 px-4 text-base font-medium leading-6 [&>svg]:size-5",
        sm: "h-6 px-2 text-[11px] font-[525] [&>svg]:size-4",
      },
    },
    defaultVariants: {
      variant: "line",
      size: "md",
    },
  }
)

function Tabs({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root> & {
  variant?: TabsVariant
  size?: TabsSize
}) {
  const ctx = React.useMemo<TabsStyleContextValue>(
    () => ({ variant: variant ?? "line", size: size ?? "md" }),
    [variant, size]
  )

  return (
    <TabsStyleContext.Provider value={ctx}>
      <TabsPrimitive.Root
        data-slot="tabs"
        className={cn("flex flex-col gap-4", className)}
        {...props}
      />
    </TabsStyleContext.Provider>
  )
}

function TabsList({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  const ctx = React.useContext(TabsStyleContext)
  const resolvedVariant = (variant ?? ctx.variant) as TabsVariant

  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(tabsListVariants({ variant: resolvedVariant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> &
  VariantProps<typeof tabsTriggerVariants>) {
  const ctx = React.useContext(TabsStyleContext)
  const resolvedVariant = (variant ?? ctx.variant) as TabsVariant
  const resolvedSize = (size ?? ctx.size) as TabsSize

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        tabsTriggerVariants({ variant: resolvedVariant, size: resolvedSize }),
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }