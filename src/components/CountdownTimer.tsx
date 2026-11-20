import React, { useEffect, useState, useRef } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { telemetryBus } from '../engine/TelemetryBus';

interface CountdownTimerProps {
  initialSeconds: number;
  isRunning: boolean;
  onTimeUp: () => void;
  onTick?: (remaining: number) => void;
  pendingTasksCount?: number;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialSeconds,
  isRunning,
  onTimeUp,
  onTick,
  pendingTasksCount = 0,
}) => {
  const [remaining, setRemaining] = useState<number>(initialSeconds);
  const stressFiredRef = useRef<boolean>(false);

  useEffect(() => {
    setRemaining(initialSeconds);
    stressFiredRef.current = false;
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }

        const next = prev - 1;
        if (onTick) {
          onTick(next);
        }

        // Stress spike alert when <= 60 seconds
        if (next <= 60 && !stressFiredRef.current) {
          stressFiredRef.current = true;
          telemetryBus.publish('stress_spike_entered', {
            remaining_sec: next,
          });
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, onTimeUp, onTick, pendingTasksCount]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const isStressState = remaining <= 60 && remaining > 0;

  return (
    <div
      role="timer"
      aria-live="polite"
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 border transition-all ${
        isStressState
          ? 'border-live-red bg-live-red/5 text-live-red font-black animate-pulse shadow-sm'
          : 'border-hairline bg-white text-gray-800 font-bold'
      }`}
    >
      {isStressState ? (
        <AlertTriangle className="w-4 h-4 text-live-red animate-bounce" />
      ) : (
        <Clock className="w-4 h-4 text-muted-gray" />
      )}

      <span className="font-mono text-sm tracking-wider">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>

      {isStressState && (
        <span className="badge-live-red text-[10px] py-0 px-1.5 ml-1">
          GIỜ G
        </span>
      )}
    </div>
  );
};

export default CountdownTimer;

