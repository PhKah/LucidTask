import React, { useState } from 'react';
import { BookOpen, CheckCircle2 } from 'lucide-react';
import { TaskDefinition } from '../types/task';
import CountdownTimer from './CountdownTimer';
import HandbookDrawer from './HandbookDrawer';
import TriageClassifier from './archetypes/TriageClassifier';
import MultiSourceInspector from './archetypes/MultiSourceInspector';

interface TaskWorkspaceProps {
  currentStage: 1 | 2;
  task: TaskDefinition;
  onStage1Complete: (summary: {
    accuracy: number;
    totalItems: number;
    correctCount: number;
    durationSeconds: number;
  }) => void;
  onStage2Complete: (
    actionId: string,
    isOptimal: boolean,
    stats: { tabSwitches: number; panicClicks: number }
  ) => void;
  onEarlyExit: (
    reason: 'LOW_ACCURACY' | 'ERRATIC_SPEED',
    accuracy: number,
    speedSecondsPerItem: number
  ) => void;
}

export const TaskWorkspace: React.FC<TaskWorkspaceProps> = ({
  currentStage,
  task,
  onStage1Complete,
  onStage2Complete,
  onEarlyExit,
}) => {
  const [isHandbookOpen, setIsHandbookOpen] = useState<boolean>(false);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  const handleTimeUp = () => {
    // If time expires in Stage 1, treat as early exit due to timeout/incompletion
    if (currentStage === 1) {
      onEarlyExit('ERRATIC_SPEED', 0.5, 0);
    }
  };

  return (
    <div className="space-y-6">
      {/* 2-Stage Progression Stepper */}
      <div className="flex items-center justify-between border-b border-hairline pb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          {/* Stage 1 Pill */}
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-black uppercase tracking-wider border ${
              currentStage === 1
                ? 'border-accent bg-accent/10 text-black'
                : 'border-hairline bg-soft-gray text-muted-gray'
            }`}
          >
            {currentStage > 1 ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-accent" />
            )}
            <span>Chặng 1: Ma Sát (90s)</span>
          </div>

          <span className="text-hairline">───</span>

          {/* Stage 2 Pill */}
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-black uppercase tracking-wider border ${
              currentStage === 2
                ? 'border-accent bg-accent/10 text-black'
                : 'border-hairline bg-soft-gray text-muted-gray'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                currentStage === 2 ? 'bg-accent' : 'bg-gray-300'
              }`}
            />
            <span>Chặng 2: Năng Lực (3.5m)</span>
          </div>
        </div>

        {/* Right Action: Countdown & Handbook Button */}
        <div className="flex items-center gap-3">
          <CountdownTimer
            initialSeconds={task.time_limit_seconds}
            isRunning={isTimerRunning}
            onTimeUp={handleTimeUp}
            pendingTasksCount={task.work_items ? task.work_items.length : 1}
          />

          <button
            onClick={() => setIsHandbookOpen(true)}
            className="btn-pill-outline text-xs py-1.5 px-3.5 flex items-center gap-1.5 border-black hover:bg-neutral-100"
          >
            <BookOpen className="w-3.5 h-3.5 text-accent" />
            <span>Sổ Tay (15s)</span>
          </button>
        </div>
      </div>

      {/* Task Header & Brief */}
      <div className="card-hairline">
        <div className="flex items-center gap-2 mb-2">
          <span className="eyebrow-marker" />
          <span className="text-xs font-bold uppercase tracking-widest text-muted-gray">
            VAI TRÒ: {task.role_title}
          </span>
        </div>

        <h2 className="text-xl font-black uppercase tracking-tight mb-2">
          {task.title}
        </h2>
        <p className="text-xs text-muted-gray leading-relaxed max-w-3xl">
          {task.scenario_brief}
        </p>
      </div>

      {/* Dynamic Interaction Archetype Body */}
      {task.interaction_archetype === 'TRIAGE_AND_CLASSIFY' && (
        <TriageClassifier
          task={task}
          onComplete={summary => {
            setIsTimerRunning(false);
            onStage1Complete(summary);
          }}
          onEarlyExit={(reason, accuracy, speed) => {
            setIsTimerRunning(false);
            onEarlyExit(reason, accuracy, speed);
          }}
        />
      )}

      {task.interaction_archetype === 'MULTI_SOURCE_INVESTIGATION' && (
        <MultiSourceInspector
          task={task}
          onComplete={(actionId, isOptimal, stats) => {
            setIsTimerRunning(false);
            onStage2Complete(actionId, isOptimal, stats);
          }}
        />
      )}

      {/* Slide-out Handbook Drawer */}
      <HandbookDrawer
        isOpen={isHandbookOpen}
        onClose={() => setIsHandbookOpen(false)}
        rules={task.handbook_rules}
      />
    </div>
  );
};

export default TaskWorkspace;

