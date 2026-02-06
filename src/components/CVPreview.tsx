"use client";

import React from "react";
import { CVData } from "@/types/cv";
import logo21datas from "@/image/21DATAS LOGO-05.png";

interface CVPreviewProps {
  data: CVData;
}

/* ────────── small reusable pieces ────────── */

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
    <h2
      style={{
        fontSize: "1.35rem",
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
      fontSize: 10,
      flexShrink: 0,
    }}
  >
    {children}
  </span>
);

const InfoRow: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
    <IconBox>{icon}</IconBox>
    <span style={{ fontSize: 10, color: "#222" }}>{text}</span>
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

/* ────────── main component ────────── */

export default function CVPreview({ data }: CVPreviewProps) {
  const hasProjects = data.projects && data.projects.length > 0;
  const hasReferences = data.references && data.references.length > 0;

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
        minHeight: 1123,
        background: "#fff",
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
        color: "#111",
        padding: "28px 36px 32px 36px",
        boxSizing: "border-box",
        position: "relative",
        fontSize: 11,
        lineHeight: 1.45,
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
              fontSize: "2.15rem",
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
              {data.email && <InfoRow icon="✉" text={data.email} />}
              {data.linkedin && <InfoRow icon="in" text={data.linkedin} />}
              {data.drivingLicense && (
                <InfoRow icon="🚗" text={isFrench ? "Permis de conduire" : "Driving licence"} />
              )}
              {data.location && <InfoRow icon="🏠" text={data.location} />}
            </div>
            <div>
              {data.birthDate && <InfoRow icon="📅" text={data.birthDate} />}
              {data.phone && <InfoRow icon="📞" text={data.phone} />}
              {data.certifications?.map((cert, i) => (
                <InfoRow key={i} icon="🎓" text={cert} />
              ))}
            </div>
          </div>
        </div>

        {/* Right side: professional title + 21 DATAS logo */}
        <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12, maxWidth: 160 }}>
          {data.titles?.map((title, i) => (
            <div key={i} style={{ fontSize: 12, color: "#444", lineHeight: 1.35 }}>
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
      <div style={{ display: "flex", gap: 24 }}>
        {/* ====== LEFT COLUMN ====== */}
        <div style={{ width: "47%" }}>
          {/* EXPERIENCE */}
          <SectionTitle>{labels.experience}</SectionTitle>

          <div>
            {data.experiences.map((exp, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                {/* Timeline column */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    paddingTop: 2,
                    position: "relative",
                    minWidth: 12,
                  }}
                >
                  <TimelineDot filled={i === 0} />
                  {i < data.experiences.length - 1 && (
                    <div style={{ width: 3, background: "#022bfe", flex: 1 }} />
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, paddingBottom: 2 }}>
                  <div style={{ fontSize: 10, color: "#888", fontStyle: "italic" }}>
                    {exp.dateRange}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#022bfe" }}>
                    {exp.company}
                  </div>
                  {exp.location && (
                    <div style={{ fontSize: 9, color: "#888", fontStyle: "italic" }}>
                      {exp.location}
                    </div>
                  )}
                  {exp.roles.map((role, j) => (
                    <div key={j} style={{ marginTop: 3 }}>
                      <div style={{ fontSize: 11, fontWeight: 700 }}>{role.title}</div>
                      <ul style={{ margin: "2px 0 0 14px", padding: 0, listStyleType: "disc" }}>
                        {role.bullets.map((bullet, k) => (
                          <li key={k} style={{ fontSize: 10, lineHeight: 1.35, marginBottom: 1 }}>
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* PREVIOUS EXPERIENCES SUMMARY */}
          {data.previousExperiencesSummary && (
            <div style={{ marginTop: 4 }}>
              <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 3 }}>
                {data.previousExperiencesSummary.title}
              </div>
              <ul style={{ margin: "0 0 0 14px", padding: 0, listStyleType: "disc" }}>
                {data.previousExperiencesSummary.bullets.map((bullet, i) => (
                  <li key={i} style={{ fontSize: 10, lineHeight: 1.35, marginBottom: 1 }}>
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* PROJECTS */}
          {hasProjects && (
            <div style={{ marginTop: 16 }}>
              <SectionTitle>{labels.projects}</SectionTitle>
              <div>
                {data.projects.map((project, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 6 }}>
                    <div style={{ paddingTop: 2, minWidth: 12, display: "flex", justifyContent: "center" }}>
                      <TimelineDot filled />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
                        <span style={{ fontSize: 10, color: "#888", fontStyle: "italic" }}>
                          {project.year}
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 700 }}>
                          {project.sector}
                        </span>
                      </div>
                      <div style={{ fontSize: 10, lineHeight: 1.35 }}>
                        {project.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EDUCATION */}
          <div style={{ marginTop: 16 }}>
            <SectionTitle>{labels.education}</SectionTitle>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 20px" }}>
              {data.education.map((edu, i) => (
                <div key={i} style={{ flex: "1 1 45%", minWidth: "45%" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, textAlign: "center", marginBottom: 3 }}>
                    {edu.degree}
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <div style={{ fontSize: 9, color: "#888", fontStyle: "italic", whiteSpace: "nowrap" }}>
                      {edu.dateRange}
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700 }}>{edu.institution}</div>
                      {edu.details && (
                        <ul style={{ margin: "2px 0 0 10px", padding: 0, listStyleType: "disc" }}>
                          {edu.details.map((d, j) => (
                            <li key={j} style={{ fontSize: 9, lineHeight: 1.3 }}>
                              {d}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ====== RIGHT COLUMN ====== */}
        <div style={{ width: "53%" }}>
          {/* COMPETENCES */}
          <SectionTitle>{labels.competences}</SectionTitle>

          <div>
            {data.competences.map((cat, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
                  <span style={{ fontSize: 13 }}>{cat.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{cat.title}</span>
                </div>

                {cat.subcategories && cat.subcategories.length > 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 20px", marginLeft: 20 }}>
                    {cat.subcategories.map((sub, j) => (
                      <div key={j} style={{ minWidth: 90 }}>
                        <div style={{ fontSize: 10, fontWeight: 600, textDecoration: "underline", marginBottom: 2 }}>
                          {sub.title}
                        </div>
                        <ul style={{ margin: "0 0 0 12px", padding: 0, listStyleType: "disc" }}>
                          {sub.items.map((item, k) => (
                            <li key={k} style={{ fontSize: 10, lineHeight: 1.35 }}>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : cat.items ? (
                  <ul style={{ margin: "0 0 0 30px", padding: 0, listStyleType: "disc" }}>
                    {cat.items.map((item, j) => (
                      <li key={j} style={{ fontSize: 10, lineHeight: 1.35 }}>
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
            <div style={{ marginTop: 16 }}>
              <SectionTitle>{labels.references}</SectionTitle>
              <div>
                {data.references.map((ref, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                    <div style={{ paddingTop: 2 }}>
                      <TimelineDot filled />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700 }}>{ref.name}</div>
                      {ref.email && (
                        <div style={{ fontSize: 10, color: "#022bfe", fontStyle: "italic" }}>
                          {ref.email}
                        </div>
                      )}
                      <div style={{ fontSize: 10, color: "#555" }}>{ref.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
