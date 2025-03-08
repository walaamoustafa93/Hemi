import React, { useId, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "react-hot-toast";
import { SelectPolling, SelectType } from "@/types";
import { ConnectionSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import WebAPIForm from "@/components/ConnectionsType/WebAPI";
import { Label } from "@radix-ui/react-dropdown-menu";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import DbForm from "@/components/ConnectionsType/DB";

interface AddConnectionsProps {
  selectType: SelectType[];
  selectPolling: SelectPolling[];
  ProjectId: string;
  onClose: () => void;
  fetchDevices: () => void;
}

export default function AddConnections({
  selectType,
  selectPolling,
  ProjectId,
  onClose,
  fetchDevices,
}: AddConnectionsProps) {
  const id = useId();
  const [isTestConnectionSuccessful, setIsTestConnectionSuccessful] = useState(false);
  const form = useForm<z.infer<typeof ConnectionSchema>>({
    resolver: zodResolver(ConnectionSchema),
    defaultValues: {
      name: "",
      type: "",
      description: "",
      lastConnected: "",
      polling: 0,
      enabled: false,
      property: {
        method: "",
        format: "",
        address: "",
        ip: "",
        databaseType: "",
        port: 0,
        host: 0,
        username: "",
        password: "",
        DSN: "",
        slot: 0,
        rack: 0,
      },
    },
  });
  const isEnabled = form.watch("enabled");
  const selectedType = form.watch("type");

  async function onSubmit(values: z.infer<typeof ConnectionSchema>) {
    console.log(values);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/devices/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            projectId: ProjectId,
            ...values,
            property: values.property,
          }),
        }
      );

      if (!response.ok) {
        // const errorData = await response.json();
        // toast.error(errorData.message || "An error occurred.");
      }
      toast.success("Device has been successfully added.");
      form.reset();
      setIsTestConnectionSuccessful(false); 
      onClose();
      fetchDevices();
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`Failed to added Device: ${err.message}`);
      } else {
        toast.error("Failed to added Device due to an unknown error.");
      }
    }
  }
  async function testConnection(values: z.infer<typeof ConnectionSchema>) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/devices/testconnection`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectId: ProjectId,
            ...values,
            property: values.property,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Connection test failed.");
        setIsTestConnectionSuccessful(false);
        return;
      }

      const result = await response.json();
      toast.success("Connection test successful!");
      setIsTestConnectionSuccessful(true);
      console.log("Connection test result:", result);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`Connection test failed: ${err.message}`);
      } else {
        toast.error("Connection test failed due to an unknown error.");
      }
      setIsTestConnectionSuccessful(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-4 my-3">
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

          <div className="flex flex-col items-center gap-4 ml-auto">
            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <div>
                  <div className="relative inline-grid h-10 grid-cols-[1fr_1fr] items-center text-sm font-medium">
                    <Switch
                      id="enabled-switch"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="peer absolute inset-0 h-[inherit] w-auto rounded-lg data-[state=unchecked]:bg-gray-500 data-[state=checked]:bg-[rgba(72,195,137,1)] [&_span]:z-10 [&_span]:h-full [&_span]:w-1/2 [&_span]:rounded-md [&_span]:transition-transform [&_span]:duration-300 [&_span]:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] data-[state=checked]:[&_span]:translate-x-full rtl:data-[state=checked]:[&_span]:-translate-x-full"
                    />
                    <span className="min-w-78flex pointer-events-none relative ms-0.5 items-center justify-center px-2 text-center transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-full rtl:peer-data-[state=unchecked]:-translate-x-full">
                      <span className="text-[10px] font-medium uppercase text-white">
                        Disabled
                      </span>
                    </span>
                    <span className="min-w-78flex pointer-events-none relative me-0.5 items-center justify-center px-2 text-center transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] peer-data-[state=unchecked]:invisible peer-data-[state=checked]:-translate-x-full peer-data-[state=checked]:text-background rtl:peer-data-[state=checked]:translate-x-full">
                      <span className="text-[10px] font-medium uppercase">
                        Enabled
                      </span>
                    </span>
                  </div>
                  <Label className="sr-only">Enabled</Label>
                </div>
              )}
            />
          </div>
        </div>

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
        <div className="flex gap-4 w-full ">
          <div className="group relative w-full mt-2">
            <FormLabel
              htmlFor={id}
              className="absolute start-1 top-0 z-10 block -translate-y-1/2 bg-background px-2 text-xs font-medium text-foreground group-has-[select:disabled]:opacity-50"
            >
              Type
            </FormLabel>

            {/* Select Field */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="mb-2 flex-1">
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectType.map((item) => (
                          <SelectItem key={item.id} value={item.value}>
                            {item.title}
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
          <div className="group relative w-full  mt-2">
            <FormLabel
              htmlFor={id}
              className="absolute start-1 top-0 z-10 block -translate-y-1/2 bg-background px-2 text-xs font-medium text-foreground group-has-[select:disabled]:opacity-50"
            >
              Polling
            </FormLabel>{" "}
            <FormField
              control={form.control}
              name="polling"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Select
                      value={String(field.value)}
                      onValueChange={(val) => field.onChange(Number(val))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Polling">
                          {selectPolling.find(
                            (item) => item.value === field.value
                          )?.title || "Select Polling"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {selectPolling.map((item) => (
                            <SelectItem
                              value={String(item.value)}
                              key={item.id}
                            >
                              {item.title}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {selectedType === "WebAPI" && <WebAPIForm form={form} />}
        {/* {selectedType === "S7" && <S7Form form={form} />} */}
        {selectedType === "Database" && <DbForm form={form} />}
        <Button
          type="submit"
          variant="edit"
          className="w-[100%]"
          onClick={form.handleSubmit((values) => testConnection(values))}
        >
          Test Connections
        </Button>
        <SheetFooter>
          <SheetClose asChild>
            <Button
              type="button"
              variant="destructive"
              size="custom"
              className="mr-auto"
            >
              Cancel
            </Button>
          </SheetClose>
          <Button
            type="submit"
            variant="Accepted"
            size="custom"
            className="ml-auto"
            disabled={isEnabled && !isTestConnectionSuccessful}
          >
            Save
          </Button>
        </SheetFooter>
      </form>
    </Form>
  );
}
