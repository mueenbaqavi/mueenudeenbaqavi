import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const runtime = "edge";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? siteConfig.name;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#fbfdf9",
          color: "#10231a",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ color: "#b58a2b", fontSize: 30, fontWeight: 700 }}>Official Islamic Knowledge Platform</div>
        <div style={{ marginTop: 30, fontSize: 78, fontWeight: 800, lineHeight: 1.18 }}>{title}</div>
        <div style={{ marginTop: 36, color: "#116a45", fontSize: 32 }}>{siteConfig.domain}</div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
