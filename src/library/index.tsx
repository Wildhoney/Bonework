import { Children, useId, type ReactElement } from "react";

import type { Props } from "./types";
import { applyMask } from "./utils";

export function Bonework({
  children,
  resolving = false,
  levels = 1,
  palette,
  borderRadius = 4,
  durationMs = 1400,
}: Props): ReactElement {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");

  if (resolving) {
    return <>{children}</>;
  }

  return (
    <>
      {Children.toArray(children).map((child, index) =>
        applyMask(child, `--sk-${id}-${index}`, Math.max(1, levels), {
          palette,
          borderRadius,
          durationMs,
        }),
      )}
    </>
  );
}
