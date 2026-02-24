export interface SystemMetrics {
  cpuCores: number;
  memoryLimit: number;
  storageEstimate: {
    usage: number;
    quota: number;
  };
  battery: {
    level: number;
    charging: boolean;
  } | null;
  network: {
    downlink: number;
    effectiveType: string;
  } | null;
  userAgent: string;
  platform: string;
}

export async function getSystemMetrics(): Promise<SystemMetrics> {
  const storage = await navigator.storage.estimate();
  
  let battery = null;
  if ('getBattery' in navigator) {
    // @ts-ignore
    const b = await navigator.getBattery();
    battery = {
      level: b.level * 100,
      charging: b.charging
    };
  }

  // @ts-ignore
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  return {
    cpuCores: navigator.hardwareConcurrency || 0,
    // @ts-ignore
    memoryLimit: navigator.deviceMemory || 0,
    storageEstimate: {
      usage: storage.usage || 0,
      quota: storage.quota || 0
    },
    battery,
    network: connection ? {
      downlink: connection.downlink,
      effectiveType: connection.effectiveType
    } : null,
    userAgent: navigator.userAgent,
    // @ts-ignore
    platform: navigator.platform
  };
}
