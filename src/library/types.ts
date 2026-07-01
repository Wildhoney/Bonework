import type { CSSProperties, ReactNode, Ref } from "react";

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
  skeleton?: boolean;
  levels?: number;
  palette?: Palette;
  radius?: number | string;
  duration?: number;
};

export type Config = {
  palette: Palette;
  radius: number | string;
  duration: number;
};

export type MaskProps = {
  child: ReactNode;
  anchor: string;
  config: Config;
};

export type FallbackProps = {
  child: ReactNode;
  measure: Ref<HTMLElement>;
  radius: string | null;
  config: Config;
};

export type BoneworkState = {
  skeleton: boolean;
  placeholder: <T, F>(
    actual: T | null | undefined,
    fallback: F,
  ) => T | F | null;
};
