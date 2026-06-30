import { type ISkeletonProps } from "react-native-reanimated-skeleton";

export enum ColourMode {
  Purple = "purple",
  Grey = "grey",
}

export type Palette = {
  bone: string;
  highlight: string;
};

export type Props = Pick<ISkeletonProps, "layout" | "animationType"> & {
  colourMode?: ColourMode;
  palette?: Palette;
};
