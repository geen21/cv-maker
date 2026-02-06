"use client";

import React, { useMemo } from "react";
import { CVData, Education } from "@/types/cv";
import logo21datas from "@/image/21DATAS LOGO-05.png";

interface CVPreviewProps {
  data: CVData;
}

/* ────────── small reusable pieces ────────── */

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
    <h2
      style={{
        fontSize: "1.5rem",
        fontWeight: 900,
        textTransform: "uppercase",
        letterSpacing: "0.02em",
        color: "#111",
        whiteSpace: "nowrap",
        lineHeight: 1,
        margin: 0,
      }}
    >
      {children}
    </h2>
    <div style={{ height: 3, background: "#022bfe", flex: 1 }} />
  </div>
);

const IconBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 18,
      height: 18,
      borderRadius: 3,
      background: "#022bfe",
      color: "#fff",
      flexShrink: 0,
    }}
  >
    {children}
  </span>
);

/* SVG icons matching the reference CV */
const icons = {
  email: (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 4L12 13L2 4" />
    </svg>
  ),
  linkedin: (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="#fff">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S.02 4.88.02 3.5 1.13 1 2.5 1 4.98 2.12 4.98 3.5zM5 8H0v16h5V8zm7.98 0h-4.97v16h4.97v-8.4c0-4.67 6.03-5.05 6.03 0V24H24V13.87c0-7.88-8.92-7.59-11.02-3.71V8z" transform="scale(0.9) translate(1.3,1.3)" />
    </svg>
  ),
  driving: (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
    </svg>
  ),
  location: (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 2l9 7.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  ),
  birthday: (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  phone: (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  cert: (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" />
      <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
    </svg>
  ),
};

const InfoRowSvg: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
    <IconBox>{icon}</IconBox>
    <span style={{ fontSize: 12, color: "#222" }}>{text}</span>
  </div>
);

const TimelineDot: React.FC<{ filled?: boolean }> = ({ filled }) => (
  <div
    style={{
      width: 12,
      height: 12,
      borderRadius: "50%",
      border: "3px solid #022bfe",
      background: filled ? "#022bfe" : "#fff",
      flexShrink: 0,
      zIndex: 2,
    }}
  />
);

/* ────────── Education section (reusable, placed dynamically) ────────── */

const EducationSection: React.FC<{
  labels: { education: string };
  education: Education[];
}> = ({ labels, education }) => (
  <div style={{ marginTop: 14 }}>
    <SectionTitle>{labels.education}</SectionTitle>
    <div style={{ position: "relative" }}>
      {education.length > 1 && (
        <div
          style={{
            position: "absolute",
            left: 4.5,
            top: 8,
            bottom: 8,
            width: 3,
            background: "#022bfe",
            zIndex: 0,
          }}
        />
      )}
      {education.map((edu, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, position: "relative" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: 2,
              minWidth: 12,
              zIndex: 1,
            }}
          >
            <TimelineDot filled={i === 0} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontSize: 11, color: "#888", fontStyle: "italic", whiteSpace: "nowrap" }}>
                {edu.dateRange}
              </span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{edu.degree}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#022bfe" }}>{edu.institution}</div>
            {edu.details && (
              <ul style={{ margin: "1px 0 0 12px", padding: 0, listStyleType: "disc" }}>
                {edu.details.map((d, j) => (
                  <li key={j} style={{ fontSize: 11, lineHeight: 1.3 }}>
                    {d}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ────────── main component ────────── */

export default function CVPreview({ data }: CVPreviewProps) {
  const hasProjects = data.projects && data.projects.length > 0;
  const hasReferences = data.references && data.references.length > 0;

  /* ─── Layout agent: estimate content height per column ─── */
  const educationPlacement = useMemo(() => {
    const TOTAL_H = 1123;
    const HEADER_H = 160; // header + padding
    const SECTION_TITLE_H = 30;
    const AVAILABLE = TOTAL_H - HEADER_H;

    // ── Left column height estimation ──
    let leftH = SECTION_TITLE_H; // "EXPERIENCES"
    for (const exp of data.experiences) {
      leftH += 14 + 16 + (exp.location ? 14 : 0); // dateRange + company + location
      for (const role of exp.roles) {
        leftH += 16; // role title
        leftH += role.bullets.length * 16; // bullets
      }
      leftH += 6; // marginBottom
    }
    if (data.previousExperiencesSummary) {
      leftH += 18; // title
      leftH += data.previousExperiencesSummary.bullets.length * 15;
    }
    if (hasProjects) {
      leftH += SECTION_TITLE_H;
      for (const p of data.projects!) {
        leftH += 28 + (p.description ? 16 : 0);
      }
    }

    // ── Right column height estimation ──
    let rightH = SECTION_TITLE_H; // "COMPETENCES"
    for (const cat of data.competences) {
      rightH += 22; // category header
      if (cat.subcategories && cat.subcategories.length > 0) {
        // subcategories laid out in flex-wrap rows (~2 per row)
        const rows = Math.ceil(cat.subcategories.length / 2);
        let maxItemsPerRow = 0;
        for (const sub of cat.subcategories) {
          maxItemsPerRow = Math.max(maxItemsPerRow, sub.items.length);
        }
        rightH += rows * (18 + maxItemsPerRow * 15);
      } else if (cat.items) {
        rightH += cat.items.length * 15;
      }
      rightH += 8; // marginBottom
    }
    if (hasReferences) {
      rightH += SECTION_TITLE_H;
      rightH += data.references.length * 42;
    }

    // ── Education height estimation ──
    let eduH = SECTION_TITLE_H;
    for (const edu of data.education) {
      eduH += 16 + 16 + 16; // dateRange + degree + institution
      if (edu.details) {
        eduH += edu.details.length * 15;
      }
      eduH += 6;
    }

    const leftRemaining = AVAILABLE - leftH;
    const rightRemaining = AVAILABLE - rightH;

    // Decide placement:
    // 1. Right column (default if it fits)
    if (rightRemaining >= eduH + 10) return "right";
    // 2. Left column (if right is too full but left has space)
    if (leftRemaining >= eduH + 10) return "left";
    // 3. Full width bottom (fallback)
    return "bottom";
  }, [data, hasProjects, hasReferences]);

  // Language detection
  const isFrench =
    data.experiences.some(
      (e) =>
        e.roles.some((r) => r.title.toLowerCase().includes("consultant")) ||
        e.location?.toLowerCase().includes("lausanne")
    ) ||
    data.competences.some(
      (c) =>
        c.title.toLowerCase().includes("informatique") ||
        c.title.toLowerCase().includes("personnel") ||
        c.title.toLowerCase().includes("compétence")
    );

  const labels = {
    experience: isFrench ? "EXPÉRIENCES" : "EXPERIENCE",
    competences: isFrench ? "COMPÉTENCES" : "COMPETENCES",
    references: isFrench ? "RÉFÉRENCES" : "REFERENCE",
    projects: isFrench ? "PROJETS" : "PROJECTS",
    education: isFrench ? "ÉDUCATION" : "EDUCATION",
  };

  return (
    <div
      id="cv-content"
      style={{
        width: 794,
        height: 1123,
        background: "#fff",
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
        color: "#111",
        padding: "28px 36px 32px 36px",
        boxSizing: "border-box",
        position: "relative",
        fontSize: 13,
        lineHeight: 1.45,
        overflow: "hidden",
      }}
    >
      {/* ───────── HEADER ───────── */}
      <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 14 }}>
        {/* Photo with blue arc */}
        <div style={{ position: "relative", width: 100, height: 100, flexShrink: 0 }}>
          {/* Blue arc behind photo (top-left quarter circle) */}
          <svg
            width="106"
            height="106"
            viewBox="0 0 106 106"
            style={{ position: "absolute", top: -3, left: -3 }}
          >
            <path
              d="M53 3 A50 50 0 0 0 3 53"
              fill="none"
              stroke="#022bfe"
              strokeWidth="3"
            />
          </svg>
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              overflow: "hidden",
              background: "#e5e7eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {data.photoUrl ? (
              <img
                src={data.photoUrl}
                alt="Photo"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                crossOrigin="anonymous"
              />
            ) : (
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
              </svg>
            )}
          </div>
          {/* Blue vertical line below photo */}
          <div
            style={{
              position: "absolute",
              left: 49,
              top: 103,
              width: 3,
              height: 28,
              background: "#022bfe",
              borderRadius: 1,
            }}
          />
        </div>

        {/* Name + contact info */}
        <div style={{ flex: 1, marginLeft: 16 }}>
          <h1
            style={{
              fontSize: "2.25rem",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              lineHeight: 1,
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            {data.firstName} {data.lastName}
          </h1>

          {/* Contact info in 2 columns */}
          <div style={{ display: "flex", gap: 32, marginTop: 12 }}>
            <div>
              {data.email && <InfoRowSvg icon={icons.email} text={data.email} />}
              {data.linkedin && <InfoRowSvg icon={icons.linkedin} text={data.linkedin} />}
              {data.drivingLicense && (
                <InfoRowSvg icon={icons.driving} text={isFrench ? "Permis de conduire" : "Driving licence"} />
              )}
              {data.location && <InfoRowSvg icon={icons.location} text={data.location} />}
            </div>
            <div>
              {data.birthDate && <InfoRowSvg icon={icons.birthday} text={data.birthDate} />}
              {data.phone && <InfoRowSvg icon={icons.phone} text={data.phone} />}
              {data.certifications?.map((cert, i) => (
                <InfoRowSvg key={i} icon={icons.cert} text={cert} />
              ))}
            </div>
          </div>
        </div>

        {/* Right side: professional title + 21 DATAS logo */}
        <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12, maxWidth: 160 }}>
          {data.titles?.slice(0, 2).map((title, i) => (
            <div key={i} style={{ fontSize: 14, color: "#444", lineHeight: 1.35 }}>
              {title}
            </div>
          ))}

          {/* 21 DATAS Logo */}
          <div style={{ marginTop: 10 }}>
            <img
              src={logo21datas.src}
              alt="21 DATAS"
              style={{ width: 70, height: "auto", marginLeft: "auto", display: "block" }}
            />
          </div>
        </div>
      </div>

      {/* ───────── TWO COLUMN LAYOUT ───────── */}
      <div style={{ display: "flex", gap: 28 }}>
        {/* ====== LEFT COLUMN ====== */}
        <div style={{ width: "46%" }}>
          {/* EXPERIENCE */}
          <SectionTitle>{labels.experience}</SectionTitle>

          <div style={{ position: "relative" }}>
            {/* Continuous timeline line behind all entries */}
            <div
              style={{
                position: "absolute",
                left: 4.5,
                top: 8,
                bottom: 8,
                width: 3,
                background: "#022bfe",
                zIndex: 0,
              }}
            />
            {data.experiences.map((exp, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, position: "relative" }}>
                {/* Timeline dot */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    paddingTop: 2,
                    minWidth: 12,
                    zIndex: 1,
                  }}
                >
                  <TimelineDot filled={i === 0} />
                </div>

                {/* Content */}
                <div style={{ flex: 1, paddingBottom: 1 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span style={{ fontSize: 11, color: "#888", fontStyle: "italic", whiteSpace: "nowrap" }}>
                      {exp.dateRange}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#022bfe" }}>
                    {exp.company}
                  </div>
                  {exp.location && (
                    <div style={{ fontSize: 11, color: "#888", fontStyle: "italic" }}>
                      {exp.location}
                    </div>
                  )}
                  {exp.roles.map((role, j) => (
                    <div key={j} style={{ marginTop: 2 }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{role.title}</div>
                      <ul style={{ margin: "1px 0 0 12px", padding: 0, listStyleType: "disc" }}>
                        {role.bullets.map((bullet, k) => (
                          <li key={k} style={{ fontSize: 11.5, lineHeight: 1.3, marginBottom: 0.5 }}>
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* PREVIOUS EXPERIENCES SUMMARY — inside timeline */}
            {data.previousExperiencesSummary && (
              <div style={{ display: "flex", gap: 8, position: "relative" }}>
                {/* Timeline dot */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    paddingTop: 2,
                    minWidth: 12,
                    zIndex: 1,
                  }}
                >
                  <TimelineDot filled />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 2 }}>
                    {data.previousExperiencesSummary.title}
                  </div>
                  <ul style={{ margin: "0 0 0 12px", padding: 0, listStyleType: "disc" }}>
                    {data.previousExperiencesSummary.bullets.map((bullet, i) => (
                      <li key={i} style={{ fontSize: 11, lineHeight: 1.3, marginBottom: 0.5 }}>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* PROJECTS */}
          {hasProjects && (
            <div style={{ marginTop: 14 }}>
              <SectionTitle>{labels.projects}</SectionTitle>
              <div>
                {data.projects!.map((project, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5, alignItems: "flex-start" }}>
                    <div style={{ paddingTop: 3, minWidth: 12, display: "flex", justifyContent: "center" }}>
                      <TimelineDot filled />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 0 }}>
                        <span style={{ fontSize: 11, color: "#888", fontStyle: "italic", minWidth: 38, flexShrink: 0 }}>
                          {project.year}
                        </span>
                        <div>
                          <span style={{ fontSize: 12, fontWeight: 700 }}>{project.sector}</span>
                          {project.description && (
                            <div style={{ fontSize: 11, lineHeight: 1.3, color: "#333" }}>
                              {project.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* EDUCATION — left column placement */}
          {educationPlacement === "left" && <EducationSection labels={labels} education={data.education} />}
        </div>

        {/* ====== RIGHT COLUMN ====== */}
        <div style={{ width: "54%" }}>
          {/* COMPETENCES */}
          <SectionTitle>{labels.competences}</SectionTitle>

          <div>
            {data.competences.map((cat, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
                  <span style={{ fontSize: 14 }}>{cat.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{cat.title}</span>
                </div>

                {cat.subcategories && cat.subcategories.length > 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "2px 16px", marginLeft: 18 }}>
                    {cat.subcategories.map((sub, j) => (
                      <div key={j} style={{ minWidth: 80 }}>
                        <div style={{ fontSize: 11.5, fontWeight: 600, textDecoration: "underline", marginBottom: 1 }}>
                          {sub.title}
                        </div>
                        <ul style={{ margin: "0 0 0 10px", padding: 0, listStyleType: "disc" }}>
                          {sub.items.map((item, k) => (
                            <li key={k} style={{ fontSize: 11.5, lineHeight: 1.3 }}>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : cat.items ? (
                  <ul style={{ margin: "0 0 0 28px", padding: 0, listStyleType: "disc" }}>
                    {cat.items.map((item, j) => (
                      <li key={j} style={{ fontSize: 11.5, lineHeight: 1.3 }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>

          {/* REFERENCES */}
          {hasReferences && (
            <div style={{ marginTop: 14 }}>
              <SectionTitle>{labels.references}</SectionTitle>
              <div>
                {data.references.map((ref, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{ paddingTop: 3 }}>
                      <TimelineDot filled />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{ref.name}</div>
                      {ref.email && (
                        <div style={{ fontSize: 12, color: "#022bfe", fontStyle: "italic" }}>
                          {ref.email}
                        </div>
                      )}
                      <div style={{ fontSize: 12, color: "#555" }}>{ref.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EDUCATION — right column placement */}
          {educationPlacement === "right" && <EducationSection labels={labels} education={data.education} />}
        </div>
      </div>

      {/* EDUCATION — full width bottom fallback */}
      {educationPlacement === "bottom" && (
        <div style={{ marginTop: 14 }}>
          <EducationSection labels={labels} education={data.education} />
        </div>
      )}
    </div>
  );
}
