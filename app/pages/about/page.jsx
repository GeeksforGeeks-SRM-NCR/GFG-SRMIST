"use client";
import Link from "next/link";
import { Rocket, Lightbulb, Code2, Trophy, Users } from "lucide-react";
import GlassyNavbar from "../../components/GlassyNavbar";
import DotGrid from "../../components/DotGrid";

export default function HomePage() {
  return (
    <div style={{ width: "100%", minHeight: "100vh", position: "relative" }}>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      >
        <DotGrid
          dotSize={3}
          gap={15}
          baseColor="#073b0d"
          activeColor="#128224"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <GlassyNavbar />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "40px",
            color: "white",
          }}
        >
          <h1
            style={{
              fontFamily: "San Francisco pro",
              fontSize: "5rem",
              marginBottom: "20px",
              background: "linear-gradient(135deg, #ffffff 0%, #46b94e 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ABOUT US
          </h1>
          <h2
            style={{
              fontFamily: "San Francisco pro",
              fontSize: "2.5rem",
              marginBottom: "30px",
              color: "#46b94e",
              textAlign: "center",
            }}
          >
            GeeksForGeeks SRMIST NCR Chapter
          </h2>

          <p
            style={{
              fontFamily: "San Francisco Pro",
              fontSize: "1.15rem",
              textAlign: "center",
              lineHeight: "1.8",
              color: "rgba(255, 255, 255, 0.92)",
              margin: 0,
              //rgba(255, 255, 255, 0.05)
              padding: "40px , 10px",
              background: "black",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            Hey there,
            <br /> Want to outshine in your career ? or desire to give shape to
            your ideas? if yes, then you are on the right page. Achieve your
            dreams with geeksforgeeks and upgrade your skillsets consistently to
            become more confident. Geeksforgeeks Students' chapter at SRM NCR is
            working on the idea to impart knowledge among the geeks in a fun and
            exciting way. It will be achieved through events, hackathons and
            webinars to enlighten the mates. We aim for the perfection and
            success of all who are connected with us through this chapter. So
            keep yourself connected with us to ace your career beyond the skies.
            Wishing you luck!!
          </p>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            marginTop: "10px",
            animation: "bounce 2s infinite",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "30px",
              height: "50px",
              border: "2px solid rgba(255, 255, 255, 0.5)",
              borderRadius: "25px",
              position: "relative",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "10px",
                background: "#46b94e",
                borderRadius: "3px",
                position: "absolute",
                top: "8px",
                left: "50%",
                transform: "translateX(-50%)",
                animation: "scroll 2s infinite",
              }}
            />
          </div>
        </div>

        {/* Mission & Vision Section */}
        <section
          style={{
            padding: "80px 40px",
            //background: "rgba(255, 255, 255, 0.02)",
            // backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: "40px",
            }}
          >
            <div
              style={{
                padding: "40px",
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "20px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-10px)";
                e.currentTarget.style.boxShadow =
                  "0 20px 40px rgba(70, 185, 78, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <Rocket
                size={48}
                color="#46b94e"
                style={{ marginBottom: "20px" }}
              />
              <h3
                style={{
                  fontFamily: "San Francisco",
                  fontSize: "2rem",
                  marginBottom: "20px",
                  color: "#46b94e",
                }}
              >
                Our Mission
              </h3>
              <p
                style={{
                  fontFamily: "San Francisco",
                  fontSize: "1.1rem",
                  lineHeight: "1.8",
                  color: "rgba(255, 255, 255, 0.8)",
                }}
              >
                To empower students with industry-relevant skills, foster
                innovation, and build a strong community of tech enthusiasts who
                can solve real-world problems through coding and collaborative
                learning.
              </p>
            </div>

            <div
              style={{
                padding: "40px",
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "20px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-10px)";
                e.currentTarget.style.boxShadow =
                  "0 20px 40px rgba(70, 185, 78, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <Lightbulb
                size={48}
                color="#46b94e"
                style={{ marginBottom: "20px" }}
              />
              <h3
                style={{
                  fontFamily: "San Francisco",
                  fontSize: "2rem",
                  marginBottom: "20px",
                  color: "#46b94e",
                }}
              >
                Our Vision
              </h3>
              <p
                style={{
                  fontFamily: "San Francisco",
                  fontSize: "1.1rem",
                  lineHeight: "1.8",
                  color: "rgba(255, 255, 255, 0.8)",
                }}
              >
                To be the leading technical community that bridges the gap
                between academic learning and industry requirements, creating
                future-ready professionals who can contribute meaningfully to
                the tech ecosystem.
              </p>
            </div>
          </div>
        </section>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    padding: '40px',
                    color: 'white'
                }}>
                    <h1 style={{
                        fontSize: '4rem',
                        fontWeight: 'bold',
                        marginBottom: '20px',
                        textAlign: 'center'
                    }}>
                        ABOUT US
                    </h1>
                </div>
        {/* What We Do Section */}
        <section
          style={{
            padding: "80px 40px",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
            <h2
              style={{
                fontFamily: "San Francisco",
                fontSize: "3rem",
                textAlign: "center",
                marginBottom: "60px",
                color: "#46b94e",
              }}
            >
              What We Do
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "30px",
              }}
            >
              {[
                {
                  icon: <Code2 size={40} />,
                  title: "Coding Workshops",
                  description:
                    "Regular hands-on workshops on latest technologies, frameworks, and programming languages.",
                },
                {
                  icon: <Trophy size={40} />,
                  title: "Competitive Programming",
                  description:
                    "Organize coding contests and hackathons to sharpen problem-solving skills.",
                },
                {
                  icon: <Users size={40} />,
                  title: "Peer Learning",
                  description:
                    "Foster a collaborative environment where students learn from each other.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  style={{
                    padding: "35px",
                    background: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "15px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(70, 185, 78, 0.1)";
                    e.currentTarget.style.borderColor = "#46b94e";
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.05)";
                    e.currentTarget.style.borderColor =
                      "rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <div
                    style={{
                      color: "#46b94e",
                      marginBottom: "20px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </div>
                  <h4
                    style={{
                      fontSize: "1.4rem",
                      marginBottom: "15px",
                    }}
                  >
                    {item.title}
                  </h4>
                  <p
                    style={{
                      fontSize: "1rem",
                      lineHeight: "1.6",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section
          style={{
            padding: "80px 40px",
            //background: "rgba(255, 255, 255, 0.02)",
            //backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "40px",
              textAlign: "center",
            }}
          >
            {[
              { number: "500+", label: "Active Members" },
              { number: "50+", label: "Events Conducted" },
              { number: "100+", label: "Workshops" },
              { number: "20+", label: "Hackathons" },
            ].map((stat, index) => (
              <div
                key={index}
                style={{
                  padding: "30px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <div
                  style={{
                    fontSize: "3.5rem",
                    color: "#46b94e",
                    marginBottom: "10px",
                  }}
                >
                  {stat.number}
                </div>
                <div
                  style={{
                    fontSize: "1.2rem",
                    color: "rgba(255, 255, 255, 0.8)",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Join Us Section */}
        <section
          style={{
            padding: "80px 40px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            <h2
              style={{
                fontFamily: "San Francisco",
                fontSize: "3rem",
                marginBottom: "30px",
                color: "#46b94e",
              }}
            >
              Join Our Community
            </h2>
            <p
              style={{
                fontFamily: "San Francisco",
                fontSize: "1.2rem",
                lineHeight: "1.8",
                marginBottom: "40px",
                color: "rgba(255, 255, 255, 0.8)",
              }}
            >
              Be part of a vibrant community where innovation meets
              collaboration. Whether you're a beginner or an expert, there's a
              place for you here.
            </p>
          </div>
        </section>

        {/* Add CSS animations */}
        <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% {
                        transform: translateY(0);
                    }
                    40% {
                        transform: translateY(-10px);
                    }
                    60% {
                        transform: translateY(-5px);
                    }
                }

                @keyframes scroll {
                    0% {
                        opacity: 0;
                        transform: translateX(-50%) translateY(0);
                    }
                    40% {
                        opacity: 1;
                    }
                    80% {
                        opacity: 0;
                        transform: translateX(-50%) translateY(20px);
                    }
                    100% {
                        opacity: 0;
                    }
                }
            `}</style>
      </div>
    </div>
  );
}