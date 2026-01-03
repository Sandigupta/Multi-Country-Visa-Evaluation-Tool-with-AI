import { UploadCloud } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/utils";

interface DropzoneProps {
    onFilesSelected: (files: File[]) => void;
    className?: string;
    maxFiles?: number;
}

export function Dropzone({ onFilesSelected, className }: DropzoneProps) {
    const [isDragging, setIsDragging] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFiles = Array.from(e.dataTransfer.files);
            // Filter by type if needed, currently accepting broad range per PRD
            onFilesSelected(droppedFiles);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFiles = Array.from(e.target.files);
            onFilesSelected(selectedFiles);
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    return (
        <div
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
                "relative flex flex-col items-center justify-center w-full min-h-[160px] rounded-xl border-2 border-dashed transition-colors cursor-pointer",
                isDragging
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
                className
            )}
        >
            <input
                ref={inputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileInput}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <div className="flex flex-col items-center gap-2 text-center p-4">
                <div className="p-3 rounded-full bg-secondary text-primary">
                    <UploadCloud className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-medium">
                        Drag and drop or <span className="text-primary hover:underline">click to upload</span> your resume.
                    </p>
                    <p className="text-xs text-muted-foreground">
                        PDF, DOC, DOCX, JPEG, JPG, PNG
                    </p>
                </div>
            </div>
        </div>
    );
}
