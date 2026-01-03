import { FileText, X } from "lucide-react";
import { Button } from "../ui/button";

interface FileListProps {
    files: File[];
    onRemove: (index: number) => void;
}

export function FileList({ files, onRemove }: FileListProps) {
    if (files.length === 0) return null;

    return (
        <div className="space-y-3 mt-4">
            {files.map((file, index) => (
                <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-card shadow-sm"
                >
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                            <FileText className="h-4 w-4" />
                        </div>
                        <div className="grid gap-0.5 leading-none">
                            <p className="text-sm font-medium truncate pr-4">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                        onClick={() => onRemove(index)}
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove file</span>
                    </Button>
                </div>
            ))}
        </div>
    );
}
