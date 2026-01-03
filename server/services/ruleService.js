const calculateScore = (submission, visa) => {
    let score = 50; // Base score

    // Placeholder logic - real logic would parse resume/answers
    if (submission.context && submission.context.length > 100) {
        score += 10;
    }

    if (submission.documents && submission.documents.length > 0) {
        score += 10;
    }

    // Cap score
    const maxScore = visa.maxScoreCap || 100;
    return Math.min(score, maxScore);
};

module.exports = {
    calculateScore
};
