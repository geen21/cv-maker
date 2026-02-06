"use client";

import React, { useState, useRef, useCallback } from "react";
import CVPreview from "@/components/CVPreview";
import ChatPanel from "@/components/ChatPanel";
import { CVData } from "@/types/cv";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import logo21datas from "@/image/21DATAS LOGO-05.png";

export default function Home() {
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [exporting, setExporting] = useState(false);
  const cvRef = useRef<HTMLDivElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleCvDataUpdate = useCallback((data: CVData) => {
    setCvData(data);
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !cvData) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setCvData({ ...cvData, photoUrl: dataUrl });
    };
    reader.readAsDataURL(file);
    // Reset so the same file can be re-selected
    e.target.value = "";
  };

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
    <div className="h-screen flex flex-col bg-white">
      {/* Top bar */}
      <header className="px-6 py-3 flex items-center justify-between flex-shrink-0 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <img src={logo21datas.src} alt="21 DATAS" className="h-7" />
          <span className="text-xs text-gray-300 font-light">|</span>
          <span className="text-xs text-gray-400 font-light tracking-wide">
            CV Maker
          </span>
        </div>
        {cvData && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => photoInputRef.current?.click()}
              className="px-4 py-1.5 border border-[#022bfe] text-[#022bfe] rounded text-xs font-medium hover:bg-[#022bfe]/5 transition-colors"
            >
              {cvData.photoUrl ? "Change Photo" : "Upload Photo"}
            </button>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className="px-4 py-1.5 bg-[#022bfe] text-white rounded text-xs font-medium hover:opacity-90 disabled:opacity-40 transition-opacity"
            >
              {exporting ? "Exporting..." : "Export PDF"}
            </button>
          </div>
        )}
      </header>

      {/* Main split layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: CV Preview */}
        <div className="flex-1 overflow-auto cv-preview-scroll bg-[#f7f7f8] flex justify-center py-8 px-4">
          <div ref={cvRef}>
            {cvData ? (
              <div className="shadow-sm">
                <CVPreview data={cvData} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto mb-4 rounded-full border-2 border-[#022bfe] flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#022bfe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-400 font-light">
                    Paste CV content in the chat to begin
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Chat Panel */}
        <div className="w-[400px] border-l border-gray-100 flex-shrink-0">
          <ChatPanel onCvDataUpdate={handleCvDataUpdate} cvData={cvData} />
        </div>
      </div>
    </div>
  );
}
