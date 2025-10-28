import { ChevronLeftIcon } from "lucide-react";
import React from "react";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { ProcessLogSection } from "./sections/ProcessLogSection";
import { TechnicianListSection } from "./sections/TechnicianListSection";
import { TrackingInfoSection } from "./sections/TrackingInfoSection";
import { WorkOrderDetailsSection } from "./sections/WorkOrderDetailsSection";

const processLogOptions = [
  { value: "1", label: "PROCESS LOG 1" },
  { value: "2", label: "PROCESS LOG 2" },
  { value: "3", label: "PROCESS LOG 3" },
  { value: "4", label: "PROCESS LOG 4" },
];

export const Atatchments = (): JSX.Element => {
  return (
    <div className="bg-white w-full flex flex-col">
      <ProcessLogSection />

      <div className="flex flex-1 gap-6 p-6">
        <div className="flex flex-col gap-6 w-[300px]">
          <Select defaultValue="1">
            <SelectTrigger className="w-full bg-white shadow-08-dp">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {processLogOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="font-body-2 text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)]"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <TechnicianListSection />
        </div>

        <div className="flex flex-col gap-6 flex-1">
          <WorkOrderDetailsSection />
          <TrackingInfoSection />
        </div>
      </div>

      <div className="flex justify-end p-6">
        <Button
          variant="outline"
          className="h-auto gap-2 px-3 py-2 rounded-[50px] shadow-04-dp"
        >
          <ChevronLeftIcon className="w-4 h-4" />
          <span className="font-single-line-body-base font-[number:var(--single-line-body-base-font-weight)] text-[length:var(--single-line-body-base-font-size)] tracking-[var(--single-line-body-base-letter-spacing)] leading-[var(--single-line-body-base-line-height)]">
            Previous
          </span>
        </Button>
      </div>
    </div>
  );
};
