import { motion } from "framer-motion";

interface ScoreGaugeProps {
    score: number; // 0-100
    label?: string;
}

export function ScoreGauge({ score, label = "Chance of Success" }: ScoreGaugeProps) {
    // SVG parameters
    // SVG parameters
    const radius = 70;
    const stroke = 18;
    const normalizedRadius = radius - stroke; // Adjusted to maximize size within SVG
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-card rounded-2xl border border-border/50 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">{label}</h3>
            <div className="relative flex items-center justify-center">
                <svg
                    height={radius * 2}
                    width={radius * 2}
                    className="rotate-[-90deg]"
                >
                    <circle
                        stroke="currentColor"
                        fill="transparent"
                        strokeWidth={stroke}
                        strokeDasharray={circumference + " " + circumference}
                        style={{ strokeDashoffset: 0 }}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        className="text-secondary"
                    />
                    <motion.circle
                        stroke="currentColor"
                        fill="transparent"
                        strokeWidth={stroke}
                        strokeDasharray={circumference + " " + circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        strokeLinecap="round"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        className="text-primary"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold tracking-tighter text-foreground">{score}%</span>
                </div>
            </div>
        </div>
    );
}
