"use client";

import { Container } from "../layout/Container";
import { BreadcrumbItem, Breadcrumbs } from "../ui/Breadcrumbs";

interface Props {
    label: BreadcrumbItem[];
    heading: string;
    description: string;
    children: React.ReactNode;
}
export function HomePageContainer({ label, heading, description, children }: Props) {
    return (
        <div className="bg-background min-h-screen pb-20">
            <div className="bg-secondary/20 py-16 mb-10">
                <Container>
                    <Breadcrumbs items={label} />
                    <h1 className="text-5xl md:text-6xl font-heading mt-6 mb-2"> {heading}</h1>
                    <p className="text-muted-foreground font-serif italic text-lg max-w-2xl">
                        {description}
                    </p>
                </Container>
            </div>
            <Container>
                {children}
            </Container>
        </div>
    );
}
