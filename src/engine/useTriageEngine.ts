import { useState, useRef, useEffect, useCallback } from 'react';
import { TaskDefinition } from '../types/task';
import { telemetryBus } from './TelemetryBus';
import { ScoringEngine } from './ScoringEngine';

export interface TriageEngineOptions {
  task: TaskDefinition;
  onComplete: (summary: {
    accuracy: number;
    totalItems: number;
    correctCount: number;
    durationSeconds: number;
  }) => void;
  onEarlyExit: (
    reason: 'LOW_ACCURACY' | 'ERRATIC_SPEED',
    accuracy: number,
    speedSecondsPerItem: number
  ) => void;
  onDecisionFeedback?: (info: {
    isCorrect: boolean;
    latencyMs: number;
    streak: number;
    itemId: string;
  }) => void;
}

/**
 * Headless Hook encapsulating all Triage / Card-Swipe / SOP Stamp queue logic.
 * Prevents code duplication across different Diegetic UI skins while keeping TelemetryBus & Gatekeeper intact.
 */
export function useTriageEngine({
  task,
  onComplete,
  onEarlyExit,
  onDecisionFeedback,
}: TriageEngineOptions) {
  const items = task.work_items || [];
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [streakCount, setStreakCount] = useState<number>(0);
  const [lastFeedback, setLastFeedback] = useState<'CORRECT' | 'INCORRECT' | null>(null);
  const [stampAnimation, setStampAnimation] = useState<'LEFT' | 'RIGHT' | null>(null);

  const taskStartTimeRef = useRef<number>(Date.now());
  const itemStartTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    taskStartTimeRef.current = Date.now();
    itemStartTimeRef.current = performance.now();
  }, [task.id]);

  const currentItem = items[currentIndex];

  const leftTargetId = task.custom_bins?.[0]?.target_id || 'CONN_ERR';
  const rightTargetId = task.custom_bins?.[1]?.target_id || 'DATA_ERR';

  const handleClassify = useCallback(
    (targetId: string) => {
      if (!currentItem) return;

      const latencyMs = Math.round(performance.now() - itemStartTimeRef.current);
      const isCorrect = targetId === currentItem.expected_target;

      const newCorrect = isCorrect ? correctCount + 1 : correctCount;
      const newStreak = isCorrect ? streakCount + 1 : 0;

      setCorrectCount(newCorrect);
      setStreakCount(newStreak);
      setLastFeedback(isCorrect ? 'CORRECT' : 'INCORRECT');
      setStampAnimation(targetId === leftTargetId ? 'LEFT' : 'RIGHT');

      telemetryBus.publish('item_classified', {
        item_id: currentItem.id,
        target_id: targetId,
        is_correct: isCorrect,
        latency_ms: latencyMs,
      });

      if (onDecisionFeedback) {
        onDecisionFeedback({
          isCorrect,
          latencyMs,
          streak: newStreak,
          itemId: currentItem.id,
        });
      }

      if (currentIndex + 1 < items.length) {
        setCurrentIndex(prev => prev + 1);
        itemStartTimeRef.current = performance.now();
      } else {
        const totalDurationSec = (Date.now() - taskStartTimeRef.current) / 1000;
        const totalItems = items.length;

        const gatekeeper = ScoringEngine.evaluateStage1Gatekeeper({
          totalItems,
          correctItems: newCorrect,
          durationSeconds: totalDurationSec,
        });

        if (gatekeeper.shouldExit && gatekeeper.reason) {
          telemetryBus.publish('early_exit_fired', {
            reason: gatekeeper.reason,
            final_accuracy: gatekeeper.accuracy,
            speed_sec_per_item: gatekeeper.speedSecondsPerItem,
          });
          onEarlyExit(gatekeeper.reason, gatekeeper.accuracy, gatekeeper.speedSecondsPerItem);
        } else {
          onComplete({
            accuracy: gatekeeper.accuracy,
            totalItems,
            correctCount: newCorrect,
            durationSeconds: totalDurationSec,
          });
        }
      }
    },
    [
      currentItem,
      correctCount,
      streakCount,
      leftTargetId,
      onDecisionFeedback,
      currentIndex,
      items.length,
      onEarlyExit,
      onComplete,
    ]
  );

  // Keyboard shortcuts (A / ArrowLeft -> Left Stamp, D / ArrowRight -> Right Stamp)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
        e.preventDefault();
        handleClassify(leftTargetId);
      } else if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
        e.preventDefault();
        handleClassify(rightTargetId);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleClassify, leftTargetId, rightTargetId]);

  return {
    items,
    currentItem,
    currentIndex,
    correctCount,
    streakCount,
    lastFeedback,
    stampAnimation,
    leftTargetId,
    rightTargetId,
    handleClassify,
  };
}
