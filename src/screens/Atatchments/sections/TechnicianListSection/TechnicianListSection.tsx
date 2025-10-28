import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";

const technicianData = [
  {
    name: "JOSE",
    operation: "1120",
  },
  {
    name: "PHILIP",
    operation: "1150",
  },
  {
    name: "FRANCISCO",
    operation: "1160",
  },
  {
    name: "Text",
    operation: "1180",
  },
];

export const TechnicianListSection = (): JSX.Element => {
  return (
    <section className="w-full">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#eef1f4] hover:bg-[#eef1f4]">
            <TableHead className="h-10 px-3 py-2 [font-family:'Inter',Helvetica] font-bold text-[#3c3c3c] text-xs tracking-[0] leading-[normal]">
              TECHNICIAN
            </TableHead>
            <TableHead className="h-10 px-3 py-2 [font-family:'Inter',Helvetica] font-bold text-[#3c3c3c] text-xs tracking-[0] leading-[normal]">
              OPERATION
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {technicianData.map((technician, index) => (
            <TableRow
              key={index}
              className="bg-white hover:bg-white border-[#eef0f4]"
            >
              <TableCell className="h-10 px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[url(/user-01.svg)] bg-[100%_100%]" />
                  <span className="[font-family:'Inter',Helvetica] font-normal text-[#3c3c3c] text-xs tracking-[0] leading-[normal]">
                    {technician.name}
                  </span>
                </div>
              </TableCell>
              <TableCell className="h-10 px-3 py-2 [font-family:'Inter',Helvetica] font-normal text-[#3c3c3c] text-xs tracking-[0] leading-[normal]">
                {technician.operation}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
};
