import React, { useState } from 'react';
import {
  Printer,
  Share2,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Coins,
  MessageSquareQuote,
  ShieldAlert,
  Check,
  Building,
  RotateCcw,
} from 'lucide-react';
import { CompetencyProfile, ProgramMatchResult } from '../types/state';
import { IndustryMarketIntelligence } from '../types/program';

interface ParentAlignmentKitProps {
  profile: CompetencyProfile;
  matchedPrograms: ProgramMatchResult[];
  selectedProgramId: string | null;
  marketIntelligence: IndustryMarketIntelligence;
  onBackToBlindMatching: () => void;
  onResetSession: () => void;
}

const formatMillionRange = (min: number, max: number): string =>
  `${(min / 1_000_000).toFixed(1).replace(/\.0$/, '')} - ${(max / 1_000_000).toFixed(1).replace(/\.0$/, '')} triệu`;

const formatVnd = (val: number): string =>
  `${new Intl.NumberFormat('vi-VN').format(val)} đ`;

export const ParentAlignmentKit: React.FC<ParentAlignmentKitProps> = ({
  profile,
  matchedPrograms,
  selectedProgramId,
  marketIntelligence,
  onBackToBlindMatching,
  onResetSession,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  const chosenMatch =
    matchedPrograms.find(m => m.program.id === selectedProgramId) || matchedPrograms[0];

  const program = chosenMatch?.program;
  const matchPercent = chosenMatch?.match_percentage || 88;
  const isLogistics = profile.mission_id === 'IND_LOG_COLDCHAIN';

  const tuitionMillion = program?.revealed_profile.annual_tuition_vnd
    ? Math.round(program.revealed_profile.annual_tuition_vnd / 1_000_000)
    : 28;

  const schoolName = program?.revealed_profile.institution_name || 'Cơ sở Đào tạo Khuyến nghị';

  const handlePrint = () => {
    window.print();
  };

  const handleShareZalo = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Báo cáo Đồng thuận Hướng nghiệp LucidTask (${marketIntelligence.industry_name}) - Khuyến nghị: ${schoolName} (${matchPercent}% tương thích, Mã Holland: ${profile.riasec.top_code}).`
      );
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const dinnerQuestion1 = isLogistics
    ? '"Con cảm thấy thế nào khi trực tiếp điều phối 42 tấn hàng container lạnh, tự kiểm soát tải trọng xe 15 tấn/5 tấn và phải cân nhắc thiệt hại do giao trễ và rủi ro hỏng trái cây? Con có hứng thú với nhịp độ ra quyết định đó không?"'
    : '"Con cảm thấy thế nào khi ngồi rà soát từng dòng trong bảng 15 đơn hàng và bắt lỗi trên sơ đồ luồng thanh toán tiếng Việt? Con thấy thích thú khi săn ra lỗi ẩn hay cảm thấy mệt mỏi?"';

  return (
    <div className="space-y-8 animate-fadeIn text-black">
      {/* Top Action Bar (Hidden on Print) */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-hairline no-print">
        <button
          onClick={onBackToBlindMatching}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-gray hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Khung Ghép Nối Ẩn Danh</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShareZalo}
            className="btn-pill-outline text-xs flex items-center gap-1.5 py-2 px-4"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Đã Sao Chép Tóm Tắt</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Chia Sẻ Zalo</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="btn-pill-dark text-xs flex items-center gap-2 py-2 px-5 bg-black text-white hover:bg-neutral-800"
          >
            <Printer className="w-4 h-4" />
            <span>In Báo Cáo A4 (PDF)</span>
          </button>
        </div>
      </div>

      {/* Main A4 Printable Document */}
      <div className="bg-white p-6 sm:p-10 border border-hairline rounded-none space-y-8 page-break-inside-avoid">
        {/* Document Header */}
        <div className="border-b-2 border-hairline pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-6 bg-accent inline-block flex-shrink-0" />
              <span className="text-xs font-black uppercase tracking-widest text-muted-gray font-mono">
                LUCIDTASK EMPIRICAL CAREER REPORT • {marketIntelligence.industry_name.toUpperCase()}
              </span>
            </div>
            <div className="text-xs font-mono text-muted-gray">
              MÃ HOLLAND: <strong className="text-black">{profile.riasec.top_code}</strong> | NGÀY:{' '}
              {new Date().toLocaleDateString('vi-VN')}
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-night-navy font-roboto">
            Báo Cáo Đồng Thuận Định Hướng Nghề Nghiệp
          </h1>
          <p className="text-xs text-muted-gray mt-1">
            Đối chiếu năng lực thực chứng từ nhiệm vụ mô phỏng chuyên sâu và dữ liệu thị trường lao động ngành {marketIntelligence.industry_name}.
          </p>
        </div>

        {/* 2-Column Comparative Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2 items-start">
          {/* CỘT 1: NĂNG LỰC THỰC CHỨNG CON */}
          <div className="border border-hairline p-5 space-y-6 bg-white">
            <div className="flex items-center gap-2 border-b border-hairline pb-3">
              <span className="w-2 h-4 bg-accent inline-block" />
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-black">
                  CỘT 1: NĂNG LỰC THỰC CHỨNG CON
                </h2>
                <p className="text-[11px] text-muted-gray">
                  {profile.mission_title} • Big Five &amp; RIASEC
                </p>
              </div>
            </div>

            {/* 1. Điểm số 3 Trục Năng lực */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-black flex justify-between">
                <span>1. Chỉ Số Big Five &amp; Năng Lực Cốt Lõi</span>
                <span className="font-mono text-muted-gray">
                  Tổng hợp: <strong className="text-black">{profile.composite_score}/100</strong>
                </span>
              </div>

              {[
                {
                  label: `Tận tâm / Kỷ luật (Trọng số ${profile.big_five_weights.conscientiousness}%)`,
                  score: profile.big_five.conscientiousness,
                  barColor: 'bg-emerald-600',
                },
                {
                  label: `Ổn định cảm xúc (Trọng số ${profile.big_five_weights.emotional_stability}%)`,
                  score: profile.big_five.emotional_stability,
                  barColor: 'bg-live-red',
                },
                {
                  label: `Cởi mở & Phản biện (Trọng số ${profile.big_five_weights.openness}%)`,
                  score: profile.big_five.openness,
                  barColor: 'bg-accent',
                },
              ].map((row, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>{row.label}:</span>
                    <span className="font-mono">{row.score}/100</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div className={`h-full ${row.barColor}`} style={{ width: `${row.score}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* 2. Bằng chứng Hành vi Từ Nhiệm Vụ */}
            <div className="space-y-2 border-t border-hairline pt-4">
              <div className="text-xs font-bold uppercase tracking-wider text-black">
                2. Bằng Chứng Thao Tác Khách Quan
              </div>
              <ul className="text-xs space-y-2 text-neutral-700">
                {profile.criteria_breakdown.map(crit => (
                  <li key={crit.id} className="flex items-start gap-2">
                    <CheckCircle2
                      className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${
                        crit.status === 'PASS'
                          ? 'text-emerald-600'
                          : crit.status === 'PARTIAL'
                            ? 'text-amber-600'
                            : 'text-live-red'
                      }`}
                    />
                    <span>
                      <strong>{crit.label}:</strong> {crit.summary}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Nhận định Định tính */}
            <div className="space-y-2 border-t border-hairline pt-4">
              <div className="text-xs font-bold uppercase tracking-wider text-black">
                3. Nhận Định Chuyên Sâu
              </div>
              <div className="space-y-2">
                {profile.qualitative_insights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-neutral-50 border border-hairline text-[11px] leading-relaxed text-neutral-800"
                  >
                    • {insight}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CỘT 2: THỊ TRƯỜNG & CHI PHÍ RỦI RO (DYNAMIC PER INDUSTRY) */}
          <div className="border border-hairline p-5 space-y-6 bg-white">
            <div className="flex items-center gap-2 border-b border-hairline pb-3">
              <span className="w-2 h-4 bg-night-navy inline-block" />
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-black">
                  CỘT 2: THỊ TRƯỜNG &amp; CHI PHÍ RỦI RO
                </h2>
                <p className="text-[11px] text-muted-gray">
                  Nguồn: {marketIntelligence.data_sources[0]}
                </p>
              </div>
            </div>

            {/* 1. Thu nhập 5 năm đầu */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-accent" />
                <span>1. Dải Thu Nhập Thực Tế 5 Năm Đầu</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-neutral-50 border border-hairline">
                  <div className="text-muted-gray text-[10px] uppercase font-bold">
                    Mới ra trường (0 - 2 năm)
                  </div>
                  <div className="font-bold text-black font-mono text-sm mt-0.5">
                    {formatMillionRange(
                      marketIntelligence.market_metrics.salary_range_0_to_2_years_vnd.min,
                      marketIntelligence.market_metrics.salary_range_0_to_2_years_vnd.max
                    )}
                  </div>
                  <div className="text-[10px] text-muted-gray">VNĐ / tháng</div>
                </div>
                <div className="p-3 bg-neutral-50 border border-hairline">
                  <div className="text-muted-gray text-[10px] uppercase font-bold">
                    Cứng tay nghề (3 - 5 năm)
                  </div>
                  <div className="font-bold text-black font-mono text-sm mt-0.5">
                    {formatMillionRange(
                      marketIntelligence.market_metrics.salary_range_3_to_5_years_vnd.min,
                      marketIntelligence.market_metrics.salary_range_3_to_5_years_vnd.max
                    )}
                  </div>
                  <div className="text-[10px] text-muted-gray">VNĐ / tháng</div>
                </div>
              </div>
              <div className="text-[11px] text-muted-gray flex items-start gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  Tăng trưởng tới 2030:{' '}
                  <strong>{marketIntelligence.market_metrics.long_term_growth_projection_2030}</strong>
                </span>
              </div>
            </div>

            {/* 2. Rủi ro AI */}
            <div className="space-y-2 border-t border-hairline pt-4">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-black">
                <span className="flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  <span>2. Rủi Ro Thay Thế Bởi AI</span>
                </span>
                <span className="px-2 py-0.5 bg-neutral-200 text-neutral-800 text-[10px] font-bold rounded">
                  MỨC {marketIntelligence.market_metrics.automation_ai_risk_level}
                </span>
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed bg-neutral-50 p-3 border border-hairline">
                {marketIntelligence.market_metrics.automation_risk_explanation}
              </p>
            </div>

            {/* 3. Chi phí Rủi ro Chọn sai ngành */}
            <div className="space-y-3 border-t border-hairline pt-4">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-live-red">
                <AlertTriangle className="w-3.5 h-3.5 text-live-red" />
                <span>3. Bảng Chi Phí Rủi Ro Chọn Sai Ngành</span>
              </div>
              <div className="p-3 bg-red-50/50 border border-red-200 space-y-2 text-xs">
                <div className="text-[11px] text-neutral-700">
                  Tỷ lệ sinh viên bỏ học / chuyển ngành do ngộ nhận:{' '}
                  <strong>{marketIntelligence.academic_risk_stats.industry_dropout_or_shift_rate}%</strong> (
                  {marketIntelligence.academic_risk_stats.root_cause_breakdown.gap_between_expectation_and_reality}% do lệch giữa kỳ vọng và thực tế công việc).
                </div>
                <div className="space-y-1.5 border-t border-red-200 pt-2 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">• Học phí lãng phí:</span>
                    <span className="font-bold">
                      {formatVnd(marketIntelligence.academic_risk_stats.wasted_cost_breakdown.tuition_lost)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">• Sinh hoạt phí tại đô thị:</span>
                    <span className="font-bold">
                      {formatVnd(marketIntelligence.academic_risk_stats.wasted_cost_breakdown.living_expenses_lost)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">• Chi phí cơ hội (trễ 1-2 năm đi làm):</span>
                    <span className="font-bold">
                      {formatVnd(marketIntelligence.academic_risk_stats.wasted_cost_breakdown.opportunity_cost_youth_lost)}
                    </span>
                  </div>
                </div>
                <div className="border-t-2 border-red-300 pt-2 flex items-center justify-between text-live-red font-black text-xs sm:text-sm">
                  <span>TỔNG LÃNG PHÍ TIỀM ẨN:</span>
                  <span className="font-mono">
                    ~{Math.round(marketIntelligence.academic_risk_stats.estimated_wasted_cost_1year_vnd / 1_000_000)} TRIỆU VNĐ
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* VÙNG ĐỒNG THUẬN GIA ĐÌNH (ALIGNMENT ZONE) */}
        <div className="border-2 border-black p-6 space-y-5 bg-neutral-50/70">
          <div className="flex items-center gap-2 border-b border-hairline pb-3">
            <span className="w-2.5 h-5 bg-accent inline-block" />
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-black">
                VÙNG ĐỒNG THUẬN GIA ĐÌNH (ALIGNMENT ZONE)
              </h3>
              <span className="text-xs font-mono font-bold text-accent bg-black px-2.5 py-0.5 rounded self-start sm:self-auto">
                ĐỘ PHÙ HỢP: {matchPercent}%
              </span>
            </div>
          </div>

          <div className="bg-white p-4 border border-hairline space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-gray">
              <Building className="w-3.5 h-3.5 text-black" />
              <span>Khuyến Nghị Khách Quan Từ Dữ Liệu Thực Chứng:</span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed">
              "Qua nhiệm vụ thực chứng <strong>{profile.mission_title}</strong> (Mã Holland: <strong>{profile.riasec.top_code}</strong>), gia đình nên cùng con cân nhắc chương trình <strong>{program?.anonymous_profile.code_name}</strong> tại <strong>{schoolName}</strong> (độ tương thích thuật toán: <strong>{matchPercent}%</strong>)."
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black">
              <MessageSquareQuote className="w-4 h-4 text-accent" />
              <span>3 Câu Hỏi Gợi Mở Đối Thoại Bữa Tối Gia Đình:</span>
            </div>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="p-3 bg-white border border-hairline flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                  1
                </span>
                <p className="text-neutral-800 leading-relaxed pt-0.5">
                  <strong>Trải nghiệm công việc thật:</strong> {dinnerQuestion1}
                </p>
              </div>

              <div className="p-3 bg-white border border-hairline flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                  2
                </span>
                <p className="text-neutral-800 leading-relaxed pt-0.5">
                  <strong>Khả năng tài chính:</strong> "Mức học phí <strong>{tuitionMillion} triệu/năm</strong> của trường <strong>{schoolName}</strong> có phù hợp với kế hoạch tài chính của gia đình mình không?"
                </p>
              </div>

              <div className="p-3 bg-white border border-hairline flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                  3
                </span>
                <p className="text-neutral-800 leading-relaxed pt-0.5">
                  <strong>Cam kết rèn luyện:</strong> "Con sẵn sàng chủ động trải nghiệm nốt nhiệm vụ còn lại trên LucidTask và rèn thêm kỹ năng ngoại ngữ, phân tích số liệu để tự tin bước vào ngành này chứ?"
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-muted-gray border-t border-hairline pt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>Hệ thống LucidTask v2.0 — Xác nhận độ tin cậy thực chứng qua Telemetry Bus.</span>
          <span className="font-mono">Chuẩn IEEE 830 &amp; IEEE 1016</span>
        </div>
      </div>

      {/* Bottom Actions (Hidden on Print) */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4 pb-12 no-print">
        <button
          onClick={handlePrint}
          className="btn-pill-dark text-sm flex items-center gap-2 py-3 px-8 bg-black text-white hover:bg-neutral-800"
        >
          <Printer className="w-4 h-4" />
          <span>IN BÁO CÁO A4 (PDF)</span>
        </button>

        <button
          onClick={handleShareZalo}
          className="btn-pill-outline text-sm flex items-center gap-2 py-3 px-6"
        >
          <Share2 className="w-4 h-4" />
          <span>CHIA SẺ ZALO</span>
        </button>

        <button
          onClick={onResetSession}
          className="btn-pill-outline text-sm flex items-center gap-2 py-3 px-6 text-muted-gray hover:text-black"
        >
          <RotateCcw className="w-4 h-4" />
          <span>CHỌN NHIỆM VỤ KHÁC</span>
        </button>
      </div>
    </div>
  );
};

export default ParentAlignmentKit;
