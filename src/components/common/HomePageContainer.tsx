"use client";

import { cn } from "@/lib/utils";
import { Container } from "../layout/Container";
import { BreadcrumbItem, Breadcrumbs } from "../ui/Breadcrumbs";

interface Props {
    label: BreadcrumbItem[];
    heading?: string;
    description?: string;
    children: React.ReactNode;
}
export function HomePageContainer({ label, heading, description, children }: Props) {
    return (
        <div className="bg-background min-h-screen pb-20">
            <div className={cn("bg-secondary/20 py-8 md:py-16", heading && description && "mb-6 md:mb-10")}>
                <Container>
                    <Breadcrumbs items={label} />
                    {heading && <h1 className="text-4xl md:text-6xl font-heading mt-3 md:mt-6 mb-2"> {heading}</h1>}
                    {description && <p className="muted-italic text-lg max-w-2xl">
                        {description}
                    </p>}
                </Container>
            </div>
            <Container>
                {children}
            </Container>
        </div>
    );
}
