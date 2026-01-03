import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Plus, Users, ArrowRight } from "lucide-react";
import { CreatePartnerModal } from "./CreatePartnerModal";

interface Partner {
    _id: string;
    name: string;
    apiKey: string;
    active: boolean;
    leadCount: number;
    createdAt: string;
}

export default function PartnerListPage() {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const fetchPartners = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:5000/api/partners");
            if (response.ok) {
                const data = await response.json();
                setPartners(data);
            }
        } catch (error) {
            console.error("Failed to fetch partners", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPartners();
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Partners</h1>
                    <p className="text-muted-foreground mt-1">Manage external partners and API keys.</p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Partner
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Users className="h-5 w-5 text-primary" />
                        Registered Partners
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="p-8 text-center text-muted-foreground">Loading partners...</div>
                    ) : partners.length === 0 ? (
                        <div className="p-12 text-center border-2 border-dashed rounded-lg border-muted">
                            <Users className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                            <h3 className="text-lg font-medium text-foreground">No partners found</h3>
                            <p className="text-muted-foreground mb-4">Get started by creating your first partner profile.</p>
                            <Button variant="outline" onClick={() => setIsCreateModalOpen(true)}>
                                Create Partner
                            </Button>
                        </div>
                    ) : (
                        <div className="rounded-md border overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/50 text-muted-foreground font-medium uppercase text-xs">
                                    <tr>
                                        <th className="px-4 py-3">Partner Name</th>
                                        <th className="px-4 py-3">API Key</th>
                                        <th className="px-4 py-3 text-center">Leads Generated</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {partners.map((partner) => (
                                        <tr key={partner._id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-3 font-medium">{partner.name}</td>
                                            <td className="px-4 py-3 font-mono text-muted-foreground">
                                                {partner.apiKey.substring(0, 8)}...
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                                                    {partner.leadCount}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${partner.active ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                                                    }`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full ${partner.active ? "bg-green-600" : "bg-red-600"}`} />
                                                    {partner.active ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Link to={`/partners/${partner._id}`}>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <ArrowRight className="h-4 w-4" />
                                                        <span className="sr-only">View Details</span>
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <CreatePartnerModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onPartnerCreated={fetchPartners}
            />
        </div>
    );
}
