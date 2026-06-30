import type { CSSProperties, ReactNode } from "react";

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface CSSProperties {
    anchorName?: string;
    positionAnchor?: string;
  }
}

export type Palette = {
  bone: string;
  highlight: string;
};

export type ElementProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export type Props = {
  children?: ReactNode;
  resolving?: boolean;
  levels?: number;
  palette: Palette;
  borderRadius?: number | string;
  durationMs?: number;
};
