import { css } from "@emotion/css";

const tokens = {
  spacing: { xs: "4px", s: "8px", m: "16px", l: "24px", xl: "32px" },
  radius: { s: "8px", m: "12px", l: "16px", pill: "999px" },
  colour: {
    background: "#f6f4ff",
    surface: "#ffffff",
    text: "#1f1740",
    muted: "#5b5577",
    accent: "#3c1b72",
    accentSoft: "#edeafd",
    border: "#e2dcf2",
  },
  shadow: {
    card: "0 1px 0 rgba(15,8,48,0.04), 0 6px 16px -10px rgba(15,8,48,0.2)",
  },
} as const;

export const page = css`
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  max-width: 960px;
  margin: 0 auto;
  padding: ${tokens.spacing.xl} ${tokens.spacing.l} 96px;
  color: ${tokens.colour.text};
`;

export const header = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${tokens.spacing.l};
`;

export const brand = css`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.s};
  font-size: 20px;
`;

export const brandMark = css`
  width: 32px;
  height: 32px;
  border-radius: ${tokens.radius.s};
  background: ${tokens.colour.accent};
  color: white;
  display: grid;
  place-items: center;
  font-weight: 700;
`;

export const button = css`
  border: 1px solid ${tokens.colour.border};
  background: ${tokens.colour.accent};
  color: white;
  padding: 10px 18px;
  border-radius: ${tokens.radius.pill};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.12s ease;

  &:hover {
    background: #2c1356;
  }

  &:disabled {
    background: ${tokens.colour.muted};
    cursor: not-allowed;
  }
`;

export const hero = css`
  padding: ${tokens.spacing.xl};
  background: ${tokens.colour.surface};
  border-radius: ${tokens.radius.l};
  margin-bottom: ${tokens.spacing.xl};
  box-shadow: ${tokens.shadow.card};
`;

export const heroTitle = css`
  font-size: 28px;
  margin: 0 0 ${tokens.spacing.s};
  line-height: 1.2;
`;

export const heroLead = css`
  color: ${tokens.colour.muted};
  margin: 0;
  max-width: 580px;
`;

export const grid = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: ${tokens.spacing.m};
`;

export const card = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${tokens.spacing.s};
  padding: ${tokens.spacing.l};
  background: ${tokens.colour.surface};
  border-radius: ${tokens.radius.m};
  box-shadow: ${tokens.shadow.card};
`;

export const avatar = css`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  background: ${tokens.colour.accentSoft};
`;

export const name = css`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
`;

export const meta = css`
  margin: 0;
  font-size: 13px;
  color: ${tokens.colour.muted};
`;

export const bio = css`
  margin: 0;
  font-size: 14px;
  color: ${tokens.colour.text};
  text-align: center;
  line-height: 1.5;
`;

export const sectionTitle = css`
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: ${tokens.colour.muted};
  margin: ${tokens.spacing.l} 0 ${tokens.spacing.s};
`;

export const palette = {
  bone: "#f2f2f2",
  highlight: "#e1e1e1",
} as const;
