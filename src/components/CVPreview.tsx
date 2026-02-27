"use client";

import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { CVData, Education } from "@/types/cv";
import logo21datas from "@/image/21DATAS LOGO-05.png";

interface CVPreviewProps {
  data: CVData;
  onUpdate?: (data: CVData) => void;
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

/* ────────── Editable inline text (contentEditable) ────────── */

const Editable: React.FC<{
  value: string;
  onCommit?: (v: string) => void;
  style?: React.CSSProperties;
}> = ({ value, onCommit, style }) => (
  <span
    key={value}
    contentEditable={!!onCommit}
    suppressContentEditableWarning
    onBlur={
      onCommit
        ? (e: React.FocusEvent) => {
            const t = (e.target as HTMLElement).innerText.trim();
            if (t !== value) onCommit(t);
          }
        : undefined
    }
    style={{
      ...style,
      outline: "none",
      ...(onCommit ? { cursor: "text", borderRadius: 2 } : {}),
    }}
  >
    {value}
  </span>
);

/* ────────── Add button (hidden during PDF export) ────────── */

const AddButton: React.FC<{
  onClick: () => void;
  label?: string;
  style?: React.CSSProperties;
}> = ({ onClick, label = "+", style }) => (
  <button
    className="cv-add-btn"
    onClick={onClick}
    title="Add"
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 18,
      height: 18,
      borderRadius: "50%",
      border: "1.5px dashed #022bfe",
      background: "transparent",
      color: "#022bfe",
      fontSize: 13,
      fontWeight: 700,
      cursor: "pointer",
      padding: 0,
      lineHeight: 1,
      opacity: 0.5,
      transition: "opacity 0.15s",
      flexShrink: 0,
      ...style,
    }}
    onMouseEnter={e => { (e.target as HTMLElement).style.opacity = "1"; (e.target as HTMLElement).style.background = "#022bfe"; (e.target as HTMLElement).style.color = "#fff"; }}
    onMouseLeave={e => { (e.target as HTMLElement).style.opacity = "0.5"; (e.target as HTMLElement).style.background = "transparent"; (e.target as HTMLElement).style.color = "#022bfe"; }}
  >
    {label}
  </button>
);

const InfoRowSvg: React.FC<{ icon: React.ReactNode; text: string; onTextChange?: (v: string) => void }> = ({ icon, text, onTextChange }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
    <IconBox>{icon}</IconBox>
    {onTextChange ? (
      <Editable value={text} onCommit={onTextChange} style={{ fontSize: 12, color: "#222" }} />
    ) : (
      <span style={{ fontSize: 12, color: "#222" }}>{text}</span>
    )}
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
  onEditField?: (idx: number, field: "dateRange" | "degree" | "institution", v: string) => void;
  onEditDetail?: (eduIdx: number, detailIdx: number, v: string) => void;
  onAddEducation?: () => void;
  onAddDetail?: (eduIdx: number) => void;
}> = ({ labels, education, onEditField, onEditDetail, onAddEducation, onAddDetail }) => (
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
              <Editable value={edu.dateRange} onCommit={onEditField ? v => onEditField(i, "dateRange", v) : undefined} style={{ fontSize: 11, color: "#888", fontStyle: "italic", whiteSpace: "nowrap" }} />
            </div>
            <Editable value={edu.degree} onCommit={onEditField ? v => onEditField(i, "degree", v) : undefined} style={{ fontSize: 13, fontWeight: 700, display: "block" }} />
            <Editable value={edu.institution} onCommit={onEditField ? v => onEditField(i, "institution", v) : undefined} style={{ fontSize: 12, fontWeight: 700, color: "#022bfe", display: "block" }} />
            {edu.details && (
              <ul style={{ margin: "1px 0 0 12px", padding: 0, listStyleType: "disc" }}>
                {edu.details.map((d, j) => (
                  <li key={j} style={{ fontSize: 11, lineHeight: 1.3 }}>
                    <Editable value={d} onCommit={onEditDetail ? v => onEditDetail(i, j, v) : undefined} />
                  </li>
                ))}
                {onAddDetail && (
                  <li style={{ listStyleType: "none", marginLeft: -12 }}>
                    <AddButton onClick={() => onAddDetail(i)} />
                  </li>
                )}
              </ul>
            )}
            {!edu.details && onAddDetail && (
              <AddButton onClick={() => onAddDetail(i)} style={{ marginTop: 2 }} />
            )}
          </div>
        </div>
      ))}
      {onAddEducation && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
          <AddButton onClick={onAddEducation} />
        </div>
      )}
    </div>
  </div>
);

