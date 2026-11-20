import React from 'react';
import { Brain, Clock, ShieldAlert, Award } from 'lucide-react';
import { CompetencyProfile } from '../types/state';

interface CompetencyRadarProps {
  profile: CompetencyProfile;
}

export const CompetencyRadar: React.FC<CompetencyRadarProps> = ({ profile }) => {
  const { logic_score, patience_score, resilience_score, composite_score, qualitative_insights } = profile;

  return (
    <div className="card-hairline space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-hairline">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="eyebrow-marker" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-gray">
              BẰNG CHỨNG HÀNH VI THỰC TẾ
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
              Đo bằng độ chính xác so khớp mã log và phân tích nguyên nhân gốc lỗi SSL.
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
              Đo bằng thời gian đọc kỹ sổ tay Handbook và tần suất đối soát 3 tab.
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
              Đo bằng khả năng giữ bình tĩnh ở 60s cuối và không click hoảng loạn.
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

