import React from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Download, 
  Share2, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  ShieldCheck,
  ArrowRight,
  Printer
} from 'lucide-react';

interface ScanStep {
  id: string;
  name: string;
  status: 'pending' | 'scanning' | 'passed' | 'failed' | 'warning';
  result?: string;
  recommendation?: string;
  severity: 'Low' | 'Medium' | 'Critical';
}

interface ReportProps {
  results: ScanStep[] | null;
}

export const Report: React.FC<ReportProps> = ({ results }) => {
  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-hw-text-dim">
        <FileText size={64} className="mb-6 opacity-20" />
        <h3 className="text-xl font-bold text-white mb-2">No Report Available</h3>
        <p className="text-sm max-w-xs text-center">
          Run a Full System Scan to generate a comprehensive diagnostic report.
        </p>
      </div>
    );
  }

  const passedCount = results.filter(r => r.status === 'passed').length;
  const failedCount = results.filter(r => r.status === 'failed' || r.status === 'warning').length;
  const healthScore = Math.round((passedCount / results.length) * 100);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-hw-accent/20 rounded-lg">
              <ShieldCheck className="text-hw-accent" size={20} />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">DIAGNOSTIC REPORT</h2>
          </div>
          <p className="text-hw-text-dim text-sm font-mono uppercase tracking-widest">
            Report ID: NS-{Math.random().toString(36).substring(7).toUpperCase()} • {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-3">
          <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-hw-text-dim hover:text-white">
            <Printer size={20} />
          </button>
          <button className="flex items-center gap-2 bg-hw-accent text-hw-bg px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform">
            <Download size={18} />
            EXPORT PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Health Score Card */}
        <div className="lg:col-span-1 bg-hw-card border border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
          <h3 className="text-xs font-mono text-hw-text-dim uppercase tracking-widest mb-6">Overall Health Score</h3>
          <div className="relative inline-flex items-center justify-center mb-6">
            <svg className="w-40 h-40">
              <circle className="text-white/5" strokeWidth="10" stroke="currentColor" fill="transparent" r="70" cx="80" cy="80" />
              <motion.circle 
                className={healthScore > 80 ? 'text-hw-accent' : healthScore > 50 ? 'text-hw-warning' : 'text-hw-error'}
                strokeWidth="10" 
                strokeDasharray={440}
                initial={{ strokeDashoffset: 440 }}
                animate={{ strokeDashoffset: 440 - (440 * healthScore) / 100 }}
                strokeLinecap="round" 
                stroke="currentColor" 
                fill="transparent" 
                r="70" cx="80" cy="80" 
              />
            </svg>
            <span className="absolute text-5xl font-bold">{healthScore}%</span>
          </div>
          <p className={`text-sm font-bold uppercase tracking-widest ${
            healthScore > 80 ? 'text-hw-accent' : healthScore > 50 ? 'text-hw-warning' : 'text-hw-error'
          }`}>
            {healthScore > 80 ? 'SYSTEM OPTIMAL' : healthScore > 50 ? 'ATTENTION REQUIRED' : 'CRITICAL FAILURE'}
          </p>
        </div>

        {/* Summary Stats */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-hw-card border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-hw-accent/10 rounded-lg text-hw-accent">
                <CheckCircle2 size={20} />
              </div>
              <h4 className="text-xs font-mono text-hw-text-dim uppercase">Passed Tests</h4>
            </div>
            <p className="text-4xl font-bold">{passedCount}</p>
            <p className="text-xs text-hw-text-dim mt-2">Components verified healthy</p>
          </div>
          <div className="bg-hw-card border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-hw-error/10 rounded-lg text-hw-error">
                <AlertTriangle size={20} />
              </div>
              <h4 className="text-xs font-mono text-hw-text-dim uppercase">Issues Found</h4>
            </div>
            <p className="text-4xl font-bold">{failedCount}</p>
            <p className="text-xs text-hw-text-dim mt-2">Requires technical attention</p>
          </div>
          <div className="col-span-2 bg-hw-card border border-white/5 rounded-2xl p-6 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-mono text-hw-text-dim uppercase mb-1">Scan Duration</h4>
              <p className="text-xl font-bold">02:44 MIN</p>
            </div>
            <div className="text-right">
              <h4 className="text-xs font-mono text-hw-text-dim uppercase mb-1">Nodes Scanned</h4>
              <p className="text-xl font-bold">{results.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold mb-6">Detailed Findings</h3>
        {results.map((result, index) => (
          <motion.div
            key={result.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-hw-card border rounded-2xl p-6 ${
              result.status === 'passed' ? 'border-white/5' : 
              result.status === 'warning' ? 'border-hw-warning/30 bg-hw-warning/[0.02]' :
              'border-hw-error/30 bg-hw-error/[0.02]'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${
                  result.status === 'passed' ? 'bg-hw-accent/10 text-hw-accent' :
                  result.status === 'warning' ? 'bg-hw-warning/10 text-hw-warning' :
                  'bg-hw-error/10 text-hw-error'
                }`}>
                  {result.status === 'passed' ? <CheckCircle2 size={20} /> : 
                   result.status === 'warning' ? <AlertTriangle size={20} /> : <XCircle size={20} />}
                </div>
                <div>
                  <h4 className="font-bold">{result.name}</h4>
                  <p className="text-xs text-hw-text-dim">{result.result}</p>
                </div>
              </div>
              <div className={`text-[10px] font-mono px-2 py-1 rounded uppercase border ${
                result.severity === 'Critical' ? 'border-hw-error/30 text-hw-error' :
                result.severity === 'Medium' ? 'border-hw-warning/30 text-hw-warning' :
                'border-hw-accent/30 text-hw-accent'
              }`}>
                {result.severity}
              </div>
            </div>

            {result.recommendation && (
              <div className="mt-4 p-4 bg-black/20 rounded-xl border border-white/5 flex items-start gap-3">
                <ArrowRight size={14} className="text-hw-accent mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-mono text-hw-accent uppercase mb-1">Recommendation</p>
                  <p className="text-xs text-white/80">{result.recommendation}</p>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
