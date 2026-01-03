export interface EvaluationResult {
    score: number;
    overallSummary: string;
    criteria: {
        id: string;
        title: string;
        status: "strong" | "medium" | "weak";
        score: number;
        description: string;
        scoreExplanation: string;
        supportingMaterial: string[];
        improvementNeeded: string[];
        recommendations: string[];
    }[];
    conclusion: string;
}

export function generateMockEvaluation(visaType: string, country: string): EvaluationResult {
    // Deterministic "random" based on string length
    const seed = visaType.length + country.length;
    const score = Math.max(30, Math.min(92, (seed * 7) % 100)); // Pseudo-random 30-92%

    const isStrong = score > 70;

    return {
        score,
        overallSummary: `The applicant demonstrates ${isStrong ? "strong" : "moderate"} qualifications for the ${visaType} pathway. Their profile shows solid alignment with educational and professional requirements, though some documentation gaps may need addressing to maximize approval chances.`,
        criteria: [
            {
                id: "c1",
                title: "Specialty Occupation Qualification",
                status: "medium",
                score: 65,
                description: "The applicant demonstrates solid foundational qualifications for a specialty occupation in software development/IT. They possess a relevant B.Tech degree in Computer Science & Engineering from an established institution, which directly aligns with specialty occupation requirements. However, the applicant is still a current student with no demonstrated professional work experience, which is a significant gap for sponsorship requiring practical application of specialty knowledge.",
                scoreExplanation: "The score of 65 reflects that the applicant meets basic expectations for specialty occupation qualification through relevant degree and technical foundation, but falls short of strong evidence due to absence of professional experience. The applicant has the educational credentials and technical skills that align with specialty occupation roles, but lacks the professional demonstrated application of these skills.",
                supportingMaterial: [
                    "B.Tech in Computer Science & Engineering - a recognized institution offering specialty occupation degree",
                    "High CGPA of 8.00/10 demonstrates strong academic performance in specialized coursework",
                    "Comprehensive technical stack aligned with industry demand (Python, C++, JavaScript, React.js, AWS)",
                    "Strong foundation in core CS concepts (OOPs, DBMS, DSA, Agile Methodology)"
                ],
                improvementNeeded: [
                    "No professional work experience or internships mentioned - typically requires demonstrated practical application",
                    "Currently pursuing degree (graduation 2026) - applicant will be a fresh graduate at time of application",
                    "No evidence of certifications, published work, patents, or industry recognition",
                    "No specific project portfolio or real-world application examples provided"
                ],
                recommendations: [
                    "Secure a full-time software development position or internship before application to demonstrate practical skills",
                    "Develop a portfolio of real-world projects showcasing full-stack development capabilities",
                    "Obtain industry-recognized certifications (AWS Solutions Architect, Kubernetes Administrator) to supplement academic credentials",
                    "Contribute meaningfully to open-source projects to establish professional credibility"
                ]
            },
            {
                id: "c2",
                title: "Degree Field & Job Requirements Match",
                status: "strong",
                score: 90,
                description: "The applicant's educational background aligns perfectly with the standard requirements for this role. The coursework covers all essential theoretical and practical aspects required for a software engineering position.",
                scoreExplanation: "The applicant scores 90 (strong evidence) based on clear alignment between degree field and professional expertise. The B.Tech in Computer Science & Engineering is directly relevant to the claimed roles, and the technical skill set demonstrates substantive knowledge application. The information provided is sufficient to establish strong match.",
                supportingMaterial: [
                    "Degree major matches the job title's standard ONET classification",
                    "Coursework includes advanced algorithms, system design, and database management",
                    "University is accredited and recognized by international standards"
                ],
                improvementNeeded: [],
                recommendations: []
            },
            {
                id: "c3",
                title: "Beneficiary's Educational Credentials",
                status: "medium",
                score: 70,
                description: "While the degree is relevant, the lack of a completed transcript or final degree certificate (due to ongoing studies) requires careful documentation.",
                scoreExplanation: "The applicant receives a score of 70 (meeting basic expectations) because while the undergraduate program is from a reputable institution with a good CGPA, the degree remains incomplete as of the evaluation date. H-1B visa sponsorship typically requires a completed bachelor's degree at minimum.",
                supportingMaterial: [
                    "Transcripts for completed semesters are available",
                    "University issuance of provisional certificates is possible"
                ],
                improvementNeeded: [
                    "Missing final degree certificate (pending graduation)",
                    "Need accurate translation of any non-English documents"
                ],
                recommendations: [
                    "Request a provisional degree certificate from the university registrar",
                    "Ensure all varied documents are collated into a single academic dossier"
                ]
            },
            {
                id: "c4",
                title: "Employer-Beneficiary Relationship & LCA",
                status: "weak",
                score: 40,
                description: "There is currently no evidence of a valid job offer or employer sponsorship, which is a critical prerequisite for this visa category.",
                scoreExplanation: "Unable to provide a comprehensive analysis as no applicant information has been provided in the request regarding the employer. The evaluation requires specific details about the employer's details and sponsorship history.",
                supportingMaterial: [],
                improvementNeeded: [
                    "No petitioning employer identified",
                    "No Labor Condition Application (LCA) filed or certified",
                    "No indication of prevailing wage determination"
                ],
                recommendations: [
                    "Begin interviewing with employers who are willing to sponsor visa petitions",
                    "Verify that potential salary offers meet the prevailing wage for the intended geographic location"
                ]
            }
        ],
        conclusion: `Based on the provided documents, you have a ${score}% chance of success. We recommend addressing the experience gap by securing internships or full-time employment to strengthen the 'Specialty Occupation' claim.`
    };
}
