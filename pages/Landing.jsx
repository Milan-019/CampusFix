import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h2 style={styles.logo}>CampusFix</h2>
        <button
          style={styles.navBtn}
          onClick={() => navigate("/auth")}
        >
          Login / Register
        </button>
      </div>

      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.title}>
          Fix Campus Issues <span style={styles.highlight}>Smarter</span>
        </h1>

        <p style={styles.subtitle}>
          An AI-Powered Smart Issue Tracking System designed to help students
          and administrators report, track, and resolve campus problems
          efficiently.
        </p>

        <button
          style={styles.cta}
          onClick={() => navigate("/auth")}
        >
          Get Started →
        </button>
      </div>

      {/* Features */}
      <div style={styles.features}>
        <div style={styles.card}>
          <h3>📢 Easy Reporting</h3>
          <p>Report campus issues in seconds with a simple interface.</p>
        </div>

        <div style={styles.card}>
          <h3>📊 Real-Time Tracking</h3>
          <p>Track complaint status and resolution progress live.</p>
        </div>

        <div style={styles.card}>
          <h3>🤖 AI Assistance</h3>
          <p>Gemini AI helps refine complaints and provide smart insights.</p>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <p>© 2026 CampusFix · Built for smarter campuses</p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
    fontFamily: "Segoe UI, sans-serif",
    display: "flex",
    flexDirection: "column"
  },

  navbar: {
    padding: "20px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  logo: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#1e3a8a"
  },

  navBtn: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px"
  },

  hero: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "0 20px"
  },

  title: {
    fontSize: "3.2rem",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "15px"
  },

  highlight: {
    color: "#2563eb"
  },

  subtitle: {
    maxWidth: "700px",
    fontSize: "1.1rem",
    color: "#475569",
    marginBottom: "30px",
    lineHeight: "1.6"
  },

  cta: {
    padding: "14px 28px",
    fontSize: "16px",
    borderRadius: "10px",
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(37,99,235,0.3)"
  },

  features: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    padding: "40px 60px"
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "14px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    textAlign: "center"
  },

  footer: {
    textAlign: "center",
    padding: "15px",
    color: "#64748b",
    fontSize: "14px"
  }
};
