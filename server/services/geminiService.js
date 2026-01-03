const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const generateEvaluation = async (submission, visa) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // Construct Prompt
        const prompt = `
      You are an expert immigration consultant. Evaluate the following candidate for a ${visa.visaType} visa for ${submission.country}.

      CANDIDATE PROFILE:
      - Context/Background: ${submission.context}
      - Documents Provided: ${submission.documents.map(d => d.fileName).join(', ')}

      VISA REQUIREMENTS:
      - Mandatory Checks: ${visa.mandatoryChecks.join(', ')}
      - Scoring Factors: ${visa.scoringFactors.join(', ')}

      TASK:
      Generate a comprehensive evaluation for the ${visa.visaType} of ${submission.country}.
      You must identify the key criteria relevant to this specific visa (e.g. Education, Experience, Financial Solvency, Ties to Home Country, Specific Skills, etc.) and analyze the candidate against EACH of them.

      Output strictly valid JSON with the following structure:
      {
        "score": <Number 0-100 overall score>,
        "overallSummary": "<String: Professional summary of the entire profile>",
        "criteria": [
          {
            "id": "<String: unique_id_c1>",
            "title": "<String: Name of the criteria (e.g. Educational Qualification)>",
            "status": "<String: 'strong', 'medium', or 'weak'>",
            "score": <Number 0-100 for this specific criteria>,
            "description": "<String: Overview of this criteria analysis>",
            "scoreExplanation": "<String: Why this score was given>",
            "supportingMaterial": ["<String>"],
            "improvementNeeded": ["<String>"],
            "recommendations": ["<String>"]
          },
          ... (Generate as many criteria sections as relevant for this visa type)
        ],
        "conclusion": "<String: Final concluding remarks and key next steps>"
      }
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean markdown code blocks if present
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(cleanText);

    } catch (error) {
        console.error("Gemini AI Error:", error);
        // Fallback if AI fails
        return {
            score: 50,
            overallSummary: "We could not generate a detailed AI evaluation at this time due to high demand. Please try again later.",
            criteria: [
                {
                    id: "fallback-1",
                    title: "General Verification",
                    status: "medium",
                    score: 50,
                    description: "AI analysis unavailable. Please verify documents manually.",
                    scoreExplanation: "Default score due to service unavailability.",
                    supportingMaterial: ["Documents received"],
                    improvementNeeded: ["Manual review required"],
                    recommendations: ["Consult with an expert"]
                }
            ],
            conclusion: "AI Service Temporarily Unavailable. Please retry."
        };
    }
};

module.exports = {
    generateEvaluation
};
