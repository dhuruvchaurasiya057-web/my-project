import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: number;
  status?: 'normal' | 'warning' | 'critical';
  children?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  status = 'normal',
  children
}) => {
  const statusColors = {
    normal: 'text-hw-accent',
    warning: 'text-hw-warning',
    critical: 'text-hw-error'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-hw-card border border-white/5 rounded-xl p-5 relative overflow-hidden group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-white/5 rounded-lg">
          <Icon size={20} className={statusColors[status]} />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-mono ${trend >= 0 ? 'text-hw-accent' : 'text-hw-error'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      
      <div>
        <h3 className="text-hw-text-dim text-xs uppercase tracking-wider font-mono mb-1">{title}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold tracking-tight">{value}</span>
          {unit && <span className="text-hw-text-dim text-sm font-mono">{unit}</span>}
        </div>
      </div>

      {children && (
        <div className="mt-4 h-16 w-full">
          {children}
        </div>
      )}

      <div className={`absolute bottom-0 left-0 h-0.5 bg-current transition-all duration-500 opacity-30 ${statusColors[status]}`} style={{ width: '100%' }} />
    </motion.div>
  );
};
