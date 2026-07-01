import {
  Children,
  Fragment,
  cloneElement,
  isValidElement,
  useEffect,
  useState,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";

import { anchorName, cx, muted, overlay } from "./styles";
import type { Config, ElementProps, MaskProps } from "./types";

export function supportsAnchorPositioning(): boolean {
  return typeof CSS !== "undefined" && CSS.supports("anchor-name: --x");
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
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [radius, setRadius] = useState<string | null>(null);
  const [lines, setLines] = useState<number>(1);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const supported = supportsAnchorPositioning();

  useEffect(() => {
    if (!node) return;
    const computed = window.getComputedStyle(node).borderRadius;
    if (computed && computed !== "0px") setRadius(computed);

    const isTextLeaf =
      node.childNodes.length > 0 &&
      Array.from(node.childNodes).every((n) => n.nodeType === Node.TEXT_NODE);
    if (!isTextLeaf) return;

    const measureLines = (): void => {
      const range = document.createRange();
      range.selectNodeContents(node);
      const tops: number[] = [];
      for (const rect of range.getClientRects()) {
        const tolerance = rect.height / 2;
        if (!tops.some((t) => Math.abs(t - rect.top) < tolerance)) {
          tops.push(rect.top);
        }
      }
      setLines(Math.max(1, tops.length));
    };
    measureLines();

    const observer = new ResizeObserver(measureLines);
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);

  useEffect(() => {
    if (supported || !node) return;
    const measure = (): void => setRect(node.getBoundingClientRect());
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    window.addEventListener("scroll", measure, {
      passive: true,
      capture: true,
    });
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
    };
  }, [supported, node]);

  const anchorClass = supported ? anchorName(anchor) : "";

  const anchored: ReactNode = isValidElement(child) ? (
    cloneAnchor(child as ReactElement<ElementProps>, anchorClass, setNode)
  ) : (
    <span ref={setNode} aria-hidden="true" className={cx(muted, anchorClass)}>
      {child}
    </span>
  );

  const overlayClass = overlay(
    config.palette,
    radius ?? config.radius,
    config.duration,
    supported ? anchor : null,
    lines,
  );

  const overlayStyle =
    !supported && rect
      ? {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        }
      : undefined;

  return (
    <Fragment>
      {anchored}
      <span aria-hidden="true" className={overlayClass} style={overlayStyle} />
    </Fragment>
  );
}

function cloneAnchor(
  element: ReactElement<ElementProps>,
  anchorClass: string,
  ref: Ref<HTMLElement>,
): ReactElement {
  return cloneElement(element, {
    ref,
    "aria-hidden": true,
    tabIndex: -1,
    className: cx(element.props.className, muted, anchorClass),
  } as Partial<ElementProps> & { ref: Ref<HTMLElement> });
}
