import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = "AIzaSyDjUPBjZR-CZ2d9o0enQ_6NRmY0B6Fs3O0";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are a CV data extraction expert for 21Datas consulting company. Your job is to parse raw CV text and extract structured data.

You MUST respond with valid JSON only. No markdown, no explanation, just the JSON object.

The JSON schema you must follow:
{
  "firstName": "string",
  "lastName": "string", 
  "titles": ["string array of professional titles, max 3 - e.g. 'data analyst', 'business analyst'"],
  "email": "string (if not provided use firstname.lastname@21datas.ch)",
  "linkedin": "string (just the path like linkedin.com/in/name)",
  "phone": "string",
  "birthDate": "string (DD.MM.YYYY format)",
  "location": "string (city, country or city)",
  "certifications": ["string array"],
  "drivingLicense": boolean,
  "photoUrl": "",
  "extraLogos": [],
  "experiences": [
    {
      "dateRange": "string (e.g. '2021 - 2025' or 'today' or 'aujourd'hui' for current)",
      "company": "string (company name in bold/caps)",
      "location": "string (city)",
      "roles": [
        {
          "title": "string (job title)",
          "bullets": ["string array of responsibilities"]
        }
      ]
    }
  ],
  "previousExperiencesSummary": {
    "title": "string (optional, e.g. 'Previous experiences (summary)')",
    "bullets": ["string array"]
  } or null,
  "competences": [
    {
      "icon": "string (emoji or icon identifier: 💻 for IT/Computing, 🔧 for tools/platforms, 📊 for data viz, 🗣 for languages/personal, ⚙️ for frameworks, 🎯 for functional)",
      "title": "string (category name)",
      "subcategories": [
        {
          "title": "string (subcategory name, can be underlined)",
          "items": ["string array"]
        }
      ] or null,
      "items": ["string array if no subcategories"] or null
    }
  ],
  "references": [
    {
      "name": "string",
      "email": "string (optional)",
      "title": "string (job title - company)"
    }
  ],
  "projects": [
    {
      "year": "string",
      "sector": "string (bold sector name like 'banking', 'medical')",
      "description": "string"
    }
  ],
  "education": [
    {
      "dateRange": "string (e.g. '2007 - 2010')",
      "institution": "string (school name)",
      "degree": "string (degree title)",
      "details": ["string array of specializations"] or null
    }
  ]
}

IMPORTANT RULES:
1. The FIRST experience should ALWAYS be at 21DATAS in Lausanne, with dates starting from 2025 or "today"/"aujourd'hui" if current
2. Keep original language (French or English) for content
3. For section headers in the CV, detect the language and use appropriate headers (EXPERIENCE/EXPÉRIENCES, COMPÉTENCES/SKILLS, ÉDUCATION/EDUCATION, etc.)
4. Extract ALL information - don't skip any details
5. Group competences logically (IT/Computing, Tools/Platforms, Data viz, Languages/Personal, Frameworks, Functional)
6. If experiences mention a summary of previous roles, use previousExperiencesSummary
7. For email, default to firstname.lastname@21datas.ch if not provided
8. LinkedIn should be in format linkedin.com/in/name
9. Return ONLY the JSON, no markdown code fences, no explanation
10. If projects are mentioned, extract them with year, sector and description
11. References should include name and title/position`;

export async function POST(request: NextRequest) {
  try {
    const { message, currentCvData } = await request.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-3-pro-preview",
    });

    let userPrompt: string;

    if (currentCvData) {
      userPrompt = `Here is the current CV data:
${JSON.stringify(currentCvData, null, 2)}

The user wants to modify it with this instruction: "${message}"

Apply the modifications and return the complete updated CV data as JSON. Keep all existing data that wasn't mentioned for modification. Return ONLY the JSON.`;
    } else {
      userPrompt = `Parse the following CV content and extract all information into the structured JSON format. Return ONLY valid JSON, no markdown.

CV Content:
${message}`;
    }

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      systemInstruction: { role: "model", parts: [{ text: SYSTEM_PROMPT }] },
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 8192,
      },
    });

    const response = result.response;
    const text = response.text();

    // Try to parse as JSON, stripping any markdown fences
    let cleanJson = text.trim();
    if (cleanJson.startsWith("```json")) {
      cleanJson = cleanJson.slice(7);
    }
    if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.slice(3);
    }
    if (cleanJson.endsWith("```")) {
      cleanJson = cleanJson.slice(0, -3);
    }
    cleanJson = cleanJson.trim();

    const cvData = JSON.parse(cleanJson);

    return NextResponse.json({
      success: true,
      cvData,
      message: "CV data extracted successfully!",
    });
  } catch (error: unknown) {
    console.error("Gemini API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
