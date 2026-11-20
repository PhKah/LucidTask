import React from 'react';
import {
  Brain,
  Clock,
  ShieldAlert,
  Award,
  Compass,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Bot,
} from 'lucide-react';
import { CompetencyProfile } from '../types/state';
import { MissionId } from '../types/mission';

interface CompetencyRadarProps {
  profile: CompetencyProfile;
  recommendedNextMission?: { id: MissionId; name: string } | null;
  onStartRecommendedMission?: (missionId: MissionId) => void;
}

export const CompetencyRadar: React.FC<CompetencyRadarProps> = ({
  profile,
  recommendedNextMission,
  onStartRecommendedMission,
}) => {
  const {
    mission_title,
    logic_score,
    patience_score,
    resilience_score,
    composite_score,
    qualitative_insights,
    big_five,
    big_five_weights,
    riasec,
    ai_trap_verdict,
    completed_missions_count,
    confidence_level,
  } = profile;

  const isTargetReached = completed_missions_count >= 2;

  const aiBadge =
    ai_trap_verdict === 'TRIGGERED_AND_REJECTED'
      ? { label: 'PHẢN BIỆN AI XUẤT SẮC', cls: 'bg-emerald-700 text-white' }
      : ai_trap_verdict === 'TRIGGERED_AND_ACCEPTED'
        ? { label: 'CẢNH BÁO PHỤ THUỘC AI', cls: 'bg-live-red text-white' }
        : { label: 'TỰ CHỦ ĐỘC LẬP 100%', cls: 'bg-black text-accent' };

  return (
    <div className="card-hairline border-2 border-black shadow-[5px_5px_0px_0px_#000] space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-hairline">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="eyebrow-marker" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-gray">
              HỒ SƠ THỰC CHỨNG • {mission_title}
            </span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-black">
            Hồ Sơ Năng Lực Big Five &amp; Holland RIASEC
          </h2>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono font-black border border-black ${aiBadge.cls}`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>{aiBadge.label}</span>
          </span>

          <div className="bg-night-navy text-white px-4 py-2 rounded-[18px] border border-black flex items-center gap-2.5">
            <Award className="w-5 h-5 text-accent" />
            <div className="text-right">
              <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                ĐIỂM TỔNG HỢP
              </div>
              <div className="font-mono text-xl font-black text-white leading-tight">
                {composite_score} <span className="text-xs text-accent">/ 100</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Mission Progress Banner (Goal: 2/2 Deep Missions) */}
      <div className="bg-amber-50 border-2 border-black p-4 shadow-[4px_4px_0px_0px_#000] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-black">
            <Sparkles className="w-4 h-4 text-accent" />
            <span>
              TIẾN ĐỘ ĐÁNH GIÁ CHUYÊN SÂU: {completed_missions_count} / 2 NHIỆM VỤ (ĐỘ TIN CẬY: {confidence_level}%)
            </span>
          </div>
          <p className="text-xs text-neutral-800 leading-relaxed">
            {isTargetReached
              ? 'Xuất sắc! Bạn đã hoàn thành cả 2 nhiệm vụ chuyên sâu (Logistics & QA/Dữ liệu). Hồ sơ Big Five & RIASEC đạt độ tin cậy tối đa để xuất Báo cáo Đồng thuận A4!'
              : 'Bạn đã có dữ liệu thực chứng của nhiệm vụ đầu tiên. Bạn có thể xem trước danh sách trường ẩn danh bên dưới hoặc trải nghiệm nốt nhiệm vụ còn lại để đạt 100% độ tin cậy đa chiều.'}
          </p>
        </div>

        {recommendedNextMission && onStartRecommendedMission && !isTargetReached ? (
          <button
            onClick={() => onStartRecommendedMission(recommendedNextMission.id)}
            className="btn-pill-dark text-xs py-2.5 px-5 flex-shrink-0 flex items-center gap-2"
          >
            <span>THỬ TIẾP: {recommendedNextMission.name}</span>
            <ArrowRight className="w-3.5 h-3.5 text-accent" />
          </button>
        ) : (
          <div className="inline-flex items-center gap-1.5 bg-emerald-700 text-white text-xs font-black px-3 py-1.5 border border-black flex-shrink-0">
            <CheckCircle2 className="w-4 h-4" />
            <span>HOÀN TẤT 2/2 NHIỆM VỤ</span>
          </div>
        )}
      </div>

      {/* 3 Core Axes Meters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-soft-gray p-4 border border-hairline flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-accent" />
                <span className="text-xs font-black uppercase text-black">Tư Duy Phân Tích</span>
              </div>
              <span className="font-mono text-sm font-black text-black">{logic_score}/100</span>
            </div>
            <p className="text-[11px] text-muted-gray mb-3 leading-normal">
              Tối ưu hóa đánh đổi, nhận diện lỗ hổng logic và phản biện đề xuất AI.
            </p>
          </div>
          <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-accent h-full transition-all duration-700"
              style={{ width: `${logic_score}%` }}
            />
          </div>
        </div>

        <div className="bg-soft-gray p-4 border border-hairline flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-black uppercase text-black">Kỷ Luật &amp; Chi Tiết</span>
              </div>
              <span className="font-mono text-sm font-black text-black">{patience_score}/100</span>
            </div>
            <p className="text-[11px] text-muted-gray mb-3 leading-normal">
              Tự kiểm soát tải trọng / nhiệt độ trên bảng thụ động hoặc săn lỗi dữ liệu chính xác.
            </p>
          </div>
          <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full transition-all duration-700"
              style={{ width: `${patience_score}%` }}
            />
          </div>
        </div>

        <div className="bg-soft-gray p-4 border border-hairline flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-live-red" />
                <span className="text-xs font-black uppercase text-black">Bản Lĩnh Dưới Áp Lực</span>
              </div>
              <span className="font-mono text-sm font-black text-black">{resilience_score}/100</span>
            </div>
            <p className="text-[11px] text-muted-gray mb-3 leading-normal">
              Giữ bình tĩnh trước sự khan hiếm nguồn lực và áp lực chốt lệnh giờ G.
            </p>
          </div>
          <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-live-red h-full transition-all duration-700"
              style={{ width: `${resilience_score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Dual Psychometric Framework: Big Five (OCEAN) & Holland RIASEC */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-hairline">
        {/* Big Five */}
        <div className="border-2 border-black p-4 bg-white space-y-3">
          <div className="flex items-center justify-between border-b border-hairline pb-2">
            <span className="text-xs font-black uppercase text-black">
              1. Chỉ Số Big Five (Theo Trọng Số Nhiệm Vụ)
            </span>
            <span className="text-[10px] font-mono bg-neutral-100 px-2 py-0.5 border border-black font-bold">
              C:{big_five_weights.conscientiousness}% • ES:{big_five_weights.emotional_stability}% • O:{big_five_weights.openness}%
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {[
              {
                label: `Tận tâm / Kỷ luật (Conscientiousness — ${big_five_weights.conscientiousness}%)`,
                val: big_five.conscientiousness,
              },
              {
                label: `Ổn định cảm xúc (Emotional Stability — ${big_five_weights.emotional_stability}%)`,
                val: big_five.emotional_stability,
              },
              {
                label: `Cởi mở & Phản biện (Openness — ${big_five_weights.openness}%)`,
                val: big_five.openness,
              },
              { label: 'Hòa đồng & Phối hợp (Agreeableness)', val: big_five.agreeableness },
              { label: 'Chủ động điều hành (Extraversion)', val: big_five.extraversion },
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

        {/* Holland RIASEC */}
        <div className="border-2 border-black p-4 bg-white space-y-3">
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
              { label: 'Realistic (Kỹ thuật / Vận hành)', val: riasec.realistic },
              { label: 'Investigative (Nghiên cứu / QA)', val: riasec.investigative },
              { label: 'Enterprising (Quản lý / Điều phối)', val: riasec.enterprising },
              { label: 'Conventional (Nghiệp vụ / Quy chuẩn)', val: riasec.conventional },
              { label: 'Social (Xã hội)', val: riasec.social },
              { label: 'Artistic (Nghệ thuật)', val: riasec.artistic },
            ].map((r, idx) => (
              <div key={idx} className="p-2.5 bg-soft-gray border border-hairline">
                <div className="text-[11px] font-bold text-black">{r.label}</div>
                <div className="font-mono font-black text-sm text-night-navy">{r.val}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Qualitative Insights */}
      {qualitative_insights.length > 0 && (
        <div className="pt-4 border-t border-hairline space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-gray block">
            Nhận Định Hành Vi Thực Chứng:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {qualitative_insights.map((insight, idx) => (
              <div
                key={idx}
                className="bg-white border border-hairline p-3 text-xs text-gray-800 leading-relaxed"
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
