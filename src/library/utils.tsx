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

import { fallbackOverlay, hidden, inlineHost, muted, overlay } from "./styles";
import type {
  Config,
  ElementProps,
  FallbackProps,
  MaskProps,
} from "./types";

export function supportsAnchorPositioning(): boolean {
  return typeof CSS !== "undefined" && CSS.supports("anchor-name: --x");
}

const VOID_ELEMENTS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

function isVoidElement(element: ReactElement): boolean {
  return typeof element.type === "string" && VOID_ELEMENTS.has(element.type);
}

export function applyMask(
  child: ReactNode,
  anchor: string,
  levels: number,
  config: Config,
): ReactNode {
  if (levels > 1 && isValidElement(child)) {
    const element = child as ReactElement<ElementProps>;
    const own = Children.toArray(element.props.children);
    if (own.length > 0) {
      const inner: ReactNode[] = own.map(
        (nested: ReactNode, index: number): ReactNode =>
          applyMask(nested, `${anchor}-${index}`, levels - 1, config),
      );
      return cloneElement(element, { key: anchor }, inner);
    }
  }

  return <Mask key={anchor} child={child} anchor={anchor} config={config} />;
}

function Mask({ child, anchor, config }: MaskProps): ReactElement {
  const [radius, setRadius] = useState<string | null>(null);

  const measure = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    const computed = window.getComputedStyle(node).borderRadius;
    if (computed && computed !== "0px") setRadius(computed);
  }, []);

  if (!supportsAnchorPositioning()) {
    return (
      <FallbackMask
        child={child}
        measure={measure}
        radius={radius}
        config={config}
      />
    );
  }

  const anchored: ReactNode = isValidElement(child) ? (
    cloneAnchor(child as ReactElement<ElementProps>, anchor, measure)
  ) : (
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
    config.palette,
    radius ?? config.radius,
    config.duration,
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

function FallbackMask({
  child,
  measure,
  radius,
  config,
}: FallbackProps): ReactElement {
  const shimmerClass = fallbackOverlay(
    config.palette,
    radius ?? config.radius,
    config.duration,
  );
  const shimmer = <span aria-hidden="true" className={shimmerClass} />;

  if (isValidElement(child) && !isVoidElement(child)) {
    const element = child as ReactElement<ElementProps>;
    return cloneElement(
      element,
      {
        ref: measure,
        "aria-hidden": true,
        tabIndex: -1,
        className: element.props.className,
        style: { ...element.props.style, position: "relative" },
      } as Partial<ElementProps> & { ref: Ref<HTMLElement> },
      <span key="__bw-content" className={hidden}>
        {element.props.children}
      </span>,
      shimmer,
    );
  }

  const descendant = isValidElement(child)
    ? cloneElement(child as ReactElement<ElementProps>, {
        ref: measure,
      } as Partial<ElementProps> & { ref: Ref<HTMLElement> })
    : child;

  return (
    <span aria-hidden="true" className={inlineHost}>
      <span className={hidden}>{descendant}</span>
      {shimmer}
    </span>
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
