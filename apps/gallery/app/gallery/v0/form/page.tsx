"use client"

import { useForm } from "react-hook-form"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Input,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@chebert-pd/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const FORM_ROWS: PropRow[] = [
  {
    prop: "...useFormReturn",
    type: "UseFormReturn",
    required: true,
    description:
      "All properties returned by react-hook-form's useForm hook. Spread onto Form (which is FormProvider).",
  },
]

const FORM_FIELD_ROWS: PropRow[] = [
  {
    prop: "name",
    type: "string",
    required: true,
    description:
      "The name of the field in the form. Must match a key in the form's default values.",
  },
  {
    prop: "control",
    type: "Control",
    description:
      "The control object from useForm. Optional when Form (FormProvider) wraps the tree.",
  },
  {
    prop: "render",
    type: "({ field, fieldState, formState }) => ReactElement",
    required: true,
    description:
      "Render prop that receives the field binding object. Spread field onto your input component.",
  },
]

const FORM_ITEM_ROWS: PropRow[] = [
  {
    prop: "className",
    type: "string",
    description: "Additional CSS classes for the form item wrapper div.",
  },
]

const FORM_LABEL_ROWS: PropRow[] = [
  {
    prop: "className",
    type: "string",
    description:
      "Additional CSS classes. Automatically turns red when the field has a validation error.",
  },
]

const FORM_CONTROL_ROWS: PropRow[] = [
  {
    prop: "children",
    type: "ReactElement",
    required: true,
    description:
      "A single form control element. The Slot merges aria attributes (id, aria-describedby, aria-invalid) onto the child.",
  },
]

const FORM_DESCRIPTION_ROWS: PropRow[] = [
  {
    prop: "className",
    type: "string",
    description: "Additional CSS classes for the description paragraph.",
  },
  {
    prop: "children",
    type: "ReactNode",
    description: "Helper text displayed below the form control.",
  },
]

const FORM_MESSAGE_ROWS: PropRow[] = [
  {
    prop: "className",
    type: "string",
    description: "Additional CSS classes for the error message paragraph.",
  },
  {
    prop: "children",
    type: "ReactNode",
    description:
      "Fallback content when there is no validation error. When an error exists, the error message is shown instead.",
  },
]

function BasicFormExample() {
  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
    },
  })

  function onSubmit(data: { username: string; email: string }) {
    alert(JSON.stringify(data, null, 2))
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          rules={{ required: "Username is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please enter a valid email",
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="john@example.com" {...field} />
              </FormControl>
              <FormDescription>
                We will never share your email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="primary">
          Submit
        </Button>
      </form>
    </Form>
  )
}

function ValidationExample() {
  const form = useForm({
    defaultValues: {
      name: "",
    },
    mode: "onBlur",
  })

  function onSubmit(data: { name: string }) {
    alert(JSON.stringify(data, null, 2))
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          rules={{
            required: "Name is required",
            minLength: { value: 2, message: "Must be at least 2 characters" },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} />
              </FormControl>
              <FormDescription>
                Try submitting empty or with a single character to see
                validation.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="primary">
          Validate
        </Button>
      </form>
    </Form>
  )
}

export default function FormPage() {
  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="h1">Form</h1>
        <p className="p text-muted-foreground">
          A set of form components that integrate with React Hook Form. Provides
          accessible labels, descriptions, error messages, and automatic aria
          attribute wiring for any form control.
        </p>
      </div>

      {/* Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">Basic Form</CardTitle>
            <CardDescription>
              A simple form with two fields, descriptions, and submit.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BasicFormExample />
          </CardContent>
        </Card>

        {/* Validation */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">With Validation</CardTitle>
            <CardDescription>
              Demonstrates onBlur validation with required and minLength rules.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ValidationExample />
          </CardContent>
        </Card>
      </div>

      {/* API Reference */}
      <section className="space-y-6">
        <h2 className="h2">API Reference</h2>
        <PropTable title="Form" rows={FORM_ROWS} />
        <PropTable title="FormField" rows={FORM_FIELD_ROWS} />
        <PropTable title="FormItem" rows={FORM_ITEM_ROWS} />
        <PropTable title="FormLabel" rows={FORM_LABEL_ROWS} />
        <PropTable title="FormControl" rows={FORM_CONTROL_ROWS} />
        <PropTable title="FormDescription" rows={FORM_DESCRIPTION_ROWS} />
        <PropTable title="FormMessage" rows={FORM_MESSAGE_ROWS} />
      </section>
    </div>
  )
}
