import React, { useState, useRef } from 'react';
import { Layers, AlertTriangle, GitCommit, CheckCircle2, Pin } from 'lucide-react';
import { TaskDefinition } from '../../types/task';
import { telemetryBus } from '../../engine/TelemetryBus';
import WorkChatFeed from '../WorkChatFeed';

interface MultiSourceInspectorProps {
  task: TaskDefinition;
  onComplete: (
    actionId: string,
    isOptimal: boolean,
    stats: { tabSwitches: number; panicClicks: number }
  ) => void;
  onDecisionImpact?: (params: { isCorrect: boolean; latencyMs?: number }) => void;
}

export const MultiSourceInspector: React.FC<MultiSourceInspectorProps> = ({
  task,
  onComplete,
  onDecisionImpact,
}) => {
  const sources = task.investigation_sources || [];
  const actions = task.resolution_actions || [];

  const [activeTabId, setActiveTabId] = useState<string>(sources[0]?.id || '');
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const [pinnedClues, setPinnedClues] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState<boolean>(false);

  const tabSwitchesRef = useRef<number>(0);
  const panicClicksRef = useRef<number>(0);
  const clickTimestampsRef = useRef<number[]>([]);

  // Detect panic clicks: > 3 clicks within 1000ms
  const registerClick = (area: string) => {
    const now = Date.now();
    clickTimestampsRef.current = clickTimestampsRef.current.filter(t => now - t <= 1000);
    clickTimestampsRef.current.push(now);

    if (clickTimestampsRef.current.length > 3) {
      panicClicksRef.current += 1;
      telemetryBus.publish('panic_click_flag', {
        click_rate_per_sec: clickTimestampsRef.current.length,
        area,
      });
    }
  };

  const handleTabChange = (newTabId: string) => {
    registerClick('TAB_SWITCH');
    if (newTabId !== activeTabId) {
      tabSwitchesRef.current += 1;
      telemetryBus.publish('tab_switched', {
        from_tab: activeTabId,
        to_tab: newTabId,
      });
      setActiveTabId(newTabId);
    }
  };

  const handleTogglePinClue = (line: string) => {
    registerClick('CLUE_PIN');
    setPinnedClues(prev =>
      prev.includes(line) ? prev.filter(item => item !== line) : [...prev, line]
    );
  };

  const handleConfirmAction = () => {
    if (!selectedActionId || confirmed) return;
    registerClick('CONFIRM_ACTION');

    const chosen = actions.find(a => a.id === selectedActionId);
    const isOptimal = chosen ? chosen.is_optimal : false;

    if (onDecisionImpact) {
      onDecisionImpact({ isCorrect: isOptimal });
    }

    setConfirmed(true);
    onComplete(selectedActionId, isOptimal, {
      tabSwitches: tabSwitchesRef.current,
      panicClicks: panicClicksRef.current,
    });
  };

  const currentSource = sources.find(s => s.id === activeTabId) || sources[0];

  return (
    <div className="space-y-6">
      {/* Diegetic Work Chat Feed (Zalo / Slack War Room) */}
      {task.work_chat_messages && task.work_chat_messages.length > 0 && (
        <WorkChatFeed messages={task.work_chat_messages} />
      )}

      {/* Multi-Source Inspection Instructions */}
      <div className="bg-soft-gray border-2 border-black p-3.5 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2.5 text-muted-gray">
          <Layers className="w-4 h-4 text-accent flex-shrink-0" />
          <span>
            <strong className="text-black uppercase">Bàn Điều Tra Đa Nguồn:</strong> Chuyển đổi giữa 3 Tab để đối chiếu chứng cứ. Bạn có thể click vào từng dòng thông tin để{' '}
            <strong className="text-black">📌 Ghim Bằng Chứng</strong> trước khi chọn phương án đánh đổi bên dưới.
          </span>
        </div>
        <span className="font-mono font-bold text-[11px] bg-white px-2.5 py-1 border border-black">
          Bằng chứng đã ghim: {pinnedClues.length}
        </span>
      </div>

      {/* Tabs Header */}
      <div className="flex border-b-2 border-black gap-2 overflow-x-auto">
        {sources.map(source => {
          const isActive = source.id === activeTabId;
          return (
            <button
              key={source.id}
              onClick={() => handleTabChange(source.id)}
              className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all border-2 border-b-0 flex items-center gap-2 flex-shrink-0 ${
                isActive
                  ? 'border-black text-black bg-accent/20'
                  : 'border-transparent text-muted-gray hover:text-black hover:bg-neutral-100'
              }`}
            >
              {source.id === 'TAB_LOGS' && <AlertTriangle className="w-3.5 h-3.5 text-live-red" />}
              {source.id === 'TAB_DEPLOY' && <GitCommit className="w-3.5 h-3.5 text-accent" />}
              <span>{source.tab_title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Data Content (Interactive Clue Pinning Console) */}
      <div className="card-hairline bg-night-navy text-gray-200 border-2 border-black shadow-[4px_4px_0px_0px_#000] min-h-[190px] p-4 font-mono text-xs overflow-x-auto selection:bg-accent selection:text-black">
        <div className="text-gray-400 pb-2 mb-3 border-b border-gray-800 flex items-center justify-between text-[11px]">
          <span>SOURCE: {currentSource?.source_type}</span>
          <span>CLICK VÀO DÒNG BẤT KỲ ĐỂ GHIM BẰNG CHỨNG 📌</span>
        </div>

        <div className="space-y-2">
          {currentSource?.content.map((line, idx) => {
            const isCritical = line.includes('CRITICAL') || line.includes('FATAL');
            const isWarn = line.includes('WARN');
            const isDeploy = line.includes('Bản build') || line.includes('KỊCH BẢN');
            const isPinned = pinnedClues.includes(line);

            let textColor = 'text-gray-200';
            if (isCritical) textColor = 'text-live-red font-bold';
            else if (isWarn) textColor = 'text-amber-400';
            else if (isDeploy) textColor = 'text-accent font-bold';

            return (
              <div
                key={idx}
                onClick={() => handleTogglePinClue(line)}
                className={`p-2 border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                  isPinned
                    ? 'border-accent bg-white/10'
                    : 'border-transparent hover:border-gray-700 hover:bg-white/5'
                }`}
              >
                <span className={`leading-relaxed ${textColor}`}>{line}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 flex-shrink-0 flex items-center gap-1 border ${
                    isPinned
                      ? 'bg-accent text-black border-black font-black'
                      : 'text-gray-400 border-gray-700'
                  }`}
                >
                  <Pin className="w-3 h-3" />
                  {isPinned ? 'ĐÃ GHIM' : 'GHIM'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pinned Evidence Board */}
      {pinnedClues.length > 0 && (
        <div className="bg-amber-50 border-2 border-black p-3.5 space-y-2">
          <div className="text-xs font-black uppercase text-black flex items-center gap-1.5">
            <Pin className="w-3.5 h-3.5 text-accent" />
            <span>BẢNG BẰNG CHỨNG ĐÃ GHIM ({pinnedClues.length}):</span>
          </div>
          <ul className="space-y-1 text-xs font-mono text-neutral-800">
            {pinnedClues.map((clue, idx) => (
              <li key={idx} className="truncate">
                • {clue}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Constructive Balance Tray ("Nợ Có Ơi" 2-Tray Matching + Catharsis Closure) */}
      <div className="bg-[#FAF5E8] border-2 border-black p-4 shadow-[4px_4px_0px_0px_#000] space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#D8CFAF] pb-2">
          <span className="text-xs font-black uppercase text-black">
            ⚖️ KHAY ĐỐI CHIẾU &amp; CÂN BẰNG HỒ SƠ (2 · ĐỊNH KHOẢN &amp; KHỚP CHỨNG CỨ)
          </span>
          {pinnedClues.length > 0 && selectedActionId ? (
            <span className="text-[11px] font-black bg-emerald-700 text-white px-2.5 py-0.5 border border-black">
              ✓ ĐÃ CÂN SỔ &amp; KHỚP CHỨNG CỨ 100% — SẴN SÀNG KHÓA CA
            </span>
          ) : (
            <span className="text-[11px] font-black bg-[#c31833] text-white px-2.5 py-0.5 border border-black">
              ⚠️ ĐANG LỆCH HỒ SƠ (Chưa gắp đủ bằng chứng &amp; phương án đối ứng)
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Tray 1: NỢ / HIỆN TRẠNG SỰ CỐ */}
          <div className="bg-[#EBF2FA] border-2 border-black p-3 space-y-1.5">
            <div className="font-black text-[#2B5B84] uppercase flex items-center justify-between">
              <span>NỢ / HIỆN TRẠNG &amp; BẰNG CHỨNG</span>
              <span className="font-mono">{pinnedClues.length} chứng cứ</span>
            </div>
            {pinnedClues.length > 0 ? (
              <ul className="space-y-1 text-[11px] font-mono text-black">
                {pinnedClues.map((clue, idx) => (
                  <li key={idx} className="truncate bg-white px-2 py-1 border border-[#2B5B84]/40">
                    📌 {clue}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[11px] text-[#2B5B84]/80 italic">
                Chưa gắp bằng chứng nào. Hãy click nút GHIM ở 3 Tab phía trên.
              </p>
            )}
          </div>

          {/* Tray 2: CÓ / BẰNG CHỨNG & GIẢI PHÁP ĐỐI ỨNG */}
          <div className="bg-[#FBECE9] border-2 border-black p-3 space-y-1.5">
            <div className="font-black text-[#8C3B2B] uppercase flex items-center justify-between">
              <span>CÓ / GIẢI PHÁP ĐỐI ỨNG</span>
              <span className="font-mono">{selectedActionId ? '1 phương án' : '0 phương án'}</span>
            </div>
            {selectedActionId ? (
              <div className="text-[11px] font-bold text-black bg-white px-2 py-1.5 border border-[#8C3B2B]/40">
                ✓ {actions.find(a => a.id === selectedActionId)?.label}
              </div>
            ) : (
              <p className="text-[11px] text-[#8C3B2B]/80 italic">
                Hãy chọn 1 phương án xử lý bên dưới để cân bằng hồ sơ.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Decision Matrix with Trade-off Impact Previews */}
      <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_#000] space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="eyebrow-marker" />
            <h3 className="text-sm font-black uppercase tracking-wider text-black">
              Phán Quyết &amp; Đánh Đổi Nguồn Lực (Resolution &amp; Trade-off Action)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-muted-gray">
            Cân nhắc kỹ hệ quả đánh đổi của từng quyết định
          </span>
        </div>

        <div className="space-y-3">
          {actions.map(action => {
            const isSelected = selectedActionId === action.id;
            return (
              <label
                key={action.id}
                className={`p-3.5 border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  isSelected
                    ? 'border-black bg-accent/15 shadow-[3px_3px_0px_0px_#000]'
                    : 'border-hairline hover:border-black bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="resolution_action"
                  value={action.id}
                  checked={isSelected}
                  onChange={() => setSelectedActionId(action.id)}
                  className="mt-0.5 accent-black w-4 h-4"
                />
                <div className="text-xs flex-1 space-y-1.5">
                  <span className="font-bold block text-black">
                    {action.label}
                  </span>
                  {action.trade_off_preview && (
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                      <span className="font-mono bg-neutral-100 px-2 py-0.5 border border-hairline text-muted-gray">
                        Hệ quả: {action.trade_off_preview.risk_note}
                      </span>
                    </div>
                  )}
                </div>
              </label>
            );
          })}
        </div>

        <div className="pt-4 border-t border-hairline flex items-center justify-between">
          <span className="text-xs text-muted-gray">
            {selectedActionId ? 'Đã chọn phương án xử lý' : 'Hãy chọn 1 phương án để ra lệnh'}
          </span>
          <button
            onClick={handleConfirmAction}
            disabled={!selectedActionId || confirmed}
            className="btn-pill-dark"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            <span>XÁC NHẬN RA LỆNH XỬ LÝ</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultiSourceInspector;
