import React, { useState } from 'react';
import { TaskWorkflowState, CompetencyProfile, ProgramMatchResult } from './types/state';
import {
  LogisticsSubmission,
  MissionEvaluationResult,
  MissionId,
  QaSubmission,
} from './types/mission';
import { IndustryRegistry } from './registry/index';
import { evaluateLogisticsMission, evaluateQaDataMission } from './engine/MissionEvaluators';
import { ScoringEngine } from './engine/ScoringEngine';
import { telemetryBus } from './engine/TelemetryBus';

import AppShell from './components/AppShell';
import IndustrySelector from './components/IndustrySelector';
import MissionBriefing from './components/missions/MissionBriefing';
import LogisticsDispatchBoard from './components/missions/LogisticsDispatchBoard';
import QaDataWorkbench from './components/missions/QaDataWorkbench';
import MissionDebrief from './components/missions/MissionDebrief';
import CompetencyRadar from './components/CompetencyRadar';
import BlindMatchingCards from './components/BlindMatchingCards';
import ParentAlignmentKit from './components/ParentAlignmentKit';

export const App: React.FC = () => {
  const [workflowState, setWorkflowState] = useState<TaskWorkflowState>('IDLE');
  const [selectedMissionId, setSelectedMissionId] = useState<MissionId>('IND_LOG_COLDCHAIN');
  const [completedMissionIds, setCompletedMissionIds] = useState<MissionId[]>([]);

  const [lastEvaluation, setLastEvaluation] = useState<MissionEvaluationResult | null>(null);
  const [competencyProfile, setCompetencyProfile] = useState<CompetencyProfile | null>(null);
  const [matchedPrograms, setMatchedPrograms] = useState<ProgramMatchResult[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  const currentIndustry = IndustryRegistry.getIndustry(selectedMissionId);

  const handleSelectMission = (missionId: MissionId) => {
    setSelectedMissionId(missionId);
    setWorkflowState('MISSION_BRIEFING');
  };

  const handleStartMission = () => {
    telemetryBus.publish('mission_started', {
      mission_id: selectedMissionId,
      time_limit_sec: currentIndustry.scenario.durationMinutes * 60,
    });
    setWorkflowState('MISSION_ACTIVE');
  };

  const finalizeEvaluation = (evaluation: MissionEvaluationResult, elapsedSeconds: number) => {
    const updatedCompleted = completedMissionIds.includes(evaluation.missionId)
      ? completedMissionIds
      : [...completedMissionIds, evaluation.missionId];
    setCompletedMissionIds(updatedCompleted);

    if (evaluation.aiTrapVerdict === 'TRIGGERED_AND_ACCEPTED') {
      telemetryBus.publish('ai_copilot_accepted', { mission_id: evaluation.missionId });
    } else if (evaluation.aiTrapVerdict === 'TRIGGERED_AND_REJECTED') {
      telemetryBus.publish('ai_copilot_overridden', {
        mission_id: evaluation.missionId,
        method: 'MANUAL_FIX',
      });
    }

    telemetryBus.publish('mission_submitted', {
      mission_id: evaluation.missionId,
      elapsed_sec: elapsedSeconds,
      composite_score: evaluation.scores.composite,
    });

    const profile = ScoringEngine.buildCompetencyProfile(evaluation, updatedCompleted.length);
    const programs = IndustryRegistry.getPrograms(evaluation.missionId);
    const ranked = ScoringEngine.rankPrograms(profile, programs);

    setLastEvaluation(evaluation);
    setCompetencyProfile(profile);
    setMatchedPrograms(ranked);
    setSelectedProgramId(ranked[0]?.program.id || null);
    setIsRevealed(false);
    setWorkflowState('MISSION_DEBRIEF');
  };

  const handleLogisticsSubmit = (submission: LogisticsSubmission) => {
    const evaluation = evaluateLogisticsMission(submission);
    finalizeEvaluation(evaluation, submission.elapsedSeconds);
  };

  const handleQaSubmit = (submission: QaSubmission) => {
    const evaluation = evaluateQaDataMission(submission);
    finalizeEvaluation(evaluation, submission.elapsedSeconds);
  };

  const handleReturnToSelector = () => {
    setLastEvaluation(null);
    setCompetencyProfile(null);
    setMatchedPrograms([]);
    setSelectedProgramId(null);
    setIsRevealed(false);
    setWorkflowState('IDLE');
  };

  const handleRetryCurrentMission = () => {
    setLastEvaluation(null);
    setWorkflowState('MISSION_ACTIVE');
  };

  const otherMission = IndustryRegistry.getAllIndustries().find(
    ind => ind.id !== selectedMissionId
  );

  return (
    <AppShell
      industryName={workflowState !== 'IDLE' ? currentIndustry.name : undefined}
      onResetSession={workflowState !== 'IDLE' ? handleReturnToSelector : undefined}
      wideLayout={workflowState === 'MISSION_ACTIVE'}
    >
      {workflowState === 'IDLE' && (
        <IndustrySelector
          onSelectMission={handleSelectMission}
          completedMissionIds={completedMissionIds}
        />
      )}

      {workflowState === 'MISSION_BRIEFING' && (
        <MissionBriefing
          scenario={currentIndustry.scenario}
          onStartMission={handleStartMission}
          onBack={handleReturnToSelector}
        />
      )}

      {workflowState === 'MISSION_ACTIVE' && selectedMissionId === 'IND_LOG_COLDCHAIN' && (
        <LogisticsDispatchBoard
          scenario={IndustryRegistry.getLogisticsScenario()}
          onSubmit={handleLogisticsSubmit}
        />
      )}

      {workflowState === 'MISSION_ACTIVE' && selectedMissionId === 'IND_QA_DATA' && (
        <QaDataWorkbench
          scenario={IndustryRegistry.getQaScenario()}
          onSubmit={handleQaSubmit}
        />
      )}

      {workflowState === 'MISSION_DEBRIEF' && lastEvaluation && (
        <MissionDebrief
          evaluation={lastEvaluation}
          onProceedToMatching={() => setWorkflowState('BLIND_MATCHING')}
          onRetryMission={handleRetryCurrentMission}
        />
      )}

      {workflowState === 'BLIND_MATCHING' && competencyProfile && (
        <div className="space-y-10 animate-fadeIn">
          <CompetencyRadar
            profile={competencyProfile}
            recommendedNextMission={
              otherMission ? { id: otherMission.id, name: otherMission.name } : null
            }
            onStartRecommendedMission={handleSelectMission}
          />
          <BlindMatchingCards
            matchedPrograms={matchedPrograms}
            selectedProgramId={selectedProgramId}
            onSelectProgram={setSelectedProgramId}
            isRevealed={isRevealed}
            onReveal={() => setIsRevealed(true)}
            onProceedToReport={() => setWorkflowState('REVEALED_REPORT')}
          />
        </div>
      )}

      {workflowState === 'REVEALED_REPORT' && competencyProfile && (
        <ParentAlignmentKit
          profile={competencyProfile}
          matchedPrograms={matchedPrograms}
          selectedProgramId={selectedProgramId}
          marketIntelligence={currentIndustry.marketIntelligence}
          onBackToBlindMatching={() => setWorkflowState('BLIND_MATCHING')}
          onResetSession={handleReturnToSelector}
        />
      )}
    </AppShell>
  );
};

export default App;
