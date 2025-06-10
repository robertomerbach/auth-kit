"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Loader } from "../loader"

interface EditableFieldProps {
    title: string;
    children: React.ReactNode;
    displayValue: React.ReactNode;
    onSave: () => Promise<void>;
    onCancel: () => void;
    isLoading: boolean;
    isSaveDisabled?: boolean;
    editButtonText?: string;
    hideEditButton?: boolean;
}

export function EditableField({
    title,
    children,
    displayValue,
    onSave,
    onCancel,
    isLoading,
    isSaveDisabled = false,
    editButtonText = "Edit",
    hideEditButton = false,
}: EditableFieldProps) {
    const [isEditing, setIsEditing] = useState(false)

    const handleCancel = () => {
        onCancel()
        setIsEditing(false)
    }

    const handleEdit = () => {
        setIsEditing(true)
    }
    
    const enhancedOnSave = async () => {
        await onSave();
        setIsEditing(false);
    };


    return (
        <div className="flex flex-col gap-4 pb-7 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-[1] shrink-0">
                <h3 className="text-lg font-medium">{title}</h3>
            </div>
            <div className="flex-[2] flex items-center justify-between gap-6">
                {isEditing ? (
                    <>                    
                        {children}
                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={handleCancel} className="h-10">
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                variant="default"
                                disabled={isLoading || isSaveDisabled}
                                className="h-10"
                                onClick={enhancedOnSave}
                            >
                                {isLoading ? <Loader size={16} /> : "Save"}
                            </Button>
                        </div>
                    </>
                ) : (
                    <>  
                        <div className="text-base text-muted-foreground">{displayValue}</div>
                        {!hideEditButton && (
                            <Button type="button" variant="outline" onClick={handleEdit} className="h-10">
                                {editButtonText}
                            </Button>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}