import { useState } from "react";

import { Bonework } from "bonework";

const palettes = {
  purple: { bone: "#edeafd", highlight: "#ddd7fa" },
  grey: { bone: "#f2f2f2", highlight: "#e1e1e1" },
} as const;

export function App() {
  const [resolving, setResolving] = useState(false);
  const [tone, setTone] = useState<keyof typeof palettes>("purple");

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
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>bonework</h1>
        <p style={{ color: "#5b5577", marginTop: 8 }}>
          CSS Anchor Positioning skeleton loader. Children stay mounted —
          shimmer overlays paint exactly over their bounding boxes.
        </p>
      </header>

      <section style={{ marginBottom: 24, display: "flex", gap: 24 }}>
        <label>
          <input
            type="checkbox"
            checked={resolving}
            onChange={(event) => setResolving(event.target.checked)}
          />{" "}
          resolving
        </label>
        <label>
          <input
            type="radio"
            name="tone"
            checked={tone === "purple"}
            onChange={() => setTone("purple")}
          />{" "}
          purple
        </label>
        <label>
          <input
            type="radio"
            name="tone"
            checked={tone === "grey"}
            onChange={() => setTone("grey")}
          />{" "}
          grey
        </label>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 14, textTransform: "uppercase" }}>
          Single block
        </h2>
        <Bonework resolving={resolving} palette={palettes[tone]}>
          <p>The quick brown fox jumps over the lazy dog.</p>
        </Bonework>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 14, textTransform: "uppercase" }}>
          Nested levels
        </h2>
        <Bonework resolving={resolving} palette={palettes[tone]} levels={2}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: 16,
              border: "1px solid #e7e1f5",
              borderRadius: 12,
            }}
          >
            <img
              src="https://placehold.co/64x64"
              alt=""
              width={64}
              height={64}
              style={{ borderRadius: 32 }}
            />
            <div>
              <strong>Acme Trading LLC</strong>
              <p style={{ margin: 0, color: "#5b5577" }}>Treasury</p>
            </div>
          </div>
        </Bonework>
      </section>
    </main>
  );
}
