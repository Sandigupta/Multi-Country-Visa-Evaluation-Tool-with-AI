import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Dropzone } from "../file-upload/Dropzone";
import { FileList } from "../file-upload/FileList";
import { Mail, CheckCircle2 } from "lucide-react";

// Mock Data
const VISA_OPTIONS: Record<string, string[]> = {
    "United States": ["H-1B", "O-1A", "O-1B", "L-1A", "L-1B", "EB-1A", "EB-2 NIW"],
    "Germany": ["EU Blue Card", "ICT Permit", "Freelance Visa"],
    "Ireland": ["Critical Skills Employment Permit", "General Employment Permit"],
    "France": ["Talent Passport", "Salarie en Mission"],
    "Netherlands": ["Knowledge Migrant Permit (HSM)"],
    "Poland": ["Work Permit Type C", "EU Blue Card"],
    "Australia": ["Global Talent Visa (858)", "TSS (482)"]
};

export default function VisaEvaluationForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        country: "",
        visaType: "",
        email: "",
        context: ""
    });
    const [files, setFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({ ...formData, country: e.target.value, visaType: "" });
    };

    const handleFilesSelected = (newFiles: File[]) => {
        setFiles((prev) => [...prev, ...newFiles]);
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            const uploadData = new FormData();
            uploadData.append("country", formData.country);
            uploadData.append("visaType", formData.visaType);
            uploadData.append("email", formData.email);
            uploadData.append("context", formData.context);

            files.forEach((file) => {
                uploadData.append("documents", file);
            });

            // Call Real API
            const response = await fetch("http://localhost:5000/api/evaluate", {
                method: "POST",
                body: uploadData,
            });

            if (!response.ok) {
                throw new Error("Evaluation failed");
            }

            const data = await response.json();

            // Store result in LocalStorage for the result page to pick up
            // The API returns the evaluationResult object directly
            const minimalUserData = {
                country: formData.country,
                visaType: formData.visaType,
                email: formData.email
            };

            localStorage.setItem("currentEvaluation", JSON.stringify(minimalUserData));
            // Store the real result (data IS the evaluationResult)
            localStorage.setItem("realEvaluationResult", JSON.stringify(data));

            setIsLoading(false);
            navigate("/result");

        } catch (error) {
            console.error("API Error:", error);
            setIsLoading(false);
            // Optional: Show error toast
        }
    };

    const isFormValid =
        formData.country &&
        formData.visaType &&
        formData.email &&
        files.length > 0;

    return (
        <div className="grid lg:grid-cols-2 gap-12 items-start animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* LEFT COLUMN: Form */}
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Start your evaluation</h1>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 text-xs font-medium rounded-full cursor-default border border-green-500/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Ready to start
                    </div>
                </div>

                <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                    <CardContent className="p-6 space-y-6">

                        {/* Country & Visa */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    I want to work in
                                </label>
                                <Select value={formData.country} onChange={handleCountryChange}>
                                    <option value="" disabled>Select Country</option>
                                    {Object.keys(VISA_OPTIONS).map(country => (
                                        <option key={country} value={country}>{country}</option>
                                    ))}
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Visa Type
                                </label>
                                <Select
                                    value={formData.visaType}
                                    onChange={(e) => setFormData({ ...formData, visaType: e.target.value })}
                                    disabled={!formData.country}
                                    className={!formData.country ? "opacity-50" : ""}
                                >
                                    <option value="" disabled>Select Visa Type</option>
                                    {formData.country && VISA_OPTIONS[formData.country]?.map(visa => (
                                        <option key={visa} value={visa}>{visa}</option>
                                    ))}
                                </Select>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="pl-9"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Context */}
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-sm font-medium leading-none">Add context (optional)</label>
                            </div>
                            <Textarea
                                placeholder="Highlight marquee achievements, upcoming milestones, or anything else we should know."
                                className="resize-none min-h-[100px]"
                                maxLength={600}
                                value={formData.context}
                                onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                            />
                            <p className="text-xs text-right text-muted-foreground">{formData.context.length}/600 characters</p>
                        </div>

                        {/* Upload */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Resume / Documents</label>
                            <div className="border border-dashed border-primary/20 rounded-xl p-1 bg-secondary/5">
                                <Dropzone onFilesSelected={handleFilesSelected} />
                            </div>
                            <FileList files={files} onRemove={removeFile} />
                        </div>

                        <Button
                            className="w-full h-12 text-base shadow-lg shadow-primary/20"
                            onClick={handleSubmit}
                            disabled={!isFormValid || isLoading}
                            isLoading={isLoading}
                        >
                            Start Evaluation
                        </Button>
                        <p className="text-xs text-center text-muted-foreground pt-2">
                            Your information is secure and confidential.
                        </p>

                    </CardContent>
                </Card>
            </div>

            {/* RIGHT COLUMN: Hero/Marketing */}
            <div className="hidden lg:block space-y-8 pt-8 pl-8 sticky top-24">
                <div>
                    <p className="text-sm font-semibold tracking-wider text-muted-foreground uppercase mb-4">Begin Your Evaluation</p>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
                        Discover the best <span className="text-primary">Visa options</span> for your story in minutes.
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Upload your resume, add context, and let OpenSphere craft a visa strategy with expert-level analysis, personalized scoring, and a shareable report.
                    </p>
                </div>

                <Button variant="outline" className="h-12 px-6">
                    Talk to our team
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        "Personalized visa fit across 14 pathways",
                        "Expert reasoning & USCIS-aligned scoring",
                        "Instant shareable evaluation link + downloadable PDF",
                        "End-to-end encryption with automatic file cleanup"
                    ].map((item, i) => (
                        <div key={i} className="flex gap-3 p-4 rounded-lg bg-card border border-border/40 shadow-sm">
                            <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <span className="text-sm font-medium">{item}</span>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/40">
                    <div className="space-y-1">
                        <div className="text-2xl font-bold">5K+</div>
                        <div className="text-xs text-muted-foreground">Evaluations delivered</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-2xl font-bold">&lt;1 min</div>
                        <div className="text-xs text-muted-foreground">Avg. turnaround</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-2xl font-bold">50K+</div>
                        <div className="text-xs text-muted-foreground">Documents Processed</div>
                    </div>
                </div>

                <div className="p-4 rounded-lg border border-dashed border-border bg-secondary/20 text-sm text-muted-foreground">
                    No credit card required. Share the report with anyone you want instantly.
                </div>
            </div>

        </div>
    );
}
