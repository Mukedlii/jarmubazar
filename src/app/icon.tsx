import { ImageResponse } from "next/og";

export const runtime = "edge";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 64,
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 18,
          background: "#0B1220",
          border: "2px solid rgba(37,99,235,0.85)",
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 999,
            background: "linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)",
          }}
        />
      </div>
    ),
    { width: 64, height: 64 }
  );
}
