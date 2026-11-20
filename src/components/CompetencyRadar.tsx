import React from 'react';
import { Brain, Clock, ShieldAlert, Award, Compass, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CompetencyProfile } from '../types/state';

interface CompetencyRadarProps {
  profile: CompetencyProfile;
  recommendedNextIndustry?: { id: string; name: string; headline: string } | null;
  onStartRecommendedIndustry?: (industryId: string) => void;
}

export const CompetencyRadar: React.FC<CompetencyRadarProps> = ({
  profile,
  recommendedNextIndustry,
  onStartRecommendedIndustry,
}) => {
  const {
    logic_score,
    patience_score,
    resilience_score,
    composite_score,
    qualitative_insights,
    big_five,
    riasec,
    completed_micro_tasks_count = 2,
    confidence_level = 40,
  } = profile;

  const isTargetReached = completed_micro_tasks_count >= 5;

  return (
    <div className="card-hairline space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-hairline">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="eyebrow-marker" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-gray">
              BẰNG CHỨNG HÀNH VI THỰC TẾ (BIG FIVE &amp; HOLLAND RIASEC)
            </span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-black">
            Hồ Sơ Năng Lực 3 Trục Đo Khách Quan
          </h2>
        </div>

        {/* Composite Score Pill */}
        <div className="bg-night-navy text-white px-4 py-2 rounded-[18px] border border-black flex items-center gap-2.5">
          <Award className="w-5 h-5 text-accent" />
          <div className="text-right">
            <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
              ĐIỂM TỔNG HỢP (STOTAL)
            </div>
            <div className="font-mono text-xl font-black text-white leading-tight">
              {composite_score} <span className="text-xs text-accent">/ 100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Adaptive Micro-Task Loop Progress Banner (Goal: Minimum 5 Micro-Tasks) */}
      <div className="bg-amber-50 border-2 border-black p-4 shadow-[4px_4px_0px_0px_#000] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-black">
            <Sparkles className="w-4 h-4 text-accent" />
            <span>
              VÒNG LẶP ĐÁNH GIÁ MICRO-TASK: {completed_micro_tasks_count} / 5 MICRO-TASKS HOÀN THÀNH (ĐỘ TIN CẬY: {confidence_level}%)
            </span>
          </div>
          <p className="text-xs text-neutral-800 leading-relaxed">
            {isTargetReached
              ? 'Tuyệt vời! Bạn đã hoàn thành đủ tối thiểu 5 Micro-Tasks. Hồ sơ Big Five & RIASEC đã đạt độ chính xác thực chứng tối đa để tạo Báo cáo Đồng thuận!'
              : `Hệ thống khuyến nghị hoàn thành tối thiểu 5 Micro-Tasks để lấp đầy dữ liệu 5 trục Big Five và 6 nhóm RIASEC. Bạn có thể làm tiếp Micro-Task gợi ý bên cạnh hoặc xem trước kết quả ghép nối bên dưới.`}
          </p>
        </div>

        {recommendedNextIndustry && onStartRecommendedIndustry && !isTargetReached ? (
          <button
            onClick={() => onStartRecommendedIndustry(recommendedNextIndustry.id)}
            className="btn-pill-dark text-xs py-2.5 px-5 flex-shrink-0 flex items-center gap-2"
          >
            <span>LÀM TIẾP: {recommendedNextIndustry.name}</span>
            <ArrowRight className="w-3.5 h-3.5 text-accent" />
          </button>
        ) : (
          <div className="inline-flex items-center gap-1.5 bg-emerald-700 text-white text-xs font-black px-3 py-1.5 border border-black flex-shrink-0">
            <CheckCircle2 className="w-4 h-4" />
            <span>ĐỦ DỮ LIỆU CHUẨN (5+ TASKS)</span>
          </div>
        )}
      </div>

      {/* 3 Competency Axes Meters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Axis 1: Logic */}
        <div className="bg-soft-gray p-4 border border-hairline flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-accent" />
                <span className="text-xs font-black uppercase text-black">
                  Tư Duy Logic (SLOGIC)
                </span>
              </div>
              <span className="font-mono text-sm font-black text-black">
                {logic_score}/100
              </span>
            </div>
            <p className="text-[11px] text-muted-gray mb-3 leading-normal">
              Đo bằng độ chính xác áp dụng SOP 3 dòng và phân tích bằng chứng nguyên nhân gốc.
            </p>
          </div>

          <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-accent h-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, logic_score))}%` }}
            />
          </div>
        </div>

        {/* Axis 2: Patience */}
        <div className="bg-soft-gray p-4 border border-hairline flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-black uppercase text-black">
                  Kiên Nhẫn Chi Tiết (SPATIENCE)
                </span>
              </div>
              <span className="font-mono text-sm font-black text-black">
                {patience_score}/100
              </span>
            </div>
            <p className="text-[11px] text-muted-gray mb-3 leading-normal">
              Đo bằng thời gian đọc kỹ sổ tay quy định và tần suất đối soát đa nguồn dữ liệu.
            </p>
          </div>

          <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, patience_score))}%` }}
            />
          </div>
        </div>

        {/* Axis 3: Resilience */}
        <div className="bg-soft-gray p-4 border border-hairline flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-live-red" />
                <span className="text-xs font-black uppercase text-black">
                  Sức Bền Giờ G (SRESILIENCE)
                </span>
              </div>
              <span className="font-mono text-sm font-black text-black">
                {resilience_score}/100
              </span>
            </div>
            <p className="text-[11px] text-muted-gray mb-3 leading-normal">
              Đo bằng khả năng giữ bình tĩnh ở 60s cuối và không click hoảng loạn khi Sếp giục.
            </p>
          </div>

          <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-live-red h-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, resilience_score))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Scientific Assessment Dual Framework: Big Five (OCEAN) & Holland RIASEC */}
      {big_five && riasec && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-hairline">
          {/* Layer 1: Big Five Personality Traits */}
          <div className="border border-black p-4 bg-white space-y-3">
            <div className="flex items-center justify-between border-b border-hairline pb-2">
              <span className="text-xs font-black uppercase text-black">
                1. Nền Tảng Tâm Lý Học Big Five (OCEAN)
              </span>
              <span className="text-[10px] font-mono bg-neutral-100 px-2 py-0.5 border border-black font-bold">
                CHẤT LÀM VIỆC THỰC CHỨNG
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { label: 'Tận tâm (Conscientiousness)', val: big_five.conscientiousness },
                { label: 'Cởi mở (Openness)', val: big_five.openness },
                { label: 'Ổn định cảm xúc (Emotional Stability)', val: big_five.emotional_stability },
                { label: 'Hòa đồng (Agreeableness)', val: big_five.agreeableness },
                { label: 'Hướng ngoại (Extraversion)', val: big_five.extraversion },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span>{item.label}</span>
                    <span className="font-mono font-bold">{item.val}/100</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 overflow-hidden">
                    <div className="h-full bg-black" style={{ width: `${item.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Layer 2: Holland RIASEC 6 Career Dimensions */}
          <div className="border border-black p-4 bg-white space-y-3">
            <div className="flex items-center justify-between border-b border-hairline pb-2">
              <span className="text-xs font-black uppercase text-black flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-accent" />
                <span>2. Khung Môi Trường Nghề Nghiệp RIASEC</span>
              </span>
              <span className="text-xs font-mono font-black bg-accent text-black px-2 py-0.5 border border-black">
                MÃ HOLLAND: {riasec.top_code}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              {[
                { label: 'Investigative (Nghiên cứu)', val: riasec.investigative },
                { label: 'Conventional (Nghiệp vụ)', val: riasec.conventional },
                { label: 'Realistic (Kỹ thuật)', val: riasec.realistic },
                { label: 'Enterprising (Quản lý)', val: riasec.enterprising },
                { label: 'Social (Xã hội)', val: riasec.social },
                { label: 'Artistic (Nghệ thuật)', val: riasec.artistic },
              ].map((r, idx) => (
                <div key={idx} className="p-2 bg-soft-gray border border-hairline">
                  <div className="text-[11px] font-bold text-black">{r.label}</div>
                  <div className="font-mono font-black text-sm text-night-navy">{r.val}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Qualitative Insights */}
      {qualitative_insights.length > 0 && (
        <div className="pt-4 border-t border-hairline space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-gray block">
            Nhận Định Hành Vi Tự Động:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {qualitative_insights.map((insight, idx) => (
              <div
                key={idx}
                className="bg-white border border-hairline p-3 text-xs text-gray-800 leading-relaxed rounded-none"
              >
                <span className="w-1.5 h-1.5 bg-black inline-block mr-1.5 align-middle" />
                {insight}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompetencyRadar;
