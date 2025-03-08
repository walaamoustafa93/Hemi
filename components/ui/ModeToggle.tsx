"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { useId, useState } from "react";
import { Switch } from "./switch";
import { Label } from "./label";

export function ModeToggle() {
  const id = useId();
  const [checked, setChecked] = useState<boolean>(true);
  const { setTheme } = useTheme();

  return (
    <>
      <div>
        <div className="relative inline-grid h-9 grid-cols-[1fr_1fr] items-center text-sm font-medium">
          <Switch
            id={id}
            checked={checked}
            onCheckedChange={(checked) => {
              setChecked(checked);
              setTheme(checked ? "light" : "dark");
            }}
            className="peer absolute inset-0 h-[inherit] w-auto data-[state=checked]:bg-input/50 data-[state=unchecked]:bg-input/50 [&_span]:h-full [&_span]:w-1/2 [&_span]:transition-transform [&_span]:duration-300 [&_span]:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] data-[state=checked]:[&_span]:translate-x-full rtl:data-[state=checked]:[&_span]:-translate-x-full"
          />
          <span className="pointer-events-none relative ms-0.5 flex min-w-8 items-center justify-center text-center peer-data-[state=checked]:text-muted-foreground/70">
            <Moon size={16} strokeWidth={2} aria-hidden="true" />
          </span>
          <span className="pointer-events-none relative me-0.5 flex min-w-8 items-center justify-center text-center peer-data-[state=unchecked]:text-muted-foreground/70">
            <Sun size={16} strokeWidth={2} aria-hidden="true" />
          </span>
        </div>
        <Label htmlFor={id} className="sr-only">
          Labeled switch
        </Label>
      </div>
    </>
  );
}
