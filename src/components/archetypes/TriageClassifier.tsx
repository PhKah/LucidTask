import React, { useState } from 'react';
import { Network, Database, Check, AlertCircle, Flame, Stamp, Keyboard } from 'lucide-react';
import { TaskDefinition } from '../../types/task';
import { useTriageEngine } from '../../engine/useTriageEngine';
import WorkChatFeed from '../WorkChatFeed';

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
  onDecisionImpact?: (params: { isCorrect: boolean; latencyMs: number }) => void;
}

export const TriageClassifier: React.FC<TriageClassifierProps> = ({
  task,
  onComplete,
  onEarlyExit,
  onDecisionImpact,
}) => {
  const [liveReaction, setLiveReaction] = useState<{
    sender: string;
    text: string;
    isPositive: boolean;
  } | null>(null);

  const {
    items,
    currentItem,
    currentIndex,
    streakCount,
    lastFeedback,
    leftTargetId,
    rightTargetId,
    handleClassify,
  } = useTriageEngine({
    task,
    onComplete,
    onEarlyExit,
    onDecisionFeedback: ({ isCorrect, latencyMs, streak }) => {
      if (onDecisionImpact) {
        onDecisionImpact({ isCorrect, latencyMs });
      }
      if (isCorrect) {
        setLiveReaction({
          sender: 'Sếp Trực Ca',
          text:
            streak >= 2
              ? `Chuẩn xác! Combo x${streak} liên tiếp — giữ vững tốc độ rà soát SOP nhé!`
              : 'Đóng dấu chuẩn quy định SOP! Tiếp tục phiếu kế tiếp.',
          isPositive: true,
        });
      } else {
        setLiveReaction({
          sender: 'Sếp Trực Ca',
          text: 'Sai quy định SOP rồi! Em đối chiếu lại 3 dòng quy tắc ghim bên trái ngay nhé!',
          isPositive: false,
        });
      }
    },
  });

  if (!currentItem) {
    return (
      <div className="card-hairline text-center py-12">
        <p className="text-muted-gray text-sm">Đã xử lý xong toàn bộ danh sách hồ sơ.</p>
      </div>
    );
  }

  const isHighPriority =
    currentItem.content.includes('FATAL') ||
    currentItem.content.includes('CRITICAL') ||
    currentItem.content.includes('85.000.000') ||
    currentItem.content.includes('8.500.000');

  const bin1Config = task.custom_bins?.[0] || {
    target_id: 'CONN_ERR',
    label: 'Thùng 1: Lỗi Kết Nối Mạng',
    short_hint: 'TIMEOUT, CONNECTION_REFUSED, UNREACHABLE',
    key_shortcut: 'Phím A / ⬅️',
  };

  const bin2Config = task.custom_bins?.[1] || {
    target_id: 'DATA_ERR',
    label: 'Thùng 2: Lỗi Dữ Liệu Logic',
    short_hint: 'NULL_POINTER, INVALID_FORMAT, OUT_OF_BOUNDS',
    key_shortcut: 'Phím D / ➡️',
  };

  const sopRules = task.sop_quick_rules || [
    '1. Chứa TIMEOUT, CONNECTION_REFUSED, UNREACHABLE => Đóng dấu Thùng 1: Lỗi Kết Nối Mạng.',
    '2. Chứa NULL_POINTER, INVALID_FORMAT, OUT_OF_BOUNDS => Đóng dấu Thùng 2: Lỗi Dữ Liệu Logic.',
    '3. Kỷ luật ca trực: Không bấm ẩu dưới 1.2 giây/phiếu kẻo sập thanh Chất lượng!',
  ];

  return (
    <div className="space-y-5">
      {/* Top Status & Streak HUD */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold uppercase tracking-wider text-black">
            Mã Log Cần Xử Lý:
          </span>
          <span className="font-mono bg-soft-gray px-2.5 py-0.5 border-2 border-black font-black">
            {currentIndex + 1} / {items.length}
          </span>

          {streakCount >= 2 && (
            <span className="inline-flex items-center gap-1 bg-accent text-black font-black px-2.5 py-0.5 border-2 border-black text-[11px]">
              <Flame className="w-3.5 h-3.5" />
              COMBO x{streakCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-muted-gray">
            <Keyboard className="w-3.5 h-3.5 text-black" />
            Phím tắt nhanh: [A / ⬅️] hoặc [D / ➡️]
          </span>

          {lastFeedback && (
            <div
              className={`flex items-center gap-1 font-black text-xs px-2.5 py-0.5 border border-black ${
                lastFeedback === 'CORRECT'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-red-100 text-live-red'
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
      </div>

      {/* Diegetic UI Split Desk: Left = Pinned 3-Line SOP Rulebook + Work Chat | Right = Inspection Docket & Stamps */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 cols): Pinned 3-Line SOP Rulebook & Zalo/Slack Chat */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-amber-50 border-2 border-black p-4 shadow-[4px_4px_0px_0px_#000] space-y-2.5">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <span className="text-xs font-black uppercase tracking-wider text-black">
                📌 BẢNG QUY ĐỊNH SOP 3 DÒNG (ĐỀ MỞ)
              </span>
              <span className="text-[10px] font-mono font-bold bg-black text-white px-2 py-0.5">
                GHIM CỐ ĐỊNH
              </span>
            </div>
            <ul className="space-y-2 text-xs text-neutral-900 font-medium leading-relaxed">
              {sopRules.map((rule, idx) => (
                <li key={idx} className="bg-white p-2 border border-black">
                  {rule}
                </li>
              ))}
            </ul>
          </div>

          {task.work_chat_messages && task.work_chat_messages.length > 0 && (
            <WorkChatFeed messages={task.work_chat_messages} liveReaction={liveReaction} />
          )}
        </div>

        {/* Right Column (7 cols): Papers, Please Inspection Docket & 2 Neo-Brutalist Decision Stamps */}
        <div className="md:col-span-7 space-y-4">
          {/* Active Document / Order Card */}
          <div className="bg-white border-2 border-black p-5 shadow-[6px_6px_0px_0px_#000] flex flex-col justify-between min-h-[230px] space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-hairline pb-2.5">
                <div className="flex items-center gap-2">
                  <Stamp className="w-4 h-4 text-accent" />
                  <span className="text-xs font-mono font-black text-black">
                    HỒ SƠ: {currentItem.id}
                  </span>
                </div>
                <span
                  className={
                    isHighPriority
                      ? 'badge-live-red text-[10px]'
                      : 'bg-neutral-800 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase'
                  }
                >
                  {isHighPriority ? 'P1 - NGUY CẤP' : 'P3 - CA TRỰC'}
                </span>
              </div>

              {currentItem.order_title && (
                <h3 className="text-base font-black text-black uppercase tracking-tight">
                  {currentItem.order_title}
                </h3>
              )}

              {currentItem.everyday_note && (
                <div className="bg-soft-gray p-3 border-l-4 border-accent text-xs text-neutral-800 leading-relaxed">
                  <strong>Tình huống thực tế:</strong> {currentItem.everyday_note}
                </div>
              )}

              <div className="bg-night-navy text-green-400 font-mono text-xs p-3.5 border border-black leading-relaxed selection:bg-accent selection:text-black">
                {currentItem.content}
              </div>
            </div>

            <div className="text-[11px] text-muted-gray pt-2 border-t border-hairline flex items-center justify-between">
              <span>Đối chiếu với Bảng quy định SOP 3 dòng bên trái</span>
              <span className="font-mono font-bold text-black">Đóng dấu hoặc gõ phím A / D</span>
            </div>
          </div>

          {/* 2 Diegetic Stamp / Swipe Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Bin 1 */}
            <button
              onClick={() => handleClassify(leftTargetId)}
              className="bg-white p-4 text-left border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:bg-amber-50 active:translate-y-0.5 transition-all group flex items-start gap-3"
            >
              <div className="w-9 h-9 bg-black text-white flex items-center justify-center flex-shrink-0 group-hover:bg-live-red transition-colors">
                <Network className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-black uppercase text-black">
                    {bin1Config.label}
                  </span>
                </div>
                <p className="text-[11px] text-muted-gray leading-tight mb-1.5">
                  {bin1Config.short_hint}
                </p>
                <span className="inline-block text-[10px] font-mono font-bold bg-neutral-200 px-1.5 py-0.5 border border-black">
                  {bin1Config.key_shortcut}
                </span>
              </div>
            </button>

            {/* Bin 2 */}
            <button
              onClick={() => handleClassify(rightTargetId)}
              className="bg-white p-4 text-left border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:bg-emerald-50 active:translate-y-0.5 transition-all group flex items-start gap-3"
            >
              <div className="w-9 h-9 bg-black text-white flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-700 transition-colors">
                <Database className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-black uppercase text-black">
                    {bin2Config.label}
                  </span>
                </div>
                <p className="text-[11px] text-muted-gray leading-tight mb-1.5">
                  {bin2Config.short_hint}
                </p>
                <span className="inline-block text-[10px] font-mono font-bold bg-neutral-200 px-1.5 py-0.5 border border-black">
                  {bin2Config.key_shortcut}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TriageClassifier;
