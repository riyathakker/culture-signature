"use client";

import { Loader2 } from "lucide-react";

export function CommonLoader() {
    return (
        <div className="h-[60vh] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );
}
