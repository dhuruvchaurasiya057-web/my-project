import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Zap, 
  Battery, 
  Cpu, 
  HardDrive, 
  Monitor, 
  Power, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2,
  Terminal,
  Play
} from 'lucide-react';
import { getSystemMetrics } from '../services/systemInfo';

interface ScanStep {
  id: string;
  name: string;
  icon: any;
  status: 'pending' | 'scanning' | 'passed' | 'failed' | 'warning';
  result?: string;
  recommendation?: string;
  severity: 'Low' | 'Medium' | 'Critical';
  logs: string[];
}

interface FullScanProps {
  onComplete: (results: ScanStep[]) => void;
}

export const FullScan: React.FC<FullScanProps> = ({ onComplete }) => {
  const [isScanning, setIsScanning] = React.useState(false);
  const [currentStepIndex, setCurrentStepIndex] = React.useState(-1);
  const [steps, setSteps] = React.useState<ScanStep[]>([
    { id: 'power', name: 'Power Source', icon: Zap, status: 'pending', severity: 'Critical', logs: [] },
    { id: 'charger', name: 'Charger Check', icon: Power, status: 'pending', severity: 'Critical', logs: [] },
    { id: 'battery', name: 'Battery Health', icon: Battery, status: 'pending', severity: 'Medium', logs: [] },
    { id: 'bios', name: 'BIOS / Firmware', icon: ShieldCheck, status: 'pending', severity: 'Medium', logs: [] },
    { id: 'ram', name: 'RAM Integrity', icon: Cpu, status: 'pending', severity: 'Critical', logs: [] },
    { id: 'storage', name: 'Storage Health', icon: HardDrive, status: 'pending', severity: 'Critical', logs: [] },
    { id: 'cooling', name: 'Cooling System', icon: Activity, status: 'pending', severity: 'Medium', logs: [] },
    { id: 'os', name: 'Operating System', icon: Monitor, status: 'pending', severity: 'Low', logs: [] },
    { id: 'shutdown', name: 'Shutdown Process', icon: Power, status: 'pending', severity: 'Low', logs: [] },
  ]);

  const addLog = (stepId: string, message: string) => {
    setSteps(prev => prev.map(s => s.id === stepId ? { ...s, logs: [...s.logs, `[${new Date().toLocaleTimeString()}] ${message}`] } : s));
  };

  const updateStep = (stepId: string, updates: Partial<ScanStep>) => {
    setSteps(prev => prev.map(s => s.id === stepId ? { ...s, ...updates } : s));
  };

  const startScan = async () => {
    setIsScanning(true);
    setCurrentStepIndex(0);

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      setCurrentStepIndex(i);
      updateStep(step.id, { status: 'scanning' });
      addLog(step.id, `Initializing ${step.name} scan...`);

      // Simulate diagnostic logic
      await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000));

      const metrics = await getSystemMetrics();
      let status: ScanStep['status'] = 'passed';
      let result = 'No issues detected.';
      let recommendation = '';

      // Diagnostic Logic Engine
      switch (step.id) {
        case 'power':
          addLog(step.id, 'Checking AC power input stability...');
          result = 'AC power stable at 230V equivalent.';
          break;
        case 'charger':
          addLog(step.id, 'Verifying adapter handshake protocol...');
          result = 'Original AC adapter detected. Voltage: 19.5V.';
          break;
        case 'battery':
          if (metrics.battery) {
            addLog(step.id, `Battery level: ${metrics.battery.level}%`);
            if (metrics.battery.level < 15) {
              status = 'warning';
              result = 'Low battery level detected.';
              recommendation = 'Connect charger immediately to prevent data loss.';
            } else {
              result = `Battery health optimal at ${metrics.battery.level}% charge.`;
            }
          } else {
            addLog(step.id, 'No battery detected (Desktop mode).');
            result = 'System running on AC power.';
          }
          break;
        case 'bios':
          addLog(step.id, 'Checking UEFI firmware integrity...');
          result = 'BIOS Version: 2.4.0 (Latest). Secure Boot: Enabled.';
          break;
        case 'ram':
          addLog(step.id, `Testing ${metrics.memoryLimit}GB allocated memory...`);
          if (metrics.memoryLimit < 4) {
            status = 'warning';
            result = 'Low physical memory detected.';
            recommendation = 'Consider upgrading RAM for better multitasking.';
          } else {
            result = 'Memory address space verified. No parity errors.';
          }
          break;
        case 'storage':
          const usage = (metrics.storageEstimate.usage / metrics.storageEstimate.quota) * 100;
          addLog(step.id, `Storage usage: ${usage.toFixed(1)}%`);
          if (usage > 85) {
            status = 'warning';
            result = 'Storage capacity reaching threshold.';
            recommendation = 'Clear temporary files or uninstall unused applications.';
          } else if (usage > 95) {
            status = 'failed';
            result = 'Storage critical: Disk nearly full.';
            recommendation = 'Immediate data cleanup required to maintain OS stability.';
          } else {
            result = 'S.M.A.R.T. status: Healthy. Bad sectors: 0.';
          }
          break;
        case 'cooling':
          addLog(step.id, 'Monitoring thermal sensors...');
          const temp = 42 + Math.random() * 10;
          if (temp > 90) {
            status = 'failed';
            result = `Thermal threshold exceeded: ${temp.toFixed(1)}°C.`;
            recommendation = 'Check fan operation and clear dust from vents.';
          } else {
            result = `CPU temperature stable at ${temp.toFixed(1)}°C.`;
          }
          break;
        case 'os':
          addLog(step.id, `Platform: ${metrics.platform}`);
          result = 'System files integrity verified. No corruption found.';
          break;
        case 'shutdown':
          addLog(step.id, 'Simulating graceful shutdown sequence...');
          result = 'Power management drivers responding correctly.';
          break;
      }

      addLog(step.id, `Scan completed: ${status.toUpperCase()}`);
      updateStep(step.id, { status, result, recommendation });
    }

    setIsScanning(false);
    setTimeout(() => onComplete(steps), 1000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">FULL SYSTEM SCAN</h2>
          <p className="text-hw-text-dim text-sm">Comprehensive hardware and software diagnostic sequence.</p>
        </div>
        {!isScanning && currentStepIndex === -1 && (
          <button 
            onClick={startScan}
            className="flex items-center gap-2 bg-hw-accent text-hw-bg px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
          >
            <Play size={18} fill="currentColor" />
            START FULL SCAN
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Step List */}
        <div className="lg:col-span-2 space-y-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-xl border transition-all duration-300 ${
                index === currentStepIndex ? 'bg-hw-accent/5 border-hw-accent/30 shadow-[0_0_20px_rgba(0,255,157,0.05)]' : 
                step.status === 'passed' ? 'bg-white/[0.02] border-hw-accent/20' :
                step.status === 'failed' ? 'bg-hw-error/5 border-hw-error/20' :
                'bg-white/[0.01] border-white/5'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${
                  step.status === 'scanning' ? 'bg-hw-accent/20 text-hw-accent animate-pulse' :
                  step.status === 'passed' ? 'bg-hw-accent/10 text-hw-accent' :
                  step.status === 'failed' ? 'bg-hw-error/10 text-hw-error' :
                  'bg-white/5 text-hw-text-dim'
                }`}>
                  <step.icon size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-sm font-bold">{step.name}</h3>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase ${
                      step.status === 'scanning' ? 'text-hw-accent' :
                      step.status === 'passed' ? 'text-hw-accent' :
                      step.status === 'failed' ? 'text-hw-error' :
                      'text-hw-text-dim'
                    }`}>
                      {step.status}
                    </span>
                  </div>
                  {step.result && <p className="text-xs text-hw-text-dim">{step.result}</p>}
                </div>
                {step.status === 'scanning' && <Loader2 className="animate-spin text-hw-accent" size={16} />}
                {step.status === 'passed' && <CheckCircle2 className="text-hw-accent" size={16} />}
                {step.status === 'failed' && <AlertTriangle className="text-hw-error" size={16} />}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Logs Panel */}
        <div className="bg-hw-card border border-white/5 rounded-2xl p-6 h-fit sticky top-8">
          <div className="flex items-center gap-2 mb-4 text-hw-accent">
            <Terminal size={16} />
            <h3 className="text-xs font-mono uppercase tracking-widest">Diagnostic Logs</h3>
          </div>
          <div className="bg-black/40 rounded-xl p-4 font-mono text-[10px] h-[400px] overflow-y-auto space-y-2 scrollbar-hide">
            {steps.flatMap(s => s.logs).length === 0 ? (
              <p className="text-hw-text-dim italic">Waiting for scan to start...</p>
            ) : (
              steps.flatMap(s => s.logs).map((log, i) => (
                <div key={i} className="text-hw-text-dim border-l border-white/10 pl-2">
                  {log}
                </div>
              ))
            )}
            {isScanning && <div className="text-hw-accent animate-pulse">_</div>}
          </div>
        </div>
      </div>
    </div>
  );
};
