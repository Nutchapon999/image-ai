"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { BsBorderWidth } from "react-icons/bs";
import { TbColorFilter } from "react-icons/tb";
import { RxTransparencyGrid } from "react-icons/rx";
import { FaBold, FaItalic, FaStrikethrough, FaUnderline } from "react-icons/fa6";
import { ArrowUp, ArrowDown, ChevronDown, AlignLeft, AlignCenter, AlignRight, Trash, SquareSplitHorizontal, Copy } from "lucide-react";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";

import { isTextType } from "@/features/editor/utils";
import { 
  ActiveTool, 
  Editor, 
  FONT_SIZE, 
  FONT_WEIGHT 
} from "@/features/editor/types";
import { FontSizeInput } from "@/features/editor/components/font-size-input";

interface ToolbarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const Toolbar = ({
  editor,
  activeTool,
  onChangeActiveTool
}: ToolbarProps) => {
  const initialFontFamily = editor?.getActiveFontFamily();
  const initialStrokeColor = editor?.getActiveStrokeColor();
  const initialFillColor = editor?.getActiveFillColor();
  const initialFontWeight = editor?.getActiveFontWeight() || FONT_WEIGHT;
  const initialFontStyle = editor?.getActiveFontStyle();
  const initialFontLinetrough = editor?.getActiveFontLinetrough();
  const initialFontUnderline = editor?.getActiveFontUnderline();
  const initialTextAlign = editor?.getActiveTextAlign();
  const initialFontSize = editor?.getActiveFontSize() || FONT_SIZE;

  const [properties, setProperties] = useState({
    fontSize: initialFontSize,
    fillColor: initialFillColor,
    fontStyle: initialFontStyle,
    textAlign: initialTextAlign,
    fontFamily: initialFontFamily,
    fontWeight: initialFontWeight,
    strokeColor: initialStrokeColor,
    fontUnderline: initialFontUnderline,
    fontLinetrough: initialFontLinetrough,
  });

  const selectedObject = editor?.selectedObjects[0];
  const selectedObjectType = editor?.selectedObjects[0]?.type;

  const isText = isTextType(selectedObjectType);
  const isImage = selectedObjectType === "image";

  const onChangeFontSize = (value: number) => {
    if (!selectedObject) return;

    editor?.changeFontSize(value);
    setProperties((current) => ({
      ...current,
      fontSize: value,
    }));
  }

  const onChangeTextAlign = (value: string) => {
    if (!selectedObject) return;

    editor?.changeTextAlign(value);
    setProperties((current) => ({
      ...current,
      textAlign: value,
    }));
  }

  const toggleBold = () => {
    if (!selectedObject) return;

    const newValue = properties.fontWeight > 500 ? 500 : 700;

    editor?.changeFontWeight(newValue);
    setProperties((current) => ({
      ...current,
      fontWeight: newValue
    }));
  }

  const toggleItalic = () => {
    if (!selectedObject) return;

    const isItalic = properties.fontStyle === "italic";
    const newValue = isItalic ? "normal" : "italic";

    editor?.changeFontStyle(newValue);
    setProperties((current) => ({
      ...current,
      fontStyle: newValue
    }));
  }

  const toggleLinetrough = () => {
    if (!selectedObject) return;

    const newValue = properties.fontLinetrough ? false : true;

    editor?.changeFontLinethrough(newValue);
    setProperties((current) => ({
      ...current,
      fontLinetrough: newValue
    }));
  }

  const toggleUnderline = () => {
    if (!selectedObject) return;

    const newValue = properties.fontUnderline ? false : true;

    editor?.changeFontUnderline(newValue);
    setProperties((current) => ({
      ...current,
      fontUnderline: newValue
    }));
  }

  if (editor?.selectedObjects.length === 0) {
    return (
      <div className="shrink-0 h-[56px] border-b bg-white w-full flex items-center 
        overflow-x-auto z-[49] p-2 gap-x-2"
      />
    );
  }

  return (
    <div className="shrink-0 h-[56px] border-b bg-white w-full flex items-center 
      overflow-x-auto z-[49] p-2 gap-x-2"
    >
      {
        !isImage && (
          <div className="flex items-center h-full justify-center">
            <Hint label="Color" side="bottom" sideOffset={5}>
              <Button
                onClick={() => onChangeActiveTool("fill")}
                size="icon"
                variant="ghost"
                className={cn(
                  activeTool === "fill" && "bg-gray-100"
                )}
              >
                <div
                  className="rounded-md size-4 border"
                  style={{ backgroundColor: properties.fillColor }}
                />
              </Button>
            </Hint>
          </div>
        )
      }
      { 
        !isText && (
          <>
            <div className="flex items-center h-full justify-center">
              <Hint label="Stroke color" side="bottom" sideOffset={5}>
                <Button
                  onClick={() => onChangeActiveTool("stroke-color")}
                  size="icon"
                  variant="ghost"
                  className={cn(
                    activeTool === "stroke-color" && "bg-gray-100"
                  )}
                >
                  <div
                    className="rounded-md size-4 border-2 bg-white"
                    style={{ borderColor: properties.strokeColor }}
                  />
                </Button>
              </Hint>
            </div>
            <div className="flex items-center h-full justify-center">
              <Hint label="Stroke color" side="bottom" sideOffset={5}>
                <Button
                  onClick={() => onChangeActiveTool("stroke-width")}
                  size="icon"
                  variant="ghost"
                  className={cn(
                    activeTool === "stroke-width" && "bg-gray-100"
                  )}
                >
                  <BsBorderWidth className="size-4"/>
                </Button>
              </Hint>
            </div>
          </>
        ) 
      }
      {
        isText && (
          <>
            <div className="flex items-center h-full justify-center">
              <Hint label="Font" side="bottom" sideOffset={5}>
                <Button
                  onClick={() => onChangeActiveTool("font")}
                  size="icon"
                  variant="ghost"
                  className={cn(
                    "w-auto px-2 text-sm",
                    activeTool === "font" && "bg-gray-100"
                  )}
                >
                  <div className="max-w-[300px] truncate">
                    { properties.fontFamily }
                  </div>
                  <ChevronDown className="size-4 ml-2 shrink-0"/>
                </Button>
              </Hint>
            </div>
            <div className="flex items-center h-full justify-center">
              <Hint label="Bold" side="bottom" sideOffset={5}>
                <Button
                  onClick={toggleBold}
                  size="icon"
                  variant="ghost"
                  className={cn(
                    properties.fontWeight > 500 && "bg-gray-100"
                  )}
                >
                  <FaBold className="size-4"/>
                </Button>
              </Hint>
            </div>
            <div className="flex items-center h-full justify-center">
              <Hint label="Italic" side="bottom" sideOffset={5}>
                <Button
                  onClick={toggleItalic}
                  size="icon"
                  variant="ghost"
                  className={cn(
                    properties.fontStyle === "italic" && "bg-gray-100"
                  )}
                >
                  <FaItalic className="size-4"/>
                </Button>
              </Hint>
            </div>
            <div className="flex items-center h-full justify-center">
              <Hint label="Underline" side="bottom" sideOffset={5}>
                <Button
                  onClick={toggleUnderline}
                  size="icon"
                  variant="ghost"
                  className={cn(
                    properties.fontUnderline && "bg-gray-100"
                  )}
                >
                  <FaUnderline className="size-4"/>
                </Button>
              </Hint>
            </div>
            <div className="flex items-center h-full justify-center">
              <Hint label="Strike" side="bottom" sideOffset={5}>
                <Button
                  onClick={toggleLinetrough}
                  size="icon"
                  variant="ghost"
                  className={cn(
                    properties.fontLinetrough && "bg-gray-100"
                  )}
                >
                  <FaStrikethrough className="size-4"/>
                </Button>
              </Hint>
            </div>
            <div className="flex items-center h-full justify-center">
              <Hint label="Align left" side="bottom" sideOffset={5}>
                <Button
                  onClick={() => onChangeTextAlign("left")}
                  size="icon"
                  variant="ghost"
                  className={cn(
                    properties.textAlign === "left" && "bg-gray-100"
                  )}
                >
                  <AlignLeft className="size-4"/>
                </Button>
              </Hint>
            </div>
            <div className="flex items-center h-full justify-center">
              <Hint label="Align center" side="bottom" sideOffset={5}>
                <Button
                  onClick={() => onChangeTextAlign("center")}
                  size="icon"
                  variant="ghost"
                  className={cn(
                    properties.textAlign === "center" && "bg-gray-100"
                  )}
                >
                  <AlignCenter className="size-4"/>
                </Button>
              </Hint>
            </div>
            <div className="flex items-center h-full justify-center">
              <Hint label="Align right" side="bottom" sideOffset={5}>
                <Button
                  onClick={() => onChangeTextAlign("right")}
                  size="icon"
                  variant="ghost"
                  className={cn(
                    properties.textAlign === "right" && "bg-gray-100"
                  )}
                >
                  <AlignRight className="size-4"/>
                </Button>
              </Hint>
            </div>
            <div className="flex items-center h-full justify-center">
              <FontSizeInput 
                value={properties.fontSize}
                onChange={onChangeFontSize}
              />
            </div>
          </>
        )
      }
      {
        isImage && (
          <>
            <div className="flex items-center h-full justify-center">
              <Hint label="Filters" side="bottom" sideOffset={5}>
                <Button
                  onClick={() => onChangeActiveTool("filter")}
                  size="icon"
                  variant="ghost"
                  className={cn(
                    activeTool === "filter" && "bg-gray-100"
                  )}
                >
                  <TbColorFilter className="size-4"/>
                </Button>
              </Hint>
            </div>
            <div className="flex items-center h-full justify-center">
              <Hint label="Remove background" side="bottom" sideOffset={5}>
                <Button
                  onClick={() => onChangeActiveTool("remove-bg")}
                  size="icon"
                  variant="ghost"
                  className={cn(
                    activeTool === "remove-bg" && "bg-gray-100"
                  )}
                >
                  <SquareSplitHorizontal className="size-4"/>
                </Button>
              </Hint>
            </div>
          </>
        )
      }
      <div className="flex items-center h-full justify-center">
        <Hint label="Bring forward" side="bottom" sideOffset={5}>
          <Button
            onClick={() => editor?.bringForward()}
            size="icon"
            variant="ghost"
          >
            <ArrowUp className="size-4"/>
          </Button>
        </Hint>
      </div>
      <div className="flex items-center h-full justify-center">
        <Hint label="Send backwards" side="bottom" sideOffset={5}>
          <Button
            onClick={() => editor?.sendBackwards()}
            size="icon"
            variant="ghost"
          >
            <ArrowDown className="size-4"/>
          </Button>
        </Hint>
      </div>
      <div className="flex items-center h-full justify-center">
        <Hint label="Opacity" side="bottom" sideOffset={5}>
          <Button
            onClick={() => onChangeActiveTool("opacity")}
            size="icon"
            variant="ghost"
            className={cn(activeTool === "opacity" && "bg-gray-100")}
          >
            <RxTransparencyGrid className="size-4"/>
          </Button>
        </Hint>
      </div>
      <div className="flex items-center h-full justify-center">
        <Hint label="Delete" side="bottom" sideOffset={5}>
          <Button
            onClick={() => editor?.delete()}
            size="icon"
            variant="ghost"
          >
            <Trash className="size-4"/>
          </Button>
        </Hint>
      </div>
      <div className="flex items-center h-full justify-center">
        <Hint label="Duplicate" side="bottom" sideOffset={5}>
          <Button
            onClick={() => {
              editor?.onCopy();
              editor?.onPaste();
            }}
            size="icon"
            variant="ghost"
          >
            <Copy className="size-4"/>
          </Button>
        </Hint>
      </div>
    </div>
  );
}