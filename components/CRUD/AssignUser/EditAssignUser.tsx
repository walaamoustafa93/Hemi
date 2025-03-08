import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import React, { useId} from "react";
  import { DialogClose, DialogFooter } from "@/components/ui/dialog";
  import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
  import { Input } from "@/components/ui/input";
  import { Button } from "@/components/ui/button";
  import { zodResolver } from "@hookform/resolvers/zod";
  import { useForm } from "react-hook-form";
  import { z } from "zod";
  import { UserSchema } from "@/schemas";
  import { toast } from "react-hot-toast";
  import { User } from "@/types";
  interface EditUserProps {
    users: User;
    ProjectId: string;
    onClose: () => void;
    fetchUsers: () => Promise<void>;
  }
  export default function EditAssignUser({ onClose, users,ProjectId,fetchUsers }: EditUserProps) {
    const id = useId();
    
  
    const groupOptions = [
      {
        id: "367cfca8-a02e-4d2e-a476-da75a2d789b8",
        name: "admin",
        label: "admin",
      },
      {
        id: "b45c43fa-9349-4e4b-a742-f7c411e30f89",
        name: "operator",
        label: "operator",
      },
    ];
    const form = useForm<z.infer<typeof UserSchema>>({
      resolver: zodResolver(UserSchema),
      defaultValues: {
        username: users.username,
        email: users.email,
        group: users.groups?.[0]?.name || "",
      },
    });
  
    async function onSubmit(values: z.infer<typeof UserSchema>) {
        try {
          const requestBody = {
            ...values,
            userIds: [users.id], 
          };
      
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/${ProjectId}/editusers`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify(requestBody), 
            }
          );
      
          if (!response.ok) {
            throw new Error("Failed to update user");
          }
      
          toast.success("User has been edited successfully.");
          onClose();
          fetchUsers()
                } catch (err) {
          if (err instanceof Error) {
            toast.error(`Failed to edited user: ${err.message}`);
          } else {
            toast.error('Failed to edited user due to an unknown error.');
          }
        }
      }
  
    return (
      <>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Username and Name on the same line */}
            <div className="flex gap-4 w-full">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <div className="group relative">
                        <FormLabel
                          htmlFor={id}
                          className="origin-start absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm text-muted-foreground/70 transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-foreground"
                        >
                          <span className="inline-flex bg-background px-2">
                            Username
                          </span>
                        </FormLabel>
  
                        <Input
                          id={id}
                          type="username"
                          placeholder=""
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="group relative flex-1">
                {/* Overlapping Label */}
                <FormLabel
                  htmlFor={id}
                  className="absolute start-1 top-0 z-10 block -translate-y-1/2 bg-background px-2 text-xs font-medium text-foreground group-has-[select:disabled]:opacity-50"
                >
                  Group
                </FormLabel>
  
                {/* Select Field */}
                <FormField
                  control={form.control}
                  name="group"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Select onValueChange={field.onChange} {...field}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a group" />
                          </SelectTrigger>
                          <SelectContent>
                            {groupOptions.map((item) => (
                              <SelectItem key={item.id} value={item.name}>
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
            </div>
  
            {/* Email Field */}
  
            <div className="flex gap-4">
              {/* Group Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <div className="group relative">
                        <FormLabel
                          htmlFor={id}
                          className="origin-start absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm text-muted-foreground/70 transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-foreground"
                        >
                          <span className="inline-flex bg-background px-2">
                            Email
                          </span>
                        </FormLabel>
  
                        <Input id={id} type="email" placeholder="" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
  
            <DialogFooter>
              <DialogClose asChild>
                <Button size="custom" variant="destructive" className="mr-auto">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                size="custom"
                variant={"Accepted"}
                className="ml-auto"
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </>
    );
  }
  