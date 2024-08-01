import { cn } from "@/lib/utils";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

import { ActiveTool, Editor } from "@/features/editor/types";

import { usePayWall } from "@/features/subscriptions/hooks/use-pay-wall";
import { useGenerateImage } from "@/features/ai/api/use-generate-image";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";

interface AiSidebarProps {
  editor: Editor | undefined
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const AiSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool
}: AiSidebarProps) => {
  const mutation = useGenerateImage();
  const { shouldBlock, triggerPayWall } = usePayWall(); 

  const [value, setValue] = useState("");

  const onSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (shouldBlock) {
      triggerPayWall();
      return;
    }

    mutation.mutate({ prompt: value }, {
      onSuccess: ({ data }) => {
        editor?.addImage(data);
      }
    }) 
  }

  const onClose = () => {
    onChangeActiveTool("select");
  }

  return (
    <aside className={cn(
      "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
      activeTool === "ai" ? "visible" : "hidden",
    )}
    >
      <ToolSidebarHeader 
        title="AI"
        description="Generate an image using AI"
      />
      <ScrollArea>
        <form 
          onSubmit={onSubmit}
          className="p-4 space-y-6"
        >
          <Textarea 
            placeholder="An astronaut riding a horse on mars, hd, dramatic lighting"
            cols={30}
            rows={10}
            required
            minLength={3}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button
            type="submit"
            className="w-full"
          >
            Generate
          </Button>
        </form>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose}/>
    </aside>
  );
}