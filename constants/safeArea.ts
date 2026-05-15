import { layout } from "@/constants/layout";

export function getTabContentBottomSpace(bottomInset: number, extra: number = 24): number {
  return layout.tabBarBaseHeight + bottomInset + extra;
}

export function getBottomCtaPadding(bottomInset: number, extra: number = 12): number {
  return bottomInset + extra;
}

export function getScreenBottomPadding(bottomInset: number, extra: number = 20): number {
  return bottomInset + extra;
}

export function isCompactHeight(height: number): boolean {
  return height < layout.compactHeight;
}

export function isNarrowWidth(width: number): boolean {
  return width < layout.narrowWidth;
}
