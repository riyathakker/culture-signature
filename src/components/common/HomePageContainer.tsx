"use client";

import { cn } from "@/lib/utils";
import { Container } from "../layout/Container";
import { BreadcrumbItem, Breadcrumbs } from "./Breadcrumbs";

interface Props {
    label: BreadcrumbItem[];
    heading?: string;
    description?: string;
    children: React.ReactNode;
    breadcrumbClassName?: string;
    headerClassName?: string;
}
export function HomePageContainer({ label, heading, description, children, breadcrumbClassName, headerClassName }: Props) {
    return (
        <div className="bg-background pb-10">
            <div className={cn("py-4 [@media(display-mode:standalone)]:py-2", heading && description && "mb-0 md:mb-6", headerClassName)}>
                <Container>
                    <Breadcrumbs items={label} className={breadcrumbClassName} />
                    <div className="hidden sm:inline-block">
                        {heading && <TitleAndDescription heading={heading} description={description} />}
                    </div>
                </Container>
            </div>
            <Container>
                {children}
            </Container>
        </div>
    );
}

export const TitleAndDescription = ({ heading, description }: { heading: string; description?: string }) => {
    return (
        <>
            <h1 className="text-3xl font-heading mt-0 md:mt-3 mb-2"> {heading}</h1>
            {description && <p className="muted-italic text-l max-w-2xl">
                {description}
            </p>}
        </>
    );
}