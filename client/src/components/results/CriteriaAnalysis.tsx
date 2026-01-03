import { ChevronDown, Info } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";

interface CriteriaItem {
    id: string;
    title: string;
    status: "strong" | "medium" | "weak";
    score: number;
    description: string;
    scoreExplanation: string;
    supportingMaterial: string[];
    improvementNeeded: string[];
    recommendations: string[];
}

interface CriteriaAnalysisProps {
    criteria: CriteriaItem[];
}

export function CriteriaAnalysis({ criteria }: CriteriaAnalysisProps) {
    const [expandedIds, setExpandedIds] = useState<string[]>(criteria[0]?.id ? [criteria[0].id] : []);
    const [infoTooltipId, setInfoTooltipId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const allExpanded = criteria.length > 0 && expandedIds.length === criteria.length;

    const handleToggleAll = () => {
        if (allExpanded) {
            setExpandedIds([]);
        } else {
            setExpandedIds(criteria.map(c => c.id));
        }
        setInfoTooltipId(null);
    };

    const getStatusColor = (status: "strong" | "medium" | "weak") => {
        switch (status) {
            case "strong": return "bg-green-500/20 text-green-600 dark:text-green-400";
            case "medium": return "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400";
            case "weak": return "bg-red-500/20 text-red-600 dark:text-red-400";
        }
    };

    const getStatusLabel = (status: "strong" | "medium" | "weak") => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Criteria Analysis</h3>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-2 bg-card border-border/50 hover:bg-secondary/50"
                    onClick={handleToggleAll}
                >
                    <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", allExpanded ? "rotate-180" : "")} />
                    {allExpanded ? "Collapse All" : "Expand All"}
                </Button>
            </div>

            <div className="space-y-3">
                {criteria.map((item) => (
                    <div
                        key={item.id}
                        className="rounded-2xl border-none bg-secondary/50 dark:bg-secondary transition-all duration-200"
                    >
                        <div
                            onClick={() => toggleExpand(item.id)}
                            className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors rounded-2xl"
                        >
                            <div className="flex items-center gap-4">
                                <span className="font-medium text-base text-foreground">{item.title}</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className={cn("px-3 py-1 rounded-full text-xs font-bold border-none min-w-[80px] text-center", getStatusColor(item.status))}>
                                    {getStatusLabel(item.status)}
                                </div>
                                <div
                                    className="relative"
                                    onMouseEnter={() => setInfoTooltipId(item.id)}
                                    onMouseLeave={() => setInfoTooltipId(null)}
                                >
                                    <div className="h-6 w-6 rounded-full hover:bg-muted/50 flex items-center justify-center transition-colors cursor-help">
                                        <Info className={cn("h-4 w-4 transition-colors", infoTooltipId === item.id ? "text-primary" : "text-muted-foreground/50 hover:text-muted-foreground")} />
                                    </div>
                                    <AnimatePresence>
                                        {infoTooltipId === item.id && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95, y: 10, x: -10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="absolute z-50 right-0 top-8 w-72 md:w-80 p-4 rounded-xl border border-border/50 bg-[#1A1F2E] text-white shadow-xl backdrop-blur-xl"
                                            >
                                                <div className="text-xs leading-relaxed opacity-90 font-light">
                                                    {item.scoreExplanation || item.description}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <ChevronDown
                                    className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200",
                                        expandedIds.includes(item.id) ? "rotate-180" : ""
                                    )}
                                />
                            </div>
                        </div>

                        <AnimatePresence initial={false}>
                            {expandedIds.includes(item.id) && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-5 pb-6 pt-2 space-y-6 border-t border-white/5 bg-black/5 dark:bg-black/20 rounded-b-2xl">
                                        <div>
                                            <h4 className="text-sm font-semibold text-foreground mb-2">Overview</h4>
                                            <p className="text-sm text-foreground/80 leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>

                                        {item.supportingMaterial.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-2">Supporting Material</h4>
                                                <ul className="space-y-1.5">
                                                    {item.supportingMaterial.map((point, i) => (
                                                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                                                            <span>{point}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {item.improvementNeeded.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">Improvement Needed</h4>
                                                <ul className="space-y-1.5">
                                                    {item.improvementNeeded.map((point, i) => (
                                                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                                                            <span>{point}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {item.recommendations.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">Recommendations</h4>
                                                <ul className="space-y-1.5">
                                                    {item.recommendations.map((point, i) => (
                                                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                                                            <span>{point}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
}
