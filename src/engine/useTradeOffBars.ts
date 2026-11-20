import { useState, useCallback } from 'react';

export interface TradeOffBarsState {
  quality: number;       // Độ chính xác / Chất lượng (0 - 100)
  satisfaction: number;  // Hài lòng của Sếp / Khách (0 - 100)
  sanity: number;        // Tinh thần / Áp lực Giờ G (0 - 100)
  lastDelta: {
    quality: number;
    satisfaction: number;
    sanity: number;
  } | null;
}

/**
 * Headless Hook managing the 3 Diegetic Trade-off Bars (Reigns / Papers, Please style)
 * Demonstrates that every workplace action involves a resource trade-off.
 */
export function useTradeOffBars(initial?: Partial<TradeOffBarsState>) {
  const [bars, setBars] = useState<TradeOffBarsState>({
    quality: initial?.quality ?? 80,
    satisfaction: initial?.satisfaction ?? 75,
    sanity: initial?.sanity ?? 85,
    lastDelta: null,
  });

  const applyDecisionImpact = useCallback(
    (params: { isCorrect: boolean; latencyMs?: number }) => {
      const isTooFast = params.latencyMs !== undefined && params.latencyMs < 1200;

      const qDelta = params.isCorrect ? (isTooFast ? 2 : 6) : -12;
      const sDelta = params.isCorrect ? (isTooFast ? -4 : 5) : -10;
      const tDelta = isTooFast ? -8 : params.isCorrect ? -2 : -6;

      setBars(prev => ({
        quality: Math.min(100, Math.max(5, prev.quality + qDelta)),
        satisfaction: Math.min(100, Math.max(5, prev.satisfaction + sDelta)),
        sanity: Math.min(100, Math.max(5, prev.sanity + tDelta)),
        lastDelta: {
          quality: qDelta,
          satisfaction: sDelta,
          sanity: tDelta,
        },
      }));
    },
    []
  );

  return {
    bars,
    applyDecisionImpact,
  };
}
