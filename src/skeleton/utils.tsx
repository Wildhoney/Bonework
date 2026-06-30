import { cx } from "@emotion/css";
import {
  Children,
  Fragment,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

import { muted, overlay } from "./styles";
import type { ElementProps, Palette } from "./types";

type Options = {
  palette: Palette;
  borderRadius: number | string;
  durationMs: number;
};

export function applyMask(
  child: ReactNode,
  anchor: string,
  levels: number,
  options: Options,
): ReactNode {
  if (levels > 1 && isValidElement(child)) {
    const element = child as ReactElement<ElementProps>;
    const inner: ReactNode[] = Children.toArray(element.props.children).map(
      (nested: ReactNode, index: number): ReactNode =>
        applyMask(nested, `${anchor}-${index}`, levels - 1, options),
    );
    return cloneElement(element, { key: anchor }, inner);
  }

  const anchored: ReactNode = isValidElement(child) ? (
    cloneAnchor(child as ReactElement<ElementProps>, anchor)
  ) : (
    <span aria-hidden="true" className={muted} style={{ anchorName: anchor }}>
      {child}
    </span>
  );

  const overlayClass = overlay(
    options.palette,
    options.borderRadius,
    options.durationMs,
  );

  return (
    <Fragment key={anchor}>
      {anchored}
      <span
        aria-hidden="true"
        className={overlayClass}
        style={{ positionAnchor: anchor }}
      />
    </Fragment>
  );
}

function cloneAnchor(
  element: ReactElement<ElementProps>,
  anchor: string,
): ReactElement {
  return cloneElement(element, {
    "aria-hidden": true,
    tabIndex: -1,
    className: cx(element.props.className, muted),
    style: { ...element.props.style, anchorName: anchor },
  } as Partial<ElementProps>);
}
