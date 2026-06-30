import { cx } from "@emotion/css";
import {
  Children,
  Fragment,
  cloneElement,
  isValidElement,
  useCallback,
  useState,
  type ReactElement,
  type ReactNode,
  type Ref,
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
    const own = Children.toArray(element.props.children);
    if (own.length > 0) {
      const inner: ReactNode[] = own.map(
        (nested: ReactNode, index: number): ReactNode =>
          applyMask(nested, `${anchor}-${index}`, levels - 1, options),
      );
      return cloneElement(element, { key: anchor }, inner);
    }
  }

  return <Mask key={anchor} child={child} anchor={anchor} options={options} />;
}

type MaskProps = {
  child: ReactNode;
  anchor: string;
  options: Options;
};

function Mask({ child, anchor, options }: MaskProps): ReactElement {
  const [radius, setRadius] = useState<string | null>(null);

  const measure = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    const computed = window.getComputedStyle(node).borderRadius;
    if (computed && computed !== "0px") setRadius(computed);
  }, []);

  const anchored: ReactNode = isValidElement(child)
    ? cloneAnchor(child as ReactElement<ElementProps>, anchor, measure)
    : (
        <span
          ref={measure}
          aria-hidden="true"
          className={muted}
          style={{ anchorName: anchor }}
        >
          {child}
        </span>
      );

  const overlayClass = overlay(
    options.palette,
    radius ?? options.borderRadius,
    options.durationMs,
  );

  return (
    <Fragment>
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
  ref: Ref<HTMLElement>,
): ReactElement {
  return cloneElement(element, {
    ref,
    "aria-hidden": true,
    tabIndex: -1,
    className: cx(element.props.className, muted),
    style: { ...element.props.style, anchorName: anchor },
  } as Partial<ElementProps> & { ref: Ref<HTMLElement> });
}
