"use client";
import { Textarea } from "@/components/ui/textarea";

import React, { useId, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { DialogClose, DialogFooter } from "../../ui/dialog";
import { Label } from "../../ui/label";
import { ViewSchema } from "@/schemas";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddProjectButton from "@/components/motion/AddProject";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const GridOptions = [
  { id: 1, value: "Baseline", label: "Baseline Grid" },
  { id: 2, value: "Column", label: "Column Grid" },
  { id: 3, value: "Modular", label: "Modular Grid" },
  { id: 4, value: "Manuscript", label: "Manuscript Grid" },
  { id: 5, value: "Pixel", label: "Pixel Grid" },
  { id: 6, value: "Hierarchical", label: "Hierarchical Grid" },
];

export default function AddViews({ projectId }: { projectId: number | null }) {
  const id = useId();

  const router = useRouter();
  const [isDialogOpen, setDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof ViewSchema>>({
    resolver: zodResolver(ViewSchema),
    defaultValues: {
      name: "",
      description: "",
      width: 0,
      height: 0,
      backgroundColor: "",
      gridType: "",
    },
  });

  async function onSubmit(values: z.infer<typeof ViewSchema>) {
    const parsedValues = {
      ...values,
      width: values.width ? Number(values.width) : undefined,
      height: values.height ? Number(values.height) : undefined,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/views/${projectId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(parsedValues),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error === "conflict_error") {
          toast.error(
            errorData.message ||
              "A view with this name already exists for the user."
          );
        } else {
          toast.error(errorData.message || "An error occurred.");
        }
      }

      // Success toast
      toast.success("Your view has been added successfully.");

      form.reset();
      setDialogOpen(false);
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`Failed to added view: ${err.message}`);
      } else {
        toast.error("Failed to added view due to an unknown error.");
      }
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger
        asChild
        className="h-10 flex-1 rounded-xl md:min-h-min flex items-center justify-center"
      >
        <div className="flex flex-1 flex-col ">
          <AddProjectButton className="w-full h-7 flex items-center justify-between px-3">
            <span className="text-sm ml-1">Add New View</span>
            <Plus size={20} />
          </AddProjectButton>
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add View</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="group relative">
                      <FormLabel
                        htmlFor={id}
                        className="origin-start absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm text-muted-foreground/70 transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-foreground"
                      >
                        <span className="inline-flex bg-background px-2">
                          Name
                        </span>
                      </FormLabel>

                      <Input id={id} type="name" placeholder="" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="group relative w-full">
              <FormLabel
                htmlFor={id}
                className="absolute start-1 top-0 z-10 block -translate-y-1/2 bg-background px-2 text-xs font-medium text-foreground group-has-[select:disabled]:opacity-50"
              >
                Grid Type
              </FormLabel>{" "}
              <FormField
                control={form.control}
                name="gridType"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select grid type" />
                        </SelectTrigger>
                        <SelectContent>
                          {GridOptions.map((item) => (
                            <SelectItem key={item.id} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="width"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="group relative">
                      <FormLabel
                        htmlFor={id}
                        className="origin-start absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm text-muted-foreground/70 transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-foreground"
                      >
                        <span className="inline-flex bg-background px-2">
                          Width
                        </span>
                      </FormLabel>

                      <Input id={id} type="number" placeholder="" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="group relative">
                      <FormLabel
                        htmlFor={id}
                        className="origin-start absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm text-muted-foreground/70 transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-foreground"
                      >
                        <span className="inline-flex bg-background px-2">
                          Height
                        </span>
                      </FormLabel>

                      <Input id={id} type="number" placeholder="" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="group relative">
                      <FormLabel
                        htmlFor={id}
                        className="origin-start absolute top-0 block translate-y-2 cursor-text px-1 text-sm text-muted-foreground/70 transition-all group-focus-within:pointer-events-none group-focus-within:-translate-y-1/2 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-foreground has-[+textarea:not(:placeholder-shown)]:pointer-events-none has-[+textarea:not(:placeholder-shown)]:-translate-y-1/2 has-[+textarea:not(:placeholder-shown)]:cursor-default has-[+textarea:not(:placeholder-shown)]:text-xs has-[+textarea:not(:placeholder-shown)]:font-medium has-[+textarea:not(:placeholder-shown)]:text-foreground"
                      >
                        <span className="inline-flex bg-background px-2">
                          Description
                        </span>
                      </FormLabel>
                      <Textarea id={id} {...field} placeholder="" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="backgroundColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background Color</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2 ">
                      <Label
                        htmlFor="backgroundColor"
                        className="text-sm text-gray-400"
                      >
                        Choose background color
                      </Label>
                      <Input
                        id="backgroundColor"
                        type="color"
                        {...field}
                        className="w-12 h-8 p-0 border-none"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="col-span-2 flex justify-between">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant={"destructive"}
                  size={"custom"}
                  className="mr-auto"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                variant={"Accepted"}
                size={"custom"}
                className="ml-auto"
              >
                Add
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
