"use client";

import { useRouter } from "next/navigation";
import { Loader, TriangleAlert } from "lucide-react";

import { TemplateCard } from "./template-card";

import { usePayWall } from "@/features/subscriptions/hooks/use-pay-wall";
import { useCreateProject } from "@/features/projects/api/use-create-project";
import { ResponseType, useGetTemplates } from "@/features/projects/api/use-get-templates";

export const TemplatesSection = () => {
  const router = useRouter();

  const { shouldBlock, triggerPayWall } = usePayWall(); 
  const mutation = useCreateProject();

  const { data, isLoading, isError } = useGetTemplates({ page: "1", limit: "4" });

  const onClick = (template: ResponseType["data"][0]) => {
    if (template.isPro && shouldBlock) {
      triggerPayWall();
      return;
    }

    mutation.mutate(
      {
        name: `${template.name} project`,
        json: template.json,
        width: template.width,
        height: template.height,
      },
      {
        onSuccess: ({ data }) => {
          router.push(`/editor/${data.id}`);
        }
      }
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">
          Start from a template
        </h3>
        <div className="flex items-center justify-center h-32">
          <Loader className="size-6 text-muted-foreground animate-spin"/>
        </div>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">
          Start from a template
        </h3>
        <div className="flex items-center justify-center h-32">
          <TriangleAlert className="size-6 text-muted-foreground"/>
          <p>
            Failed to load templates
          </p>
        </div>
      </div>
    );
  }

  if (!data?.length) return null;

  return (
    <div>
      <h3 className="font-semibold text-lg">
        Start from a template
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 mt-4 gap-4">
        {
          data?.map((template) => (
            <TemplateCard 
              key={template.id}
              title={template.name}
              imageSrc={template.thumbnailUrl || ""}
              onClick={() => onClick(template)}
              disabled={mutation.isPending}
              description={`${template.width} x ${template.height}`}
              width={template.width}
              height={template.height}
              isPremium={template.isPro}
            />
          ))
        }
      </div>
    </div>
  );
}