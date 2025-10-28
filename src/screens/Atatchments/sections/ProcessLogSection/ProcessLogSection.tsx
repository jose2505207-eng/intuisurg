import { MenuIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../../components/ui/button";

export const ProcessLogSection = (): JSX.Element => {
  return (
    <header className="w-full bg-[#50709f] shadow-04-dp">
      <div className="flex items-center justify-between px-6 py-6 h-[198px]">
        <div className="flex items-center gap-8">
          <div className="flex flex-col gap-2">
            <div className="[font-family:'Roboto_Mono',Helvetica] font-normal text-x00-on-surface-high-emphasis text-base tracking-[-0.13px] leading-5">
              intuitive surgical
            </div>
            <div className="[font-family:'Roboto_Mono',Helvetica] font-normal text-[#121212] text-5xl tracking-[-0.40px] leading-[48px]">
              DEBUG PANEL
            </div>
          </div>

          <div className="flex items-center justify-center w-[110px] h-[110px] bg-[#2c4a6b] rounded-full border-4 border-[#1a2f47]">
            <div className="flex items-center justify-center w-full h-full">
              <span className="text-white text-6xl font-bold [font-family:'Roboto_Mono',Helvetica]">
                i
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="[font-family:'Roboto_Mono',Helvetica] font-normal text-[#121212] text-5xl tracking-[-0.40px] leading-[48px]">
            WORK ORDER DETAILS
          </div>

          <Button
            variant="outline"
            className="bg-surface rounded shadow-08-dp h-auto px-2 py-1.5 gap-1.5"
          >
            <MenuIcon className="w-6 h-6" />
            <span className="font-button font-[number:var(--button-font-weight)] text-x01-primary500 text-[length:var(--button-font-size)] tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)] [font-style:var(--button-font-style)] px-1.5 py-1">
              MAIN
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
};
