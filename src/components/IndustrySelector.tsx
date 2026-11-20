import React from 'react';
import {
  ArrowRight,
  Clock,
  CheckCircle2,
  Sparkles,
  Truck,
  Bug,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { IndustryRegistry } from '../registry/index';
import { MissionId } from '../types/mission';

interface IndustrySelectorProps {
  onSelectMission: (missionId: MissionId) => void;
  completedMissionIds?: MissionId[];
}

export const IndustrySelector: React.FC<IndustrySelectorProps> = ({
  onSelectMission,
  completedMissionIds = [],
}) => {
  const industries = IndustryRegistry.getAllIndustries();
  const completedCount = completedMissionIds.length;
  const confidencePercent = completedCount >= 2 ? 100 : completedCount === 1 ? 60 : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Banner */}
      <div className="card-hairline border-2 border-black shadow-[6px_6px_0px_0px_#000]">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="eyebrow-marker" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-gray">
              MÔ PHỎNG CÔNG VIỆC THỰC CHỨNG (100% PHI TRẮC NGHIỆM)
            </span>
          </div>

          <div className="inline-flex items-center gap-2 bg-night-navy text-white px-3 py-1 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>
              TIẾN ĐỘ TRẢI NGHIỆM: {completedCount} / 2 NHIỆM VỤ (ĐỘ TIN CẬY: {confidencePercent}%)
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-3 text-black">
          Nhập Vai Chuyên Viên — Giải Bài Toán Nghề Nghiệp Thật Trong 10–15 Phút
        </h1>
        <p className="text-sm text-muted-gray leading-relaxed max-w-3xl">
          Không trắc nghiệm A/B/C/D, không đòi hỏi kiến thức đại học hay gõ cú pháp code. Bạn sẽ trực tiếp thao tác trên <strong>Bảng Điều Phối Chuỗi Lạnh</strong> hoặc <strong>Trạm Săn Lỗi Dữ Liệu &amp; Luồng Logic Tiếng Việt</strong> để hệ thống đo lường năng lực thực chứng qua <strong>Big Five (OCEAN)</strong>, <strong>Holland RIASEC</strong> và bản lĩnh phản biện <strong>AI Co-pilot</strong>.
        </p>

        {/* 3 Core Principles Strip */}
        <div className="mt-6 pt-5 border-t border-hairline grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-soft-gray p-3.5 border border-black">
            <div className="font-black uppercase text-black mb-1">01. Thao Tác Chủ Động</div>
            <p className="text-muted-gray leading-normal">
              Tự phân bổ tải trọng từng xe, tự bấm bắt lỗi trên bảng 15 đơn hàng &amp; sơ đồ luồng tiếng Việt.
            </p>
          </div>
          <div className="bg-soft-gray p-3.5 border border-black">
            <div className="font-black uppercase text-black mb-1">02. Kiểm Soát &amp; Bẫy AI</div>
            <p className="text-muted-gray leading-normal">
              Bảng thống kê thụ động đo tính kỷ luật tự đối chiếu và bản lĩnh phát hiện đề xuất sai từ AI Co-pilot.
            </p>
          </div>
          <div className="bg-soft-gray p-3.5 border border-black">
            <div className="font-black uppercase text-black mb-1">03. Ghép Nối Ẩn Danh</div>
            <p className="text-muted-gray leading-normal">
              Che tên trường 100% chống định kiến bằng cấp và xuất Báo cáo Đồng thuận A4 cho gia đình.
            </p>
          </div>
        </div>
      </div>

      {/* 2 Flagship Missions Grid */}
      <div>
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-black inline-block" />
            <h2 className="text-sm font-black uppercase tracking-wider text-black">
              2 Nhiệm Vụ Mô Phỏng Chuyên Sâu (MVP)
            </h2>
          </div>
          <span className="text-xs text-muted-gray">
            Hoàn thành cả 2 nhiệm vụ để đạt hồ sơ định hướng đa chiều 100% độ tin cậy
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {industries.map(ind => {
            const isLogistics = ind.id === 'IND_LOG_COLDCHAIN';
            const isCompleted = completedMissionIds.includes(ind.id);

            return (
              <div
                key={ind.id}
                className="card-hairline border-2 border-black shadow-[5px_5px_0px_0px_#000] hover:bg-neutral-50 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Tag & Duration */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-black bg-accent text-black px-2.5 py-0.5 border border-black uppercase tracking-wider">
                      {ind.shortTag}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-mono font-bold text-black">
                      <Clock className="w-3.5 h-3.5 text-live-red" />
                      <span>{ind.durationLabel}</span>
                    </div>
                  </div>

                  {/* Title & Icon */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 bg-night-navy text-accent border border-black flex items-center justify-center flex-shrink-0">
                        {isLogistics ? <Truck className="w-5 h-5" /> : <Bug className="w-5 h-5" />}
                      </div>
                      <h3 className="text-lg font-black uppercase group-hover:text-accent transition-colors leading-tight">
                        {ind.name}
                      </h3>
                    </div>

                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-600 flex-shrink-0">
                        <CheckCircle2 className="w-3 h-3" />
                        ĐÃ XONG
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-muted-gray leading-relaxed mb-4">
                    {ind.headline}
                  </p>

                  {/* Mission Highlights */}
                  <div className="space-y-2 mb-4 text-xs text-neutral-800 bg-soft-gray p-3.5 border border-black">
                    {ind.keyHighlights.map((hl, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-black flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{hl}</span>
                      </div>
                    ))}
                  </div>

                  {/* Target RIASEC */}
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-gray mb-5">
                    <Compass className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                    <span>{ind.riasecFocusLabel}</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectMission(ind.id)}
                  className="btn-pill-dark w-full justify-between text-xs py-3"
                >
                  <span>
                    {isLogistics
                      ? 'VÀO BẢNG ĐIỀU PHỐI LOGISTICS'
                      : 'VÀO TRẠM SĂN LỖI QA & DỮ LIỆU'}
                  </span>
                  <ArrowRight className="w-4 h-4 ml-2 text-accent group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Upcoming Post-MVP Teaser */}
        <div className="mt-6 card-hairline bg-soft-gray border-dashed border-gray-300 flex flex-col sm:flex-row items-center justify-between gap-4 opacity-85">
          <div>
            <span className="text-[11px] font-bold uppercase text-gray-600">
              LỘ TRÌNH MỞ RỘNG TIẾP THEO (KẾ TOÁN CHỨNG TỪ &amp; Y TẾ PHÂN LUỒNG)
            </span>
            <p className="text-xs text-muted-gray mt-0.5">
              Các mô phỏng chuyên sâu cho Kế toán – Kiểm toán (C) và Điều dưỡng Triage (S) đang được chuẩn hóa theo cùng triết lý phi trắc nghiệm.
            </p>
          </div>
          <button disabled className="btn-pill-outline text-xs flex-shrink-0">
            ĐANG PHÁT TRIỂN (POST-MVP)
          </button>
        </div>
      </div>
    </div>
  );
};

export default IndustrySelector;
