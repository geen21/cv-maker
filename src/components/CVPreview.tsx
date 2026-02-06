"use client";

import React from "react";
import { CVData } from "@/types/cv";

interface CVPreviewProps {
  data: CVData;
}

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="flex items-center mb-3 mt-1">
    <h2 className="cv-section-title whitespace-nowrap">{children}</h2>
    <div className="cv-section-rule" />
  </div>
);

const TimelineDot: React.FC<{ filled?: boolean }> = ({ filled }) => (
  <div className={filled ? "cv-timeline-dot-filled" : "cv-timeline-dot"} />
);

const InfoRow: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
  <div className="flex items-center gap-2 text-[11px] mb-[5px]">
    <span className="w-5 h-5 flex items-center justify-center bg-[#2563EB] text-white rounded-sm text-[10px]">
      {icon}
    </span>
    <span>{text}</span>
  </div>
);

export default function CVPreview({ data }: CVPreviewProps) {
  const hasProjects = data.projects && data.projects.length > 0;
  const hasReferences = data.references && data.references.length > 0;

  // Determine language from content heuristics
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
        c.title.toLowerCase().includes("fonctionnel")
    );

  const labels = {
    experience: isFrench ? "EXPÉRIENCES" : "EXPERIENCE",
    competences: isFrench ? "COMPÉTENCES" : "SKILLS",
    references: isFrench ? "RÉFÉRENCES" : "REFERENCES",
    projects: isFrench ? "PROJETS" : "PROJECTS",
    education: isFrench ? "ÉDUCATION" : "EDUCATION",
  };

  return (
    <div className="cv-page p-[40px] pt-[30px] text-[11px] leading-[1.45]" id="cv-content">
      {/* HEADER */}
      <div className="flex items-start mb-4">
        {/* Photo */}
        <div className="w-[90px] h-[90px] rounded-full border-[3px] border-[#2563EB] overflow-hidden flex-shrink-0 bg-gray-200 flex items-center justify-center">
          {data.photoUrl ? (
            <img
              src={data.photoUrl}
              alt="Photo"
              className="w-full h-full object-cover"
            />
          ) : (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
            </svg>
          )}
        </div>

        {/* Name and contact info */}
        <div className="ml-4 flex-1">
          <h1 className="text-[2rem] font-black tracking-tight leading-none uppercase">
            {data.firstName} {data.lastName}
          </h1>

          {/* Contact rows */}
          <div className="flex mt-3 gap-x-12">
            <div className="space-y-[3px]">
              {data.email && <InfoRow icon="✉" text={data.email} />}
              {data.linkedin && <InfoRow icon="in" text={data.linkedin} />}
              {data.drivingLicense && (
                <InfoRow icon="🚗" text={isFrench ? "Permis de conduire" : "Driving licence"} />
              )}
              {data.phone && <InfoRow icon="📞" text={data.phone} />}
              {data.location && <InfoRow icon="🏠" text={data.location} />}
            </div>
            <div className="space-y-[3px]">
              {data.birthDate && <InfoRow icon="📅" text={data.birthDate} />}
              {data.certifications?.map((cert, i) => (
                <InfoRow key={i} icon="🎓" text={cert} />
              ))}
            </div>
          </div>
        </div>

        {/* Titles + Logo */}
        <div className="text-right flex-shrink-0 ml-4">
          <div className="mb-2">
            {data.titles?.map((title, i) => (
              <div key={i} className="text-[12px] text-gray-700 leading-snug">
                {title}
              </div>
            ))}
          </div>
          {/* 21 DATAS Logo */}
          <div className="mt-1">
            <div className="flex items-end justify-end">
              <span className="text-[2rem] font-black text-[#2563EB] leading-none">
                2
              </span>
              <span className="text-[2rem] font-black text-[#2563EB] leading-none relative -top-[8px]">
                1
              </span>
            </div>
            <div className="text-[0.65rem] font-black tracking-[0.15em] text-[#2563EB] -mt-1">
              21 DATAS
            </div>
          </div>
        </div>
      </div>

      {/* TWO COLUMN LAYOUT */}
      <div className="flex gap-6">
        {/* LEFT COLUMN - Experience + Projects + Education */}
        <div className="w-[48%]">
          {/* EXPERIENCE */}
          <SectionTitle>{labels.experience}</SectionTitle>

          <div className="space-y-3">
            {data.experiences.map((exp, i) => (
              <div key={i} className="flex gap-3">
                {/* Timeline */}
                <div className="flex flex-col items-center pt-[2px] relative">
                  <TimelineDot filled={i === 0} />
                  {i < data.experiences.length - 1 && (
                    <div className="w-[3px] bg-[#2563EB] flex-1 mt-0" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[10px] text-gray-500 italic whitespace-nowrap">
                      {exp.dateRange}
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-[#2563EB]">
                    {exp.company}
                  </div>
                  <div className="text-[9px] text-gray-500 italic">
                    {exp.location}
                  </div>
                  {exp.roles.map((role, j) => (
                    <div key={j} className="mt-1">
                      <div className="text-[11px] font-bold">{role.title}</div>
                      <ul className="list-disc ml-4 mt-0.5 space-y-[1px]">
                        {role.bullets.map((bullet, k) => (
                          <li key={k} className="text-[10px] leading-[1.35]">
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
            <div className="mt-3">
              <div className="text-[11px] font-bold mb-1">
                {data.previousExperiencesSummary.title}
              </div>
              <ul className="list-disc ml-4 space-y-[1px]">
                {data.previousExperiencesSummary.bullets.map((bullet, i) => (
                  <li key={i} className="text-[10px] leading-[1.35]">
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* PROJECTS */}
          {hasProjects && (
            <>
              <div className="mt-5">
                <SectionTitle>{labels.projects}</SectionTitle>
              </div>
              <div className="space-y-2">
                {data.projects.map((project, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center pt-[2px]">
                      <TimelineDot filled />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-3">
                        <span className="text-[10px] text-gray-500 italic">
                          {project.year}
                        </span>
                      </div>
                      <div className="text-[11px] font-bold">{project.sector}</div>
                      <div className="text-[10px] leading-[1.35]">
                        {project.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* EDUCATION */}
          <div className="mt-5">
            <SectionTitle>{labels.education}</SectionTitle>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {data.education.map((edu, i) => (
              <div key={i} className="flex-1 min-w-[45%]">
                <div className="text-[12px] font-bold text-center mb-1">
                  {edu.degree}
                </div>
                <div className="flex gap-2">
                  <div className="text-[9px] text-gray-500 italic whitespace-nowrap">
                    {edu.dateRange}
                  </div>
                  <div>
                    <div className="text-[10px] font-bold">{edu.institution}</div>
                    {edu.details && (
                      <ul className="list-disc ml-3 mt-0.5">
                        {edu.details.map((d, j) => (
                          <li key={j} className="text-[9px] leading-[1.3]">
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

        {/* RIGHT COLUMN - Competences + References */}
        <div className="w-[52%]">
          {/* COMPETENCES */}
          <SectionTitle>{labels.competences}</SectionTitle>

          <div className="space-y-3">
            {data.competences.map((cat, i) => (
              <div key={i}>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[13px]">{cat.icon}</span>
                  <span className="text-[12px] font-bold">{cat.title}</span>
                </div>

                {cat.subcategories && cat.subcategories.length > 0 ? (
                  <div className="flex flex-wrap gap-x-6 gap-y-1 ml-5">
                    {cat.subcategories.map((sub, j) => (
                      <div key={j} className="min-w-[100px]">
                        <div className="text-[10px] font-semibold underline mb-0.5">
                          {sub.title}
                        </div>
                        <ul className="list-disc ml-3 space-y-[0px]">
                          {sub.items.map((item, k) => (
                            <li key={k} className="text-[10px] leading-[1.35]">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : cat.items ? (
                  <ul className="list-disc ml-8 space-y-[0px]">
                    {cat.items.map((item, j) => (
                      <li key={j} className="text-[10px] leading-[1.35]">
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
            <>
              <div className="mt-5">
                <SectionTitle>{labels.references}</SectionTitle>
              </div>
              <div className="space-y-2.5">
                {data.references.map((ref, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <TimelineDot filled />
                    <div>
                      <div className="text-[11px] font-bold">{ref.name}</div>
                      {ref.email && (
                        <div className="text-[10px] text-[#2563EB]">
                          {ref.email}
                        </div>
                      )}
                      <div className="text-[10px] text-gray-600">
                        {ref.title}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
