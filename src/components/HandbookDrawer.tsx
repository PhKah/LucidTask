import React, { useEffect, useRef } from 'react';
import { X, BookOpen, CheckCircle2 } from 'lucide-react';
import { HandbookRule } from '../types/task';
import { telemetryBus } from '../engine/TelemetryBus';

interface HandbookDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  rules: HandbookRule[];
}

export const HandbookDrawer: React.FC<HandbookDrawerProps> = ({
  isOpen,
  onClose,
  rules,
}) => {
  const openTimeRef = useRef<number | null>(null);
  const viewCountRef = useRef<number>(0);

  useEffect(() => {
    if (isOpen) {
      openTimeRef.current = performance.now();
      viewCountRef.current += 1;
    } else if (openTimeRef.current !== null) {
      const durationMs = Math.round(performance.now() - openTimeRef.current);
      telemetryBus.publish('handbook_viewed', {
        duration_ms: durationMs,
        view_count: viewCountRef.current,
      });
      openTimeRef.current = null;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden no-print animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Panel */}
      <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl border-l border-hairline flex flex-col transform transition-transform">
        {/* Header */}
        <div className="bg-night-navy text-white px-6 py-4 flex items-center justify-between border-b border-black">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-accent" />
            <span className="font-black text-sm uppercase tracking-wider">
              SỔ TAY QUY TẮC NGHIỆP VỤ
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
            title="Đóng sổ tay"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice */}
        <div className="bg-soft-gray px-6 py-3 border-b border-hairline">
          <p className="text-xs text-muted-gray leading-relaxed">
            <span className="font-bold text-black">Lời khuyên:</span> Đọc kỹ các điều kiện kích hoạt dưới đây. Các kỹ sư cẩn trọng thường dành 15-20 giây nghiên cứu quy tắc trước khi bấm chọn.
          </p>
        </div>

        {/* Content Rules List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {rules.map((rule, idx) => (
            <div
              key={rule.rule_id || idx}
              className="card-hairline bg-white border border-hairline p-4 space-y-2 hover:border-black transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-accent inline-block" />
                <span className="text-xs font-black uppercase tracking-wide text-black">
                  {rule.category}
                </span>
              </div>

              <div className="bg-soft-gray p-2.5 rounded border border-hairline font-mono text-xs text-gray-800">
                {rule.condition}
              </div>

              {rule.hint && (
                <div className="flex items-start gap-1.5 text-xs text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  <span>{rule.hint}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-hairline bg-white">
          <button
            onClick={onClose}
            className="btn-pill-dark w-full justify-center"
          >
            ĐÃ HIỂU QUY TẮC — TIẾP TỤC LÀM BÀI
          </button>
        </div>
      </div>
    </div>
  );
};

export default HandbookDrawer;
