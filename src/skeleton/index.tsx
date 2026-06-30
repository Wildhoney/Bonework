import ReanimatedSkeleton from "react-native-reanimated-skeleton";
import { type ReactElement, useMemo } from "react";

import { palettes } from "./palettes";
import styles from "./styles";
import { ColourMode, type Props } from "./types";

export function Skeleton({
  layout,
  colourMode = ColourMode.Purple,
  palette,
  animationType,
}: Props): ReactElement {
  const colours = useMemo(
    () => palette ?? palettes[colourMode],
    [palette, colourMode],
  );

  return (
    <ReanimatedSkeleton
      layout={layout}
      isLoading
      boneColor={colours.bone}
      highlightColor={colours.highlight}
      containerStyle={styles.container}
      animationType={animationType}
    />
  );
}
