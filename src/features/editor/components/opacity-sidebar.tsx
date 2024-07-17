import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState} from "react";

import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";

import { 
  ActiveTool, 
  Editor, 
} from "@/features/editor/types";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";


interface OpacitySidebarProps {
  editor: Editor | undefined
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const OpacitySidebar = ({
  editor,
  activeTool,
  onChangeActiveTool
}: OpacitySidebarProps) => {
  const initialValue = editor?.getActiveOpacity() || 1;
  const selectedObject = useMemo(() => editor?.selectedObjects[0], [editor?.selectedObjects]);

  const [opacity, setOpacity] = useState(initialValue);

  useEffect(() => {
    if (selectedObject) {
      setOpacity(selectedObject.get("opacity") || 1);
    }
  }, [selectedObject]);

  const onClose = () => {
    onChangeActiveTool("select");
  }

  const onChange = (value: number) => {
    editor?.changeOpacity(value);
    setOpacity(value);  
  }

  return (
    <aside className={cn(
      "bg-white relative border-r z-[40] w-[360px]",
      activeTool === "opacity" ? "visible" : "hidden",
    )}
    >
      <ToolSidebarHeader 
        title="Options"
        description="Change the opacity of the selected object"
      />
      <ScrollArea>
        <div className="p-4 space-y-6">
          <Slider 
            value={[opacity]}
            onValueChange={(value) => onChange(value[0])}
            max={1}
            min={0}
            step={0.01}
          />
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose}/>
    </aside>
  );
}