import { ImageResponse } from "next/og";

import { APP } from "@/lib/config";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "linear-gradient(135deg, #0B1220 0%, #0A0F1C 55%, #0B1220 100%)",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "#0B1220",
              border: "2px solid rgba(37, 99, 235, 0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 16px 32px rgba(0,0,0,0.35)",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 999,
                background: "linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)",
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: -0.5 }}>{APP.name}</div>
            <div style={{ fontSize: 18, opacity: 0.78 }}>{APP.region}</div>
          </div>
        </div>

        <div>
          <div style={{ fontSize: 64, fontWeight: 900, letterSpacing: -1.2, lineHeight: 1.05 }}>
            Autóhirdetések —
            <br />
            tisztán, gyorsan.
          </div>
          <div style={{ marginTop: 18, fontSize: 24, opacity: 0.85, maxWidth: 920, lineHeight: 1.35 }}>
            Márka, típus, évjárat, km, üzemanyag, karosszéria — pár kattintás és kész.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 18, opacity: 0.75 }}>jarmubazar • {new Date().getFullYear()}</div>
          <div
            style={{
              fontSize: 18,
              padding: "10px 14px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              opacity: 0.9,
            }}
          >
            Böngészés • Hirdetés feladás
          </div>
        </div>
      </div>
    ),
    size
  );
}
