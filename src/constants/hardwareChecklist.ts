export interface DiagnosticStep {
  id: string;
  name: string;
  purpose: string;
  checkItems: string[];
  selfMethod: string;
  externalMethod: string;
  tools: string[];
  expectedResult: string;
  faultSymptoms: string[];
  faultyComponent: string;
  recommendedFix: string;
  severity: 'Low' | 'Medium' | 'Critical';
  automation: 'Yes' | 'No' | 'Partial';
}

export const HARDWARE_CHECKLIST: DiagnosticStep[] = [
  {
    id: 'power-source',
    name: 'Power Source',
    purpose: 'Ensure the primary power supply from the wall outlet is stable.',
    checkItems: ['Wall outlet voltage', 'Socket physical condition', 'Surge protector status'],
    selfMethod: 'Observe if the laptop charging LED lights up when plugged in.',
    externalMethod: 'Plug another known-working device (lamp, phone charger) into the same outlet.',
    tools: ['Multimeter', 'Outlet Tester', 'Known-working device'],
    expectedResult: 'Stable voltage output (110V/220V depending on region).',
    faultSymptoms: ['No power to any device', 'Intermittent power', 'Sparking at outlet'],
    faultyComponent: 'Wall Outlet / Surge Protector / Building Wiring',
    recommendedFix: 'Try a different outlet or replace the surge protector.',
    severity: 'Critical',
    automation: 'No'
  },
  {
    id: 'charger-check',
    name: 'Charger Check',
    purpose: 'Verify the AC adapter is converting power and delivering it to the device.',
    checkItems: ['Charger LED', 'Cable physical integrity', 'Connector pin condition'],
    selfMethod: 'Check for "Plugged in" status in OS; listen for coil whine.',
    externalMethod: 'Test charger on another compatible laptop; test laptop with another known-working charger.',
    tools: ['Multimeter (DC Volts)', 'Compatible spare charger'],
    expectedResult: 'LED is on; output voltage matches the label (e.g., 19.5V DC).',
    faultSymptoms: ['LED off', 'Frayed cables', 'Laptop only runs on battery'],
    faultyComponent: 'AC Adapter / Power Cord',
    recommendedFix: 'Replace AC adapter.',
    severity: 'Critical',
    automation: 'Partial'
  },
  {
    id: 'battery-check',
    name: 'Battery Check',
    purpose: 'Assess battery health, capacity, and charging capability.',
    checkItems: ['Battery health percentage', 'Cycle count', 'Physical swelling'],
    selfMethod: 'Run `powercfg /batteryreport` in Windows; check BIOS battery health.',
    externalMethod: 'Remove battery and run laptop on AC power only (if removable).',
    tools: ['Windows Battery Report', 'HWMonitor', 'BIOS Diagnostics'],
    expectedResult: 'Health > 80%; status "Charging" or "Full".',
    faultSymptoms: ['"Plugged in, not charging"', 'Rapid discharge', 'System shuts down when unplugged'],
    faultyComponent: 'Battery Cells / Charging Circuit',
    recommendedFix: 'Replace battery.',
    severity: 'Medium',
    automation: 'Yes'
  },
  {
    id: 'power-button',
    name: 'Power Button Check',
    purpose: 'Confirm the physical trigger for the power-on sequence is functional.',
    checkItems: ['Button tactile feedback', 'Power LED response', 'Motherboard power header'],
    selfMethod: 'Press button and observe fan spin or LED blink.',
    externalMethod: 'Short the power pins on the motherboard (Desktop only) to bypass the button.',
    tools: ['Screwdriver (for shorting pins)', 'Multimeter (Continuity)'],
    expectedResult: 'System initiates POST (Power-On Self-Test) immediately.',
    faultSymptoms: ['No response to press', 'Button feels stuck', 'System turns on then immediately off'],
    faultyComponent: 'Power Button Switch / Ribbon Cable',
    recommendedFix: 'Clean button contact or replace power switch assembly.',
    severity: 'Critical',
    automation: 'No'
  },
  {
    id: 'bios-firmware',
    name: 'BIOS / Firmware Check',
    purpose: 'Ensure the low-level software can detect and initialize hardware.',
    checkItems: ['Component detection (CPU/RAM/Disk)', 'System time/date', 'Firmware version'],
    selfMethod: 'Enter BIOS (F2/Del/F12) and verify all hardware is listed.',
    externalMethod: 'Flash BIOS using a USB recovery drive (if system is bricked).',
    tools: ['BIOS Setup Utility', 'UEFI Diagnostics', 'CMOS Battery'],
    expectedResult: 'All components detected; no "Checkstyle" or "CMOS" errors.',
    faultSymptoms: ['"No bootable device"', 'System time resets', 'BIOS password lock'],
    faultyComponent: 'CMOS Battery / BIOS Chip / Firmware',
    recommendedFix: 'Replace CMOS battery or reset BIOS to defaults.',
    severity: 'Medium',
    automation: 'Partial'
  },
  {
    id: 'ram-check',
    name: 'RAM Check',
    purpose: 'Verify memory integrity and proper seating.',
    checkItems: ['Total memory capacity', 'Memory frequency', 'Slot functionality'],
    selfMethod: 'Run Windows Memory Diagnostic or MemTest86.',
    externalMethod: 'Reseat RAM modules; test one stick at a time in different slots.',
    tools: ['MemTest86', 'Windows Memory Diagnostic', 'Isopropyl Alcohol (for cleaning)'],
    expectedResult: 'Full capacity detected; zero errors found during stress test.',
    faultSymptoms: ['Blue Screen of Death (BSOD)', 'Random crashes', 'Beep codes on startup'],
    faultyComponent: 'RAM Module / Motherboard DIMM Slot',
    recommendedFix: 'Reseat modules or replace faulty RAM stick.',
    severity: 'Critical',
    automation: 'Yes'
  },
  {
    id: 'storage-check',
    name: 'Storage Check (HDD/SSD)',
    purpose: 'Ensure data integrity and drive health.',
    checkItems: ['S.M.A.R.T. status', 'Read/Write speeds', 'Partition health'],
    selfMethod: 'Check CrystalDiskInfo for S.M.A.R.T. status; run `chkdsk`.',
    externalMethod: 'Connect drive to another PC via USB adapter to check accessibility.',
    tools: ['CrystalDiskInfo', 'SATA-to-USB Adapter', 'HD Tune'],
    expectedResult: 'S.M.A.R.T. status "Good"; no bad sectors.',
    faultSymptoms: ['Slow performance', 'Clicking sounds (HDD)', 'Files disappearing'],
    faultyComponent: 'HDD / SSD / SATA Cable',
    recommendedFix: 'Replace drive and restore from backup.',
    severity: 'Critical',
    automation: 'Yes'
  },
  {
    id: 'cooling-system',
    name: 'Cooling System Check',
    purpose: 'Prevent hardware damage from overheating.',
    checkItems: ['Fan RPM', 'CPU/GPU temperatures', 'Thermal paste condition'],
    selfMethod: 'Monitor temps with HWInfo; listen for fan noise.',
    externalMethod: 'Use compressed air to blow out dust from vents.',
    tools: ['HWInfo', 'Compressed Air', 'Thermal Paste'],
    expectedResult: 'Idle temps < 50°C; Load temps < 90°C; Fan spins freely.',
    faultSymptoms: ['Loud fan noise', 'System throttling', 'Sudden thermal shutdown'],
    faultyComponent: 'CPU Fan / Heatsink / Thermal Paste',
    recommendedFix: 'Clean dust or re-apply thermal paste.',
    severity: 'Medium',
    automation: 'Yes'
  },
  {
    id: 'os-check',
    name: 'Operating System Check',
    purpose: 'Verify software stability and driver compatibility.',
    checkItems: ['Boot time', 'Device Manager errors', 'System file integrity'],
    selfMethod: 'Run `sfc /scannow`; check Event Viewer for critical errors.',
    externalMethod: 'Boot from a Live Linux USB to rule out hardware failure.',
    tools: ['Windows Event Viewer', 'SFC/DISM tools', 'Live Linux USB'],
    expectedResult: 'OS boots in < 30s; no yellow exclamation marks in Device Manager.',
    faultSymptoms: ['Infinite loading circle', 'Driver crashes', 'System lag'],
    faultyComponent: 'OS Installation / Drivers / Registry',
    recommendedFix: 'Update drivers or perform a clean OS install.',
    severity: 'Low',
    automation: 'Partial'
  },
  {
    id: 'process-monitoring',
    name: 'Process Monitoring Check',
    purpose: 'Identify resource-heavy or malicious background tasks.',
    checkItems: ['CPU spikes', 'Memory leaks', 'Disk I/O usage'],
    selfMethod: 'Analyze Task Manager "Details" and "Performance" tabs.',
    externalMethod: 'Scan for malware using an offline scanner.',
    tools: ['Task Manager', 'Resource Monitor', 'Process Explorer'],
    expectedResult: 'Idle CPU < 5%; no unknown high-resource processes.',
    faultSymptoms: ['Constant 100% CPU usage', 'System unresponsive', 'High network activity at idle'],
    faultyComponent: 'Malware / Background Services / Bloatware',
    recommendedFix: 'End task or uninstall unnecessary software.',
    severity: 'Low',
    automation: 'Yes'
  },
  {
    id: 'shutdown-check',
    name: 'Shutdown Check',
    purpose: 'Ensure the system powers down correctly without data loss.',
    checkItems: ['Shutdown duration', 'Power LED behavior', 'Restart loop detection'],
    selfMethod: 'Initiate shutdown and time how long it takes for the power LED to turn off.',
    externalMethod: 'Check BIOS "Power Management" settings for "Wake on LAN" issues.',
    tools: ['Stopwatch', 'Event Viewer (Kernel-Power logs)'],
    expectedResult: 'System shuts down completely in < 15s.',
    faultSymptoms: ['System restarts instead of shutting down', 'Screen goes black but fans stay on', 'Blue screen on shutdown'],
    faultyComponent: 'Power Supply / Windows Fast Startup / Driver conflict',
    recommendedFix: 'Disable Fast Startup or update chipset drivers.',
    severity: 'Low',
    automation: 'Partial'
  }
];

export const DIAGNOSTIC_LOGIC_FLOW = [
  'IF no power → check charger',
  'IF charger OK → check battery',
  'IF battery OK → check motherboard',
  'IF system boots → check OS',
  'IF OS OK → check processes'
];
