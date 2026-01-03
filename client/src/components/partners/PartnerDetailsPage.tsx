import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { ArrowLeft, Filter, Calendar } from "lucide-react";

interface Evaluation {
    _id: string;
    name: string;
    email: string;
    country: string;
    visaType: string;
    evaluationResult: {
        score: number;
        conclusion: string;
    };
    createdAt: string;
}

interface PartnerDetails {
    _id: string;
    name: string;
    apiKey: string;
    active: boolean;
    createdAt: string;
}

export default function PartnerDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const [partner, setPartner] = useState<PartnerDetails | null>(null);
    const [leads, setLeads] = useState<Evaluation[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filters
    const [filterCountry, setFilterCountry] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    // Debounce search query to prevent API spam while typing
    const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500); // 500ms delay

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchDetails = async () => {
        setIsLoading(true);
        try {
            // Build query
            const params = new URLSearchParams();
            if (filterCountry && filterCountry !== "All") params.append("country", filterCountry);
            if (debouncedSearch) params.append("search", debouncedSearch);

            const response = await fetch(`http://localhost:5000/api/partners/${id}/leads?${params}`);
            if (response.ok) {
                const data = await response.json();
                setPartner(data.partner);
                setLeads(data.leads || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-fetch when filters change (debounced for search)
    useEffect(() => {
        if (id) fetchDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, filterCountry, debouncedSearch]); // Only auto-fetch on mount/id change. For filters, we wait for user to click button or enter? 
    // Actually, usually filters should auto-apply or have a button. 
    // Given the number of inputs, let's keep the manual refresh button or debounce. 
    // For simplicity, let's just trigger on 'enter' or button click, but to simulate "live" feel we can include them in deps 
    // if we debounce. But without debounce, typing 'name' will fire 100 requests. 
    // Let's stick to the manual "Filter" button for now or enter key on inputs. 
    // Wait, the previous code had them in dependencies. I'll remove them from deps to prevent request spamming during typing.

    if (!partner && !isLoading) return <div className="p-8 text-center text-muted-foreground">Partner not found</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <Link to="/partners">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{partner?.name || "Loading..."}</h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
                        <span>API Key prefix: {partner?.apiKey?.substring(0, 8)}...</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${partner?.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {partner?.active ? "Active" : "Inactive"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
                <Card className="md:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                            Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="text-3xl font-bold">{leads.length}</div>
                            <p className="text-xs text-muted-foreground">Total Leads Generated</p>
                        </div>
                        <div className="pt-4 border-t">
                            <p className="text-xs text-muted-foreground mb-2">Joined Date</p>
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>{partner ? new Date(partner.createdAt).toLocaleDateString() : "-"}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-3">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <CardTitle>Leads & Evaluations</CardTitle>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <select
                                    value={filterCountry}
                                    onChange={(e) => setFilterCountry(e.target.value)}
                                    className="w-[140px] h-8 text-xs border rounded-md bg-background px-3 py-1 shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                >
                                    <option value="All">All Countries</option>
                                    <option value="Germany">Germany</option>
                                    <option value="Canada">Canada</option>
                                    <option value="United States">United States</option>
                                    <option value="Australia">Australia</option>
                                </select>
                                <Input
                                    placeholder="Search name, visa, etc..."
                                    className="h-8 text-xs w-[180px]"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && fetchDetails()}
                                />
                                <Button variant="outline" size="sm" className="h-8 w-8 p-0" title="Refresh" onClick={fetchDetails}>
                                    <Filter className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="py-8 text-center text-muted-foreground text-sm">Loading leads...</div>
                        ) : leads.length === 0 ? (
                            <div className="py-12 text-center text-muted-foreground">
                                <p>No leads found matching your criteria.</p>
                            </div>
                        ) : (
                            <div className="border rounded-md overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted/50 text-muted-foreground font-medium text-xs uppercase">
                                        <tr>
                                            <th className="px-4 py-2">Candidate</th>
                                            <th className="px-4 py-2">Target</th>
                                            <th className="px-4 py-2 text-center">Score</th>
                                            <th className="px-4 py-2">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {leads.map((lead) => (
                                            <tr key={lead._id} className="hover:bg-muted/30">
                                                <td className="px-4 py-2">
                                                    <div className="font-medium text-foreground">{lead.name || "Candidate"}</div>
                                                    <div className="text-xs text-muted-foreground">{lead.email}</div>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <div className="text-xs font-semibold">{lead.country}</div>
                                                    <div className="text-xs text-muted-foreground">{lead.visaType}</div>
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-bold ${(lead.evaluationResult?.score || 0) >= 70 ? "bg-green-100 text-green-800" :
                                                        (lead.evaluationResult?.score || 0) >= 50 ? "bg-yellow-100 text-yellow-800" :
                                                            "bg-red-100 text-red-800"
                                                        }`}>
                                                        {lead.evaluationResult?.score || 0}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 text-xs tabular-nums text-muted-foreground">
                                                    {new Date(lead.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
