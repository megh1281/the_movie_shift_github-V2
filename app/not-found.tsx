import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f4f1ea",
        color: "#191817",
        fontFamily: "var(--font-mono)",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h2 style={{ fontSize: "32px", marginBottom: "12px", fontFamily: "var(--font-sans)" }}>
        [ 404 — FRAME NOT FOUND ]
      </h2>
      <p style={{ color: "#5e594f", marginBottom: "24px", maxWidth: "480px" }}>
        The requested cinema frame or chapter could not be located in the catalog archives.
      </p>
      <Link
        href="/"
        style={{
          padding: "10px 18px",
          border: "1px solid #191817",
          color: "#191817",
          textDecoration: "none",
          fontSize: "11px",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        Return to Prologue
      </Link>
    </div>
  );
}
