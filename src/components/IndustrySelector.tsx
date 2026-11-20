import React from 'react';
import { ArrowRight, Clock, ShieldCheck, Zap, CheckCircle2, Sparkles } from 'lucide-react';
import { IndustryRegistry } from '../registry/index';

interface IndustrySelectorProps {
  onSelectIndustry: (industryId: string) => void;
  completedIndustryIds?: string[];
  completedMicroTasksCount?: number;
}

const INDUSTRY_TASK_PREVIEWS: Record<
  string,
  { task1: string; task2: string; badge: string }
> = {
  IND_TECH_SW: {
    badge: 'ĐỀ XUẤT BẮT ĐẦU (DATA / CNTT)',
    task1: 'Micro-Task 1 (90s): Đóng dấu kiểm duyệt 8 đơn hàng Trà sữa lỗi nhập liệu & kết nối',
    task2: 'Micro-Task 2 (210s): Phòng chat cứu sập cổng thanh toán Flash-Sale & Rollback',
  },
  IND_ECON_LAW: {
    badge: 'PHÁP CHẾ & HỢP ĐỒNG',
    task1: 'Micro-Task 3 (90s): Soi 3 quy định công ty bắt bẫy câu chữ trong 8 thỏa thuận sự kiện',
    task2: 'Micro-Task 4 (210s): Ghim bằng chứng email bác bỏ yêu cầu phạt cọc 200 triệu',
  },
  IND_MARKETING: {
    badge: 'TRUYỀN THÔNG & SỰ KIỆN',
    task1: 'Micro-Task 5 (90s): Quẹt thẻ cân đối ngân sách 10 triệu kéo 500 khách sự kiện trường',
    task2: 'Micro-Task 6 (210s): Xoay chuyển tình thế khi Ca sĩ khách mời hủy show sát giờ G',
  },
};

