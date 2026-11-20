import React, { useState } from 'react';
import { TaskWorkflowState } from './types/state';
import { IndustryRegistry } from './registry/index';
import AppShell from './components/AppShell';
import IndustrySelector from './components/IndustrySelector';
import TaskWorkspace from './components/TaskWorkspace';
import EarlyExitScreen from './components/EarlyExitScreen';
import { telemetryBus } from './engine/TelemetryBus';
import { ScoringEngine } from './engine/ScoringEngine';

export const App: React.FC = () => {
  const [workflowState, setWorkflowState] = useState<TaskWorkflowState>('IDLE');
  const [selectedIndustryId, setSelectedIndustryId] = useState<string>('IND_TECH_SW');
  const [earlyExitData, setEarlyExitData] = useState<{
    reason: 'LOW_ACCURACY' | 'ERRATIC_SPEED';
    accuracy: number;
    speedSecondsPerItem: number;
  } | null>(null);

  const [stage1Summary, setStage1Summary] = useState<{
    accuracy: number;
    totalItems: number;
    correctCount: number;
    durationSeconds: number;
  } | null>(null);

  const [_stage2Result, setStage2Result] = useState<{
    actionId: string;
    isOptimal: boolean;
    stats: { tabSwitches: number; panicClicks: number };
  } | null>(null);

  const currentIndustry = IndustryRegistry.getIndustry(selectedIndustryId);
  const stage1Task = IndustryRegistry.getStageTask(selectedIndustryId, 1);
  const stage2Task = IndustryRegistry.getStageTask(selectedIndustryId, 2);

  const handleSelectIndustry = (industryId: string) => {
    setSelectedIndustryId(industryId);
    telemetryBus.publish('task_started', {
      stage: 1,
      time_limit_sec: 90,
    });
    setWorkflowState('STAGE1_TASK');
  };

  const handleStage1Complete = (summary: {
    accuracy: number;
    totalItems: number;
    correctCount: number;
    durationSeconds: number;
  }) => {
    setStage1Summary(summary);
    telemetryBus.publish('task_completed', {
      stage: 1,
      total_duration_sec: summary.durationSeconds,
    });

    // Advance to Stage 2
    telemetryBus.publish('task_started', {
      stage: 2,
      time_limit_sec: 210,
    });
    setWorkflowState('STAGE2_TASK');
  };

  const handleEarlyExit = (
    reason: 'LOW_ACCURACY' | 'ERRATIC_SPEED',
    accuracy: number,
    speedSecondsPerItem: number
  ) => {
    setEarlyExitData({ reason, accuracy, speedSecondsPerItem });
    setWorkflowState('EARLY_EXIT_SCREEN');
  };

  const handleStage2Complete = (
    actionId: string,
    isOptimal: boolean,
    stats: { tabSwitches: number; panicClicks: number }
  ) => {
    setStage2Result({ actionId, isOptimal, stats });
    telemetryBus.publish('task_completed', {
      stage: 2,
      total_duration_sec: 180,
    });

    // Compute profile for preview
    const profile = ScoringEngine.generateCompetencyProfile(
      {
        accuracy: stage1Summary ? stage1Summary.accuracy : 0.8,
        rootCauseIsolated: isOptimal,
        optimalPathTaken: isOptimal,
      },
      {
        handbookReadingMs: 16000,
        tabSwitchCount: stats.tabSwitches,
      },
      {
        errorRateNormal: 0.1,
        errorRateStress: isOptimal ? 0.15 : 0.45,
        panicClicksCount: stats.panicClicks,
      },
      stage1Summary ? stage1Summary.accuracy : 0.8
    );

    console.log('Competency Profile Generated:', profile);
    // In Sprint 3, this transitions to BLIND_MATCHING
    alert(`Hoàn thành xuất sắc 2 Chặng Tác Vụ!\nĐiểm tổng hợp: ${profile.composite_score}/100\nS_Logic: ${profile.logic_score} | S_Patience: ${profile.patience_score} | S_Resilience: ${profile.resilience_score}`);
  };

  const handleResetSession = () => {
    telemetryBus.clear();
    setStage1Summary(null);
    setStage2Result(null);
    setEarlyExitData(null);
    setWorkflowState('IDLE');
  };

  return (
    <AppShell
      industryName={workflowState !== 'IDLE' ? currentIndustry?.name : undefined}
      onResetSession={workflowState !== 'IDLE' ? handleResetSession : undefined}
      hasHandbook={workflowState === 'STAGE1_TASK' || workflowState === 'STAGE2_TASK'}
    >
      {workflowState === 'IDLE' && (
        <IndustrySelector onSelectIndustry={handleSelectIndustry} />
      )}

      {workflowState === 'STAGE1_TASK' && stage1Task && (
        <TaskWorkspace
          currentStage={1}
          task={stage1Task}
          onStage1Complete={handleStage1Complete}
          onStage2Complete={handleStage2Complete}
          onEarlyExit={handleEarlyExit}
        />
      )}

      {workflowState === 'EARLY_EXIT_SCREEN' && earlyExitData && (
        <EarlyExitScreen
          reason={earlyExitData.reason}
          accuracy={earlyExitData.accuracy}
          speedSecondsPerItem={earlyExitData.speedSecondsPerItem}
          onRetry={() => {
            telemetryBus.clear();
            setWorkflowState('STAGE1_TASK');
          }}
          onChooseOtherIndustry={handleResetSession}
        />
      )}

      {workflowState === 'STAGE2_TASK' && stage2Task && (
        <TaskWorkspace
          currentStage={2}
          task={stage2Task}
          onStage1Complete={handleStage1Complete}
          onStage2Complete={handleStage2Complete}
          onEarlyExit={handleEarlyExit}
        />
      )}
    </AppShell>
  );
};

export default App;