/* ────────── main component ────────── */

export default function CVPreview({ data, onUpdate }: CVPreviewProps) {
  const hasProjects = data.projects && data.projects.length > 0;
  const hasReferences = data.references && data.references.length > 0;

  /* ─── Generic deep-clone-and-mutate helper ─── */
  const update = useCallback(
    (mutator: (d: CVData) => void) => {
      if (!onUpdate) return;
      const clone: CVData = JSON.parse(JSON.stringify(data));
      mutator(clone);
      onUpdate(clone);
    },
    [data, onUpdate]
  );

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

  /* ─── Anti-truncation agent: measure & auto-scale ─── */
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const measureAndScale = useCallback(() => {
    const el = innerRef.current;
    if (!el) return;
    // Temporarily remove scale to get natural height
    el.style.transform = "none";
    const naturalH = el.scrollHeight;
    const TARGET_H = 1123;
    if (naturalH > TARGET_H) {
      const s = TARGET_H / naturalH;
      // Clamp to a minimum scale of 0.7 to keep it readable
      setScale(Math.max(0.7, s));
    } else {
      setScale(1);
    }
  }, []);

  useEffect(() => {
    // Wait for fonts & layout to settle
    const t = setTimeout(measureAndScale, 50);
    return () => clearTimeout(t);
  }, [data, educationPlacement, measureAndScale]);

  return (
    <div
      id="cv-content"
      style={{
        width: 794,
        height: 1123,
        background: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        ref={innerRef}
        style={{
          fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
          color: "#111",
          padding: "28px 36px 32px 36px",
          boxSizing: "border-box",
          fontSize: 13,
          lineHeight: 1.45,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: scale < 1 ? `${100 / scale}%` : "100%",
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
            <Editable value={data.firstName} onCommit={v => update(d => { d.firstName = v; })} /> <Editable value={data.lastName} onCommit={v => update(d => { d.lastName = v; })} />
          </h1>

          {/* Contact info in 2 columns */}
          <div style={{ display: "flex", gap: 32, marginTop: 12 }}>
            <div>
              {data.email && <InfoRowSvg icon={icons.email} text={data.email} onTextChange={v => update(d => { d.email = v; })} />}
              {data.linkedin && <InfoRowSvg icon={icons.linkedin} text={data.linkedin} onTextChange={v => update(d => { d.linkedin = v; })} />}
              {data.drivingLicense && (
                <InfoRowSvg icon={icons.driving} text={isFrench ? "Permis de conduire" : "Driving licence"} />
              )}
              {data.location && <InfoRowSvg icon={icons.location} text={data.location} onTextChange={v => update(d => { d.location = v; })} />}
            </div>
            <div>
              {data.birthDate && <InfoRowSvg icon={icons.birthday} text={data.birthDate} onTextChange={v => update(d => { d.birthDate = v; })} />}
              {data.phone && <InfoRowSvg icon={icons.phone} text={data.phone} onTextChange={v => update(d => { d.phone = v; })} />}
              {data.certifications?.map((cert, i) => (
                <InfoRowSvg key={i} icon={icons.cert} text={cert} onTextChange={v => update(d => { d.certifications[i] = v; })} />
              ))}
              <AddButton onClick={() => update(d => { d.certifications = [...(d.certifications || []), "New Certification"]; })} style={{ marginTop: 2 }} />
            </div>
          </div>
        </div>

        {/* Right side: professional title + 21 DATAS logo */}
        <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12, maxWidth: 160 }}>
          {data.titles?.slice(0, 2).map((title, i) => (
            <div key={i} style={{ fontSize: 14, color: "#444", lineHeight: 1.35 }}>
              <Editable value={title} onCommit={v => update(d => { d.titles[i] = v; })} />
            </div>
          ))}
          {(!data.titles || data.titles.length < 2) && (
            <AddButton onClick={() => update(d => { d.titles = [...(d.titles || []), "New Title"]; })} style={{ marginTop: 4 }} />
          )}

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

                <div style={{ flex: 1, paddingBottom: 1 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <Editable value={exp.dateRange} onCommit={v => update(d => { d.experiences[i].dateRange = v; })} style={{ fontSize: 11, color: "#888", fontStyle: "italic", whiteSpace: "nowrap" }} />
                  </div>
                  <Editable value={exp.company} onCommit={v => update(d => { d.experiences[i].company = v; })} style={{ fontSize: 13, fontWeight: 700, color: "#022bfe", display: "block" }} />
                  {exp.location && (
                    <Editable value={exp.location} onCommit={v => update(d => { d.experiences[i].location = v; })} style={{ fontSize: 11, color: "#888", fontStyle: "italic", display: "block" }} />
                  )}
                  {exp.roles.map((role, j) => (
                    <div key={j} style={{ marginTop: 2 }}>
                      <Editable value={role.title} onCommit={v => update(d => { d.experiences[i].roles[j].title = v; })} style={{ fontSize: 13, fontWeight: 700, display: "block" }} />
                      <ul style={{ margin: "1px 0 0 12px", padding: 0, listStyleType: "disc" }}>
                        {role.bullets.map((bullet, k) => (
                          <li key={k} style={{ fontSize: 11.5, lineHeight: 1.3, marginBottom: 0.5 }}>
                            <Editable value={bullet} onCommit={v => update(d => { d.experiences[i].roles[j].bullets[k] = v; })} />
                          </li>
                        ))}
                        <li style={{ listStyleType: "none", marginLeft: -12 }}>
                          <AddButton onClick={() => update(d => { d.experiences[i].roles[j].bullets.push("New bullet point"); })} />
                        </li>
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Add new experience */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
              <AddButton onClick={() => update(d => { d.experiences.push({ dateRange: "20XX – 20XX", company: "Company", location: "Location", roles: [{ title: "Role Title", bullets: ["Description"] }] }); })} />
            </div>

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
                  <Editable value={data.previousExperiencesSummary.title} onCommit={v => update(d => { d.previousExperiencesSummary!.title = v; })} style={{ fontSize: 12, fontWeight: 700, marginBottom: 2, display: "block" }} />
                  <ul style={{ margin: "0 0 0 12px", padding: 0, listStyleType: "disc" }}>
                    {data.previousExperiencesSummary.bullets.map((bullet, i) => (
                      <li key={i} style={{ fontSize: 11, lineHeight: 1.3, marginBottom: 0.5 }}>
                        <Editable value={bullet} onCommit={v => update(d => { d.previousExperiencesSummary!.bullets[i] = v; })} />
                      </li>
                    ))}
                    <li style={{ listStyleType: "none", marginLeft: -12 }}>
                      <AddButton onClick={() => update(d => { d.previousExperiencesSummary!.bullets.push("New bullet"); })} />
                    </li>
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
                        <Editable value={project.year} onCommit={v => update(d => { d.projects![i].year = v; })} style={{ fontSize: 11, color: "#888", fontStyle: "italic", minWidth: 38, flexShrink: 0 }} />
                        <div>
                          <Editable value={project.sector} onCommit={v => update(d => { d.projects![i].sector = v; })} style={{ fontSize: 12, fontWeight: 700 }} />
                          {project.description && (
                            <Editable value={project.description} onCommit={v => update(d => { d.projects![i].description = v; })} style={{ fontSize: 11, lineHeight: 1.3, color: "#333", display: "block" }} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Add new project */}
              <div style={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
                <AddButton onClick={() => update(d => { d.projects = [...(d.projects || []), { year: "20XX", sector: "Sector", description: "Description" }]; })} />
              </div>
            </div>
          )}
          {/* Add projects section if none */}
          {!hasProjects && (
            <div style={{ marginTop: 14 }}>
              <AddButton onClick={() => update(d => { d.projects = [{ year: "20XX", sector: "Project Sector", description: "Description" }]; })} style={{ marginLeft: 0 }} />
            </div>
          )}
          {/* EDUCATION — left column placement */}
          {educationPlacement === "left" && <EducationSection labels={labels} education={data.education} onEditField={(idx, field, v) => update(d => { (d.education[idx] as unknown as Record<string, string>)[field] = v; })} onEditDetail={(eduIdx, detailIdx, v) => update(d => { d.education[eduIdx].details![detailIdx] = v; })} onAddEducation={() => update(d => { d.education.push({ dateRange: "20XX – 20XX", degree: "Degree", institution: "Institution" }); })} onAddDetail={(eduIdx) => update(d => { if (!d.education[eduIdx].details) d.education[eduIdx].details = []; d.education[eduIdx].details!.push("New detail"); })} />}
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
                  <Editable value={cat.title} onCommit={v => update(d => { d.competences[i].title = v; })} style={{ fontSize: 13, fontWeight: 700 }} />
                  <AddButton onClick={() => update(d => { if (d.competences[i].subcategories && d.competences[i].subcategories!.length > 0) { d.competences[i].subcategories!.push({ title: "New Sub", items: ["Item"] }); } else { if (!d.competences[i].items) d.competences[i].items = []; d.competences[i].items!.push("New item"); } })} style={{ marginLeft: 4 }} />
                </div>

                {cat.subcategories && cat.subcategories.length > 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "2px 16px", marginLeft: 18 }}>
                    {cat.subcategories.map((sub, j) => (
                      <div key={j} style={{ minWidth: 80 }}>
                        <Editable value={sub.title} onCommit={v => update(d => { d.competences[i].subcategories![j].title = v; })} style={{ fontSize: 11.5, fontWeight: 600, textDecoration: "underline", marginBottom: 1, display: "block" }} />
                        <ul style={{ margin: "0 0 0 10px", padding: 0, listStyleType: "disc" }}>
                          {sub.items.map((item, k) => (
                            <li key={k} style={{ fontSize: 11.5, lineHeight: 1.3 }}>
                              <Editable value={item} onCommit={v => update(d => { d.competences[i].subcategories![j].items[k] = v; })} />
                            </li>
                          ))}
                          <li style={{ listStyleType: "none", marginLeft: -10 }}>
                            <AddButton onClick={() => update(d => { d.competences[i].subcategories![j].items.push("New item"); })} />
                          </li>
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : cat.items ? (
                  <ul style={{ margin: "0 0 0 28px", padding: 0, listStyleType: "disc" }}>
                    {cat.items.map((item, j) => (
                      <li key={j} style={{ fontSize: 11.5, lineHeight: 1.3 }}>
                        <Editable value={item} onCommit={v => update(d => { d.competences[i].items![j] = v; })} />
                      </li>
                    ))}
                    <li style={{ listStyleType: "none", marginLeft: -10 }}>
                      <AddButton onClick={() => update(d => { if (!d.competences[i].items) d.competences[i].items = []; d.competences[i].items!.push("New item"); })} />
                    </li>
                  </ul>
                ) : null}
              </div>
            ))}
            {/* Add new competence category */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
              <AddButton onClick={() => update(d => { d.competences.push({ icon: "📌", title: "New Category", items: ["Item"] }); })} />
            </div>
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
                      <Editable value={ref.name} onCommit={v => update(d => { d.references[i].name = v; })} style={{ fontSize: 13, fontWeight: 700, display: "block" }} />
                      {ref.email && (
                        <Editable value={ref.email} onCommit={v => update(d => { d.references[i].email = v; })} style={{ fontSize: 12, color: "#022bfe", fontStyle: "italic", display: "block" }} />
                      )}
                      <Editable value={ref.title} onCommit={v => update(d => { d.references[i].title = v; })} style={{ fontSize: 12, color: "#555", display: "block" }} />
                    </div>
                  </div>
                ))}
                {/* Add new reference */}
                <div style={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
                  <AddButton onClick={() => update(d => { d.references.push({ name: "Name", email: "email@example.com", title: "Title" }); })} />
                </div>
              </div>
            </div>
          )}
          {/* Add references section if none */}
          {!hasReferences && (
            <div style={{ marginTop: 14 }}>
              <AddButton onClick={() => update(d => { d.references = [{ name: "Name", email: "email@example.com", title: "Title" }]; })} style={{ marginLeft: 0 }} />
            </div>
          )}

          {/* EDUCATION — right column placement */}
          {educationPlacement === "right" && <EducationSection labels={labels} education={data.education} onEditField={(idx, field, v) => update(d => { (d.education[idx] as unknown as Record<string, string>)[field] = v; })} onEditDetail={(eduIdx, detailIdx, v) => update(d => { d.education[eduIdx].details![detailIdx] = v; })} onAddEducation={() => update(d => { d.education.push({ dateRange: "20XX – 20XX", degree: "Degree", institution: "Institution" }); })} onAddDetail={(eduIdx) => update(d => { if (!d.education[eduIdx].details) d.education[eduIdx].details = []; d.education[eduIdx].details!.push("New detail"); })} />}
        </div>
      </div>

      {/* EDUCATION — full width bottom fallback */}
      {educationPlacement === "bottom" && (
        <div style={{ marginTop: 14 }}>
          <EducationSection labels={labels} education={data.education} onEditField={(idx, field, v) => update(d => { (d.education[idx] as unknown as Record<string, string>)[field] = v; })} onEditDetail={(eduIdx, detailIdx, v) => update(d => { d.education[eduIdx].details![detailIdx] = v; })} onAddEducation={() => update(d => { d.education.push({ dateRange: "20XX – 20XX", degree: "Degree", institution: "Institution" }); })} onAddDetail={(eduIdx) => update(d => { if (!d.education[eduIdx].details) d.education[eduIdx].details = []; d.education[eduIdx].details!.push("New detail"); })} />
        </div>
      )}
      </div>
    </div>
  );
}