export const IndustrySelector: React.FC<IndustrySelectorProps> = ({
  onSelectIndustry,
  completedIndustryIds = [],
  completedMicroTasksCount = 0,
}) => {
  const industries = IndustryRegistry.getAllIndustries();
  const confidencePercent = Math.min(100, Math.round((completedMicroTasksCount / 5) * 100));

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Editorial Hero Introduction */}
      <div className="card-hairline border-2 border-black shadow-[4px_4px_0px_0px_#000]">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="eyebrow-marker" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-gray">
              HƯỚNG NGHIỆP QUA TÁC VỤ THỰC CHỨNG (DIEGETIC WORKPLACE SIMULATOR)
            </span>
          </div>

          <div className="inline-flex items-center gap-2 bg-night-navy text-white px-3 py-1 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>
              TIẾN ĐỘ THƯ VIỆN: {completedMicroTasksCount} / 5 MICRO-TASKS (ĐỘ TIN CẬY: {confidencePercent}%)
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-3">
          Chọn Cụm Ngành Để Bắt Đầu Chuỗi Tác Vụ Lũy Tiến
        </h1>
        <p className="text-sm text-muted-gray leading-relaxed max-w-3xl">
          Không cần kiến thức đại học, không làm trắc nghiệm lý thuyết. Bạn sẽ trực tiếp ngồi vào bàn làm việc giả lập (đóng dấu hồ sơ theo SOP 3 dòng, quẹt thẻ cân đối nguồn lực và xử lý khung chat công việc) để hệ thống đo lường khách quan khung tính cách <strong>Big Five (OCEAN)</strong> và môi trường nghề nghiệp <strong>Holland RIASEC</strong>.
        </p>

        {/* 2-Stage Pipeline & 5 Micro-Task Loop Overview */}
        <div className="mt-6 pt-6 border-t border-hairline grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-soft-gray p-4 border border-black flex items-start gap-3">
            <div className="w-8 h-8 rounded bg-black text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
              01
            </div>
            <div>
              <div className="text-xs font-black uppercase text-black mb-1 flex items-center gap-2">
                <span>Chặng 1: Sơ Tuyển Ma Sát (90 Giây)</span>
                <span className="badge-live-red text-[10px] py-0">BỘ LỌC SÀNG LỌC</span>
              </div>
              <p className="text-xs text-muted-gray leading-normal">
                Đối chiếu Bảng quy định SOP 3 dòng để đóng dấu hoặc quẹt thẻ 8 hồ sơ công việc. Mọi quyết định đều làm biến động 3 thanh chỉ số đánh đổi (Chất lượng - Sếp/Khách - Tinh thần).
              </p>
            </div>
          </div>

          <div className="bg-soft-gray p-4 border border-black flex items-start gap-3">
            <div className="w-8 h-8 rounded bg-accent text-black flex items-center justify-center font-bold text-xs flex-shrink-0">
              02
            </div>
            <div>
              <div className="text-xs font-black uppercase text-black mb-1 flex items-center gap-2">
                <span>Chặng 2: Năng Lực Cốt Lõi (3.5 Phút)</span>
                <span className="bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                  WAR ROOM &amp; BIG FIVE
                </span>
              </div>
              <p className="text-xs text-muted-gray leading-normal">
                Xử lý khung chat Zalo/Slack khẩn cấp, ghim bằng chứng từ 3 Tab dữ liệu và hoàn thành tối thiểu 5 Micro-Tasks trong thư viện để đạt độ chính xác Big Five &amp; RIASEC cao nhất.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Industry Cards Grid (3 Complete Careers = 6 Micro-Tasks) */}
      <div>
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-black inline-block" />
            <h2 className="text-sm font-black uppercase tracking-wider text-black">
              Thư Viện 3 Cụm Ngành Đời Thường (6 Micro-Tasks Thực Chứng)
            </h2>
          </div>
          <span className="text-xs text-muted-gray">
            Khuyến khích bắt đầu từ ngành bạn quan tâm nhất, sau đó làm thêm các ngành gợi ý
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {industries.map((ind, idx) => {
            const preview = INDUSTRY_TASK_PREVIEWS[ind.id] || INDUSTRY_TASK_PREVIEWS.IND_TECH_SW;
            const isCompleted = completedIndustryIds.includes(ind.id);
            const isPrimary = idx === 0;

            return (
              <div
                key={ind.id}
                className="card-hairline border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:bg-neutral-50 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-black bg-accent text-black px-2 py-0.5 border border-black uppercase tracking-wider">
                      {preview.badge}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-gray">
                      <Clock className="w-3.5 h-3.5" />
                      <span>2 Micro-Tasks</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="text-lg font-black uppercase group-hover:text-accent transition-colors">
                      {ind.name}
                    </h3>
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-600">
                        <CheckCircle2 className="w-3 h-3" />
                        ĐÃ XONG
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-muted-gray leading-relaxed mb-5">
                    {ind.headline}
                  </p>

                  <div className="space-y-2.5 mb-6 text-xs text-gray-800 bg-soft-gray p-3 border border-hairline">
                    <div className="flex items-start gap-2">
                      <Zap className="w-3.5 h-3.5 text-live-red flex-shrink-0 mt-0.5" />
                      <span>{preview.task1}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-black flex-shrink-0 mt-0.5" />
                      <span>{preview.task2}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectIndustry(ind.id)}
                  className="btn-pill-dark w-full justify-between text-xs"
                >
                  <span>
                    {isPrimary
                      ? 'VÀO PHÒNG MÔ PHỎNG TÁC VỤ'
                      : `KHÁM PHÁ MICRO-TASK: ${ind.id}`}
                  </span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Upcoming Expansion Module Teaser */}
        <div className="mt-6 card-hairline bg-soft-gray border-dashed border-gray-300 flex flex-col sm:flex-row items-center justify-between gap-4 opacity-80">
          <div>
            <span className="text-[11px] font-bold uppercase text-gray-500">
              MỞ RỘNG THƯ VIỆN POST-MVP (IND_LOG_SCM &amp; IND_HEALTH)
            </span>
            <p className="text-xs text-muted-gray">
              Các Micro-Task Cân bằng tải trọng Logistics và Phân luồng Y tế đang được hiệu chỉnh.
            </p>
          </div>
          <button disabled className="btn-pill-outline text-xs flex-shrink-0">
            CHƯA MỞ CHO ĐỢT THỰC NGHIỆM NÀY
          </button>
        </div>
      </div>
    </div>
  );
};

export default IndustrySelector;
