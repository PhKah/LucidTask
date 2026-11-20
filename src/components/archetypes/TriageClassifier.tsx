import React, { useState, useRef, useEffect } from 'react';
import { Network, Database, Check, AlertCircle } from 'lucide-react';
import { TaskDefinition } from '../../types/task';
import { telemetryBus } from '../../engine/TelemetryBus';
import { ScoringEngine } from '../../engine/ScoringEngine';

interface TriageClassifierProps {
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
}

export const TriageClassifier: React.FC<TriageClassifierProps> = ({
  task,
  onComplete,
  onEarlyExit,
}) => {
  const items = task.work_items || [];
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [lastFeedback, setLastFeedback] = useState<'CORRECT' | 'INCORRECT' | null>(null);

  const taskStartTimeRef = useRef<number>(Date.now());
  const itemStartTimeRef = useRef<number>(performance.now());
  const answersRef = useRef<Array<{ target: string; isCorrect: boolean; latencyMs: number }>>([]);

  useEffect(() => {
    taskStartTimeRef.current = Date.now();
    itemStartTimeRef.current = performance.now();
  }, []);

  const currentItem = items[currentIndex];

  const handleClassify = (targetId: string) => {
    if (!currentItem) return;

    const latencyMs = Math.round(performance.now() - itemStartTimeRef.current);
    const isCorrect = targetId === currentItem.expected_target;

    const newCorrect = isCorrect ? correctCount + 1 : correctCount;
    setCorrectCount(newCorrect);
    setLastFeedback(isCorrect ? 'CORRECT' : 'INCORRECT');

    answersRef.current.push({
      target: targetId,
      isCorrect,
      latencyMs,
    });

    telemetryBus.publish('item_classified', {
      item_id: currentItem.id,
      target_id: targetId,
      is_correct: isCorrect,
      latency_ms: latencyMs,
    });

    if (currentIndex + 1 < items.length) {
      setCurrentIndex(prev => prev + 1);
      itemStartTimeRef.current = performance.now();
    } else {
      // Completed all items in Stage 1 -> Run Gatekeeper evaluation
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
  };

  if (!currentItem) {
    return (
      <div className="card-hairline text-center py-12">
        <p className="text-muted-gray text-sm">Đã xử lý xong toàn bộ danh sách mã lỗi.</p>
      </div>
    );
  }

  const isHighPriority = currentItem.content.includes('FATAL') || currentItem.content.includes('CRITICAL');

  return (
    <div className="space-y-6">
      {/* Progress & Item Counter */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold uppercase tracking-wider text-black">
            Mã Log Cần Xử Lý:
          </span>
          <span className="font-mono bg-soft-gray px-2 py-0.5 border border-hairline font-bold">
            {currentIndex + 1} / {items.length}
          </span>
        </div>

        {lastFeedback && (
          <div
            className={`flex items-center gap-1 font-bold text-xs animate-fadeIn ${
              lastFeedback === 'CORRECT' ? 'text-emerald-700' : 'text-live-red'
            }`}
          >
            {lastFeedback === 'CORRECT' ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Khớp chuẩn quy tắc!</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Chưa đúng quy tắc sổ tay</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Main 2-Column Split: Ticket Inspection vs Classification Targets */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Current Ticket (7 cols) */}
        <div className="md:col-span-7 card-hairline flex flex-col justify-between border-2 border-black bg-white min-h-[220px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold text-gray-500">
                {currentItem.id}
              </span>
              <span
                className={
                  isHighPriority
                    ? 'badge-live-red text-[10px]'
                    : 'bg-neutral-800 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase'
                }
              >
                {isHighPriority ? 'P1 - NGUY CẤP' : 'P3 - THƯỜNG'}
              </span>
            </div>

            <div className="bg-night-navy text-green-400 font-mono text-xs p-4 rounded border border-black leading-relaxed selection:bg-accent selection:text-black">
              {currentItem.content}
            </div>
          </div>

          <div className="text-[11px] text-muted-gray pt-4 border-t border-hairline flex items-center justify-between">
            <span>Tra cứu từ khóa trong thông báo log</span>
            <span>Đọc kỹ điều kiện trước khi chọn</span>
          </div>
        </div>

        {/* Right Column: 2 Dropzone/Selection Buttons (5 cols) */}
        <div className="md:col-span-5 flex flex-col gap-4 justify-center">
          {/* Bin 1: Connection Error */}
          <button
            onClick={() => handleClassify('CONN_ERR')}
            className="card-hairline p-4 text-left hover:border-black hover:bg-neutral-50 transition-all group border border-hairline focus:ring-2 focus:ring-black flex items-start gap-3"
          >
            <div className="w-9 h-9 rounded bg-black text-white flex items-center justify-center flex-shrink-0 group-hover:bg-accent group-hover:text-black transition-colors">
              <Network className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-black uppercase text-black mb-1 group-hover:text-accent transition-colors">
                Thùng 1: Lỗi Kết Nối Mạng
              </div>
              <p className="text-[11px] text-muted-gray leading-tight">
                TIMEOUT, CONNECTION_REFUSED, UNREACHABLE
              </p>
            </div>
          </button>

          {/* Bin 2: Data Error */}
          <button
            onClick={() => handleClassify('DATA_ERR')}
            className="card-hairline p-4 text-left hover:border-black hover:bg-neutral-50 transition-all group border border-hairline focus:ring-2 focus:ring-black flex items-start gap-3"
          >
            <div className="w-9 h-9 rounded bg-black text-white flex items-center justify-center flex-shrink-0 group-hover:bg-accent group-hover:text-black transition-colors">
              <Database className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-black uppercase text-black mb-1 group-hover:text-accent transition-colors">
                Thùng 2: Lỗi Dữ Liệu Logic
              </div>
              <p className="text-[11px] text-muted-gray leading-tight">
                NULL_POINTER, INVALID_FORMAT, OUT_OF_BOUNDS
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TriageClassifier;
