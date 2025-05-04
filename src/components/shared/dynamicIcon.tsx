"use client";

import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import React from "react";

interface LucideIconRendererProps {
  iconName: keyof typeof Icons; // restringe aos ícones válidos
  className?: string;
}

export function LucideIconRenderer({
  iconName,
  className,
}: LucideIconRendererProps) {
  const Icon = Icons[iconName] as LucideIcon;

  if (!Icon) {
    return <span className="text-gray-400 italic">No icon</span>;
  }

  return <Icon className={className || "w-5 h-5 text-primary"} />;
}
