"use client"

import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react"

import { cn } from "../lib/utils"
import { Button } from "./button"
import { buttonVariants } from "./button"
import { Input } from "./input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<"button">, "disabled"> &
  React.ComponentProps<"a"> & {
    size?: "md" | "sm" | "lg" | "xs"
  }

function PaginationLink({
  className,
  isActive,
  size = "sm",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
          iconOnly: true,
        }),
        className
      )}
      {...props}
    />
  )
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="sm"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="sm"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

type PaginationToolbarProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  pageSize?: number
  onPageSizeChange?: (size: number) => void
  pageSizeOptions?: number[]
  totalRows?: number
  className?: string
}

function PaginationToolbar({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
  totalRows,
  className,
}: PaginationToolbarProps) {
  const [goToPage, setGoToPage] = React.useState("")
  const safeTotal = Math.max(totalPages, 1)

  function commitGoToPage() {
    const num = Number(goToPage)
    if (num >= 1 && num <= safeTotal) {
      onPageChange(num)
    }
    setGoToPage("")
  }

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination-toolbar"
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
        className
      )}
    >
      <div className="flex items-center gap-2 whitespace-nowrap">
        {pageSize != null && onPageSizeChange && (
          <>
            <span className="p-sm text-muted-foreground">
              Rows per page:
            </span>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger size="inline" className="w-auto">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}

        {typeof totalRows === "number" && (
          <span className="p-sm text-muted-foreground whitespace-nowrap">
            Total: {totalRows.toLocaleString()} rows
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 whitespace-nowrap overflow-x-auto">
        <span className="p-sm text-muted-foreground whitespace-nowrap">
          Page {currentPage} of {safeTotal}
        </span>

        <div className="flex items-center gap-2">
          <span className="p-sm text-muted-foreground whitespace-nowrap">Go to</span>
          <Input
            size="inline"
            inputMode="numeric"
            pattern="[0-9]*"
            type="number"
            min={1}
            max={safeTotal}
            value={goToPage}
            onChange={(e) => setGoToPage(e.target.value)}
            onBlur={commitGoToPage}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitGoToPage()
            }}
            className="w-16"
            aria-label="Go to page"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= safeTotal}
          >
            Next
          </Button>
        </div>
      </div>
    </nav>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationToolbar,
}
