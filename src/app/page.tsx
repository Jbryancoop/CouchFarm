import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { siteConfig } from "@/lib/config";
import { CouchCard } from "@/components/CouchCard";
import { AnimateIn } from "@/components/AnimateIn";
import { CountUpStats } from "@/components/CountUpStats";

export default async function HomePage() {
  const featured = await prisma.couch.findMany({
    where: { status: "available", featured: true },
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
    take: 6,
    orderBy: { createdAt: "desc" },
  });

  const recentCouches = featured.length > 0
    ? featured
    : await prisma.couch.findMany({
        where: { status: "available" },
        include: { images: { orderBy: { order: "asc" }, take: 1 } },
        take: 6,
        orderBy: { createdAt: "desc" },
      });

  return (
    <div>
      {/* ── Hero ── */}
      <section
        style={{
          background: "linear-gradient(135deg, var(--ccf-navy) 0%, var(--ccf-navy-dark) 50%, #001F4D 100%)",
          position: "relative",
          overflow: "hidden",
          paddingBottom: "5rem",
        }}
      >
        {/* Decorative background elements */}
        <div style={{
          position: "absolute",
          top: "-20%",
          right: "-10%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(13, 213, 255, 0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute",
          bottom: "-30%",
          left: "-15%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(254, 229, 107, 0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div className="nb-container" style={{ padding: "4rem var(--ccf-gutter) 0" }}>
          {/* Social proof badge */}
          <AnimateIn variant="fade-in" duration={400}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "2.5rem" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.875rem",
                  padding: "0.5rem 1.25rem",
                  background: "rgba(254, 229, 107, 0.15)",
                  color: "var(--ccf-sunny)",
                  borderRadius: "var(--ccf-radius-pill)",
                  fontFamily: "var(--ccf-font-display)",
                  fontWeight: 600,
                  border: "1px solid rgba(254, 229, 107, 0.25)",
                }}
              >
                <span style={{ display: "flex", gap: "2px" }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="nb-star" viewBox="0 0 20 20" fill="currentColor" style={{ width: "1rem", height: "1rem" }}>
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </span>
                4.9/5 based on 400+ Reviews
              </span>
            </div>
          </AnimateIn>

          {/* Two-column grid */}
          <div className="nb-grid-2" style={{ alignItems: "center", gap: "3rem" }}>
            {/* Left — headline + CTA */}
            <div>
              <AnimateIn variant="fade-up" delay={100}>
                <h1
                  style={{
                    fontFamily: "var(--ccf-font-display)",
                    fontWeight: 900,
                    fontStyle: "italic",
                    fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
                    lineHeight: 1.05,
                    color: "var(--ccf-white)",
                    marginBottom: "1.5rem",
                  }}
                >
                  Beautiful Couches.{" "}
                  <span style={{ color: "var(--ccf-cyan)" }}>Actually Affordable.</span>
                  <br />
                  <span style={{ color: "var(--ccf-sunny)" }}>Delivered in 24hrs.</span>
                </h1>
              </AnimateIn>

              <AnimateIn variant="fade-up" delay={200}>
                <p style={{
                  fontSize: "1.125rem",
                  color: "rgba(255, 255, 255, 0.7)",
                  lineHeight: 1.7,
                  marginBottom: "2rem",
                  maxWidth: "32rem",
                  fontWeight: 400,
                }}>
                  Skip the big-box markup. We source quality couches daily and pass the savings to you.
                  No games, no pressure, no &ldquo;suggested retail price.&rdquo;
                </p>
              </AnimateIn>

              <AnimateIn variant="fade-up" delay={300}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                  <Link href="/inventory" className="nb-btn nb-btn--cyan">
                    Browse our Selection
                  </Link>
                  <Link
                    href="/inquiry"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "0.875rem 2rem",
                      fontFamily: "var(--ccf-font-display)",
                      fontWeight: 700,
                      fontSize: "0.9375rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      borderRadius: "var(--ccf-radius-pill)",
                      border: "2px solid rgba(255,255,255,0.3)",
                      color: "var(--ccf-white)",
                      textDecoration: "none",
                      transition: "all 0.3s ease",
                      background: "transparent",
                    }}
                  >
                    Tell Us What You Need
                  </Link>
                </div>
              </AnimateIn>

              <AnimateIn variant="fade-up" delay={400}>
                <p style={{
                  fontSize: "0.875rem",
                  color: "rgba(255,255,255,0.45)",
                  fontStyle: "italic",
                  marginTop: "1.5rem",
                }}>
                  No commitment. No spam. Just couches.
                </p>
              </AnimateIn>
            </div>

            {/* Right — brand image / mascot showcase */}
            <AnimateIn variant="fade-up" delay={200}>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Glowing background circle */}
                <div style={{
                  position: "absolute",
                  width: "85%",
                  aspectRatio: "1",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(13, 213, 255, 0.2) 0%, transparent 65%)",
                  animation: "pulse-glow 4s ease-in-out infinite",
                }} />
                <Image
                  src="/brand/wordmark-cow.png"
                  alt="Colorado Couch Farm — Highland Cow Mascot"
                  width={500}
                  height={500}
                  style={{
                    width: "100%",
                    maxWidth: "420px",
                    height: "auto",
                    position: "relative",
                    zIndex: 1,
                    filter: "drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3))",
                    animation: "float 6s ease-in-out infinite",
                  }}
                  priority
                />
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── Stats Bar (overlapping hero) ── */}
      <section style={{ position: "relative", marginTop: "-2.5rem", zIndex: 10 }}>
        <div className="nb-container" style={{ maxWidth: "48rem", padding: "0 var(--ccf-gutter)" }}>
          <CountUpStats />
        </div>
      </section>

      {/* ── How It Works ── */}
      <section style={{ padding: "5rem 0 4rem" }}>
        <div className="nb-container" style={{ padding: "0 var(--ccf-gutter)" }}>
          <AnimateIn>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <span style={{
                fontFamily: "var(--ccf-font-display)",
                fontWeight: 700,
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "var(--ccf-cyan-dark)",
              }}>
                Simple Process
              </span>
              <h2
                style={{
                  fontFamily: "var(--ccf-font-display)",
                  fontWeight: 800,
                  fontStyle: "italic",
                  fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                  lineHeight: 1.1,
                  color: "var(--ccf-navy)",
                  marginTop: "0.5rem",
                  marginBottom: "0.75rem",
                }}
              >
                How It Works
              </h2>
              <p style={{ color: "var(--ccf-gray)", maxWidth: "28rem", margin: "0 auto", fontSize: "1.0625rem" }}>
                Three simple steps to finding your perfect couch
              </p>
            </div>
          </AnimateIn>

          <div className="nb-grid-3">
            {[
              {
                step: "01",
                title: "Browse or Tell Us",
                desc: "Check our current inventory or submit a request with your style, color, and budget preferences.",
                icon: (
                  <svg style={{ width: "1.5rem", height: "1.5rem" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                ),
              },
              {
                step: "02",
                title: "We Find Your Match",
                desc: "Our team sources quality couches daily. We'll match you with the perfect piece.",
                icon: (
                  <svg style={{ width: "1.5rem", height: "1.5rem" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                step: "03",
                title: "Pick Up & Enjoy",
                desc: "Visit our location to see your couch in person and take it home same day.",
                icon: (
                  <svg style={{ width: "1.5rem", height: "1.5rem" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                ),
              },
            ].map((item, idx) => (
              <AnimateIn key={item.title} delay={idx * 120} variant="fade-up">
                <div
                  style={{
                    padding: "2rem",
                    textAlign: "center",
                    position: "relative",
                    background: "var(--ccf-white)",
                    borderRadius: "var(--ccf-radius)",
                    boxShadow: "var(--ccf-shadow)",
                    border: "var(--ccf-border)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div style={{
                    width: "3.5rem",
                    height: "3.5rem",
                    borderRadius: "50%",
                    background: "var(--ccf-cyan-bg)",
                    color: "var(--ccf-navy)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem",
                    fontSize: "1.25rem",
                    fontFamily: "var(--ccf-font-display)",
                    fontWeight: 800,
                    border: "2px solid var(--ccf-cyan)",
                  }}>
                    {item.icon}
                  </div>
                  <div style={{
                    fontFamily: "var(--ccf-font-display)",
                    fontWeight: 800,
                    fontSize: "0.75rem",
                    color: "var(--ccf-cyan-dark)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: "0.5rem",
                  }}>
                    Step {item.step}
                  </div>
                  <h3 style={{
                    fontFamily: "var(--ccf-font-display)",
                    fontWeight: 700,
                    fontSize: "1.125rem",
                    marginBottom: "0.5rem",
                    color: "var(--ccf-navy)",
                  }}>
                    {item.title}
                  </h3>
                  <p style={{ color: "var(--ccf-gray)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                    {item.desc}
                  </p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Marquee Banner ── */}
      <div className="nb-marquee">
        <div className="nb-marquee-inner">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i}>
              <span style={{ padding: "0 2rem" }}>Quality Couches</span>
              <span style={{ color: "var(--ccf-navy-dark)", opacity: 0.5 }}>&bull;</span>
              <span style={{ padding: "0 2rem" }}>Same-Day Pickup</span>
              <span style={{ color: "var(--ccf-navy-dark)", opacity: 0.5 }}>&bull;</span>
              <span style={{ padding: "0 2rem" }}>No Pressure</span>
              <span style={{ color: "var(--ccf-navy-dark)", opacity: 0.5 }}>&bull;</span>
              <span style={{ padding: "0 2rem" }}>Actually Affordable</span>
              <span style={{ color: "var(--ccf-navy-dark)", opacity: 0.5 }}>&bull;</span>
              <span style={{ padding: "0 2rem" }}>100% Inspected</span>
              <span style={{ color: "var(--ccf-navy-dark)", opacity: 0.5 }}>&bull;</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Featured / Recent Inventory ── */}
      {recentCouches.length > 0 && (
        <section style={{ background: "var(--ccf-white)", padding: "4rem 0" }}>
          <div className="nb-container" style={{ padding: "0 var(--ccf-gutter)" }}>
            <AnimateIn>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <span style={{
                    fontFamily: "var(--ccf-font-display)",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    color: "var(--ccf-cyan-dark)",
                  }}>
                    Our Collection
                  </span>
                  <h2 style={{
                    fontFamily: "var(--ccf-font-display)",
                    fontWeight: 800,
                    fontStyle: "italic",
                    fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                    lineHeight: 1.1,
                    color: "var(--ccf-navy)",
                    marginTop: "0.5rem",
                  }}>
                    {featured.length > 0 ? "Featured Couches" : "Latest Arrivals"}
                  </h2>
                  <p style={{ color: "var(--ccf-gray)", marginTop: "0.25rem" }}>
                    Hand-picked selections from our inventory
                  </p>
                </div>
                <Link
                  href="/inventory"
                  className="nb-btn nb-btn--secondary nb-btn--small nb-desktop-only"
                >
                  View All &rarr;
                </Link>
              </div>
            </AnimateIn>

            <div className="nb-grid-3">
              {recentCouches.map((couch, idx) => (
                <AnimateIn key={couch.id} delay={idx * 80} variant="fade-up">
                  <CouchCard couch={couch} />
                </AnimateIn>
              ))}
            </div>

            <div className="nb-mobile-only" style={{ textAlign: "center", marginTop: "2rem" }}>
              <Link href="/inventory" className="nb-btn nb-btn--secondary nb-btn--small">
                View All Couches &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Testimonials ── */}
      <section style={{ background: "var(--ccf-chalk)", padding: "5rem 0" }}>
        <div className="nb-container" style={{ padding: "0 var(--ccf-gutter)" }}>
          <AnimateIn>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <span style={{
                fontFamily: "var(--ccf-font-display)",
                fontWeight: 700,
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "var(--ccf-cherry)",
              }}>
                Happy Customers
              </span>
              <h2 style={{
                fontFamily: "var(--ccf-font-display)",
                fontWeight: 800,
                fontStyle: "italic",
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                lineHeight: 1.1,
                color: "var(--ccf-navy)",
                marginTop: "0.5rem",
                marginBottom: "0.75rem",
              }}>
                What People Are Saying
              </h2>
              <p style={{ color: "var(--ccf-gray)", maxWidth: "28rem", margin: "0 auto" }}>
                Real reviews from real Colorado couch lovers
              </p>
            </div>
          </AnimateIn>

          <div className="nb-grid-3">
            {[
              {
                quote: "Found an amazing sectional for our new apartment. The whole process took less than a day from browsing to pickup. Incredible value!",
                name: "Sarah M.",
                location: "Denver, CO",
              },
              {
                quote: "Sold our old couch in hours. They picked it up and paid us on the spot. Way easier than dealing with Craigslist or Facebook Marketplace.",
                name: "Mike & Jen T.",
                location: "Boulder, CO",
              },
              {
                quote: "Third time buying from Colorado Couch Farm. They always have unique, quality pieces you won't find anywhere else. Highly recommend!",
                name: "Alex R.",
                location: "Fort Collins, CO",
              },
            ].map((review, idx) => (
              <AnimateIn key={review.name} delay={idx * 120} variant="fade-up">
                <div
                  style={{
                    padding: "1.75rem",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    background: "var(--ccf-white)",
                    borderRadius: "var(--ccf-radius)",
                    boxShadow: "var(--ccf-shadow)",
                    border: "var(--ccf-border)",
                  }}
                >
                  {/* Stars */}
                  <div style={{ display: "flex", gap: "2px", marginBottom: "1rem" }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} className="nb-star" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote style={{
                    flex: 1,
                    borderLeft: "3px solid var(--ccf-cyan)",
                    paddingLeft: "1rem",
                    fontStyle: "italic",
                    fontSize: "1rem",
                    lineHeight: 1.6,
                    color: "var(--ccf-black)",
                  }}>
                    &ldquo;{review.quote}&rdquo;
                  </blockquote>
                  <div style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid var(--ccf-gray-light)" }}>
                    <p style={{
                      fontFamily: "var(--ccf-font-display)",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      color: "var(--ccf-navy)",
                    }}>
                      {review.name}
                    </p>
                    <p style={{ color: "var(--ccf-gray)", fontSize: "0.75rem" }}>{review.location}</p>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sell CTA ── */}
      <AnimateIn variant="fade-in">
        <section
          style={{
            padding: "5rem 0",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            background: "linear-gradient(135deg, var(--ccf-cyan) 0%, #00B8E6 100%)",
            color: "var(--ccf-navy)",
          }}
        >
          {/* Decorative circles */}
          <div style={{
            position: "absolute",
            top: "-60px",
            right: "-60px",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "rgba(0, 57, 134, 0.1)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute",
            bottom: "-40px",
            left: "-40px",
            width: "160px",
            height: "160px",
            borderRadius: "50%",
            background: "rgba(254, 229, 107, 0.2)",
            pointerEvents: "none",
          }} />

          <div className="nb-container" style={{ position: "relative", zIndex: 1, padding: "0 var(--ccf-gutter)" }}>
            <AnimateIn variant="fade-up" delay={100}>
              <div
                style={{
                  width: "4rem",
                  height: "4rem",
                  borderRadius: "50%",
                  background: "rgba(0, 57, 134, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                }}
              >
                <svg style={{ width: "2rem", height: "2rem", color: "var(--ccf-navy)" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </AnimateIn>
            <AnimateIn variant="fade-up" delay={200}>
              <h2 style={{
                fontFamily: "var(--ccf-font-display)",
                fontWeight: 900,
                fontStyle: "italic",
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                lineHeight: 1.1,
                color: "var(--ccf-navy)",
                marginBottom: "1rem",
              }}>
                Have a Couch to Sell?
              </h2>
            </AnimateIn>
            <AnimateIn variant="fade-up" delay={300}>
              <p style={{
                color: "var(--ccf-navy-dark)",
                opacity: 0.8,
                marginBottom: "2rem",
                maxWidth: "32rem",
                margin: "0 auto 2rem",
                lineHeight: 1.7,
                fontSize: "1.0625rem",
              }}>
                We buy quality couches in good condition. Submit your couch details and we&apos;ll get back to you with an offer.
              </p>
            </AnimateIn>
            <AnimateIn variant="fade-up" delay={400}>
              <Link href="/sell" className="nb-btn nb-btn--primary">
                Sell Your Couch
              </Link>
            </AnimateIn>
          </div>
        </section>
      </AnimateIn>
    </div>
  );
}
