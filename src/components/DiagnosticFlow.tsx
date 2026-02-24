import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Search, Cpu, Map, CheckCircle, AlertCircle, Loader2, Link as LinkIcon, Server } from 'lucide-react';
import { getSystemMetrics } from '../services/systemInfo';

interface DiagnosticStep {
  id: number;
  action: string;
  element: string;
  icon: any;
  status: 'pending' | 'active' | 'completed';
}

interface SystemInfo {
  name: string;
  ip: string;
  port: number;
  next: string | null;
  status?: 'HEALTHY' | 'DOWN';
}

const SYSTEM_MAP: Record<string, SystemInfo> = {
  web_server: { name: 'Web Server', ip: '127.0.0.1', port: 80, next: 'api_server' },
  api_server: { name: 'API Server', ip: '127.0.0.1', port: 5000, next: 'database_server' },
  database_server: { name: 'Database Server', ip: '127.0.0.1', port: 5432, next: null }
};

interface DiagnosticFlowProps {
  onComplete: () => void;
}

export const DiagnosticFlow: React.FC<DiagnosticFlowProps> = ({ onComplete }) => {
  const [steps, setSteps] = React.useState<DiagnosticStep[]>([
    { id: 1, action: 'Detecting a "Heartbeat" failure (The Pulse).', element: 'Trigger', icon: Activity, status: 'pending' },
    { id: 2, action: 'Scanning System Map for dependencies.', element: 'Sensor', icon: Search, status: 'pending' },
    { id: 3, action: 'Executing Automatic Jump Logic.', element: 'Logic Controller', icon: Cpu, status: 'pending' },
    { id: 4, action: 'Identifying the "Root Cause" (The Map).', element: 'The Map', icon: Map, status: 'pending' },
    { id: 5, action: 'Sending you a summary of the fix.', element: 'Reporter', icon: CheckCircle, status: 'pending' },
  ]);

  const [diagnosticPath, setDiagnosticPath] = React.useState<string[]>([]);
  const [pathResults, setPathResults] = React.useState<Record<string, any>>({});
  const [rootCause, setRootCause] = React.useState<string | null>(null);

  const checkLocalHealth = async () => {
    const metrics = await getSystemMetrics();
    const cpu = Math.floor(Math.random() * 30) + 10; // Simulated current CPU
    const ram = 45; // Simulated current RAM %
    const disk = Math.round((metrics.storageEstimate.usage / metrics.storageEstimate.quota) * 100);

    const results = {
      cpu: { value: cpu, status: cpu < 85 ? 'PASS' : 'FAIL' },
      ram: { value: ram, status: ram < 90 ? 'PASS' : 'FAIL' },
      disk: { value: disk, status: disk < 95 ? 'PASS' : 'FAIL' }
    };

    setPathResults(prev => ({ ...prev, local: results }));
    return results.cpu.status === 'PASS' && results.ram.status === 'PASS' && results.disk.status === 'PASS';
  };

  const autoDiagnose = async (systemKey: string): Promise<string> => {
    const sysInfo = SYSTEM_MAP[systemKey];
    setDiagnosticPath(prev => [...prev, systemKey]);
    
    // Simulate network delay
    await new Promise(r => setTimeout(r, 1000));
    
    try {
      // 1. Ping Check (The Pulse)
      const pingRes = await fetch(`/api/ping?host=${sysInfo.ip}`).then(r => r.json());
      
      if (pingRes.status === 'FAIL') {
        setPathResults(prev => ({ ...prev, [systemKey]: { network: 'FAIL', service: 'UNKNOWN' } }));
        if (sysInfo.next) {
          return await autoDiagnose(sysInfo.next);
        } else {
          setRootCause(`${sysInfo.name} (Network Unreachable)`);
          return `ROOT CAUSE FOUND: ${sysInfo.name} Network`;
        }
      }

      // 2. Port Check (The Service)
      const portRes = await fetch(`/api/diagnose-port?host=${sysInfo.ip}&port=${sysInfo.port}`).then(r => r.json());
      const isHealthy = portRes.status === 'PASS';
      
      setPathResults(prev => ({ ...prev, [systemKey]: { network: 'PASS', service: portRes.status } }));

      if (isHealthy) {
        return `Root cause is NOT ${sysInfo.name}`;
      } else {
        if (sysInfo.next) {
          return await autoDiagnose(sysInfo.next);
        } else {
          setRootCause(`${sysInfo.name} (Service Down)`);
          // Send alert
          fetch('/api/send-alert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: `Root cause identified: ${sysInfo.name} service is DOWN.` })
          }).catch(err => console.error("Alert failed:", err));
          
          return `ROOT CAUSE FOUND: ${sysInfo.name}`;
        }
      }
    } catch (e) {
      setPathResults(prev => ({ ...prev, [systemKey]: { network: 'ERROR', service: 'ERROR' } }));
      return 'DIAGNOSIS_ERROR';
    }
  };

  React.useEffect(() => {
    const runSequence = async () => {
      // Step 1: Local Health Check
      setSteps(s => s.map((step, i) => i === 0 ? { ...step, status: 'active' } : step));
      const localHealthy = await checkLocalHealth();
      await new Promise(r => setTimeout(r, 1200));
      setSteps(s => s.map((step, i) => i === 0 ? { ...step, status: 'completed' } : step));

      if (!localHealthy) {
        setRootCause('Local System Overload');
        setSteps(s => s.map((step, i) => i > 0 ? { ...step, status: 'completed' } : step));
        setTimeout(onComplete, 1000);
        return;
      }

      // Step 2: Sensor (Scan Map)
      setSteps(s => s.map((step, i) => i === 1 ? { ...step, status: 'active' } : step));
      await new Promise(r => setTimeout(r, 1000));
      setSteps(s => s.map((step, i) => i === 1 ? { ...step, status: 'completed' } : step));

      // Step 3: Logic Controller (Jump Logic)
      setSteps(s => s.map((step, i) => i === 2 ? { ...step, status: 'active' } : step));
      await autoDiagnose('web_server');
      setSteps(s => s.map((step, i) => i === 2 ? { ...step, status: 'completed' } : step));

      // Step 4: Root Cause (The Map)
      setSteps(s => s.map((step, i) => i === 3 ? { ...step, status: 'active' } : step));
      await new Promise(r => setTimeout(r, 1500));
      setSteps(s => s.map((step, i) => i === 3 ? { ...step, status: 'completed' } : step));

      // Step 5: Reporter
      setSteps(s => s.map((step, i) => i === 4 ? { ...step, status: 'active' } : step));
      await new Promise(r => setTimeout(r, 1000));
      setSteps(s => s.map((step, i) => i === 4 ? { ...step, status: 'completed' } : step));
      
      setTimeout(onComplete, 1000);
    };

    runSequence();
  }, []);

  return (
    <div className="bg-hw-card border border-white/10 rounded-2xl p-8 max-w-3xl w-full mx-auto shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
        <motion.div 
          className="h-full bg-hw-accent"
          initial={{ width: 0 }}
          animate={{ width: `${(steps.filter(s => s.status === 'completed').length / steps.length) * 100}%` }}
        />
      </div>

      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-xl font-bold tracking-tight mb-1">SYSTEM NEURAL SCAN</h2>
          <p className="text-hw-text-dim text-xs font-mono uppercase tracking-widest">Sequence ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
        </div>
        <div className="p-3 bg-hw-accent/10 rounded-full">
          <Loader2 className="text-hw-accent animate-spin" size={24} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {steps.map((step) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: step.status === 'pending' ? 0.3 : 1,
                x: 0,
                scale: step.status === 'active' ? 1.02 : 1
              }}
              className={`flex items-center gap-4 p-3 rounded-xl border transition-all duration-300 ${
                step.status === 'active' ? 'bg-white/5 border-hw-accent/30' : 'border-transparent'
              }`}
            >
              <div className={`p-2 rounded-lg ${
                step.status === 'completed' ? 'bg-hw-accent/20 text-hw-accent' : 
                step.status === 'active' ? 'bg-hw-warning/20 text-hw-warning animate-pulse' : 
                'bg-white/5 text-hw-text-dim'
              }`}>
                <step.icon size={16} />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-hw-text-dim uppercase tracking-wider">{step.element}</span>
                  {step.status === 'completed' && <CheckCircle size={12} className="text-hw-accent" />}
                </div>
                <p className={`text-xs font-medium ${step.status === 'active' ? 'text-white' : 'text-hw-text-dim'}`}>
                  {step.action}
                </p>
                {step.status === 'completed' && step.id === 1 && pathResults.local && (
                  <div className="mt-2 grid grid-cols-3 gap-2 text-[8px] font-mono">
                    <div className={pathResults.local.cpu.status === 'PASS' ? 'text-hw-accent' : 'text-hw-error'}>
                      CPU: {pathResults.local.cpu.value}%
                    </div>
                    <div className={pathResults.local.ram.status === 'PASS' ? 'text-hw-accent' : 'text-hw-error'}>
                      RAM: {pathResults.local.ram.value}%
                    </div>
                    <div className={pathResults.local.disk.status === 'PASS' ? 'text-hw-accent' : 'text-hw-error'}>
                      DISK: {pathResults.local.disk.value}%
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-black/20 rounded-xl p-6 border border-white/5 flex flex-col gap-4">
          <h3 className="text-[10px] font-mono text-hw-accent uppercase tracking-widest mb-2 flex items-center gap-2">
            <Map size={14} />
            Dependency Chain Map
          </h3>
          
          <div className="flex flex-col gap-4 relative">
            {Object.entries(SYSTEM_MAP).map(([key, sys], index) => {
              const isVisited = diagnosticPath.includes(key);
              const result = pathResults[key];
              const isCurrent = diagnosticPath[diagnosticPath.length - 1] === key && !rootCause;

              return (
                <React.Fragment key={key}>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: isVisited ? 1 : 0.3, y: 0 }}
                    className={`p-2 rounded-lg border flex items-center gap-3 ${
                      isCurrent ? 'border-hw-warning bg-hw-warning/5 animate-pulse' :
                      result?.service === 'PASS' ? 'border-hw-accent bg-hw-accent/5' :
                      result?.network === 'FAIL' || result?.service?.startsWith('FAIL') ? 'border-hw-error bg-hw-error/5' :
                      'border-white/10 bg-white/5'
                    }`}
                  >
                    <Server size={14} className={result?.service === 'PASS' ? 'text-hw-accent' : result?.network === 'FAIL' || result?.service?.startsWith('FAIL') ? 'text-hw-error' : 'text-hw-text-dim'} />
                    <div className="flex-1">
                      <p className="text-[11px] font-bold">{sys.name}</p>
                      <p className="text-[9px] font-mono text-hw-text-dim">{sys.ip}:{sys.port}</p>
                    </div>
                    {result && (
                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-[7px] font-mono px-1 rounded ${
                          result.network === 'PASS' ? 'bg-hw-accent/20 text-hw-accent' : 'bg-hw-error/20 text-hw-error'
                        }`}>
                          NET: {result.network}
                        </span>
                        <span className={`text-[7px] font-mono px-1 rounded ${
                          result.service === 'PASS' ? 'bg-hw-accent/20 text-hw-accent' : result.service === 'UNKNOWN' ? 'bg-white/5 text-hw-text-dim' : 'bg-hw-error/20 text-hw-error'
                        }`}>
                          SVC: {result.service}
                        </span>
                      </div>
                    )}
                  </motion.div>
                  {sys.next && (
                    <div className="flex justify-center py-1">
                      <LinkIcon size={12} className={isVisited ? 'text-hw-accent' : 'text-white/10'} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {rootCause && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 p-4 bg-hw-error/10 border border-hw-error/30 rounded-lg text-center"
            >
              <p className="text-[10px] font-mono text-hw-error uppercase mb-1">Root Cause Identified</p>
              <p className="text-sm font-bold text-white">{rootCause.toUpperCase()} FAILURE</p>
            </motion.div>
          )}
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-hw-text-dim">
        <div className="flex gap-4">
          <span>SCAN_MODE: CHAIN_REACTION</span>
          <span>NODES: {Object.keys(SYSTEM_MAP).length}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-hw-accent animate-pulse" />
          {rootCause ? 'SCAN COMPLETE' : 'TRACE_ACTIVE...'}
        </div>
      </div>
    </div>
  );
};

