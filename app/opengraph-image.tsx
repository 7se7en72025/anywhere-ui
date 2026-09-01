import { ImageResponse } from "next/og";
import { components } from "@/lib/registry";

export const alt = "Gear5 UI — React components that work anywhere";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#737373",
            }}
          >
            Open source · MIT
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 76,
              fontWeight: 600,
              letterSpacing: -3,
              color: "#0a0a0a",
              lineHeight: 1.1,
            }}
          >
            React components that work anywhere.
          </div>

          <div style={{ display: "flex", fontSize: 30, color: "#525252" }}>
            Any device. Any network. Any language. Any ability.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 48,
            fontSize: 24,
            color: "#0a0a0a",
            borderTop: "1px solid #e5e5e5",
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex" }}>{`${components.length} components`}</div>
          <div style={{ display: "flex" }}>0 dependencies</div>
          <div style={{ display: "flex" }}>10 axes verified in CI</div>
        </div>
      </div>
    ),
    size,
  );
}
