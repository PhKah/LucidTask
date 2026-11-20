import React from 'react';
import { Compass, RotateCcw, ArrowLeft, ShieldAlert } from 'lucide-react';

interface EarlyExitScreenProps {
  reason: 'LOW_ACCURACY' | 'ERRATIC_SPEED';
  accuracy: number;
  speedSecondsPerItem: number;
  onRetry: () => void;
  onChooseOtherIndustry: () => void;
}

export const EarlyExitScreen: React.FC<EarlyExitScreenProps> = ({
  reason,
  accuracy,
  speedSecondsPerItem,
  onRetry,
  onChooseOtherIndustry,
}) => {
  const isErraticSpeed = reason === 'ERRATIC_SPEED';

  return (
    <div className="card-hairline border-2 border-black p-6 sm:p-8 space-y-6 animate-fadeIn">
      {/* Eyebrow & Status */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-live-red" />
          <span className="text-xs font-bold uppercase tracking-widest text-live-red">
            LA BÀN ĐỊNH HƯỚNG — BỘ LỌC SƠ TUYỂN DỪNG SỚM
          </span>
        </div>
        <span className="badge-live-red text-[10px]">
          PHỄU LỌC MA SÁT KÍCH HOẠT (H0 VALIDATION)
        </span>
      </div>

      {/* Headline */}
      <div>
        <h2 className="text-2xl font-black uppercase tracking-tight text-black mb-3">
          Nhận Định Năng Lực &amp; Phản Xạ Thao Tác Của Bạn
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed max-w-3xl">
          Hệ thống ghi nhận chuỗi vi thao tác của bạn ở Chặng 1 và tạm dừng thử thách để tránh lãng phí thời gian của bạn vào một công việc có thể không phù hợp với sở trường tự nhiên.
        </p>
      </div>

      {/* Telemetry Metric Insights Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-soft-gray p-4 border border-hairline space-y-2">
          <div className="text-xs font-black uppercase text-muted-gray flex items-center justify-between">
            <span>Độ Chính Xác Phân Loại</span>
            <span className={`font-mono text-sm font-black ${accuracy < 0.60 ? 'text-live-red' : 'text-black'}`}>
              {Math.round(accuracy * 100)}%
            </span>
          </div>
          <p className="text-xs text-muted-gray">
            Ngưỡng sàng lọc tối thiểu yêu cầu $\ge 60\%$.
          </p>
        </div>

        <div className="bg-soft-gray p-4 border border-hairline space-y-2">
          <div className="text-xs font-black uppercase text-muted-gray flex items-center justify-between">
            <span>Tốc Độ Thao Tác Trung Bình</span>
            <span className={`font-mono text-sm font-black ${speedSecondsPerItem < 1.2 ? 'text-live-red' : 'text-black'}`}>
              {speedSecondsPerItem.toFixed(1)}s / mã log
            </span>
          </div>
          <p className="text-xs text-muted-gray">
            Ngưỡng quan sát cẩn trọng yêu cầu $\ge 1.2$s/thao tác.
          </p>
        </div>
      </div>

      {/* Behavioral Analysis Box */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded text-xs text-amber-900 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold block">
            {isErraticSpeed
              ? 'Phát hiện phản xạ thao tác quá nhanh không đọc quy tắc:'
              : 'Phát hiện sự không tương thích với công việc đối soát lặp lại:'}
          </span>
          <p className="leading-relaxed">
            {isErraticSpeed
              ? 'Bạn hoàn thành mỗi mã log chỉ trong dưới 1.2 giây. Trong kỹ thuật phần mềm và QA, việc bấm chọn theo linh tính mà không đối chiếu sổ tay quy tắc sẽ dẫn tới rủi ro lọt lỗi nghiêm trọng lên môi trường thật.'
              : 'Tỷ lệ phân loại đúng của bạn dưới 60%. Điều này chỉ ra rằng công việc đòi hỏi ngồi rà soát dữ liệu log tỉ mỉ có thể gây cảm giác nhàm chán hoặc áp lực không cần thiết cho bạn.'}
          </p>
        </div>
      </div>

      {/* Compass Advice */}
      <div className="border-t border-hairline pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-muted-gray">
          <Compass className="w-4 h-4 text-accent" />
          <span>Bạn có thể chọn làm lại thật cẩn thận hoặc đổi sang một ngành nghề khác</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onRetry}
            className="btn-pill-dark flex-1 sm:flex-initial justify-center"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            <span>THỬ LẠI CHẶNG 1 (CẨN THẬN HƠN)</span>
          </button>

          <button
            onClick={onChooseOtherIndustry}
            className="btn-pill-outline flex-1 sm:flex-initial justify-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>ĐỔI SANG NGÀNH KHÁC</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EarlyExitScreen;
