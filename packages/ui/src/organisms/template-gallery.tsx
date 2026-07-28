"use client";

import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./carousel";
import { DocumentCard } from "./document-card";
import { cn } from "../lib/utils";

export interface TemplateOption {
  id: string;
  label: string;
  imageUrl?: string;
}

export interface TemplateGalleryProps extends Omit<
  React.ComponentPropsWithoutRef<"section">,
  "onSelect"
> {
  templates: TemplateOption[];
  onSelect?: (template: TemplateOption) => void;
  /** Disables every card, e.g. while a document is being created. */
  busy?: boolean;
  heading?: string;
}

/**
 * Horizontal carousel of starting points, shown above the document list.
 * Stateless: it renders what it is given and reports the chosen template back.
 */
const TemplateGallery = ({
  templates,
  onSelect,
  busy = false,
  heading = "Start a new document",
  className,
  ...props
}: TemplateGalleryProps) => (
  <section aria-label={heading} className={cn("bg-canvas", className)} {...props}>
    <div className="mx-auto flex max-w-screen-xl flex-col gap-y-4 px-6 py-6 lg:px-16">
      <h2 className="text-sm font-medium">{heading}</h2>
      <Carousel opts={{ align: "start" }}>
        <CarouselContent className="-ml-4">
          {templates.map((template, index) => (
            <CarouselItem
              key={template.id}
              className="basis-1/2 pl-4 sm:basis-1/3 lg:basis-1/5 2xl:basis-[14.285714%]"
            >
              <DocumentCard
                title={template.label}
                previewUrl={template.imageUrl}
                featured={index === 0}
                disabled={busy}
                className={cn(busy && "pointer-events-none opacity-50")}
                onClick={() => onSelect?.(template)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  </section>
);
TemplateGallery.displayName = "TemplateGallery";

export { TemplateGallery };
