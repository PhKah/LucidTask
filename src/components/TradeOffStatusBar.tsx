import React from 'react';
import { ShieldCheck, Smile, Zap } from 'lucide-react';
import { TradeOffBarsState } from '../engine/useTradeOffBars';

interface TradeOffStatusBarProps {
  bars: TradeOffBarsState;
}

/**
 * Diegetic UI 3 Trade-off Bars (Reigns / Papers, Please inspired)
 * Neo-Brutalist top HUD showing real-time resource trade-offs for every workplace decision.
 */
export const TradeOffStatusBar: React.FC<TradeOffStatusBarProps> = ({ bars }) => {
  const formatDelta = (val?: number) => {
    if (!val) return null;
    const isPos = val > 0;
    return (
      <span
        className={`text-[10px] font-mono font-black px-1.5 py-0.5 border border-black ${
          isPos ? 'bg-emerald-300 text-black' : 'bg-live-red text-white'
        }`}
      >
        {isPos ? `+${val}%` : `${val}%`}
      </span>
    );
  };

  return (
    <div
      aria-label="Hệ Thống 3 Thanh Chỉ Số Đánh Đổi"
      className="bg-white border-2 border-black p-3.5 shadow-[4px_4px_0px_0px_#000] space-y-2"
    >
      <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-muted-gray border-b border-hairline pb-1.5">
        <span>⚡ HỆ THỐNG 3 THANH CHỈ SỐ ĐÁNH ĐỔI LAO ĐỘNG (TRADE-OFF BARS)</span>
        <span className="font-mono text-[10px] text-black">MỌI QUYẾT ĐỊNH ĐỀU CÓ SỰ ĐÁNH ĐỔI</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        {/* Bar 1: Quality / Accuracy */}
        <div className="border border-black p-2.5 bg-neutral-50 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-black">
            <span className="flex items-center gap-1.5 uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              <span>1. Chất Lượng / Độ Chuẩn</span>
            </span>
            <div className="flex items-center gap-1.5">
              {formatDelta(bars.lastDelta?.quality)}
              <span className="font-mono">{bars.quality}%</span>
            </div>
          </div>
          <div className="w-full h-2.5 bg-gray-200 border border-black overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${bars.quality}%` }}
            />
          </div>
        </div>

        {/* Bar 2: Boss / Client Satisfaction */}
        <div className="border border-black p-2.5 bg-neutral-50 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-black">
            <span className="flex items-center gap-1.5 uppercase">
              <Smile className="w-3.5 h-3.5 text-emerald-700" />
              <span>2. Hài Lòng Sếp / Khách</span>
            </span>
            <div className="flex items-center gap-1.5">
              {formatDelta(bars.lastDelta?.satisfaction)}
              <span className="font-mono">{bars.satisfaction}%</span>
            </div>
          </div>
          <div className="w-full h-2.5 bg-gray-200 border border-black overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-300"
              style={{ width: `${bars.satisfaction}%` }}
            />
          </div>
        </div>

        {/* Bar 3: Time / Mental Sanity */}
        <div className="border border-black p-2.5 bg-neutral-50 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-black">
            <span className="flex items-center gap-1.5 uppercase">
              <Zap className="w-3.5 h-3.5 text-live-red" />
              <span>3. Tinh Thần &amp; Sức Bền</span>
            </span>
            <div className="flex items-center gap-1.5">
              {formatDelta(bars.lastDelta?.sanity)}
              <span className="font-mono">{bars.sanity}%</span>
            </div>
          </div>
          <div className="w-full h-2.5 bg-gray-200 border border-black overflow-hidden">
            <div
              className="h-full bg-live-red transition-all duration-300"
              style={{ width: `${bars.sanity}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeOffStatusBar;
