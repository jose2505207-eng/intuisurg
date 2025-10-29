interface BOMComponent {
  component_name: string;
  part_number: string;
  serial_number: string;
}

export function generateBOMComponents(workOrderId: string, baseTimestamp: number = Date.now()): Array<{
  work_order_id: string;
  component_name: string;
  part_number: string;
  serial_number: string;
}> {
  const components: BOMComponent[] = [
    { component_name: 'ARM Microcontroller', part_number: '458201', serial_number: `SN-${baseTimestamp}-001` },
    { component_name: 'DSP Processor', part_number: '407689', serial_number: `SN-${baseTimestamp}-002` },
    { component_name: 'System Controller', part_number: '325184', serial_number: `SN-${baseTimestamp}-003` },

    { component_name: 'Temperature Sensor', part_number: '299847', serial_number: `SN-${baseTimestamp}-004` },
    { component_name: 'Pressure Sensor', part_number: '150238', serial_number: `SN-${baseTimestamp}-005` },
    { component_name: 'Humidity Sensor', part_number: '682045', serial_number: `SN-${baseTimestamp}-006` },
    { component_name: 'Hall Effect Sensor', part_number: '490512', serial_number: `SN-${baseTimestamp}-007` },

    { component_name: 'DC-DC Converter', part_number: '284502', serial_number: `SN-${baseTimestamp}-008` },
    { component_name: 'Power Supply Module', part_number: '241024', serial_number: `SN-${baseTimestamp}-009` },
    { component_name: 'Voltage Regulator', part_number: '480536', serial_number: `SN-${baseTimestamp}-010` },

    { component_name: 'Ceramic Capacitor', part_number: '476915', serial_number: `SN-${baseTimestamp}-011` },
    { component_name: 'Electrolytic Capacitor', part_number: '105847', serial_number: `SN-${baseTimestamp}-012` },
    { component_name: 'Tantalum Capacitor', part_number: '226938', serial_number: `SN-${baseTimestamp}-013` },

    { component_name: 'Precision Resistor', part_number: '100045', serial_number: `SN-${baseTimestamp}-014` },
    { component_name: 'Power Resistor', part_number: '510362', serial_number: `SN-${baseTimestamp}-015` },

    { component_name: 'Board Connector', part_number: '430450', serial_number: `SN-${baseTimestamp}-016` },
    { component_name: 'Cable Connector', part_number: '215877', serial_number: `SN-${baseTimestamp}-017` },
    { component_name: 'Terminal Block', part_number: '820145', serial_number: `SN-${baseTimestamp}-018` },

    { component_name: 'Fuse', part_number: '025084', serial_number: `SN-${baseTimestamp}-019` },
    { component_name: 'TVS Diode', part_number: '360724', serial_number: `SN-${baseTimestamp}-020` },

    { component_name: 'CAN Transceiver', part_number: '323245', serial_number: `SN-${baseTimestamp}-021` },
    { component_name: 'RS-485 Interface', part_number: '325197', serial_number: `SN-${baseTimestamp}-022` },

    { component_name: 'Flash Memory', part_number: '256384', serial_number: `SN-${baseTimestamp}-023` },
    { component_name: 'EEPROM', part_number: '128745', serial_number: `SN-${baseTimestamp}-024` },
  ];

  return components.map(comp => ({
    work_order_id: workOrderId,
    ...comp
  }));
}
