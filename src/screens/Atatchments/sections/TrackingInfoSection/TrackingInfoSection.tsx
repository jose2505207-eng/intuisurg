import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "../../../../components/ui/table";

const trackingData = [
  { id: "1111111", component: "MOTOR", value: "111111" },
  { id: "2342Q32", component: "LINK 1", value: "1111111" },
  { id: "2343523", component: "LINK 2", value: "Text11111" },
  { id: "324423-34", component: "LINK 3", value: "11111111" },
];

export const TrackingInfoSection = (): JSX.Element => {
  return (
    <div className="w-full">
      <Table>
        <TableBody>
          {trackingData.map((row, index) => (
            <TableRow key={index}>
              <TableCell className="text-right [font-family:'Inter',Helvetica] font-normal text-[#3c3c3c] text-xs">
                {row.id}
              </TableCell>
              <TableCell className="[font-family:'Inter',Helvetica] font-normal text-[#3c3c3c] text-xs">
                {row.component}
              </TableCell>
              <TableCell className="[font-family:'Inter',Helvetica] font-normal text-[#3c3c3c] text-xs">
                {row.value}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
