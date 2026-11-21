import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  AlertTriangle,
  ArrowRight,
  CheckCheck,
  CheckCircle2,
  ClipboardCheck,
  CornerDownLeft,
  ShieldAlert,
  X,
} from 'lucide-react';
import { AllocationCheckMessage } from '../../engine/logisticsDragDrop';

export type LogisticsFeedbackMode = 'AUDIT' | 'SUBMIT';

interface LogisticsFeedbackModalProps {
  mode: LogisticsFeedbackMode;
  messages: AllocationCheckMessage[];
  canSubmit: boolean;
  onClose: () => void;
  onFinalize: () => void;
}

/**
 * Large, explicit feedback window for the Phase 2 experiment.
 * This window does not change the evaluator's scores or override the user's choices.
 * It appears only after the user presses Audit or Finalize, never for every drop.
 */
const LogisticsFeedbackModal: React.FC<LogisticsFeedbackModalProps> = ({
  mode,
  messages,
  canSubmit,
  onClose,
  onFinalize,
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const errors = messages.filter(message => message.type === 'error');
  const hasErrors = errors.length > 0;
  const isPositive = !hasErrors;
  const isAudit = mode === 'AUDIT';
  const isBlocked = !isAudit && !canSubmit;

  const title = isAudit
    ? (hasErrors ? 'Phương án chưa đạt' : 'Rà soát hoàn tất!')
    : isBlocked
      ? 'Chưa thể chốt lệnh'
      : hasErrors
        ? 'Có rủi ro trước khi chốt'
        : 'Sẵn sàng chốt lệnh!';
  const subtitle = isAudit
    ? (hasErrors
      ? `Tìm thấy ${errors.length} vấn đề. Các vị trí liên quan sẽ được đánh dấu trên bàn điều phối để bạn sửa.`
      : 'Các ràng buộc cơ bản về số lượng, tải trọng và bảo quản đều đạt. Bạn đã sẵn sàng bước sang phần giải trình.')
    : isBlocked
      ? 'Bạn cần hoàn tất số lượng hàng và phần giải trình trước khi gửi đánh giá cuối ca.'
      : hasErrors
        ? 'Hệ thống phát hiện rủi ro. Bạn có thể quay lại chỉnh sửa, hoặc vẫn nộp để nhận đánh giá từ nhiệm vụ.'
        : 'Tất cả các kiểm tra cơ bản đều đạt. Xác nhận để gửi phương án tới phần đánh giá cuối ca.';

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusables = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusables.length < 1) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = oldOverflow;
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-[#070818]/80 backdrop-blur-[3px] lt-modal-backdrop"
      data-testid="logistics-feedback-overlay"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="logistics-feedback-title"
        aria-describedby="logistics-feedback-description"
        ref={dialogRef}
        data-testid="logistics-feedback-modal"
        className="relative w-full max-w-[760px] max-h-[min(92vh,800px)] overflow-y-auto bg-white border-[3px] border-black shadow-[9px_9px_0px_rgba(250,144,0,0.85)] lt-modal-enter"
      >
        <div className="flex items-center justify-between bg-night-navy px-4 sm:px-6 py-3 text-white">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-black uppercase tracking-[0.12em]">
            <span className="w-2.5 h-2.5 bg-accent" aria-hidden="true" />
            LucidTask / {isAudit ? 'Rà soát điều phối' : 'Chốt lệnh điều phối'}
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            type="button"
            aria-label="Đóng cửa sổ phản hồi"
            className="p-1.5 border border-white/40 hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={`border-b-[3px] ${isPositive ? 'border-emerald-700 bg-emerald-50' : 'border-red-600 bg-red-50'} px-5 sm:px-7 py-6 sm:py-7`}>
          <div className="flex gap-4 sm:gap-5 items-start">
            <div className={`shrink-0 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 border-2 border-black ${isPositive ? 'bg-emerald-700 text-white lt-icon-success' : 'bg-red-600 text-white lt-icon-warning'}`}>
              {isPositive ? <CheckCircle2 className="w-8 h-8" strokeWidth={2.5} /> : <ShieldAlert className="w-8 h-8" strokeWidth={2.5} />}
            </div>
            <div className="min-w-0 space-y-2">
              <div className={`text-[11px] font-black uppercase tracking-widest ${isPositive ? 'text-emerald-800' : 'text-red-700'}`}>
                {isPositive ? 'ĐÃ KIỂM TRA' : isBlocked ? 'THIẾU ĐIỀU KIỆN' : 'CẦN KIỂM TRA LẠI'}
              </div>
              <h2 id="logistics-feedback-title" className="text-2xl sm:text-3xl font-black uppercase leading-tight text-black">{title}</h2>
              <p id="logistics-feedback-description" className="text-sm text-neutral-800 leading-relaxed">{subtitle}</p>
            </div>
          </div>
        </div>

        <div className="px-5 sm:px-7 py-5 space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className={`inline-flex items-center gap-1.5 border-2 px-3 py-1.5 ${isPositive ? 'border-emerald-700 text-emerald-800 bg-emerald-50' : 'border-red-600 text-red-700 bg-red-50'}`}>
              {isPositive ? <CheckCheck className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              {isPositive ? '0 lỗi cơ bản' : `${errors.length} vấn đề cần chú ý`}
            </span>
            <span className="inline-flex gap-1.5 items-center border border-neutral-300 px-3 py-2 text-neutral-700">
              <ClipboardCheck className="w-3.5 h-3.5" />
              Kiểm tra theo kịch bản 42 tấn
            </span>
          </div>

          <div className="space-y-2 max-h-[36vh] overflow-y-auto pr-1" data-testid="allocation-audit-results">
            {hasErrors ? errors.map((message, index) => (
              <div key={message.id} className="flex gap-3 p-3 sm:p-4 bg-white border-l-4 border-red-600 border-y border-r border-neutral-200 lt-error-card" style={{ animationDelay: `${Math.min(index, 6) * 65}ms` }}>
                <span className="shrink-0 w-7 h-7 grid place-items-center bg-red-100 text-red-700 font-mono font-black text-xs">{String(index + 1).padStart(2, '0')}</span>
                <div className="space-y-1 min-w-0">
                  <h3 className="font-black text-sm text-neutral-900">{message.title || 'Vấn đề cần xử lý'}</h3>
                  <p className="text-xs leading-relaxed text-neutral-800">{message.text}</p>
                  {message.suggestion && <p className="text-xs leading-relaxed text-red-800"><strong>Gợi ý sửa:</strong> {message.suggestion}</p>}
                </div>
              </div>
            )) : (
              <div className="flex gap-3 p-4 border border-emerald-700 bg-emerald-50">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-700" />
                <div>
                  <div className="font-black text-sm text-emerald-900">Phân bổ đã vượt qua bước rà soát</div>
                  <p className="text-xs text-emerald-900 leading-relaxed mt-1">
                    Đã kiểm tra đủ 3 lô, sức chứa các phương tiện và các rủi ro nhiệt độ cơ bản. Hãy tự cân nhắc chi phí vận hành, phạt SLA và giải trình phương án.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="text-[11px] border-t border-hairline pt-3 text-neutral-600 leading-relaxed">
            {hasErrors
              ? 'Các thẻ lô hàng hoặc điểm đến có liên quan sẽ được viền đỏ sau khi bạn đóng cửa sổ. Đề xuất sửa chỉ mang tính gợi ý, không tự động thay đổi quyết định của bạn.'
              : 'Rà soát này không đồng nghĩa với điểm nghề nghiệp tuyệt đối hay kết quả đánh giá cuối nhiệm vụ.'}
          </div>
        </div>

        <div className="sticky bottom-0 bg-soft-gray border-t-2 border-black px-5 sm:px-7 py-4 flex flex-col-reverse sm:flex-row justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 border-2 border-black bg-white hover:bg-neutral-100 px-4 py-3 text-xs sm:text-sm font-black text-black"
          >
            <CornerDownLeft className="w-4 h-4" />
            {hasErrors ? 'Quay lại sửa phương án' : 'Quay lại bàn điều phối'}
          </button>
          {!isAudit && canSubmit && (
            <button
              type="button"
              onClick={onFinalize}
              className={`inline-flex items-center justify-center gap-2 border-2 border-black px-4 py-3 text-xs sm:text-sm font-black ${hasErrors ? 'bg-amber-400 text-black hover:bg-amber-300' : 'bg-emerald-700 text-white hover:bg-emerald-800'}`}
            >
              {hasErrors ? <AlertTriangle className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              {hasErrors ? 'Vẫn chốt để nhận đánh giá' : 'Xác nhận chốt lệnh'}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LogisticsFeedbackModal;
