import React from 'react';
import { Lock, Unlock, Sparkles, Building2, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ProgramMatchResult } from '../types/state';

interface BlindMatchingCardsProps {
  matchedPrograms: ProgramMatchResult[];
  selectedProgramId: string | null;
  onSelectProgram: (programId: string) => void;
  isRevealed: boolean;
  onReveal: () => void;
  onProceedToReport: () => void;
}

const GREEK_LABELS = ['ALPHA', 'BETA', 'GAMMA', 'DELTA', 'EPSILON', 'ZETA', 'ETA', 'THETA'];

const getInstitutionTypeBadge = (type: string) => {
  switch (type) {
    case 'PUBLIC_TOP':
      return { label: 'ĐH CÔNG LẬP TOP 1', className: 'bg-black text-white' };
    case 'PRIVATE_APPLIED':
      return { label: 'ĐH TƯ THỤC THỰC CHIẾN', className: 'bg-accent text-black font-bold' };
    case 'VOCATIONAL_PRACTICAL':
      return { label: 'CĐ NGHỀ THỰC HÀNH', className: 'bg-emerald-700 text-white' };
    case 'INTERNATIONAL_JOINT':
      return { label: 'ĐH QUỐC TẾ LIÊN KẾT', className: 'bg-night-navy text-white' };
    default:
      return { label: 'CƠ SỞ ĐÀO TẠO', className: 'bg-gray-600 text-white' };
  }
};

