import { ImageResponse } from "next/og";

export const alt = "Bradley Charles: software engineer, cybersecurity analyst, artist";
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
          justifyContent: "center",
          padding: 80,
          background: "#0b0b15",
          color: "#e9e9f2",
        }}
      >
        <div style={{ fontSize: 28, color: "#b4c8ff", letterSpacing: 4 }}>FULL-STACK PORTFOLIO</div>
        <div style={{ fontSize: 96, fontWeight: 700, marginTop: 16 }}>Bradley Charles</div>
        <div style={{ fontSize: 36, color: "#b4c8ff", marginTop: 24 }}>
          Software engineering · Cybersecurity · Art
        </div>
      </div>
    ),
    size
  );
}
