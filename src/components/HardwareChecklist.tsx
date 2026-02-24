import React from 'react';
import { motion } from 'motion/react';
import { 
  HARDWARE_CHECKLIST, 
  DiagnosticStep, 
  DIAGNOSTIC_LOGIC_FLOW 
} from '../constants/hardwareChecklist';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Wrench, 
  Cpu, 
  Zap, 
  ShieldAlert, 
  ChevronRight,
  ArrowDown
} from 'lucide-react';

export const HardwareChecklist: React.FC = () => {
  const [selectedStep, setSelectedStep] = React.useState<DiagnosticStep | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'text-hw-error border-hw-error/20 bg-hw-error/5';
      case 'Medium': return 'text-hw-warning border-hw-warning/20 bg-hw-warning/5';
      case 'Low': return 'text-hw-accent border-hw-accent/20 bg-hw-accent/5';
      default: return 'text-hw-text-dim border-white/5 bg-white/5';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Sidebar: Logic Flow & Step List */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-hw-card border border-white/5 rounded-xl p-6">
          <h3 className="text-xs font-mono text-hw-accent uppercase tracking-widest mb-4 flex items-center gap-2">
            <Zap size={14} />
            Diagnostic Logic Flow
          </h3>
          <div className="space-y-3">
            {DIAGNOSTIC_LOGIC_FLOW.map((logic, i) => (
              <div key={i} className="flex items-center gap-3 text-[10px] font-mono text-hw-text-dim">
                <div className="w-1 h-1 rounded-full bg-hw-accent" />
                {logic}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-hw-card border border-white/5 rounded-xl p-4">
          <h3 className="text-xs font-mono text-hw-text-dim uppercase tracking-widest mb-4 px-2">
            Diagnostic Steps
          </h3>
          <div className="space-y-1">
            {HARDWARE_CHECKLIST.map((step) => (
              <button
                key={step.id}
                onClick={() => setSelectedStep(step)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between group ${
                  selectedStep?.id === step.id 
                    ? 'bg-hw-accent/10 border border-hw-accent/30 text-white' 
                    : 'hover:bg-white/5 text-hw-text-dim'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    step.severity === 'Critical' ? 'bg-hw-error' : 
                    step.severity === 'Medium' ? 'bg-hw-warning' : 'bg-hw-accent'
                  }`} />
                  <span className="text-xs font-medium">{step.name}</span>
                </div>
                <ChevronRight size={14} className={`transition-transform ${selectedStep?.id === step.id ? 'rotate-90 text-hw-accent' : 'opacity-0 group-hover:opacity-100'}`} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content: Step Details */}
      <div className="lg:col-span-8">
        {selectedStep ? (
          <motion.div
            key={selectedStep.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-hw-card border border-white/5 rounded-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-mono uppercase tracking-wider mb-4 ${getSeverityColor(selectedStep.severity)}`}>
                    {selectedStep.severity} Severity
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight">{selectedStep.name}</h2>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono text-hw-text-dim uppercase mb-1">Automation</p>
                  <p className={`text-xs font-bold ${selectedStep.automation === 'Yes' ? 'text-hw-accent' : selectedStep.automation === 'Partial' ? 'text-hw-warning' : 'text-hw-error'}`}>
                    {selectedStep.automation.toUpperCase()}
                  </p>
                </div>
              </div>
              <p className="text-hw-text-dim text-sm leading-relaxed max-w-2xl">
                {selectedStep.purpose}
              </p>
            </div>

            {/* Grid Details */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                <section>
                  <h4 className="text-[10px] font-mono text-hw-accent uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Info size={12} />
                    What to Check
                  </h4>
                  <ul className="space-y-2">
                    {selectedStep.checkItems.map((item, i) => (
                      <li key={i} className="text-xs text-hw-text-dim flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-white/20" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h4 className="text-[10px] font-mono text-hw-accent uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Cpu size={12} />
                    Self-Device Diagnosis
                  </h4>
                  <p className="text-xs text-hw-text-dim leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">
                    {selectedStep.selfMethod}
                  </p>
                </section>

                <section>
                  <h4 className="text-[10px] font-mono text-hw-accent uppercase tracking-widest mb-3 flex items-center gap-2">
                    <ShieldAlert size={12} />
                    Fault Symptoms
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedStep.faultSymptoms.map((symptom, i) => (
                      <span key={i} className="text-[10px] bg-hw-error/10 text-hw-error border border-hw-error/20 px-2 py-1 rounded">
                        {symptom}
                      </span>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                <section>
                  <h4 className="text-[10px] font-mono text-hw-accent uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Wrench size={12} />
                    Tools Required
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedStep.tools.map((tool, i) => (
                      <span key={i} className="text-[10px] bg-white/5 text-hw-text-dim border border-white/10 px-2 py-1 rounded">
                        {tool}
                      </span>
                    ))}
                  </div>
                </section>

                <section>
                  <h4 className="text-[10px] font-mono text-hw-accent uppercase tracking-widest mb-3 flex items-center gap-2">
                    <ArrowDown size={12} />
                    External / Cross-Device
                  </h4>
                  <p className="text-xs text-hw-text-dim leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">
                    {selectedStep.externalMethod}
                  </p>
                </section>

                <section className="p-4 bg-hw-accent/5 border border-hw-accent/20 rounded-xl">
                  <h4 className="text-[10px] font-mono text-hw-accent uppercase tracking-widest mb-2">Recommended Fix</h4>
                  <p className="text-sm font-bold text-white mb-1">{selectedStep.faultyComponent}</p>
                  <p className="text-xs text-hw-text-dim">{selectedStep.recommendedFix}</p>
                </section>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-hw-text-dim border-2 border-dashed border-white/5 rounded-2xl p-12 text-center">
            <Wrench size={48} className="mb-4 opacity-20" />
            <h3 className="text-lg font-bold text-white mb-2">Select a Diagnostic Step</h3>
            <p className="text-sm max-w-xs">
              Choose a component from the list to view detailed hardware engineering diagnostic protocols.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
