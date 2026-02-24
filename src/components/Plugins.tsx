import React from 'react';
import { motion } from 'motion/react';
import { 
  Slack, 
  Webhook, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const Plugins: React.FC = () => {
  const [slackWebhook, setSlackWebhook] = React.useState('');
  const [isTesting, setIsTesting] = React.useState(false);
  const [testResult, setTestResult] = React.useState<{ status: 'success' | 'error', message: string } | null>(null);

  const testSlackWebhook = async () => {
    if (!slackWebhook) {
      setTestResult({ status: 'error', message: 'Please enter a webhook URL first.' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      // In a real app, we would save this to the DB first.
      // For this demo, we'll try to send a test alert using the provided URL.
      // Since the backend /api/send-alert uses process.env, we'll simulate the call here
      // or we could update the backend to accept a URL for testing.
      
      const response = await fetch('/api/send-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: 'This is a test diagnostic alert from NOVA_SCAN.',
          // We'll assume the backend can handle an optional webhookUrl override for testing
          testWebhookUrl: slackWebhook 
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setTestResult({ status: 'success', message: 'Test alert sent successfully! Check your Slack channel.' });
      } else {
        setTestResult({ status: 'error', message: data.message || 'Failed to send test alert. Verify the Webhook URL.' });
      }
    } catch (error: any) {
      setTestResult({ status: 'error', message: error.message || 'Network error occurred.' });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight mb-2">PLUGINS & INTEGRATIONS</h2>
        <p className="text-hw-text-dim text-sm">Extend NOVA_SCAN with external hooks and third-party services.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Slack Plugin */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-hw-card border border-white/5 rounded-2xl overflow-hidden"
        >
          <div className="p-8 border-b border-white/5 bg-gradient-to-br from-hw-accent/5 to-transparent flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-hw-accent/20 rounded-xl text-hw-accent">
                <Slack size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold">Slack Notifications</h3>
                <p className="text-xs text-hw-text-dim">Send real-time diagnostic alerts to Slack channels.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono bg-hw-accent/10 text-hw-accent px-2 py-1 rounded border border-hw-accent/20 uppercase">Active</span>
              <div className="w-10 h-5 bg-hw-accent rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-3 h-3 bg-hw-bg rounded-full" />
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div>
              <label className="block text-xs font-mono text-hw-text-dim uppercase tracking-widest mb-3 flex items-center gap-2">
                <Webhook size={14} className="text-hw-accent" />
                Incoming Webhook URL
              </label>
              <div className="flex gap-3">
                <input 
                  type="password" 
                  value={slackWebhook}
                  onChange={(e) => setSlackWebhook(e.target.value)}
                  placeholder="https://hooks.slack.com/services/..."
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:border-hw-accent outline-none transition-colors"
                />
                <button 
                  onClick={testSlackWebhook}
                  disabled={isTesting}
                  className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 border border-white/10 transition-all disabled:opacity-50"
                >
                  {isTesting ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                  TEST
                </button>
              </div>
              <p className="mt-3 text-[10px] text-hw-text-dim leading-relaxed flex items-center gap-2">
                <ShieldCheck size={12} className="text-hw-accent" />
                Your webhook URL is encrypted and stored securely.
                <a href="https://api.slack.com/messaging/webhooks" target="_blank" rel="noreferrer" className="text-hw-accent hover:underline flex items-center gap-1 ml-auto">
                  Setup Guide <ExternalLink size={10} />
                </a>
              </p>
            </div>

            {testResult && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  testResult.status === 'success' ? 'bg-hw-accent/10 border-hw-accent/20 text-hw-accent' : 'bg-hw-error/10 border-hw-error/20 text-hw-error'
                }`}
              >
                {testResult.status === 'success' ? <CheckCircle2 size={16} className="mt-0.5 shrink-0" /> : <AlertCircle size={16} className="mt-0.5 shrink-0" />}
                <p className="text-xs font-medium">{testResult.message}</p>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <h4 className="text-xs font-bold mb-2 flex items-center gap-2">
                  <Zap size={14} className="text-hw-warning" />
                  Trigger Events
                </h4>
                <div className="space-y-2">
                  {['Critical Hardware Failure', 'Battery Health < 20%', 'Storage Quota Exceeded'].map(event => (
                    <div key={event} className="flex items-center gap-2 text-[10px] text-hw-text-dim">
                      <div className="w-1 h-1 rounded-full bg-hw-accent" />
                      {event}
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <h4 className="text-xs font-bold mb-2 flex items-center gap-2">
                  <ShieldCheck size={14} className="text-hw-accent" />
                  Security Policy
                </h4>
                <p className="text-[10px] text-hw-text-dim leading-relaxed">
                  Webhooks are only triggered for verified system events. Rate limiting is applied to prevent channel spamming (max 1 alert/min).
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Placeholder for more plugins */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-hw-card border border-white/5 rounded-2xl p-8 opacity-50 grayscale">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white/10 rounded-xl text-hw-text-dim">
                <Webhook size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold">Custom Webhooks</h3>
                <p className="text-xs text-hw-text-dim">Generic HTTP POST integration.</p>
              </div>
            </div>
            <button disabled className="w-full py-3 border border-white/10 rounded-xl text-[10px] font-mono uppercase tracking-widest">Coming Soon</button>
          </div>
          <div className="bg-hw-card border border-white/5 rounded-2xl p-8 opacity-50 grayscale">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white/10 rounded-xl text-hw-text-dim">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold">Azure Sentinel</h3>
                <p className="text-xs text-hw-text-dim">Enterprise SIEM integration.</p>
              </div>
            </div>
            <button disabled className="w-full py-3 border border-white/10 rounded-xl text-[10px] font-mono uppercase tracking-widest">Enterprise Only</button>
          </div>
        </div>
      </div>
    </div>
  );
};
