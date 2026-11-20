import React, { useState } from 'react';
import {
  Network,
  Database,
  Check,
  AlertCircle,
  Flame,
  Stamp,
  Keyboard,
  Shield,
  Heart,
  FileCheck2,
} from 'lucide-react';
import { TaskDefinition, DocumentLineItem, WorkItem } from '../../types/task';
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

const DEFAULT_COWORKERS = [
  { name: 'Bé Mít', role: 'Sales / CSKH', badge: 'HĐ', patience: 82 },
  { name: 'Chị Thu', role: 'Thủ quỹ', badge: 'PC', patience: 68 },
  { name: 'Anh Tài', role: 'Giám đốc', badge: 'GẤP', patience: 45 },
  { name: 'Bé Na', role: 'Thủ kho', badge: 'XK', patience: 90 },
];

function buildDocumentRows(
  item: WorkItem,
  isFlawedTarget: boolean
): DocumentLineItem[] {
  if (item.document_rows && item.document_rows.length > 0) {
    return item.document_rows;
  }

  return [
    {
      label: '1. Mã chứng từ / Hồ sơ',
      value: `${item.id} · Lưu hành nội bộ`,
      is_flawed: false,
    },
    {
      label: '2. Bộ phận trình duyệt',
      value: item.npc_name || 'Bé Mít (Sales) — Chờ xác nhận ca trực',
      is_flawed: false,
    },
    {
      label: '3. Hạng mục nghiệp vụ',
      value: item.order_title || 'Nghiệp vụ vận hành tiêu chuẩn',
      is_flawed: false,
    },
    {
      label: '4. Chi tiết kiểm tra & Thông số',
      value: item.everyday_note || item.content,
      is_flawed: isFlawedTarget,
    },
    {
      label: '5. Đối chiếu nhật ký & Quy chuẩn SOP',
      value: item.content,
      is_flawed: isFlawedTarget,
    },
  ];
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
  const [reputation, setReputation] = useState<number>(4.5);
  const [rapport, setRapport] = useState<number>(85);

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
        setReputation(prev => Math.min(5.0, Math.round((prev + 0.1) * 10) / 10));
        setRapport(prev => Math.min(100, prev + 2));
        setLiveReaction({
          sender: 'Cô Ba / Sếp Trực Ca',
          text:
            streak >= 2
              ? `Bắt chuẩn xác! Combo x${streak} liên tiếp — giữ vững uy tín phòng ban nhé!`
              : 'Chuẩn quy định SOP! Hồ sơ đã được xử lý gọn gàng.',
          isPositive: true,
        });
      } else {
        setReputation(prev => Math.max(1.0, Math.round((prev - 0.3) * 10) / 10));
        setRapport(prev => Math.max(20, prev - 6));
        setLiveReaction({
          sender: 'Cô Ba / Sếp Trực Ca',
          text: 'Chưa khớp quy định rồi! Em soi kỹ từng dòng chứng từ trước khi chốt nhé!',
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

  const activeCoworker = DEFAULT_COWORKERS[currentIndex % DEFAULT_COWORKERS.length];
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
    '1. Chứa TIMEOUT, CONNECTION_REFUSED, UNREACHABLE => Chạm dòng lỗi / Thùng 1: Lỗi Kết Nối Mạng.',
    '2. Chứa NULL_POINTER, INVALID_FORMAT, OUT_OF_BOUNDS => Thùng 2: Lỗi Dữ Liệu Logic.',
    '3. Kỷ luật ca trực: Không bấm ẩu dưới 1.2 giây/phiếu kẻo sập thanh Chất lượng!',
  ];

  const docRows = buildDocumentRows(
    currentItem,
    currentItem.expected_target === leftTargetId
  );

  return (
    <div className="space-y-5">
      {/* NPC Coworker Queue & Workplace Conflict Indicators ("Nợ Có Ơi" style) */}
      <div className="bg-[#FAF5E8] border-2 border-black p-3.5 shadow-[4px_4px_0px_0px_#000] space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#D8CFAF] pb-2">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-black">
            <span>👥 HÀNG ĐỢI ĐỒNG NGHIỆP TRÌNH HỒ SƠ:</span>
            <span className="font-mono text-[11px] bg-white px-2 py-0.5 border border-black">
              Phiếu #{currentIndex + 1}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="inline-flex items-center gap-1 bg-white px-2.5 py-0.5 border border-black">
              <Shield className="w-3.5 h-3.5 text-emerald-700" />
              <span>Uy tín: {reputation.toFixed(1)}/5</span>
            </span>
            <span className="inline-flex items-center gap-1 bg-white px-2.5 py-0.5 border border-black">
              <Heart className="w-3.5 h-3.5 text-live-red" />
              <span>Thiện cảm: {rapport}%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {DEFAULT_COWORKERS.map((cw, idx) => {
            const isActive = idx === currentIndex % DEFAULT_COWORKERS.length;
            return (
              <div
                key={cw.name}
                className={`p-2 border-2 transition-all ${
                  isActive
                    ? 'border-black bg-[#FFF8E1] shadow-[2px_2px_0px_0px_#000]'
                    : 'border-[#D8CFAF] bg-white/70 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-black text-black">
                  <span>{cw.name}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 border border-black ${
                      isActive ? 'bg-accent text-black' : 'bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    {currentItem.document_type_badge || cw.badge}
                  </span>
                </div>
                <div className="text-[10px] text-muted-gray mb-1.5">{cw.role}</div>
                <div className="w-full h-1.5 bg-gray-200 border border-black overflow-hidden">
                  <div
                    className={`h-full ${
                      cw.patience < 55 ? 'bg-amber-500' : 'bg-emerald-600'
                    }`}
                    style={{ width: `${cw.patience}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

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

      {/* Diegetic Split Desk: Left = SOP 3-Line + Work Chat | Right = Interactive Multi-Row Document Ledger */}
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

        {/* Right Column (7 cols): Cozy Ledger Interactive Document ("Nợ Có Ơi" Spot-the-Flaw) */}
        <div className="md:col-span-7 space-y-4">
          {/* Interactive Multi-Row Document on Cream Ledger Surface */}
          <div className="bg-[#FAF5E8] border-2 border-black p-5 shadow-[6px_6px_0px_0px_#000] relative overflow-hidden space-y-4">
            {/* Subtle left red ledger margin accent */}
            <div className="border-l-4 border-[#c31833]/50 pl-3.5 space-y-3">
              {/* Document Header */}
              <div className="flex items-center justify-between border-b-2 border-[#D8CFAF] pb-2.5">
                <div className="flex items-center gap-2">
                  <Stamp className="w-4 h-4 text-accent" />
                  <span className="text-xs font-mono font-black text-black uppercase">
                    CHỨNG TỪ / HỒ SƠ: {currentItem.id}
                  </span>
                </div>
                <span
                  className={
                    isHighPriority
                      ? 'badge-live-red text-[10px]'
                      : 'bg-neutral-800 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase'
                  }
                >
                  {isHighPriority ? 'P1 - NGUY CẤP' : '1 · KIỂM TRA'}
                </span>
              </div>

              <div className="text-[11px] font-bold text-[#8C3B2B] bg-[#FBECE9] border border-[#D8CFAF] px-2.5 py-1.5">
                👆 Chạm trực tiếp vào <strong>dòng có dấu hiệu sai / bẫy SOP</strong> để trả lại hồ sơ, hoặc bấm <strong>Hợp lệ ✓</strong> nếu mọi dòng đều chuẩn!
              </div>

              {/* Clickable Multi-Row Document Table */}
              <div className="divide-y divide-[#D8CFAF] border border-[#D8CFAF] bg-white">
                {docRows.map((row, idx) => (
                  <button
                    key={idx}
                    type="button"
                    data-testid={`doc-row-${idx}`}
                    onClick={() => handleClassify(leftTargetId)}
                    title="Chạm vào dòng này nếu phát hiện sai sót"
                    className="w-full text-left px-3 py-2.5 hover:bg-[#FFF8E1] hover:ring-2 hover:ring-inset hover:ring-[#E9B354] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 group"
                  >
                    <span className="text-[11px] font-bold text-neutral-600 flex-shrink-0">
                      {row.label}
                    </span>
                    <span className="text-xs font-mono font-semibold text-black sm:text-right group-hover:text-[#8C3B2B]">
                      {row.value}
                    </span>
                  </button>
                ))}
              </div>

              {/* Coworker Speech Bubble */}
              <div className="bg-white border border-black p-2.5 text-xs text-neutral-800 flex items-center justify-between gap-2">
                <div>
                  <strong className="text-black">{currentItem.npc_name || activeCoworker.name}:</strong>{' '}
                  "{currentItem.npc_quote || `Nhờ bạn kiểm tra nhanh hồ sơ ${currentItem.id} giúp mình nhé!`}"
                </div>
              </div>

              {/* Valid / Approve Button */}
              <button
                type="button"
                data-testid="btn-doc-valid"
                onClick={() => handleClassify(rightTargetId)}
                className="w-full py-3 bg-[#345E59] hover:bg-[#284a46] text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <FileCheck2 className="w-4 h-4 text-[#E9B354]" />
                <span>Hợp lệ ✓ (Duyệt &amp; Ghi sổ ngay)</span>
              </button>
            </div>
          </div>

          {/* 2 Quick-Stamp Action Buttons (Preserved for keyboard shortcuts & deterministic regression tests) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Bin 1 */}
            <button
              onClick={() => handleClassify(leftTargetId)}
              className="bg-white p-3.5 text-left border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:bg-amber-50 active:translate-y-0.5 transition-all group flex items-start gap-3"
            >
              <div className="w-8 h-8 bg-black text-white flex items-center justify-center flex-shrink-0 group-hover:bg-live-red transition-colors">
                <Network className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="text-xs font-black uppercase text-black">
                    {bin1Config.label}
                  </span>
                </div>
                <p className="text-[11px] text-muted-gray leading-tight mb-1">
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
              className="bg-white p-3.5 text-left border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:bg-emerald-50 active:translate-y-0.5 transition-all group flex items-start gap-3"
            >
              <div className="w-8 h-8 bg-black text-white flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-700 transition-colors">
                <Database className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="text-xs font-black uppercase text-black">
                    {bin2Config.label}
                  </span>
                </div>
                <p className="text-[11px] text-muted-gray leading-tight mb-1">
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
