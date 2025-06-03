"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CommentsSection } from "../CommentsSection/CommentsSection";

interface MobileCommentsProps {
  videoId: string;
}

export const MobileComments: React.FC<MobileCommentsProps> = ({ videoId }) => {
  return (
    <div className="block lg:hidden">
      <Sheet>
        <SheetTrigger className="bg-[#F73100]/30 pt-2 pb-6 pl-2 rounded-lg w-[calc(100%-16px)] mx-[8px] cursor-pointer  text-start font-medium">
          Комментарии
        </SheetTrigger>

        <SheetContent
          side="bottom"
          style={{
            scrollbarWidth: "none",
          }}
          className="h-[70vh] overflow-y-auto p-4 border-none text-foreground bg-black"
        >
          <SheetHeader className="hidden">
            <SheetTitle className="text-white">Комментарии</SheetTitle>
          </SheetHeader>
          <div className="mt-0">
            <CommentsSection videoId={videoId} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
