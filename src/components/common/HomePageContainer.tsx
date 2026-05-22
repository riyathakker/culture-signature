"use client";

import { cn } from "@/lib/utils";
import { Container } from "../layout/Container";
import { BreadcrumbItem, Breadcrumbs } from "./Breadcrumbs";

interface Props {
    label: BreadcrumbItem[];
    heading?: string;
    description?: string;
    children: React.ReactNode;
}
export function HomePageContainer({ label, heading, description, children }: Props) {
    return (
        <div className="bg-background min-h-screen pb-10 md:pb-15">
            <div className={cn("py-6 md:py-12", heading && description && "mb-0 md:mb-6")}>
                <Container>
                    <Breadcrumbs items={label} />
                    <div className="hidden sm:inline-block">
                        {heading && <h1 className="text-4xl md:text-6xl font-heading mt-0 md:mt-3 mb-2"> {heading}</h1>}
                        {description && <p className="muted-italic text-lg max-w-2xl">
                            {description}
                        </p>}
                    </div>
                </Container>
            </div>
            <Container>
                {children}
            </Container>
        </div>
    );
}
