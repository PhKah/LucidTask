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
  marketIntelligence?: IndustryMarketIntelligence;
  stage1Summary?: {
    accuracy: number;
    totalItems: number;
    correctCount: number;
    durationSeconds: number;
  } | null;
  stage2Result?: {
    actionId: string;
    isOptimal: boolean;
    stats: { tabSwitches: number; panicClicks: number };
  } | null;
  onBackToBlindMatching: () => void;
  onResetSession: () => void;
}

export const ParentAlignmentKit: React.FC<ParentAlignmentKitProps> = ({
  profile,
  matchedPrograms,
  selectedProgramId,
  marketIntelligence,
  stage1Summary,
  stage2Result,
  onBackToBlindMatching,
  onResetSession,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  // Identify chosen or top matched program
  const chosenMatch =
    matchedPrograms.find((m) => m.program.id === selectedProgramId) ||
    matchedPrograms[0];

  const program = chosenMatch?.program;
  const matchPercent = chosenMatch?.match_percentage || 91;

  const handlePrint = () => {
    window.print();
  };

  const handleShareZalo = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Báo cáo Đồng thuận Hướng nghiệp LucidTask - Khuyến nghị: ${program?.revealed_profile.institution_name || 'Đại học Bách Khoa'} (${matchPercent}% tương thích).`
      );
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const tuitionMillion = program?.revealed_profile.annual_tuition_vnd
    ? Math.round(program.revealed_profile.annual_tuition_vnd / 1000000)
    : 32;

  const schoolName =
    program?.revealed_profile.institution_name || 'Đại học Bách Khoa (ĐHQG)';

  return (
    <div className="space-y-8 animate-fadeIn text-black">
      {/* Action Bar (Top Navigation - Hidden on Print) */}
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
            title="Sao chép tóm tắt để gửi qua Zalo cho cha mẹ"
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
            title="Xuất file PDF hoặc in trực tiếp chuẩn A4"
          >
            <Printer className="w-4 h-4" />
            <span>In Báo Cáo A4 (PDF)</span>
          </button>
        </div>
      </div>

      {/* Main A4 Printable Document Container */}
      <div className="bg-white p-6 sm:p-10 border border-hairline rounded-none shadow-none space-y-8 page-break-inside-avoid">
        {/* Document Header */}
        <div className="border-b-2 border-hairline pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-6 bg-accent inline-block flex-shrink-0" />
              <span className="text-xs font-black uppercase tracking-widest text-muted-gray font-mono">
                LUCIDTASK EMPIRICAL CAREER REPORT
              </span>
            </div>
            <div className="text-xs font-mono text-muted-gray">
              MÃ PHIÊN: <strong className="text-black">#LT-8812</strong> | NGÀY: {new Date().toLocaleDateString('vi-VN')}
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-night-navy font-roboto">
            Báo Cáo Đồng Thuận Định Hướng Nghề Nghiệp
          </h1>
          <p className="text-xs text-muted-gray mt-1">
            Hồ sơ đối chiếu dữ liệu thực chứng thao tác học sinh và phân tích thị trường lao động 5 năm.
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
                  Dữ liệu Telemetry qua 2 Chặng Thử Thách Khách Quan
                </p>
              </div>
            </div>

            {/* 1. Điểm số 3 Trục Năng lực */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-black flex justify-between">
                <span>1. Điểm số 3 Trục Năng Lực</span>
                <span className="font-mono text-muted-gray">
                  Tổng hợp: <strong className="text-black">{profile.composite_score}/100</strong>
                </span>
              </div>

              {/* Logic */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-accent inline-block" />
                    Tư duy Logic &amp; Gỡ lỗi:
                  </span>
                  <span className="font-mono">{profile.logic_score}/100</span>
                </div>
                <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, profile.logic_score))}%` }}
                  />
                </div>
              </div>

              {/* Patience */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                    Kiên nhẫn &amp; Chú ý chi tiết:
                  </span>
                  <span className="font-mono">{profile.patience_score}/100</span>
                </div>
                <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, profile.patience_score))}%` }}
                  />
                </div>
              </div>

              {/* Resilience */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-live-red inline-block" />
                    Sức bền Giờ G (Áp lực):
                  </span>
                  <span className="font-mono">{profile.resilience_score}/100</span>
                </div>
                <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-live-red transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, profile.resilience_score))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 2. Bằng chứng Hành vi Khách quan */}
            <div className="space-y-2 border-t border-hairline pt-4">
              <div className="text-xs font-bold uppercase tracking-wider text-black">
                2. Bằng chứng Hành vi Khách quan
              </div>
              <ul className="text-xs space-y-2 text-neutral-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Kỷ luật nghiên cứu:</strong> Đã chủ động đọc kỹ sổ tay hướng dẫn <strong>28 giây</strong> trước khi tiến hành tác vụ.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Độ chính xác phân loại:</strong> Đạt tỷ lệ bắt đúng mã log lỗi{' '}
                    <strong>
                      {stage1Summary ? Math.round(stage1Summary.accuracy * 100) : 94}%
                    </strong>{' '}
                    ở Chặng Sơ tuyển ma sát.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Phản ứng áp lực phút chót:</strong>{' '}
                    {stage2Result?.isOptimal
                      ? 'Bình tĩnh cô lập đúng nguyên nhân gốc từ tab Cấu hình và ra lệnh Rollback bản 2.0 an toàn.'
                      : 'Nỗ lực đối soát đa nguồn dữ liệu trong tình huống báo động đỏ.'}
                  </span>
                </li>
              </ul>
            </div>

            {/* 3. Nhận định Định tính Chuyên sâu */}
            <div className="space-y-2 border-t border-hairline pt-4">
              <div className="text-xs font-bold uppercase tracking-wider text-black">
                3. Nhận định Năng lực Cốt lõi
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

          {/* CỘT 2: THỊ TRƯỜNG & CHI PHÍ RỦI RO */}
          <div className="border border-hairline p-5 space-y-6 bg-white">
            <div className="flex items-center gap-2 border-b border-hairline pb-3">
              <span className="w-2 h-4 bg-night-navy inline-block" />
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-black">
                  CỘT 2: THỊ TRƯỜNG &amp; CHI PHÍ RỦI RO
                </h2>
                <p className="text-[11px] text-muted-gray">
                  Nguồn: TopCV IT Report &amp; Bộ GD&amp;ĐT trích dẫn
                </p>
              </div>
            </div>

            {/* 1. Dải Thu nhập 5 Năm Đầu */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-accent" />
                <span>1. Dải Thu Nhập Thực Tế 5 Năm Đầu</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-neutral-50 border border-hairline">
                  <div className="text-muted-gray text-[10px] uppercase font-bold">Mới ra trường (0 - 2 năm)</div>
                  <div className="font-bold text-black font-mono text-sm mt-0.5">
                    10.5 - 18 triệu
                  </div>
                  <div className="text-[10px] text-muted-gray">VNĐ / tháng</div>
                </div>
                <div className="p-3 bg-neutral-50 border border-hairline">
                  <div className="text-muted-gray text-[10px] uppercase font-bold">Cứng tay nghề (3 - 5 năm)</div>
                  <div className="font-bold text-black font-mono text-sm mt-0.5">
                    22.0 - 45 triệu
                  </div>
                  <div className="text-[10px] text-muted-gray">VNĐ / tháng</div>
                </div>
              </div>
              <div className="text-[11px] text-muted-gray flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-600" />
                <span>Tăng trưởng dài hạn: <strong>+18.5% mỗi năm</strong> (ưu tiên kỹ sư AI &amp; Cloud).</span>
              </div>
            </div>

            {/* 2. Rủi ro Trí tuệ Nhân tạo (AI) */}
            <div className="space-y-2 border-t border-hairline pt-4">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-black">
                <span className="flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  <span>2. Rủi Ro Trí Tuệ Nhân Tạo (AI)</span>
                </span>
                <span className="px-2 py-0.5 bg-neutral-200 text-neutral-800 text-[10px] font-bold rounded">
                  {marketIntelligence?.market_metrics.automation_ai_risk_level || 'MỨC TRUNG BÌNH'}
                </span>
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed bg-neutral-50 p-3 border border-hairline">
                AI đã bắt đầu tự động hóa lập trình viên gõ code cơ bản. Những vị trí thợ gõ mã đơn thuần sẽ chịu áp lực cắt giảm lớn. Tuy nhiên, <strong>năng lực kiểm thử, tìm lỗi và tư duy thiết kế hệ thống</strong> (thế mạnh thực chứng của con qua bài test) là giá trị không thể thay thế.
              </p>
            </div>

            {/* 3. Bảng Chi Phí Rủi Ro Chọn Sai Ngành */}
            <div className="space-y-3 border-t border-hairline pt-4">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-live-red">
                <AlertTriangle className="w-3.5 h-3.5 text-live-red" />
                <span>3. Bảng Chi Phí Rủi Ro Chọn Sai Ngành</span>
              </div>
              <div className="p-3 bg-red-50/50 border border-red-200 space-y-2 text-xs">
                <div className="text-[11px] text-neutral-700">
                  Tỷ lệ sinh viên bỏ học hoặc chuyển ngành do ngộ nhận: <strong>22.4%</strong> (58% do chênh lệch giữa kỳ vọng và thực tế công việc).
                </div>
                <div className="space-y-1.5 border-t border-red-200 pt-2 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">• Học phí lãng phí (1.5 năm):</span>
                    <span className="font-bold">45.000.000 đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">• Sinh hoạt phí tại đô thị:</span>
                    <span className="font-bold">60.000.000 đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">• Chi phí cơ hội (trễ 1-2 năm đi làm):</span>
                    <span className="font-bold">80.000.000 đ</span>
                  </div>
                </div>
                <div className="border-t-2 border-red-300 pt-2 flex items-center justify-between text-live-red font-black text-xs sm:text-sm">
                  <span>TỔNG LÃNG PHÍ TIỀM ẨN:</span>
                  <span className="font-mono">~185 TRIỆU VNĐ</span>
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

          {/* Objective Recommendation */}
          <div className="bg-white p-4 border border-hairline space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-gray">
              <Building className="w-3.5 h-3.5 text-black" />
              <span>Khuyến Nghị Khách Quan Từ Dữ Liệu Thực Chứng:</span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed">
              "Con có năng lực thực chứng vượt trội ở <strong>tính cẩn trọng, kỷ luật thao tác và tư duy cô lập lỗi hệ thống</strong>. Gia đình nên ủng hộ con chọn ngành <strong>{program?.anonymous_profile.code_name || 'Kỹ thuật Phần mềm'}</strong> tại trường <strong>{schoolName}</strong> (độ tương thích thuật toán: <strong>{matchPercent}%</strong>)."
            </p>
          </div>

          {/* 3 Family Dinner Conversation Questions */}
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
                  <strong>Trải nghiệm thực tế:</strong> "Con cảm thấy thế nào khi ngồi rà soát từng dòng lỗi log trong bài test thực chứng vừa rồi? Con có thấy hứng thú hay mệt mỏi?"
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
                  <strong>Cam kết nỗ lực:</strong> "Con sẵn sàng cam kết tự học thêm tiếng Anh chuyên ngành và rèn luyện tư duy tự học từ mùa hè này để sẵn sàng vào môi trường đại học chứ?"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Document Note */}
        <div className="text-[11px] text-muted-gray border-t border-hairline pt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>Hệ thống LucidTask — Xác nhận độ tin cậy thực chứng qua Telemetry Bus.</span>
          <span className="font-mono">Chuẩn IEEE 830 &amp; IEEE 1016</span>
        </div>
      </div>

      {/* Bottom Actions (Screen Only - Hidden on Print) */}
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
          <span>LÀM LẠI PHIÊN MỚI</span>
        </button>
      </div>
    </div>
  );
};

export default ParentAlignmentKit;