export const BlindMatchingCards: React.FC<BlindMatchingCardsProps> = ({
  matchedPrograms,
  selectedProgramId,
  onSelectProgram,
  isRevealed,
  onReveal,
  onProceedToReport,
}) => {
  // Show top 3 matches primarily, with option to inspect the rest
  const topMatches = matchedPrograms.slice(0, 3);

  const handleTriggerReveal = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignore in environments without canvas
    }
    onReveal();
  };

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="card-hairline">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="eyebrow-marker" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-gray">
              THUẬT TOÁN GHÉP NỐI VÉC-TƠ KHÔNG GIAN
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold border border-hairline bg-soft-gray rounded-[18px]">
            {isRevealed ? (
              <>
                <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-black">DANH TÍNH ĐÃ MỞ KHÓA</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-accent" />
                <span className="text-black font-black">CHẾ ĐỘ ẨN DANH (BLIND MODE)</span>
              </>
            )}
          </div>
        </div>

        <h2 className="text-2xl font-black uppercase tracking-tight text-black mb-2">
          {isRevealed
            ? 'Danh Tính Cơ Sở Đào Tạo Được Ghép Nối Dựa Trên Năng Lực'
            : 'Các Chương Trình Đào Tạo Tương Thích Nhất (Đã Che Tên Trường)'}
        </h2>
        <p className="text-xs text-muted-gray leading-relaxed max-w-3xl">
          {isRevealed
            ? 'Danh tính các trường đã lộ diện hoàn toàn. Hãy đối chiếu môn học thực chiến và học phí với ngân sách gia đình của bạn.'
            : 'Tên trường và thương hiệu ban đầu bị ẩn 100% để ngăn chặn định kiến và mác trường top. Hãy lựa chọn chương trình dựa trên đồ án thực tế và môn học cốt lõi.'}
        </p>
      </div>

      {/* Top 3 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topMatches.map((item, index) => {
          const { program, match_percentage } = item;
          const isSelected = selectedProgramId === program.id;
          const labelCode = GREEK_LABELS[index] || `CHƯƠNG TRÌNH #${index + 1}`;

          return (
            <div
              key={program.id}
              className={`card-hairline flex flex-col justify-between transition-all bg-white relative ${
                isSelected
                  ? 'border-2 border-black shadow-md ring-1 ring-black'
                  : 'border border-hairline hover:border-gray-400'
              }`}
            >
              {/* Top Meta Header */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-mono font-black text-gray-500 uppercase tracking-widest">
                    THẺ {labelCode}
                  </span>

                  <div className="flex items-center gap-1 bg-accent/10 border border-accent/30 text-black px-2 py-0.5 rounded font-mono text-xs font-black">
                    <Sparkles className="w-3 h-3 text-accent" />
                    <span>{match_percentage}% TƯƠNG THÍCH</span>
                  </div>
                </div>

                {/* Identity: Blind vs. Revealed */}
                {isRevealed ? (
                  <div className="mb-4 pb-3 border-b border-hairline animate-fadeIn">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Building2 className="w-4 h-4 text-accent flex-shrink-0" />
                      <h3 className="font-black text-base text-black uppercase leading-snug">
                        {program.revealed_profile.institution_name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap text-[11px]">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getInstitutionTypeBadge(program.revealed_profile.institution_type).className}`}>
                        {getInstitutionTypeBadge(program.revealed_profile.institution_type).label}
                      </span>
                      <span className="text-muted-gray">
                        {program.revealed_profile.campus_location}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 pb-3 border-b border-hairline">
                    <h3 className="font-black text-sm text-black uppercase leading-snug mb-1">
                      {program.anonymous_profile.code_name}
                    </h3>
                    <p className="text-[11px] text-muted-gray italic">
                      {program.anonymous_profile.focus_headline}
                    </p>
                  </div>
                )}

                {/* Core Curriculum Pillars (Always visible) */}
                <div className="space-y-2 mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-black block">
                    3 Trụ Cột Đào Tạo Cốt Lõi:
                  </span>
                  <ul className="space-y-1.5 text-xs text-gray-700">
                    {program.anonymous_profile.core_curriculum_pillars.map((pillar, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-1.5 leading-tight">
                        <span className="text-accent font-black">•</span>
                        <span>{pillar}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Practical Capstone Project */}
                <div className="bg-soft-gray p-3 border border-hairline mb-4 rounded-none text-xs">
                  <span className="font-bold text-black uppercase text-[10px] block mb-1">
                    Đồ Án Tốt Nghiệp Tiêu Biểu:
                  </span>
                  <p className="text-[11px] text-muted-gray leading-normal">
                    {program.anonymous_profile.practical_project_example}
                  </p>
                </div>

                {/* Revealed Metrics (Only rendered when isRevealed === true) */}
                {isRevealed && (
                  <div className="space-y-2 mb-4 pt-3 border-t border-hairline animate-fadeIn text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-gray">Học Phí Ước Tính:</span>
                      <span className="font-mono font-bold text-black">
                        {formatVND(program.revealed_profile.annual_tuition_vnd)} đ / năm
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-gray">Việc Làm Đúng Ngành (1 Năm):</span>
                      <span className="font-mono font-bold text-emerald-700">
                        {program.revealed_profile.employment_rate_within_1yr}%
                      </span>
                    </div>

                    <div className="text-[11px] text-gray-600 bg-amber-50 p-2 rounded border border-amber-200">
                      <span className="font-bold">Xét tuyển: </span>
                      {program.revealed_profile.admissions_benchmark_note}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Card Action */}
              <div className="pt-4 border-t border-hairline">
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-muted-gray text-[11px]">Lương khởi điểm:</span>
                  <span className="font-mono font-bold text-black">
                    {program.anonymous_profile.estimated_grad_salary_vnd.min / 1000000} - {program.anonymous_profile.estimated_grad_salary_vnd.max / 1000000} triệu/tháng
                  </span>
                </div>

                <button
                  onClick={() => onSelectProgram(program.id)}
                  className={`w-full text-xs py-2 rounded-[18px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-black text-white'
                      : 'bg-white text-black border border-black hover:bg-neutral-50'
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-accent" />}
                  <span>{isSelected ? 'ĐÃ CHỌN CHƯƠNG TRÌNH NÀY' : 'CHỌN CHƯƠNG TRÌNH NÀY'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Central Unlock Bar & Next Step Action */}
      <div className="card-hairline bg-soft-gray p-6 text-center space-y-4 border border-hairline">
        {!isRevealed ? (
          <div className="max-w-xl mx-auto space-y-4">
            <p className="text-xs text-muted-gray leading-relaxed">
              Sau khi chọn chương trình phù hợp với năng lực và mục tiêu môn học, hãy nhấn mở khóa danh tính để đối chiếu tên trường thật.
            </p>

            <button
              onClick={handleTriggerReveal}
              className="btn-pill-dark text-sm px-8 py-3.5 bg-black hover:bg-neutral-800 text-white shadow-lg mx-auto"
            >
              <Unlock className="w-4 h-4 mr-2 text-accent" />
              <span>MỞ KHÓA DANH TÍNH CƠ SỞ ĐÀO TẠO</span>
            </button>
          </div>
        ) : (
          <div className="max-w-xl mx-auto space-y-4 animate-fadeIn">
            <div className="flex items-center justify-center gap-2 text-emerald-700 text-sm font-black uppercase">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Danh Tính Đã Lộ Diện — Sẵn Sàng Đối Thoại Gia Đình</span>
            </div>

            <p className="text-xs text-muted-gray leading-relaxed">
              Tiến vào Báo cáo Đồng thuận để xem bảng đối chiếu 2 cột song song (minh chứng thực tế của con và bảng tính chi phí rủi ro 185 triệu) phục vụ cuộc trò chuyện bữa tối.
            </p>

            <button
              onClick={onProceedToReport}
              className="btn-pill-dark text-sm px-8 py-3.5 bg-black hover:bg-neutral-800 text-white shadow-lg mx-auto group"
            >
              <span>TIẾN VÀO BÁO CÁO ĐỒNG THUẬN GIA ĐÌNH</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlindMatchingCards;
