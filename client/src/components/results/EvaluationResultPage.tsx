import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScoreGauge } from "./ScoreGauge";
import { CriteriaAnalysis } from "./CriteriaAnalysis";
import { generateMockEvaluation, type EvaluationResult } from "../../lib/mock-engine";

import { jsPDF } from "jspdf";


export default function EvaluationResultPage() {
    const navigate = useNavigate();
    const [result, setResult] = useState<EvaluationResult | null>(null);
    const [userData, setUserData] = useState<{ country: string; visaType: string; email: string } | null>(null);


    useEffect(() => {
        // Load data from LocalStorage
        const stored = localStorage.getItem("currentEvaluation");
        if (!stored) {
            navigate("/"); // Redirect if no data
            return;
        }

        try {
            const data = JSON.parse(stored);
            setUserData(data);

            // Check for real API result first
            const realResultEncoded = localStorage.getItem("realEvaluationResult");

            if (realResultEncoded) {
                // console.log("Using Real API Result");
                const realResult = JSON.parse(realResultEncoded);
                setResult(realResult);
            } else {
                // Fallback to mock if no real result found (legacy/dev support)
                // console.log("Using Mock Engine");
                const mockResult = generateMockEvaluation(data.visaType, data.country);
                setResult(mockResult);
            }
        } catch (e) {
            console.error("Failed to parse local data", e);
            navigate("/");
        }
    }, [navigate]);



    const handleDownload = () => {
        if (!result || !userData) return;

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 15;
        let yPos = 20;

        // Title
        doc.setFontSize(22);
        doc.setTextColor(33, 33, 33);
        doc.text("Visa Evaluation Report", margin, yPos);
        yPos += 10;

        // Subtitles
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(`Candidate: ${userData.email}`, margin, yPos);
        yPos += 6;
        doc.text(`Target: ${userData.visaType} (${userData.country})`, margin, yPos);
        yPos += 15;

        // Score
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 10;

        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text(`Overall Score: ${result.score}/100`, margin, yPos);
        yPos += 10;

        // Overview
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        const summaryLines = doc.splitTextToSize(result.overallSummary, pageWidth - 2 * margin);
        doc.text(summaryLines, margin, yPos);
        yPos += (summaryLines.length * 6) + 10;

        // Detailed Criteria Loop
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Detailed Criteria Analysis", margin, yPos);
        yPos += 10;

        result.criteria.forEach((criterion) => {
            // Check page break
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }

            // Criterion Title
            doc.setFontSize(14);
            doc.setTextColor(0, 50, 100); // Dark Blue
            doc.setFont("helvetica", "bold");
            doc.text(`${criterion.title} (${criterion.score}/100)`, margin, yPos);
            yPos += 8;

            // Status Badge text
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Status: ${criterion.status.toUpperCase()}`, margin, yPos);
            yPos += 8;

            // Description
            doc.setFontSize(11);
            doc.setTextColor(0);
            doc.setFont("helvetica", "normal");
            const descLines = doc.splitTextToSize(criterion.description, pageWidth - 2 * margin);
            doc.text(descLines, margin, yPos);
            yPos += (descLines.length * 5) + 6;

            // Supporting Material
            if (criterion.supportingMaterial.length > 0) {
                doc.setFont("helvetica", "bold");
                doc.text("Supporting Material:", margin, yPos);
                yPos += 6;
                doc.setFont("helvetica", "normal");
                criterion.supportingMaterial.forEach(item => {
                    const itemLines = doc.splitTextToSize(`• ${item}`, pageWidth - 2 * margin - 5);
                    doc.text(itemLines, margin + 5, yPos);
                    yPos += (itemLines.length * 5) + 2;
                });
                yPos += 4;
            }

            // Improvement (if any)
            if (criterion.improvementNeeded.length > 0) {
                doc.setFont("helvetica", "bold");
                doc.setTextColor(180, 0, 0); // Red hint
                doc.text("Improvement Needed:", margin, yPos);
                yPos += 6;
                doc.setFont("helvetica", "normal");
                doc.setTextColor(0);
                criterion.improvementNeeded.forEach(item => {
                    const itemLines = doc.splitTextToSize(`• ${item}`, pageWidth - 2 * margin - 5);
                    doc.text(itemLines, margin + 5, yPos);
                    yPos += (itemLines.length * 5) + 2;
                });
                yPos += 4;
            }

            yPos += 10; // Spacing between criteria
        });

        // Conclusion
        if (yPos > 240) {
            doc.addPage();
            yPos = 20;
        }

        doc.setDrawColor(200);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 10;

        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.setFont("helvetica", "bold");
        doc.text("Conclusion", margin, yPos);
        yPos += 8;

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        const conclusionLines = doc.splitTextToSize(result.conclusion, pageWidth - 2 * margin);
        doc.text(conclusionLines, margin, yPos);

        doc.save(`${userData.visaType}_Evaluation_Report.pdf`);
    };

    if (!result || !userData) return <div className="p-10 text-center animate-pulse">Analyzing...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-16">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
                <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <span className="uppercase tracking-wider font-semibold text-primary">Evaluation Ready</span>
                        <span>•</span>
                        <span>{userData.country}</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Your personalized path: {userData.visaType}</h1>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={() => navigate("/")}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Reset
                    </Button>

                    <Button size="sm" onClick={handleDownload}>
                        <Download className="h-4 w-4 mr-2" />
                        Download Report
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">

                {/* Left Column: Score & Summary */}
                <div className="space-y-6">
                    <ScoreGauge score={result.score} />

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {result.overallSummary}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg text-primary">Conclusion</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm font-medium leading-relaxed">
                                {typeof result.conclusion === 'string' ? result.conclusion : "Detailed conclusion available in full report."}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Detailed Criteria */}
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Detailed Criteria Analysis</h2>
                        <CriteriaAnalysis criteria={result.criteria} />
                    </div>

                    <div className="p-4 rounded-lg bg-secondary/50 border border-border text-xs text-muted-foreground text-center">
                        Important Notice: This evaluation report is generated by OpenSphere technology and should not be considered as legal advice.
                        Please consult with a qualified immigration attorney for verified legal counsel.
                    </div>
                </div>

            </div>
        </div>
    );
}
