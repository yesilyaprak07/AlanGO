import React from "react";
import { Radar } from "lucide-react-native";
import { EmptyState, EmptyStateProps } from "@/components/ui/EmptyState";
import { theme } from "@/constants/theme";

export type EmptyRadarStateProps = {
  title?: string;
  message?: string;
} & Omit<EmptyStateProps, "title" | "message" | "icon">;

export function EmptyRadarState({
  title = "Radar sinyali bekleniyor...",
  message = "Sehrinde aktif odul bulunamadi. Birazdan yeniden tara.",
  ...rest
}: EmptyRadarStateProps) {
  return <EmptyState title={title} message={message} icon={<Radar size={16} color={theme.colors.textSecondary} />} {...rest} />;
}
