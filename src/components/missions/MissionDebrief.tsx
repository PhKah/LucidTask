import React from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Bot,
  ShieldCheck,
  RotateCcw,
  Award,
} from 'lucide-react';
import {
  AiTrapVerdict,
  LogisticsEvaluationResult,
  MissionEvaluationResult,
  QaEvaluationResult,
} from '../../types/mission';

interface MissionDebriefProps {
  evaluation: MissionEvaluationResult;
  onProceedToMatching: () => void;
  onRetryMission: () => void;
}

const formatVnd = (amount: number): string =>
  `${new Intl.NumberFormat('vi-VN').format(amount)}đ`;

const renderAiVerdictBanner = (verdict: AiTrapVerdict, isLogistics: boolean) => {
  if (verdict === 'TRIGGERED_AND_REJECTED') {
    return (
      <div className="bg-emerald-50 border-2 border-emerald-700 p-4 flex items-start gap-3">
        <ShieldCheck className="w-6 h-6 text-emerald-700 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="text-xs font-black uppercase text-emerald-800">
            KIỂM TOÁN CẠM BẪY AI CO-PILOT: PHẢN BIỆN ĐỘC LẬP XUẤT SẮC (+ĐIỂM OPENNESS)
          </div>
          <p className="text-xs text-emerald-950 leading-relaxed">
            {isLogistics
              ? 'Bạn đã bật AI Co-pilot nhưng không bị đánh lừa bởi lời hứa "0đ phạt SLA". Bạn phát hiện AI gian lận xếp 18 tấn lên xe 15 tấn và đã chủ động bác bỏ để giữ cấu hình vật lý an toàn!'
              : 'Bạn đã chạy AI Auto-QA nhưng không tin mù quáng vào kết luận "an toàn 100%". Bạn tự phát hiện lỗi bỏ sót, gỡ đơn báo nhầm và giữ vững quyết định kiểm soát chất lượng!'}
          </p>
        </div>
      </div>
    );
  }

  if (verdict === 'TRIGGERED_AND_ACCEPTED') {
    return (
      <div className="bg-red-50 border-2 border-live-red p-4 flex items-start gap-3">
        <Bot className="w-6 h-6 text-live-red flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="text-xs font-black uppercase text-live-red">
            CẢNH BÁO PHỤ THUỘC AI: BẠN ĐÃ DÍNH BẪY AI CO-PILOT!
          </div>
          <p className="text-xs text-red-950 leading-relaxed">
            {isLogistics
              ? 'AI Co-pilot đã cố tình nhồi 18 tấn Lô #A lên chiếc Xe tải lạnh 20ft chỉ có định mức 15 tấn (quá tải +3 tấn) để vẽ ra kịch bản "0đ tiền phạt" giả tạo. Trong thực tế, xe quá tải sẽ bị phạt giao thông, nguy cơ lật xe và hỏng dàn lạnh toàn bộ lô cá hồi 5,4 tỷ!'
              : 'AI Auto-QA đã bỏ sót 4 lỗi dữ liệu kín (ngày 30/02, sai phép tính, 2 cặp đơn trùng), báo oan 1 đơn sạch (DH-1107), bỏ qua hoàn toàn lỗ hổng trừ tiền ví ở Bước 5 nhưng vẫn giục bạn DUYỆT RELEASE!'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-soft-gray border-2 border-black p-4 flex items-start gap-3">
      <ShieldCheck className="w-6 h-6 text-black flex-shrink-0 mt-0.5" />
      <div className="space-y-1">
        <div className="text-xs font-black uppercase text-black">
          KIỂM TOÁN ĐỘ PHỤ THUỘC AI: TỰ CHỦ ĐỘC LẬP 100%
        </div>
        <p className="text-xs text-neutral-800 leading-relaxed">
          Bạn hoàn thành toàn bộ quy trình phân tích và chốt phương án bằng tư duy độc lập mà không cần kích hoạt nút hỗ trợ AI Co-pilot.
        </p>
      </div>
    </div>
  );
};

const LogisticsAuditDetails: React.FC<{ ev: LogisticsEvaluationResult }> = ({ ev }) => (
  <div className="space-y-6">
    {/* Financial Damage Comparison */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 border-2 border-black bg-white">
        <div className="text-[11px] font-bold uppercase text-muted-gray">
          Thiệt hại từ phương án của bạn
        </div>
        <div
          className={`text-xl font-mono font-black mt-1 ${
            ev.totalFinancialDamageVnd <= 72_000_000 && ev.overloadViolationsCount === 0
              ? 'text-emerald-700'
              : 'text-live-red'
          }`}
        >
          {formatVnd(ev.totalFinancialDamageVnd)}
        </div>
        <div className="text-[11px] text-muted-gray mt-1">
          Phạt SLA: {formatVnd(ev.slaPenaltyVnd)} • Hỏng hàng: {formatVnd(ev.spoilageDamageVnd)}
        </div>
        <div className="mt-2 pt-2 border-t border-hairline text-[11px]">
          {ev.estimatedDamageMillionVnd !== undefined && ev.estimatedDamageMillionVnd !== null ? (
            <span className="font-bold text-black">
              Số bạn tự tính trước đó:{' '}
              <span className="font-mono">
                {ev.estimatedDamageMillionVnd} triệu VNĐ
              </span>
              {Math.abs(ev.estimatedDamageMillionVnd * 1_000_000 - ev.totalFinancialDamageVnd) <=
              3_000_000
                ? ' (Khớp chuẩn!)'
                : ' (Lệch so với thực tế)'}
            </span>
          ) : (
            <span className="text-amber-800 font-semibold">
              Bạn đã bỏ trống ô tự tính thiệt hại trước khi chốt lệnh.
            </span>
          )}
        </div>
      </div>

      <div className="p-4 border-2 border-emerald-700 bg-emerald-50">
        <div className="text-[11px] font-bold uppercase text-emerald-800">
          Mức tối ưu chuẩn (Giữ 2t Cá hồi #A)
        </div>
        <div className="text-xl font-mono font-black text-emerald-800 mt-1">
          72.000.000đ
        </div>
        <div className="text-[11px] text-emerald-900 mt-1">
          2 tấn × 12 giờ × 3tr SLA (0đ hỏng hàng — Tiết kiệm 88 triệu!)
        </div>
      </div>

      <div className="p-4 border border-hairline bg-soft-gray">
        <div className="text-[11px] font-bold uppercase text-muted-gray">
          Phương án sai phổ biến (Giữ 2t Trái cây #B)
        </div>
        <div className="text-xl font-mono font-black text-neutral-700 mt-1">
          160.000.000đ
        </div>
        <div className="text-[11px] text-muted-gray mt-1">
          2 tấn × 80tr hỏng 100% do quá 12h ngoài bãi / âm độ kho đông
        </div>
      </div>
    </div>

    {/* Vehicle Physical Capacity Audit Table */}
    <div className="border-2 border-black bg-white overflow-x-auto">
      <div className="bg-night-navy text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider">
        Bảng Kiểm Toán Tải Trọng Vật Lý & Kho Bãi (Hạng mục 3/4)
      </div>
      <table className="w-full text-xs text-left">
        <thead className="bg-soft-gray border-b border-black font-black uppercase text-[11px]">
          <tr>
            <th className="px-4 py-2.5">Phương tiện / Điểm lưu giữ</th>
            <th className="px-4 py-2.5 text-right">Đã xếp</th>
            <th className="px-4 py-2.5 text-right">Định mức tối đa</th>
            <th className="px-4 py-2.5 text-right">Kết luận vật lý</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-hairline">
          {ev.vehicleAudits.map(row => (
            <tr key={row.resourceId} className={row.isOverloaded ? 'bg-red-50' : ''}>
              <td className="px-4 py-2.5 font-bold text-black">{row.resourceName}</td>
              <td className="px-4 py-2.5 text-right font-mono font-bold">{row.assignedTons} tấn</td>
              <td className="px-4 py-2.5 text-right font-mono text-muted-gray">
                {row.maxCapacityTons !== null ? `${row.maxCapacityTons} tấn` : 'Bãi chờ'}
              </td>
              <td className="px-4 py-2.5 text-right font-black">
                {row.isOverloaded ? (
                  <span className="text-live-red">
                    QUÁ TẢI +{row.overloadAmount} TẤN
                  </span>
                ) : (
                  <span className="text-emerald-700">AN TOÀN</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {ev.contingencyPlanText && ev.contingencyPlanText.trim().length > 0 && (
      <div className="bg-soft-gray border border-black p-3.5 text-xs space-y-1">
        <div className="font-black uppercase text-[11px] text-black">
          Bản giải trình bạn đã gửi Giám Đốc Vận Hành:
        </div>
        <p className="text-neutral-800 italic leading-relaxed">"{ev.contingencyPlanText}"</p>
      </div>
    )}
  </div>
);

const QaAuditDetails: React.FC<{ ev: QaEvaluationResult }> = ({ ev }) => (
  <div className="space-y-6">
    {/* Precision / Recall Summary */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 border-2 border-black bg-white">
        <div className="text-[11px] font-bold uppercase text-muted-gray">
          Săn lỗi Bảng 15 Đơn hàng
        </div>
        <div className="text-xl font-mono font-black text-black mt-1">
          {ev.dataBugsCaughtExact} / {ev.totalExpectedDataBugs} lỗi chính xác
        </div>
        <div className="text-[11px] text-muted-gray mt-1">
          Lệch loại thẻ: {ev.dataBugsWrongCategory} • Báo nhầm đơn sạch: {ev.dataFalsePositives}
        </div>
      </div>

      <div className="p-4 border-2 border-black bg-white">
        <div className="text-[11px] font-bold uppercase text-muted-gray">
          Sơ đồ Luồng Thanh toán (7 bước)
        </div>
        <div className="text-xl font-mono font-black text-black mt-1">
          {ev.flowBugsCaught} / {ev.totalExpectedFlowBugs} lỗ hổng logic
        </div>
        <div className="text-[11px] text-muted-gray mt-1">
          Đánh dấu nhầm bước sạch: {ev.flowFalsePositives}
        </div>
        {ev.tabSwitchCount === 0 && (
          <div className="text-[11px] font-bold text-live-red mt-1">
            Cảnh báo: Bạn đã chốt lệnh mà chưa mở Tab 2 (Sơ đồ luồng)!
          </div>
        )}
      </div>

      <div
        className={`p-4 border-2 ${
          ev.releaseDecisionCorrect
            ? 'border-emerald-700 bg-emerald-50'
            : 'border-live-red bg-red-50'
        }`}
      >
        <div className="text-[11px] font-bold uppercase text-neutral-700">
          Quyết định Release 20:00
        </div>
        <div
          className={`text-lg font-black mt-1 ${
            ev.releaseDecisionCorrect ? 'text-emerald-800' : 'text-live-red'
          }`}
        >
          {ev.releaseDecisionCorrect
            ? 'CHẶN RELEASE — ĐÚNG'
            : ev.releaseDecision === null
              ? 'CHƯA CHỐT RELEASE (HẾT GIỜ) — SAI'
              : 'DUYỆT RELEASE — SAI'}
        </div>
        <div className="text-[11px] text-neutral-700 mt-1">
          Bắt buộc chặn vì còn lỗ hổng âm tiền & trừ ví không hoàn!
        </div>
      </div>
    </div>

    {/* Compact Bug Audit Breakdown */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="border-2 border-black bg-white overflow-x-auto">
        <div className="bg-night-navy text-white px-4 py-2 text-xs font-black uppercase">
          Đối soát 8 Đơn hàng có lỗi & Báo nhầm
        </div>
        <div className="divide-y divide-hairline max-h-64 overflow-y-auto text-xs">
          {ev.orderAudits
            .filter(r => r.status !== 'CLEAN_OK')
            .map(row => (
              <div key={row.orderCode} className="p-3 flex items-start justify-between gap-3">
                <div>
                  <div className="font-mono font-black text-black">{row.orderCode}</div>
                  <div className="text-[11px] text-muted-gray mt-0.5">{row.explanation}</div>
                </div>
                <span
                  className={`px-2 py-0.5 text-[10px] font-black uppercase flex-shrink-0 ${
                    row.status === 'TRUE_POSITIVE'
                      ? 'bg-emerald-100 text-emerald-800'
                      : row.status === 'WRONG_CATEGORY'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-live-red'
                  }`}
                >
                  {row.status === 'TRUE_POSITIVE'
                    ? 'BẮT ĐÚNG'
                    : row.status === 'WRONG_CATEGORY'
                      ? 'LỆCH THẺ'
                      : row.status === 'FALSE_POSITIVE'
                        ? 'BÁO NHẦM'
                        : 'BỎ SÓT'}
                </span>
              </div>
            ))}
        </div>
      </div>

      <div className="border-2 border-black bg-white overflow-x-auto">
        <div className="bg-night-navy text-white px-4 py-2 text-xs font-black uppercase">
          Đối soát Sơ đồ Luồng Tiếng Việt (Bước lỗi)
        </div>
        <div className="divide-y divide-hairline text-xs">
          {ev.flowAudits
            .filter(r => r.hasLogicBug || r.status === 'FALSE_POSITIVE')
            .map(row => (
              <div key={row.stepNumber} className="p-3 flex items-start justify-between gap-3">
                <div>
                  <div className="font-bold text-black">
                    Bước {row.stepNumber}: {row.title}
                  </div>
                  <div className="text-[11px] text-muted-gray mt-0.5">{row.explanation}</div>
                </div>
                <span
                  className={`px-2 py-0.5 text-[10px] font-black uppercase flex-shrink-0 ${
                    row.status === 'CAUGHT_EXACT'
                      ? 'bg-emerald-100 text-emerald-800'
                      : row.status === 'CAUGHT_PARTIAL'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-live-red'
                  }`}
                >
                  {row.status === 'CAUGHT_EXACT'
                    ? 'BẮT ĐÚNG'
                    : row.status === 'CAUGHT_PARTIAL'
                      ? 'CHƯA RÕ LÝ DO'
                      : row.status === 'FALSE_POSITIVE'
                        ? 'BÁO NHẦM'
                        : 'BỎ SÓT'}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>

    {ev.bugReportNote && ev.bugReportNote.trim().length > 0 && (
      <div className="bg-soft-gray border border-black p-3.5 text-xs space-y-1">
        <div className="font-black uppercase text-[11px] text-black">
          Bản báo cáo lỗi bạn đã gửi Đội Kỹ Thuật:
        </div>
        <p className="text-neutral-800 italic leading-relaxed">"{ev.bugReportNote}"</p>
      </div>
    )}
  </div>
);

export const MissionDebrief: React.FC<MissionDebriefProps> = ({
  evaluation,
  onProceedToMatching,
  onRetryMission,
}) => {
  const isLogistics = evaluation.missionId === 'IND_LOG_COLDCHAIN';

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner (Closure & Catharsis) */}
      <div className="bg-white border-2 border-black shadow-[6px_6px_0px_0px_#000] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="eyebrow-marker" />
            <span className="text-xs font-black uppercase tracking-widest text-muted-gray">
              BIÊN BẢN ĐỐI SOÁT KẾT QUẢ THỰC CHỨNG (DEBRIEF)
            </span>
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-black">
            {isLogistics
              ? 'Kết Quả Lệnh Điều Phối Chuỗi Cung Ứng Lạnh'
              : 'Kết Quả Kiểm Thử Dữ Liệu & Luồng Thanh Toán'}
          </h1>
          <p className="text-xs text-muted-gray mt-1">
            Toàn bộ tiêu chí chấm ngầm đã được mở khóa để bạn đối chiếu trực tiếp với phương án chuẩn nghề nghiệp.
          </p>
        </div>

        <div className="bg-night-navy text-white px-5 py-3 border-2 border-black flex items-center gap-3 self-start sm:self-auto">
          <Award className="w-6 h-6 text-accent" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-300">
              ĐIỂM HIỆU SUẤT NHIỆM VỤ
            </div>
            <div className="font-mono text-2xl font-black leading-none mt-0.5">
              {evaluation.scores.composite} <span className="text-xs text-accent">/ 100</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Co-pilot Trap Verdict */}
      {renderAiVerdictBanner(evaluation.aiTrapVerdict, isLogistics)}

      {/* Mission-Specific Detailed Audit */}
      {isLogistics ? (
        <LogisticsAuditDetails ev={evaluation} />
      ) : (
        <QaAuditDetails ev={evaluation} />
      )}

      {/* Criteria Checklist */}
      <div className="space-y-3">
        <h2 className="text-xs font-black uppercase tracking-wider text-black">
          Chi Tiết Đánh Giá Theo Từng Tiêu Chí Nghề Nghiệp (Ẩn Trong Lúc Chơi):
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {evaluation.criteria.map(crit => (
            <div
              key={crit.id}
              className={`p-4 border-2 bg-white space-y-1.5 ${
                crit.status === 'PASS'
                  ? 'border-emerald-700'
                  : crit.status === 'PARTIAL'
                    ? 'border-amber-500'
                    : 'border-live-red'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-black uppercase text-black">{crit.label}</span>
                {crit.status === 'PASS' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                ) : crit.status === 'PARTIAL' ? (
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-live-red flex-shrink-0" />
                )}
              </div>
              <div className="text-xs font-bold text-neutral-900">{crit.summary}</div>
              <p className="text-[11px] text-muted-gray leading-relaxed">{crit.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t-2 border-black">
        <button
          onClick={onRetryMission}
          className="btn-pill-outline text-xs py-3 px-6 flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>THỬ LẠI NHIỆM VỤ NÀY</span>
        </button>

        <button
          onClick={onProceedToMatching}
          className="btn-pill-dark text-sm py-3.5 px-8 bg-black text-white hover:bg-neutral-800 group"
        >
          <span>XEM HỒ SƠ BIG FIVE / RIASEC &amp; GHÉP NỐI TRƯỜNG ẨN DANH</span>
          <ArrowRight className="w-4 h-4 ml-2 text-accent group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default MissionDebrief;
