import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export const Banner = () => {
  return (
    <div className="aspect-[5/1] min-h-[248px] flex gap-x-6 p-6 items-center rounded-xl 
      bg-gradient-to-r from-[#2E62CB] via-[#0073FF] to-[#3FAFF5] text-white"
    >
      <div className="rounded-full size-28 hidden md:flex items-center justify-center bg-white/50">
        <div className="rounded-full size-20 flex items-center justify-center bg-white">
          <Sparkles className="h-20 text-[#0073FF] fill-[#0073FF]"/>
        </div>
      </div>
      <div className="flex flex-col gap-y-2">
        <h1 className="text-xl md:text-3xl font-semibold">
          Visualize your ideas with Image AI
        </h1>
        <p className="text-xs md:text-sm mb-2">
          Turn inspiraion into design in no time. Simply upload and image and let AI do the rest.
        </p>
        <Button
          variant="secondary"
          className="w-[160px]"
        > 
          Start creating
          <ArrowRight className="size-4 ml-2"/>
        </Button>
      </div>
    </div>
  );
}