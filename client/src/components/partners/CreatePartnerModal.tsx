import { useState } from "react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Copy, Check, ShieldAlert } from "lucide-react";

interface CreatePartnerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPartnerCreated: () => void;
}

export const CreatePartnerModal = ({ isOpen, onClose, onPartnerCreated }: CreatePartnerModalProps) => {
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [createdPartner, setCreatedPartner] = useState<{ name: string; apiKey: string } | null>(null);
    const [hasCopied, setHasCopied] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:5000/api/partners", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });

            if (!response.ok) throw new Error("Failed to create partner");

            const data = await response.json();
            setCreatedPartner(data);
            onPartnerCreated(); // Refresh list in background
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        if (createdPartner?.apiKey) {
            navigator.clipboard.writeText(createdPartner.apiKey);
            setHasCopied(true);
            setTimeout(() => setHasCopied(false), 2000);
        }
    };

    const handleClose = () => {
        // Reset state on close
        setCreatedPartner(null);
        setName("");
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={createdPartner ? "Partner Created" : "Add New Partner"}>
            {!createdPartner ? (
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Partner Name
                        </label>
                        <Input
                            placeholder="e.g. Acme Recruitment Agency"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="ghost" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
                            {isLoading ? "Creating..." : "Create Partner"}
                        </Button>
                    </div>
                </form>
            ) : (
                <div className="space-y-6 pt-2">
                    <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
                        <div className="flex items-start gap-3">
                            <ShieldAlert className="h-5 w-5 text-yellow-600 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-yellow-600">Secure API Key Generated</p>
                                <p className="text-xs text-muted-foreground">
                                    This key will only be shown once. Please copy and store it securely.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium uppercase text-muted-foreground">
                            API Key
                        </label>
                        <div className="flex items-center gap-2">
                            <code className="flex-1 rounded-md bg-muted p-3 font-mono text-sm break-all border border-input">
                                {createdPartner.apiKey}
                            </code>
                            <Button size="icon" variant="outline" onClick={handleCopy} className="shrink-0 h-11 w-11">
                                {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>

                    <Button onClick={handleClose} className="w-full mt-4">
                        Done
                    </Button>
                </div>
            )}
        </Modal>
    );
};
