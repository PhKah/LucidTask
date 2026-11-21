import React, { useState } from 'react';
import { Clock3, Info, Package, Snowflake, Truck, X } from 'lucide-react';
import { CargoLotId, LogisticsScenario } from '../../types/mission';

interface LogisticsInfoDockProps {
  scenario: LogisticsScenario;
}

type InfoPanel = CargoLotId | 'RESOURCES';

const lotStyles: Record<CargoLotId, string> = {
  LOT_A: 'border-orange-500 bg-orange-50',
  LOT_B: 'border-emerald-600 bg-emerald-50',
  LOT_C: 'border-sky-600 bg-sky-50',
};

const formatVnd = (value: number) => `${new Intl.NumberFormat('vi-VN').format(value)}đ`;

/** Compact, non-blocking reference dock. Hover, focus or tap to inspect the original scenario facts. */
const LogisticsInfoDock: React.FC<LogisticsInfoDockProps> = ({ scenario }) => {
  const [activePanel, setActivePanel] = useState<InfoPanel | null>(null);
  const selectedLot = scenario.lots.find(lot => lot.id === activePanel);

  return (
    <aside
      aria-label="Thông tin tham khảo Logistics"
      className="relative z-20 w-full shrink-0 lg:w-[72px]"
      onMouseLeave={() => setActivePanel(null)}
      onKeyDown={event => { if (event.key === 'Escape') setActivePanel(null); }}
    >
      <div className="flex items-center gap-1.5 border-2 border-black bg-white p-1.5 shadow-[3px_3px_0px_0px_#000] lg:sticky lg:top-[84px] lg:flex-col lg:gap-2">
        <div className="hidden w-full border-b border-hairline pb-1 text-center text-[9px] font-black uppercase tracking-wider text-muted-gray lg:block">
          Thông tin
        </div>
        <span className="px-1 text-[10px] font-bold text-muted-gray lg:hidden">Chi tiết</span>
        {scenario.lots.map(lot => (
          <button
            key={lot.id}
            type="button"
            aria-label={`Thông tin ${lot.code}: ${lot.name}`}
            aria-controls="logistics-info-popover"
            aria-expanded={activePanel === lot.id}
            onMouseEnter={() => setActivePanel(lot.id)}
            onFocus={() => setActivePanel(lot.id)}
            onClick={() => setActivePanel(lot.id)}
            className={`flex min-h-[48px] min-w-[51px] flex-col items-center justify-center border-2 px-1 py-1 text-center transition-shadow hover:shadow-[2px_2px_0px_0px_#000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-black ${lotStyles[lot.id]} ${activePanel === lot.id ? 'ring-2 ring-black ring-offset-1' : ''}`}
          >
            <span className="font-black text-[13px] text-black">#{lot.code.replace('Lô #', '')}</span>
            <span className="font-mono text-[10px] font-bold text-neutral-700">{lot.totalTons}t</span>
          </button>
        ))}
        <button
          type="button"
          aria-label="Thông tin định mức xe và kho bãi"
          aria-controls="logistics-info-popover"
          aria-expanded={activePanel === 'RESOURCES'}
          onMouseEnter={() => setActivePanel('RESOURCES')}
          onFocus={() => setActivePanel('RESOURCES')}
          onClick={() => setActivePanel('RESOURCES')}
          className={`flex min-h-[48px] min-w-[51px] flex-col items-center justify-center gap-0.5 border-2 border-black bg-night-navy text-accent hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black ${activePanel === 'RESOURCES' ? 'ring-2 ring-black ring-offset-1' : ''}`}
        >
          <Truck className="h-4 w-4" />
          <span className="text-[9px] font-black uppercase">Xe/Kho</span>
        </button>
        <div className="ml-auto flex items-center gap-1 text-[10px] text-muted-gray lg:ml-0 lg:border-t lg:border-hairline lg:pt-2" title="Di chuột, nhấn hoặc chạm để xem dữ liệu">
          <Info className="h-3.5 w-3.5" />
          <span className="lg:hidden">Di chuột / chạm</span>
        </div>
      </div>

      {activePanel && (
        <div
          id="logistics-info-popover"
          role="region"
          aria-label={selectedLot ? `Chi tiết ${selectedLot.code}` : 'Chi tiết định mức xe và kho bãi'}
          className="absolute left-0 top-[calc(100%+4px)] z-30 w-[min(90vw,370px)] max-h-[min(72vh,620px)] overflow-y-auto border-2 border-black bg-white shadow-[6px_6px_0px_0px_#000] lg:left-full lg:top-0"
        >
          <div className="sticky top-0 flex items-center justify-between gap-2 border-b-2 border-black bg-night-navy px-3 py-2.5 text-white">
            <span className="flex items-center gap-1.5 text-xs font-black uppercase">
              {selectedLot ? <Package className="h-4 w-4 text-accent" /> : <Truck className="h-4 w-4 text-accent" />}
              {selectedLot ? `${selectedLot.code} — ${selectedLot.name}` : 'Định mức xe và kho bãi'}
            </span>
            <button
              type="button"
              aria-label="Đóng thông tin tham khảo"
              onClick={() => setActivePanel(null)}
              className="rounded-sm p-1 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {selectedLot ? (
            <div className="space-y-3 p-3 text-xs text-neutral-800">
              <div className="flex items-center justify-between bg-soft-gray px-3 py-2">
                <span className="font-bold">Khối lượng lô hàng</span>
                <strong className="font-mono text-base text-black">{selectedLot.totalTons} tấn</strong>
              </div>
              <dl className="grid grid-cols-[105px_1fr] gap-x-2 gap-y-2 leading-snug">
                <dt className="font-bold">Nhiệt độ</dt><dd>{selectedLot.tempRequirementLabel}</dd>
                <dt className="font-bold">Hạn sử dụng</dt><dd>{selectedLot.shelfLifeLabel}</dd>
                <dt className="font-bold">Mốc giao/SLA</dt><dd>{selectedLot.deadlineLabel}</dd>
                <dt className="font-bold">Giá trị lô</dt><dd>{formatVnd(selectedLot.totalValueVnd)}</dd>
                <dt className="font-bold">Giá trị/tấn</dt><dd>{formatVnd(selectedLot.valuePerTonVnd)}</dd>
              </dl>
              <div className="border-l-2 border-accent bg-amber-50 px-3 py-2 text-[11px] leading-relaxed">
                <strong className="mb-1 block">Lưu ý rủi ro</strong>
                {selectedLot.spoilageRiskNote}
              </div>
            </div>
          ) : (
            <div className="space-y-2 p-3 text-[11px] text-neutral-800">
              {scenario.resources.map(resource => (
                <div key={resource.id} className="border border-hairline bg-soft-gray p-2.5">
                  <div className="mb-1 flex items-center justify-between gap-2 font-black text-black">
                    <span className="inline-flex items-center gap-1">
                      {resource.category === 'COLD_STORAGE' ? <Snowflake className="h-3.5 w-3.5" /> : resource.category === 'NEXT_DAY_STAGING' ? <Clock3 className="h-3.5 w-3.5" /> : <Truck className="h-3.5 w-3.5" />}
                      {resource.shortLabel}
                    </span>
                    <span className="font-mono">{resource.maxCapacityTons === null ? 'Bãi chờ' : `${resource.maxCapacityTons}t tối đa`}</span>
                  </div>
                  <p>{resource.description}</p>
                  <p className="mt-1 text-muted-gray">Khởi hành/lưu: {resource.departureTime} · Đến: {resource.arrivalTime}</p>
                  <p className="mt-1 text-muted-gray">Nhiệt độ: {resource.tempRangeLabel}</p>
                  {resource.fixedCostVnd > 0 && <p>Chi phí/chuyến: {formatVnd(resource.fixedCostVnd)}</p>}
                  {resource.costPerTonVnd > 0 && <p>Chi phí lưu kho/tấn/ngày: {formatVnd(resource.costPerTonVnd)}</p>}
                </div>
              ))}
              <p className="border-t border-hairline pt-2 text-[10px] text-muted-gray">
                Dữ liệu tham khảo không tự chặn phương án quá tải hoặc sai nhiệt độ. Bạn cần tự kiểm tra trước khi chốt.
              </p>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};

export default LogisticsInfoDock;
