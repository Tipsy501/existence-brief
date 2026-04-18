import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { FileDown, Lock } from 'lucide-react';
import Button from './Button';
import { BriefResult } from '../lib/ai-service';

interface PDFExportProps {
  briefData: BriefResult;
  userName: string;
  isPremium: boolean;
}

export default function PDFExport({ briefData, userName, isPremium }: PDFExportProps) {
  const [generating, setGenerating] = useState(false);
  
  const generatePDF = async () => {
    if (!isPremium) {
      window.location.href = '/upgrade';
      return;
    }
    
    setGenerating(true);
    
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;
      let y = 20;
      
      // Cover page
      doc.setFontSize(24);
      doc.setTextColor(79, 70, 229); // Indigo
      doc.text('EXISTENCE BRIEF', pageWidth/2, y, { align: 'center' });
      
      y += 20;
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text('STRATEGIC CLARITY REPORT', pageWidth/2, y, { align: 'center' });
      
      y += 15;
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Prepared for: ${userName}`, pageWidth/2, y, { align: 'center' });
      
      y += 10;
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth/2, y, { align: 'center' });
      
      y += 30;
      doc.setFontSize(10);
      doc.setTextColor(79, 70, 229);
      doc.text('THE ARCHITECT\'S PERSPECTIVE', pageWidth/2, y, { align: 'center' });
      
      y += 10;
      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59);
      const focusText = doc.splitTextToSize(`"${briefData.focusStatement}"`, contentWidth);
      doc.text(focusText, pageWidth/2, y, { align: 'center' });

      // Page 2: Summary
      doc.addPage();
      y = 20;
      doc.setFontSize(18);
      doc.setTextColor(79, 70, 229);
      doc.text('Executive Summary', margin, y);
      
      y += 12;
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      const summaryLines = doc.splitTextToSize(briefData.summary, contentWidth);
      doc.text(summaryLines, margin, y);
      
      // Page 3: Strategic Paths
      doc.addPage();
      y = 20;
      doc.setFontSize(18);
      doc.setTextColor(79, 70, 229);
      doc.text('Strategic Trajectories', margin, y);
      
      const paths = [
        { type: 'safe' as const, data: briefData.paths.safe },
        { type: 'balanced' as const, data: briefData.paths.balanced },
        { type: 'growth' as const, data: briefData.paths.growth }
      ];

      paths.forEach((path, i) => {
        y += 15;
        const isRecommended = briefData.recommendedPath === path.type;
        
        doc.setFontSize(14);
        if (isRecommended) {
          doc.setTextColor(79, 70, 229);
        } else {
          doc.setTextColor(30, 41, 59);
        }
        doc.text(`${i + 1}. ${path.data.title}${isRecommended ? ' (Recommended Path)' : ''}`, margin, y);
        
        y += 8;
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        const pathDesc = doc.splitTextToSize(path.data.description, contentWidth);
        doc.text(pathDesc, margin, y);
        y += (pathDesc.length * 5);
      });
      
      // Page 4: Action Plan
      doc.addPage();
      y = 20;
      doc.setFontSize(18);
      doc.setTextColor(79, 70, 229);
      doc.text('90-Day Tactical Plan', margin, y);
      
      const actionSteps = [
        { day: '30', actions: briefData.actionPlan.day30 },
        { day: '60', actions: briefData.actionPlan.day60 },
        { day: '90', actions: briefData.actionPlan.day90 }
      ];

      actionSteps.forEach((step) => {
        y += 15;
        doc.setFontSize(13);
        doc.setTextColor(79, 70, 229);
        doc.text(`Phase: Day ${step.day}`, margin, y);
        
        y += 8;
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        
        step.actions.forEach((action, j) => {
          y += 6;
          // Small bullet
          doc.circle(margin + 2, y - 1, 0.5, 'F');
          doc.text(doc.splitTextToSize(action, contentWidth - 10), margin + 6, y);
          // If text wraps, we should handle Y increment but splitTextToSize here is simple
        });
      });
      
      // Footer on all pages
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text('Confidential Strategic Intelligence - existencebrief.com', pageWidth/2, 285, { align: 'center' });
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, 285, { align: 'right' });
      }
      
      doc.save(`Existence-Brief-${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (err) {
      console.log('PDF generation failed:', err);
    } finally {
      setGenerating(false);
    }
  };
  
  return (
    <Button 
      onClick={generatePDF} 
      loading={generating}
      variant={isPremium ? 'primary' : 'secondary'}
      className="gap-2"
    >
      {isPremium ? (
        <>
          <FileDown size={18} />
          Download Strategic Report (PDF)
        </>
      ) : (
        <>
          <Lock size={18} />
          PDF Report Export (Premium)
        </>
      )}
    </Button>
  );
}
