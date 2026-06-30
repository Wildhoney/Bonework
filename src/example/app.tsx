import { useState } from "react";

import { ColourMode, Skeleton } from "@wildhoney/skeleton";

const layouts = {
  card: [
    { width: 320, height: 24, marginBottom: 12 },
    { width: 280, height: 16, marginBottom: 8 },
    { width: 240, height: 16 },
  ],
  avatar: [
    {
      width: 64,
      height: 64,
      borderRadius: 32,
      marginRight: 16,
    },
    {
      flexDirection: "column" as const,
      children: [
        { width: 180, height: 18, marginBottom: 8 },
        { width: 120, height: 14 },
      ],
    },
  ],
};

export function App() {
  const [mode, setMode] = useState<ColourMode>(ColourMode.Purple);

  return (
    <main
      style={{
        fontFamily: "system-ui, sans-serif",
        maxWidth: 720,
        margin: "48px auto",
        padding: "0 24px",
        color: "#1f1740",
      }}
    >
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ margin: 0 }}>Skeleton</h1>
        <p style={{ color: "#5b5577", marginTop: 8 }}>
          Thin, colour-aware skeleton loader for React Native.
        </p>
      </header>

      <section style={{ marginBottom: 24 }}>
        <label style={{ marginRight: 16 }}>
          <input
            type="radio"
            name="mode"
            value={ColourMode.Purple}
            checked={mode === ColourMode.Purple}
            onChange={() => setMode(ColourMode.Purple)}
          />{" "}
          Purple
        </label>
        <label>
          <input
            type="radio"
            name="mode"
            value={ColourMode.Grey}
            checked={mode === ColourMode.Grey}
            onChange={() => setMode(ColourMode.Grey)}
          />{" "}
          Grey
        </label>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 14, textTransform: "uppercase" }}>Card</h2>
        <div
          style={{
            padding: 16,
            border: "1px solid #e7e1f5",
            borderRadius: 12,
          }}
        >
          <Skeleton layout={layouts.card} colourMode={mode} />
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: 14, textTransform: "uppercase" }}>
          Avatar + lines
        </h2>
        <div
          style={{
            padding: 16,
            border: "1px solid #e7e1f5",
            borderRadius: 12,
          }}
        >
          <Skeleton layout={layouts.avatar} colourMode={mode} />
        </div>
      </section>
    </main>
  );
}
