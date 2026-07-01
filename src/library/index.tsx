import {
  Children,
  createContext,
  useContext,
  useId,
  useMemo,
  type ReactElement,
} from "react";

import type { BoneworkState, Props } from "./types";
import { applyMask } from "./utils";

const BoneworkContext = createContext<BoneworkState>({
  skeleton: false,
  placeholder: (actual) => actual ?? null,
});

export function useBonework(): BoneworkState {
  return useContext(BoneworkContext);
}

export function Bonework({
  children,
  skeleton = false,
  levels = 1,
  palette,
  radius = 4,
  duration = 1_400,
}: Props): ReactElement {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");

  const value = useMemo<BoneworkState>(
    () => ({
      skeleton,
      placeholder: <T, F>(
        actual: T | null | undefined,
        fallback: F,
      ): T | F | null =>
        actual != null ? actual : skeleton ? fallback : null,
    }),
    [skeleton],
  );

  if (!skeleton) {
    return (
      <BoneworkContext.Provider value={value}>
        {children}
      </BoneworkContext.Provider>
    );
  }

  return (
    <BoneworkContext.Provider value={value}>
      {Children.toArray(children).map((child, index) =>
        applyMask(child, `--sk-${id}-${index}`, Math.max(1, levels), {
          palette,
          radius,
          duration,
        }),
      )}
    </BoneworkContext.Provider>
  );
}
