import { ColourMode, type Palette } from "./types";

export const palettes: Record<ColourMode, Palette> = {
  [ColourMode.Purple]: { bone: "#edeafd", highlight: "#ddd7fa" },
  [ColourMode.Grey]: { bone: "#f2f2f2", highlight: "#e1e1e1" },
};
