"use client";

import React, { useState, useRef, useCallback } from "react";
import CVPreview from "@/components/CVPreview";
import ChatPanel from "@/components/ChatPanel";
import { CVData } from "@/types/cv";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

export default function Home() {
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [exporting, setExporting] = useState(false);
  const cvRef = useRef<HTMLDivElement>(null);

  const handleCvDataUpdate = useCallback((data: CVData) => {
    setCvData(data);
  }, []);

  const handleExportPDF = async () => {
    const cvElement = document.getElementById("cv-content");
    if (!cvElement) return;

    setExporting(true);
    try {
      const canvas = await html2canvas(cvElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: 794,
        windowWidth: 794,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;

      pdf.addImage(imgData, "PNG", imgX, 0, imgWidth * ratio, imgHeight * ratio);

      const filename = cvData
        ? `CV_${cvData.firstName}_${cvData.lastName}_21Datas.pdf`
        : "CV_21Datas.pdf";
      pdf.save(filename);
    } catch (error) {
      console.error("PDF export error:", error);
      alert("Error exporting PDF. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-end">
            <span className="text-2xl font-black text-[#2563EB] leading-none">
              2
            </span>
            <span className="text-2xl font-black text-[#2563EB] leading-none relative -top-[5px]">
              1
            </span>
          </div>
          <div>
            <span className="text-sm font-bold tracking-wider text-[#2563EB]">
              21 DATAS
            </span>
            <span className="text-xs text-gray-500 ml-2">CV Maker</span>
          </div>
        </div>
        {cvData && (
          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="px-4 py-1.5 bg-[#2563EB] text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {exporting ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Exporting...
              </>
            ) : (
              <>📄 Export PDF</>
            )}
          </button>
        )}
      </header>

      {/* Main split layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: CV Preview */}
        <div className="flex-1 overflow-auto cv-preview-scroll bg-gray-200 p-6 flex justify-center">
          <div ref={cvRef}>
            {cvData ? (
              <div className="shadow-2xl">
                <CVPreview data={cvData} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-400">
                  <div className="text-6xl mb-4">📄</div>
                  <h3 className="text-xl font-semibold mb-2">
                    No CV Generated Yet
                  </h3>
                  <p className="text-sm max-w-[300px]">
                    Paste CV content in the chat panel to generate a CV preview
                    in 21Datas brand style.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Chat Panel */}
        <div className="w-[420px] border-l border-gray-300 flex-shrink-0">
          <ChatPanel onCvDataUpdate={handleCvDataUpdate} cvData={cvData} />
        </div>
      </div>
    </div>
  );
}
