import React, { useState, useRef } from 'react';
import { Layers, AlertTriangle, GitCommit, CheckCircle2 } from 'lucide-react';
import { TaskDefinition } from '../../types/task';
import { telemetryBus } from '../../engine/TelemetryBus';

interface MultiSourceInspectorProps {
  task: TaskDefinition;
  onComplete: (
    actionId: string,
    isOptimal: boolean,
    stats: { tabSwitches: number; panicClicks: number }
  ) => void;
}

export const MultiSourceInspector: React.FC<MultiSourceInspectorProps> = ({
  task,
  onComplete,
}) => {
  const sources = task.investigation_sources || [];
  const actions = task.resolution_actions || [];

  const [activeTabId, setActiveTabId] = useState<string>(sources[0]?.id || '');
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
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
        timestamp_ms: Date.now(),
      });
      setActiveTabId(newTabId);
    }
  };

  const currentSource = sources.find(s => s.id === activeTabId) || sources[0];

  const handleConfirmAction = () => {
    if (!selectedActionId) return;

    const chosenAction = actions.find(a => a.id === selectedActionId);
    const isOptimal = chosenAction ? chosenAction.is_optimal : false;

    telemetryBus.publish('action_executed', {
      action_id: selectedActionId,
      is_optimal: isOptimal,
      latency_ms: 0,
    });

    setConfirmed(true);

    onComplete(selectedActionId, isOptimal, {
      tabSwitches: tabSwitchesRef.current,
      panicClicks: panicClicksRef.current,
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn" onClick={() => registerClick('WORKSPACE_BODY')}>
      {/* Investigation Instructions */}
      <div className="bg-soft-gray p-4 border border-hairline flex items-start gap-3">
        <Layers className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-bold uppercase text-black block mb-0.5">
            Quy trình Điều tra Đa Nguồn:
          </span>
          <span className="text-muted-gray leading-relaxed">
            Chuyển đổi giữa 3 Tab dữ liệu độc lập để phát hiện thời điểm phát sinh sự cố và sự kiện tương quan. 
            Cảnh giác với các thông số gây nhiễu (red-herrings) trước khi ra quyết định giải cứu.
          </span>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex border-b border-hairline gap-2 overflow-x-auto">
        {sources.map(source => {
          const isActive = source.id === activeTabId;
          return (
            <button
              key={source.id}
              onClick={() => handleTabChange(source.id)}
              className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 flex-shrink-0 ${
                isActive
                  ? 'border-accent text-black bg-white -mb-[1px]'
                  : 'border-transparent text-muted-gray hover:text-black hover:bg-neutral-50'
              }`}
            >
              {source.id === 'TAB_LOGS' && <AlertTriangle className="w-3.5 h-3.5 text-live-red" />}
              {source.id === 'TAB_DEPLOY' && <GitCommit className="w-3.5 h-3.5 text-accent" />}
              <span>{source.tab_title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Data Content (Console View) */}
      <div className="card-hairline bg-night-navy text-gray-200 border-2 border-black min-h-[200px] p-4 font-mono text-xs overflow-x-auto selection:bg-accent selection:text-black">
        <div className="text-gray-500 pb-2 mb-3 border-b border-gray-800 flex items-center justify-between text-[11px]">
          <span>SOURCE: {currentSource?.source_type}</span>
          <span>DỮ LIỆU THỜI GIAN THỰC</span>
        </div>

        <div className="space-y-2">
          {currentSource?.content.map((line, idx) => {
            const isCritical = line.includes('CRITICAL') || line.includes('FATAL');
            const isWarn = line.includes('WARN');
            const isDeploy = line.includes('Bản build');

            let textColor = 'text-gray-300';
            if (isCritical) textColor = 'text-live-red font-bold';
            else if (isWarn) textColor = 'text-amber-400';
            else if (isDeploy) textColor = 'text-accent font-bold';

            return (
              <div key={idx} className={`leading-relaxed ${textColor}`}>
                {line}
              </div>
            );
          })}
        </div>
      </div>

      {/* Resolution Decisions Section */}
      <div className="card-hairline bg-white border border-hairline p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-accent" />
          <h3 className="text-sm font-black uppercase tracking-wide">
            Lựa Chọn Quyết Định Khắc Phục Sự Cố Khẩn Cấp
          </h3>
        </div>

        <div className="space-y-3">
          {actions.map(action => {
            const isSelected = selectedActionId === action.id;
            return (
              <label
                key={action.id}
                onClick={() => registerClick('ACTION_RADIO')}
                className={`flex items-start gap-3 p-3.5 border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-black bg-neutral-50 shadow-sm'
                    : 'border-hairline hover:border-gray-400 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="incident_action"
                  value={action.id}
                  checked={isSelected}
                  onChange={() => setSelectedActionId(action.id)}
                  className="mt-0.5 accent-black w-4 h-4"
                />
                <div className="text-xs">
                  <span className={`font-bold block ${isSelected ? 'text-black' : 'text-gray-800'}`}>
                    {action.label}
                  </span>
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
