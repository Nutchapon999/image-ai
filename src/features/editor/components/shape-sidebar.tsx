import { cn } from "@/lib/utils";

import { ScrollArea } from "@/components/ui/scroll-area";

import { ActiveTool } from "@/features/editor/types";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";

interface ShapeSidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const ShapeSidebar = ({
  activeTool,
  onChangeActiveTool
}: ShapeSidebarProps) => {
  const onClose = () => {
    onChangeActiveTool("select");
  }

  return (
    <aside className={cn(
      "bg-white relative border-r z-[40] w-[360px]",
      activeTool === "shapes" ? "visible" : "hidden"
    )}
    >
      <ToolSidebarHeader 
        title="Shapes"
        description="Add shapes to your canvas"
      />
      <ScrollArea>
        <div>
          
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose}/>
    </aside>
  );
}