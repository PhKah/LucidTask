import React from 'react';
import { ArrowRight, Clock, ShieldCheck, Briefcase, AlertCircle, ArrowLeft } from 'lucide-react';
import { LogisticsScenario, QaDataScenario } from '../../types/mission';

interface MissionBriefingProps {
  scenario: LogisticsScenario | QaDataScenario;
  onStartMission: () => void;
  onBack: () => void;
}

export const MissionBriefing: React.FC<MissionBriefingProps> = ({
  scenario,
  onStartMission,
  onBack,
}) => {
  const isLogistics = scenario.missionId === 'IND_LOG_COLDCHAIN';

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-gray hover:text-black transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Quay lại Chọn Nhiệm Vụ</span>
      </button>

      <div className="bg-white border-2 border-black shadow-[6px_6px_0px_0px_#000] p-6 sm:p-8 space-y-6">
        {/* Top Meta */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b-2 border-black">
          <div className="flex items-center gap-2">
            <span className="bg-accent text-black border border-black px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider">
              {isLogistics ? 'NHIỆM VỤ 01 • LOGISTICS CHUỖI LẠNH' : 'NHIỆM VỤ 02 • QA & LÀM SẠCH DỮ LIỆU'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono font-bold text-black">
            <span className="inline-flex items-center gap-1 bg-soft-gray border border-black px-2.5 py-1">
              <Clock className="w-3.5 h-3.5 text-live-red" />
              <span>{scenario.durationMinutes} PHÚT</span>
            </span>
            <span className="bg-night-navy text-white px-2.5 py-1">
              GIỜ HIỆN TẠI: {scenario.currentClock}
            </span>
          </div>
        </div>

        {/* Title & Role */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-gray uppercase">
            <Briefcase className="w-4 h-4 text-accent" />
            <span>Vai trò nhập vai: {scenario.roleTitle}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black leading-tight">
            {scenario.title}
          </h1>
        </div>

        {/* Context Story */}
        <div className="bg-soft-gray border-l-4 border-black p-4 space-y-2">
          <div className="text-[11px] font-black uppercase tracking-wider text-live-red flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Tình Huống Sự Cố Khẩn Cấp</span>
          </div>
          <p className="text-sm text-neutral-900 leading-relaxed">{scenario.contextStory}</p>
        </div>

        {/* 3 Actionable Objectives */}
        <div className="space-y-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-black">
            3 Đầu Việc Bạn Cần Trực Tiếp Thực Hiện:
          </h2>
          <div className="space-y-2.5">
            {scenario.objectives.map((obj, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 bg-white border border-black text-xs sm:text-sm text-neutral-800"
              >
                <span className="w-6 h-6 bg-black text-white font-mono font-black text-xs flex items-center justify-center flex-shrink-0">
                  0{idx + 1}
                </span>
                <span className="leading-relaxed">{obj}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Micro-Scaffolding Operating Note */}
        <div className="bg-amber-50 border border-black p-4 flex items-start gap-3 text-xs text-neutral-900">
          <ShieldCheck className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-black uppercase">Lưu ý trước khi vào bàn làm việc:</div>
            <p className="leading-relaxed">
              {isLogistics
                ? 'Không có câu hỏi trắc nghiệm A/B. Toàn bộ số liệu định mức tải trọng, nhiệt độ và giá trị hàng đều nằm sẵn ở Cột Trái. Bảng thống kê Cột Phải chỉ cộng dồn số liệu thô — bạn cần tự đối chiếu giới hạn an toàn trước khi chốt lệnh.'
                : 'Hoàn toàn KHÔNG yêu cầu biết lập trình hay gõ code. Mọi quy chuẩn dữ liệu (4 dòng) đều ghim sẵn ở Cột Trái và Sơ đồ Luồng Thanh Toán được viết 100% bằng tiếng Việt đời thường.'}
            </p>
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[11px] font-mono text-muted-gray">
            {isLogistics
              ? 'Chuyến tăng cường tiếp theo: 03:30 sáng mai → 06:00 Hà Nội'
              : 'Mốc khóa bản phát hành Flash-Sale: 20:00 hôm nay'}
          </span>
          <button
            onClick={onStartMission}
            className="btn-pill-dark text-sm px-8 py-3.5 bg-black text-white hover:bg-neutral-800 w-full sm:w-auto group"
          >
            <span>VÀO BÀN LÀM VIỆC NGAY</span>
            <ArrowRight className="w-4 h-4 ml-2 text-accent group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MissionBriefing;
