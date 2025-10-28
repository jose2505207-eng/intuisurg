interface BOMComponent {
  vendor_denomination: string;
  part_number: string;
  serial_number: string;
}

export function generateBOMComponents(workOrderId: string, baseTimestamp: number = Date.now()): Array<{
  work_order_id: string;
  vendor_denomination: string;
  part_number: string;
  serial_number: string;
}> {
  const components: BOMComponent[] = [
    { vendor_denomination: 'Texas Instruments', part_number: '458201', serial_number: `SN-${baseTimestamp}-001` },
    { vendor_denomination: 'STMicroelectronics', part_number: '407689', serial_number: `SN-${baseTimestamp}-002` },
    { vendor_denomination: 'Microchip Technology', part_number: '325184', serial_number: `SN-${baseTimestamp}-003` },

    { vendor_denomination: 'Bosch Sensortec', part_number: '299847', serial_number: `SN-${baseTimestamp}-004` },
    { vendor_denomination: 'Honeywell', part_number: '150238', serial_number: `SN-${baseTimestamp}-005` },
    { vendor_denomination: 'Sensirion', part_number: '682045', serial_number: `SN-${baseTimestamp}-006` },
    { vendor_denomination: 'Infineon Technologies', part_number: '490512', serial_number: `SN-${baseTimestamp}-007` },

    { vendor_denomination: 'Mean Well', part_number: '284502', serial_number: `SN-${baseTimestamp}-008` },
    { vendor_denomination: 'Phoenix Contact', part_number: '241024', serial_number: `SN-${baseTimestamp}-009` },
    { vendor_denomination: 'TDK-Lambda', part_number: '480536', serial_number: `SN-${baseTimestamp}-010` },

    { vendor_denomination: 'Murata Electronics', part_number: '476915', serial_number: `SN-${baseTimestamp}-011` },
    { vendor_denomination: 'Kemet Corporation', part_number: '105847', serial_number: `SN-${baseTimestamp}-012` },
    { vendor_denomination: 'TDK Corporation', part_number: '226938', serial_number: `SN-${baseTimestamp}-013` },

    { vendor_denomination: 'Vishay Intertechnology', part_number: '100045', serial_number: `SN-${baseTimestamp}-014` },
    { vendor_denomination: 'Yageo Corporation', part_number: '510362', serial_number: `SN-${baseTimestamp}-015` },

    { vendor_denomination: 'Molex', part_number: '430450', serial_number: `SN-${baseTimestamp}-016` },
    { vendor_denomination: 'TE Connectivity', part_number: '215877', serial_number: `SN-${baseTimestamp}-017` },
    { vendor_denomination: 'Amphenol', part_number: '820145', serial_number: `SN-${baseTimestamp}-018` },

    { vendor_denomination: 'Littelfuse', part_number: '025084', serial_number: `SN-${baseTimestamp}-019` },
    { vendor_denomination: 'Bourns', part_number: '360724', serial_number: `SN-${baseTimestamp}-020` },

    { vendor_denomination: 'Maxim Integrated', part_number: '323245', serial_number: `SN-${baseTimestamp}-021` },
    { vendor_denomination: 'Analog Devices', part_number: '325197', serial_number: `SN-${baseTimestamp}-022` },

    { vendor_denomination: 'Micron Technology', part_number: '256384', serial_number: `SN-${baseTimestamp}-023` },
    { vendor_denomination: 'Winbond Electronics', part_number: '128745', serial_number: `SN-${baseTimestamp}-024` },
  ];

  return components.map(comp => ({
    work_order_id: workOrderId,
    ...comp
  }));
}
