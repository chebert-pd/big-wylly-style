"use client"

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@wyllo/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const AVATAR_ROWS: PropRow[] = [
  { prop: "className", type: "string", description: "Additional CSS classes. Use to control size (e.g. size-10, size-12)." },
  { prop: "children", type: "ReactNode", description: "AvatarImage and AvatarFallback sub-components." },
]

const AVATAR_IMAGE_ROWS: PropRow[] = [
  { prop: "src", type: "string", required: true, description: "Image URL for the avatar." },
  { prop: "alt", type: "string", required: true, description: "Accessible alt text for the image." },
  { prop: "className", type: "string", description: "Additional CSS classes." },
]

const AVATAR_FALLBACK_ROWS: PropRow[] = [
  { prop: "children", type: "ReactNode", description: "Fallback content, typically initials." },
  { prop: "className", type: "string", description: "Additional CSS classes." },
]

export default function AvatarGalleryPage() {
  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="h1">Avatar</h1>
        <p className="p text-muted-foreground">
          A circular image element with a text fallback. Use avatars to represent
          users, teams, or entities throughout the interface.
        </p>
      </div>

      {/* Examples */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="h2">Examples</h2>
          <p className="p text-muted-foreground">
            Common avatar patterns including images, fallback initials, sizes,
            and grouped layouts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* With image */}
          <Card level={1}>
            <CardHeader>
              <CardTitle className="label-md">With Image</CardTitle>
              <CardDescription>Displays a user photo when the src loads successfully.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage src="https://github.com/vercel.png" alt="@vercel" />
                <AvatarFallback>V</AvatarFallback>
              </Avatar>
            </CardContent>
          </Card>

          {/* With fallback initials */}
          <Card level={1}>
            <CardHeader>
              <CardTitle className="label-md">Fallback Initials</CardTitle>
              <CardDescription>Renders initials when no image is provided or the image fails to load.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>WH</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
            </CardContent>
          </Card>

          {/* Different sizes */}
          <Card level={1}>
            <CardHeader>
              <CardTitle className="label-md">Sizes</CardTitle>
              <CardDescription>Control size via className. Default is size-8.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-end gap-3">
              <Avatar className="size-6">
                <AvatarFallback className="text-[10px]">S</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>M</AvatarFallback>
              </Avatar>
              <Avatar className="size-10">
                <AvatarFallback>L</AvatarFallback>
              </Avatar>
              <Avatar className="size-14">
                <AvatarFallback>XL</AvatarFallback>
              </Avatar>
            </CardContent>
          </Card>

          {/* Avatar group */}
          <Card level={1}>
            <CardHeader>
              <CardTitle className="label-md">Avatar Group</CardTitle>
              <CardDescription>Stack avatars with negative margin for a grouped look.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex -space-x-2">
                <Avatar className="border-2 border-background">
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <Avatar className="border-2 border-background">
                  <AvatarFallback>B</AvatarFallback>
                </Avatar>
                <Avatar className="border-2 border-background">
                  <AvatarFallback>C</AvatarFallback>
                </Avatar>
                <Avatar className="border-2 border-background">
                  <AvatarFallback className="text-[10px]">+3</AvatarFallback>
                </Avatar>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* API Reference */}
      <section className="space-y-6">
        <h2 className="h2">API Reference</h2>
        <PropTable title="Avatar" rows={AVATAR_ROWS} />
        <PropTable title="AvatarImage" rows={AVATAR_IMAGE_ROWS} />
        <PropTable title="AvatarFallback" rows={AVATAR_FALLBACK_ROWS} />
      </section>
    </div>
  )
}
