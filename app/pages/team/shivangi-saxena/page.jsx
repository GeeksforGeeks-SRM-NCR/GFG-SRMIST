"use client";

import Link from "next/link";
import { Rocket, Lightbulb, Code2, Trophy, Users } from "lucide-react";
import GlassyNavbar from "../../../components/MemberNavbar";
import Squares from "../../../components/Squares";

export default function HomePage() {
  return (
    <div style={{ width: "100%", minHeight: "100vh", position: "relative" }}>
            {/* Background */}
            <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
                <Squares
                    speed={0.5}
                    squareSize={40}
                    direction='diagonal'
                    borderColor='#333'
                    hoverFillColor='#222'
                />
            </div>
      {/* Foreground content */}
      <div style={{ position: "relative", zIndex: 1 }}>
      <GlassyNavbar backLink="/pages/team" backLabel="← Back to Team" />

        <main
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "40px",
            color: "white",
            gap: 32,
            textAlign: "center",
          }}
        >
          {/* Hero */}
          <section style={{ maxWidth: 980 }}>
            <h1 style={{ fontSize: 48, marginBottom: 12 }}>
              Shivangi Saxena
            </h1>
            <p style={{ fontSize: 18, opacity: 0.9, marginBottom: 20 }}>
              This is your homepage. The previous syntax error happened because a JSX tag / closing bracket was missing.
              Everything below is a simple, working layout so you can continue building.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <Link href="#about" style={{ textDecoration: "none" }}>
                <button style={{ padding: "10px 18px", borderRadius: 8, cursor: "pointer" }}>
                  Get started
                </button>
              </Link>
              <Link href="#team" style={{ textDecoration: "none" }}>
                <button style={{ padding: "10px 18px", borderRadius: 8, cursor: "pointer", background: "rgba(255,255,255,0.06)" }}>
                  Meet the team
                </button>
              </Link>
            </div>
          </section>

          {/* Feature cards */}
          <section
            id="about"
            style={{
              display: "flex",
              gap: 18,
              flexWrap: "wrap",
              justifyContent: "center",
              width: "100%",
            }}
          >
            {[
              { Icon: Rocket, label: "Launch", desc: "Fast prototypes" },
              { Icon: Lightbulb, label: "Ideas", desc: "Bright concepts" },
              { Icon: Code2, label: "Code", desc: "Clean & modular" },
              { Icon: Trophy, label: "Impact", desc: "Ship with pride" },
              { Icon: Users, label: "Team", desc: "Collaboration" },
            ].map(({ Icon, label, desc }) => (
              <div
                key={label}
                style={{
                  minWidth: 180,
                  maxWidth: 220,
                  padding: 18,
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.03)",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.6)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <Icon size={28} />
                <strong style={{ fontSize: 16 }}>{label}</strong>
                <span style={{ fontSize: 13, opacity: 0.9 }}>{desc}</span>
              </div>
            ))}
          </section>

          {/* Footer / small note */}
          <footer style={{ opacity: 0.8, fontSize: 13 }}>
            <div>Built with Next.js • Glassy navbar above</div>
          </footer>
        </main>
      </div>
    </div>
  );
}
