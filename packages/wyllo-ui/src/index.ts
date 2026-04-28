"use client"

// ---------------------------------------------------------------------------
// @chebert-pd/ui — barrel export
// ---------------------------------------------------------------------------

// Utilities
export { cn } from "./lib/utils"

// Hooks
export { useMediaQuery } from "./hooks/use-media-query"

// Components
export {
  Accordion,
  AccordionGroup,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./components/accordion"

export { Alert, AlertTitle, AlertDescription, AlertAction } from "./components/alert"

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./components/alert-dialog"

export { AspectRatio } from "./components/aspect-ratio"

export { Avatar, AvatarImage, AvatarFallback } from "./components/avatar"

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "./components/breadcrumb"

export {
  Badge,
  badgeVariants,
  BadgeAction,
  BadgeAvatar,
  BadgeAvatarGroup,
  ComboBadge,
  BadgeDelta,
  BadgeIcon,
  BadgeIndicator,
} from "./components/badge"

export { Button, buttonVariants } from "./components/button"

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
} from "./components/button-group"

export { Calendar } from "./components/calendar"
export type { CalendarProps } from "./components/calendar"

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from "./components/card"

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartLegendInteractive,
  useChartLegendInteractive,
  ChartStyle,
  CHART_DEFAULT_YAXIS_WIDTH,
  CHART_DEFAULT_MARGIN,
  CHART_DEFAULT_PLOT_LEFT_OFFSET,
} from "./components/chart"
export type {
  ChartConfig,
  ChartLegendInteractiveState,
  ChartTooltipFooterContext,
} from "./components/chart"

export { Checkbox } from "./components/checkbox"

export {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockCopy,
  CodeBlockContent,
  CodeSnippet,
} from "./components/code-block"

export { ChoiceCard } from "./components/choice-card"

export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "./components/collapsible"

export {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxSeparator,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
} from "./components/combobox"

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from "./components/command"

export { DataTable } from "./components/data-table"

export { DataTableFilterPanel, countActiveFilters } from "./components/data-table-filter-panel"
export type { FilterConfig, FilterOption, FilterValues, AmountRangeValue } from "./components/data-table-filter-panel"

export { DataTableToolbar } from "./components/data-table-toolbar"
export type { DataTableToolbarProps } from "./components/data-table-toolbar"

export { DatePicker } from "./components/date-picker"
export type {
  DatePickerSingleProps,
  DatePickerRangeProps,
  DatePickerProps,
} from "./components/date-picker"

export { DateRangePicker } from "./components/date-range-picker"

export {
  Dialog,
  DialogAction,
  DialogBody,
  DialogCancel,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogMedia,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "./components/dialog"

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from "./components/drawer"

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "./components/dropdown-menu"

export { EmptyState } from "./components/empty-state"
export { ErrorState } from "./components/error-state"

export {
  FullScreenSheet,
  FullScreenSheetHeader,
  FullScreenSheetTitle,
  FullScreenSheetDescription,
  FullScreenSheetActions,
  FullScreenSheetBody,
  FullScreenSheetFooter,
} from "./components/full-screen-sheet"

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
} from "./components/field"

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from "./components/form"

export { Header } from "./components/header"
export type { HeaderProps } from "./components/header"

export {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "./components/hover-card"

export { InlineField } from "./components/inline-field"

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
} from "./components/input-group"

export { Input } from "./components/input"

export {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "./components/input-otp"

export { Kbd, KbdGroup } from "./components/kbd"

export { Label } from "./components/label"

export { MetricPanel } from "./components/metric-panel"
export type { MetricItem, MetricPanelProps } from "./components/metric-panel"

export {
  MetricStrip,
  MetricStripHeader,
  MetricStripItem,
  MetricStripContent,
} from "./components/metric-strip"

export { ModalBase } from "./components/modal-base"

export {
  Popover,
  PopoverTrigger,
  PopoverAnchor,
  PopoverContent,
} from "./components/popover"

export { Progress } from "./components/progress"

export { RadioGroup, RadioGroupItem } from "./components/radio-group"

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationToolbar,
} from "./components/pagination"

export {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "./components/resizable"

export {
  ResponsiveAlertDialog,
  ResponsiveAlertDialogAction,
  ResponsiveAlertDialogCancel,
  ResponsiveAlertDialogContent,
  ResponsiveAlertDialogDescription,
  ResponsiveAlertDialogFooter,
  ResponsiveAlertDialogHeader,
  ResponsiveAlertDialogMedia,
  ResponsiveAlertDialogTitle,
  ResponsiveAlertDialogTrigger,
} from "./components/responsive-alert-dialog"

export {
  ResponsiveDialog,
  ResponsiveDialogAction,
  ResponsiveDialogCancel,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogMedia,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "./components/responsive-dialog"

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./components/select"

export { ScrollArea, ScrollBar } from "./components/scroll-area"

export { Separator } from "./components/separator"

export {
  SidePanelProvider,
  SidePanelContainer,
  useSidePanel,
} from "./components/side-panel"
export type { SidePanelConfig } from "./components/side-panel"

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarInput,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  sidebarMenuButtonVariants,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarPage,
  SidebarPageBack,
  SidebarPages,
  SidebarPageTrigger,
  SidebarRail,
  SidebarSearchTrigger,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
  useSidebarPage,
} from "./components/sidebar"

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetPortal,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "./components/sheet"

export { Skeleton } from "./components/skeleton"

export { Slider } from "./components/slider"

export { Spinner } from "./components/spinner"

export { Steps, Step } from "./components/steps"
export type { StepStatus, StepsVariant, StepsProps, StepProps } from "./components/steps"

export { StatBlock, TrendIndicator } from "./components/stat-block"
export type { StatBlockProps, StatTrend } from "./components/stat-block"

export { Switch } from "./components/switch"

export { Toaster } from "./components/sonner"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "./components/table"

export { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/tabs"

export { Textarea } from "./components/textarea"

export {
  Timeline,
  TimelineItem,
  TimelineIndicator,
  TimelineHeader,
  TimelineDate,
  TimelineTitle,
  TimelineContent,
} from "./components/timeline"
export type {
  TimelineOrientation,
  TimelineProps,
  TimelineItemProps,
  TimelineIndicatorProps,
} from "./components/timeline"

export { Toggle, toggleVariants } from "./components/toggle"

export { ToggleGroup, ToggleGroupItem } from "./components/toggle-group"

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./components/tooltip"
