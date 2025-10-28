import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";

const tableData = [
  {
    partNumber: "1111111",
    referenceDesignated: "MOTOR",
    trackingId: "111111",
  },
  {
    partNumber: "2342Q32",
    referenceDesignated: "LINK 1",
    trackingId: "1111111",
  },
  {
    partNumber: "2343523",
    referenceDesignated: "LINK 2",
    trackingId: "Text11111",
  },
  {
    partNumber: "324423-34",
    referenceDesignated: "LINK 3",
    trackingId: "11111111",
  },
];

export const WorkOrderDetailsSection = (): JSX.Element => {
  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#eef1f4]">
            <TableHead className="[font-family:'Inter',Helvetica] font-bold text-[#3c3c3c] text-xs tracking-[0] leading-[normal] h-10 px-3 py-2">
              PART NUMBER
            </TableHead>
            <TableHead className="[font-family:'Inter',Helvetica] font-bold text-[#3c3c3c] text-xs tracking-[0] leading-[normal] h-10 px-3 py-2">
              REFERENCE DESIGNATED
            </TableHead>
            <TableHead className="[font-family:'Inter',Helvetica] font-bold text-[#3c3c3c] text-xs tracking-[0] leading-[normal] h-10 px-3 py-2">
              TRACKING ID
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((row, index) => (
            <TableRow key={index} className="bg-white border-[#eef0f4]">
              <TableCell className="[font-family:'Inter',Helvetica] font-normal text-[#3c3c3c] text-xs tracking-[0] leading-[normal] h-10 px-3 py-2 text-right">
                {row.partNumber}
              </TableCell>
              <TableCell className="[font-family:'Inter',Helvetica] font-normal text-[#3c3c3c] text-xs tracking-[0] leading-[normal] h-10 px-3 py-2">
                {row.referenceDesignated}
              </TableCell>
              <TableCell className="[font-family:'Inter',Helvetica] font-normal text-[#3c3c3c] text-xs tracking-[0] leading-[normal] h-10 px-3 py-2">
                {row.trackingId}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
