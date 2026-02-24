import React from 'react';
import { Activity, Cpu, Database, HardDrive, Battery, Network, ShieldCheck, Zap, AlertTriangle, RefreshCw, ClipboardList } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis, XAxis, Tooltip } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { MetricCard } from './MetricCard';
import { getSystemMetrics, SystemMetrics } from '../services/systemInfo';
import { getSystemDiagnosis, SystemDiagnosis } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { DiagnosticFlow } from './DiagnosticFlow';
import { HardwareChecklist } from './HardwareChecklist';

export default function Dashboard() {
  const [metrics, setMetrics] = React.useState<SystemMetrics | null>(null);
  const [diagnosis, setDiagnosis] = React.useState<SystemDiagnosis | null>(null);
  const [history, setHistory] = React.useState<any[]>([]);
  const [isScanning, setIsScanning] = React.useState(false);
  const [showFlow, setShowFlow] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'overview' | 'diagnosis'>('overview');

  const fetchMetrics = async () => {
    const data = await getSystemMetrics();
    setMetrics(data);
    
    // Simulate real-time CPU/RAM fluctuations for the chart
    setHistory(prev => {
      const newPoint = {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        cpu: Math.floor(Math.random() * 30) + 10, // Simulated CPU load
        cpuTrend: Math.floor(Math.random() * 11) - 5, // Random trend -5 to 5
        ram: Math.floor(Math.random() * 20) + 40, // Simulated RAM usage
      };
      return [...prev.slice(-19), newPoint];
    });
  };

  React.useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 3000);
    return () => clearInterval(interval);
  }, []);

  const runDiagnosis = async () => {
    setShowFlow(true);
    setIsScanning(true);
  };

  const handleFlowComplete = async () => {
    if (!metrics) return;
    const result = await getSystemDiagnosis(metrics);
    setDiagnosis(result);
    setIsScanning(false);
    setShowFlow(false);
    setActiveTab('diagnosis');
  };

  if (!metrics) return null;

  const storageUsagePercent = Math.round((metrics.storageEstimate.usage / metrics.storageEstimate.quota) * 100) || 0;

  return (
    <div className="flex flex-col gap-8">
      <AnimatePresence>
        {showFlow && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-hw-bg/90 backdrop-blur-sm"
          >
            <DiagnosticFlow onComplete={handleFlowComplete} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-hw-accent mb-1">
            <ShieldCheck size={18} />
            <span className="text-xs font-mono uppercase tracking-[0.2em]">System Secure</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tighter">NOVASYSTEM <span className="text-hw-text-dim font-light">v2.4</span></h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={runDiagnosis}
            disabled={isScanning}
            className="bg-hw-accent text-hw-bg px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:brightness-110 transition-all disabled:opacity-50"
          >
            {isScanning ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} />}
            {isScanning ? 'DIAGNOSING...' : 'AI QUICK SCAN'}
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="flex gap-1 bg-hw-card p-1 rounded-xl border border-white/5 w-fit">
        {(['overview', 'diagnosis'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
              activeTab === tab ? 'bg-white/10 text-hw-accent' : 'text-hw-text-dim hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <MetricCard 
                title="CPU Utilization" 
                value={history[history.length - 1]?.cpu || 0} 
                unit="%" 
                icon={Cpu}
                trend={history[history.length - 1]?.cpuTrend || 0}
                status={(history[history.length - 1]?.cpu || 0) > 80 ? 'critical' : 'normal'}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history}>
                    <defs>
                      <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00ff9d" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00ff9d" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="cpu" stroke="#00ff9d" fillOpacity={1} fill="url(#colorCpu)" isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </MetricCard>

              <MetricCard 
                title="Memory Usage" 
                value={metrics.memoryLimit} 
                unit="GB" 
                icon={Database}
              >
                <div className="mt-2">
                  <div className="flex justify-between text-[10px] font-mono text-hw-text-dim mb-1">
                    <span>ALLOCATED</span>
                    <span>{history[history.length - 1]?.ram}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-hw-accent"
                      initial={{ width: 0 }}
                      animate={{ width: `${history[history.length - 1]?.ram}%` }}
                    />
                  </div>
                </div>
              </MetricCard>

              <MetricCard 
                title="Storage" 
                value={storageUsagePercent} 
                unit="%" 
                icon={HardDrive}
                status={storageUsagePercent > 90 ? 'warning' : 'normal'}
              >
                <div className="mt-2 text-[10px] font-mono text-hw-text-dim">
                  {(metrics.storageEstimate.usage / (1024 * 1024 * 1024)).toFixed(1)} GB / 
                  {(metrics.storageEstimate.quota / (1024 * 1024 * 1024)).toFixed(1)} GB
                </div>
              </MetricCard>

              <MetricCard 
                title="Battery Status" 
                value={metrics.battery?.level.toFixed(0) || 'N/A'} 
                unit={metrics.battery ? '%' : ''} 
                icon={Battery}
                status={metrics.battery && metrics.battery.level < 20 ? 'warning' : 'normal'}
              >
                <div className="flex items-center gap-2 mt-2">
                  <div className={`w-2 h-2 rounded-full ${metrics.battery?.charging ? 'bg-hw-accent animate-pulse' : 'bg-hw-text-dim'}`} />
                  <span className="text-[10px] font-mono text-hw-text-dim">
                    {metrics.battery?.charging ? 'CHARGING' : 'DISCHARGING'}
                  </span>
                </div>
              </MetricCard>

              {/* Large Chart */}
              <div className="md:col-span-2 lg:col-span-4 bg-hw-card border border-white/5 rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-mono uppercase tracking-wider flex items-center gap-2">
                    <Activity size={16} className="text-hw-accent" />
                    Performance Timeline
                  </h3>
                  <div className="flex gap-4 text-[10px] font-mono">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-hw-accent rounded-full" /> CPU
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-hw-warning rounded-full" /> RAM
                    </div>
                  </div>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={history}>
                      <XAxis dataKey="time" hide />
                      <YAxis hide domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#151619', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                        itemStyle={{ fontFamily: 'monospace', fontSize: '12px' }}
                      />
                      <Area type="monotone" dataKey="cpu" stroke="#00ff9d" fill="#00ff9d" fillOpacity={0.1} />
                      <Area type="monotone" dataKey="ram" stroke="#ffb800" fill="#ffb800" fillOpacity={0.1} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'diagnosis' && (
            <motion.div
              key="diagnosis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {!diagnosis ? (
                <div className="lg:col-span-3 flex flex-col items-center justify-center py-20 text-hw-text-dim">
                  <AlertTriangle size={48} className="mb-4 opacity-20" />
                  <p className="font-mono text-sm">NO DIAGNOSTIC DATA AVAILABLE</p>
                  <button onClick={runDiagnosis} className="mt-4 text-hw-accent hover:underline text-xs font-mono">INITIATE SCAN</button>
                </div>
              ) : (
                <>
                  <div className="lg:col-span-1 flex flex-col gap-6">
                    <div className="bg-hw-card border border-white/5 rounded-xl p-6 text-center">
                      <h3 className="text-xs font-mono text-hw-text-dim uppercase mb-4">Performance Score</h3>
                      <div className="relative inline-flex items-center justify-center">
                        <svg className="w-32 h-32">
                          <circle className="text-white/5" strokeWidth="8" stroke="currentColor" fill="transparent" r="58" cx="64" cy="64" />
                          <motion.circle 
                            className={diagnosis.status === 'optimal' ? 'text-hw-accent' : diagnosis.status === 'warning' ? 'text-hw-warning' : 'text-hw-error'}
                            strokeWidth="8" 
                            strokeDasharray={364}
                            initial={{ strokeDashoffset: 364 }}
                            animate={{ strokeDashoffset: 364 - (364 * diagnosis.performanceScore) / 100 }}
                            strokeLinecap="round" 
                            stroke="currentColor" 
                            fill="transparent" 
                            r="58" cx="64" cy="64" 
                          />
                        </svg>
                        <span className="absolute text-3xl font-bold">{diagnosis.performanceScore}</span>
                      </div>
                      <div className={`mt-4 text-xs font-mono uppercase tracking-widest ${
                        diagnosis.status === 'optimal' ? 'text-hw-accent' : diagnosis.status === 'warning' ? 'text-hw-warning' : 'text-hw-error'
                      }`}>
                        {diagnosis.status}
                      </div>
                    </div>

                    <div className="bg-hw-card border border-white/5 rounded-xl p-6">
                      <h3 className="text-xs font-mono text-hw-text-dim uppercase mb-4">System Identity</h3>
                      <div className="space-y-4 font-mono text-[10px]">
                        <div>
                          <p className="text-hw-text-dim mb-1">PLATFORM</p>
                          <p className="text-white">{metrics.platform}</p>
                        </div>
                        <div>
                          <p className="text-hw-text-dim mb-1">CORES</p>
                          <p className="text-white">{metrics.cpuCores} LOGICAL PROCESSORS</p>
                        </div>
                        <div>
                          <p className="text-hw-text-dim mb-1">NETWORK</p>
                          <p className="text-white">{metrics.network?.effectiveType.toUpperCase()} ({metrics.network?.downlink} Mbps)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-hw-card border border-white/5 rounded-xl p-8">
                      <h3 className="text-sm font-mono text-hw-accent uppercase mb-6 flex items-center gap-2">
                        <ShieldCheck size={18} />
                        AI Diagnostic Summary
                      </h3>
                      <div className="prose prose-invert max-w-none prose-sm font-sans leading-relaxed text-hw-text-dim">
                        <ReactMarkdown>{diagnosis.summary}</ReactMarkdown>
                      </div>
                    </div>

                    <div className="bg-hw-card border border-white/5 rounded-xl p-8">
                      <h3 className="text-sm font-mono text-hw-warning uppercase mb-6 flex items-center gap-2">
                        <Zap size={18} />
                        Optimization Roadmap
                      </h3>
                      <ul className="space-y-4">
                        {diagnosis.recommendations.map((rec, i) => (
                          <motion.li 
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex gap-4 items-start group"
                          >
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-hw-accent group-hover:scale-150 transition-transform" />
                            <p className="text-sm text-white/80 leading-snug">{rec}</p>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
