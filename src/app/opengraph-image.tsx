import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Mindmorph Edubridge — Reshaping Minds. Connecting Dreams.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0C447C 0%, #185FA5 60%, #378ADD 100%)",
          padding: "72px",
          color: "#fff",
          fontFamily: "system-ui, sans-serif"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#fff",
              color: "#0C447C",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 800
            }}
          >
            M
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 22, fontWeight: 700 }}>Mindmorph Edubridge</div>
            <div style={{ fontSize: 16, color: "#E6F1FB", letterSpacing: 2, textTransform: "uppercase" }}>
              Reshaping Minds. Connecting Dreams.
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05, maxWidth: 920 }}>
            Your path to a global education,
            <br /> from West Africa.
          </div>
          <div style={{ marginTop: 24, fontSize: 26, color: "#E6F1FB", maxWidth: 920 }}>
            UK · Canada · USA · Australia · Germany · Türkiye · Malaysia
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 18, color: "#E6F1FB" }}>
          <div>mindmorphedubridge.com</div>
          <div>Book your free consultation →</div>
        </div>
      </div>
    ),
    size
  );
}
