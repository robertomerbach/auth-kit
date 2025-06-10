import { Button } from "../ui/button"
import { Loader } from "../loader"

interface ActionSectionProps {
    title: string;
    description: React.ReactNode;
    actionText: string;
    onAction: () => void;
    isLoading?: boolean;
    variant?: "default" | "outline" | "ghost" | "link" | "destructive";
}

export function ActionSection({
    title,
    description,
    actionText,
    onAction,
    isLoading = false,
    variant = "outline",
}: ActionSectionProps) {
    return (
        <div className="flex flex-col gap-4 pb-7 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-[1] shrink-0">
                <h3 className="text-lg font-medium">{title}</h3>
            </div>
            <div className="flex-[2] flex items-center justify-between gap-6">
                <div className="text-base text-muted-foreground">{description}</div>
                <Button
                    type="button"
                    variant={variant}
                    onClick={onAction}
                    disabled={isLoading}
                    className="shrink-0 h-10"
                >
                    {isLoading ? <Loader size={16} /> : actionText}
                </Button>
            </div>
        </div>
    );
}