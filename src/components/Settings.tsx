import React from 'react';
import { motion } from 'motion/react';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Database, 
  Cloud, 
  Save,
  Mail,
  Smartphone,
  Loader2
} from 'lucide-react';

export const Settings: React.FC = () => {
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Settings saved successfully.');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight mb-2">SYSTEM SETTINGS</h2>
        <p className="text-hw-text-dim text-sm">Configure diagnostic protocols and external integrations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Tabs */}
        <div className="md:col-span-1 space-y-2">
          {[
            { id: 'general', label: 'General', icon: SettingsIcon },
            { id: 'alerts', label: 'Alerts & Notifications', icon: Bell },
            { id: 'security', label: 'Security', icon: Shield },
            { id: 'storage', label: 'Data Management', icon: Database },
            { id: 'cloud', label: 'Cloud Sync', icon: Cloud },
          ].map((item) => (
            <button
              key={item.id}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                item.id === 'alerts' ? 'bg-hw-accent/10 text-hw-accent border border-hw-accent/20' : 'text-hw-text-dim hover:bg-white/5'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-8">
          <section className="bg-hw-card border border-white/5 rounded-2xl p-8">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
              <Bell className="text-hw-accent" />
              Notification Channels
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 opacity-50">
                <div className="flex items-center gap-4">
                  <Mail className="text-hw-text-dim" />
                  <div>
                    <h4 className="text-sm font-bold mb-1">Email Reports</h4>
                    <p className="text-xs text-hw-text-dim">Send weekly health summaries.</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-hw-text-dim uppercase">Enterprise Only</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-4">
                  <Smartphone className="text-hw-accent" />
                  <div>
                    <h4 className="text-sm font-bold mb-1">Push Notifications</h4>
                    <p className="text-xs text-hw-text-dim">Real-time mobile alerts.</p>
                  </div>
                </div>
                <div className="w-10 h-5 bg-hw-accent rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-hw-bg rounded-full" />
                </div>
              </div>
            </div>
          </section>

          <div className="flex justify-end">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-hw-accent text-hw-bg px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              SAVE CHANGES
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
