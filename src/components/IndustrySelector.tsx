import React from 'react';
import { ArrowRight, Clock, ShieldCheck, Zap } from 'lucide-react';
import { IndustryRegistry } from '../registry/index';

interface IndustrySelectorProps {
  onSelectIndustry: (industryId: string) => void;
}

export const IndustrySelector: React.FC<IndustrySelectorProps> = ({ onSelectIndustry }) => {
  const industries = IndustryRegistry.getAllIndustries();

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Editorial Headline */}
      <div className="card-hairline">
        <div className="flex items-center gap-2 mb-3">
          <span className="eyebrow-marker" />
          <span className="text-xs font-bold uppercase tracking-widest text-muted-gray">
            HƯỚNG NGHIỆP QUA TÁC VỤ THỰC CHỨNG
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-4">
          Chọn Cụm Ngành Để Bắt Đầu Chuỗi Tác Vụ Lũy Tiến
        </h1>
        <p className="text-sm text-muted-gray leading-relaxed max-w-3xl">
          LucidTask không sử dụng các câu hỏi trắc nghiệm tính cách chủ quan. Thay vào đó, bạn sẽ trực tiếp đối mặt với 
          các sự cố kỹ thuật thực tế để hệ thống đo lường khách quan tư duy giải quyết vấn đề, tính kiên nhẫn và sức bền dưới áp lực thời gian.
        </p>

        {/* 2-Stage Progression Banner */}
        <div className="mt-6 pt-6 border-t border-hairline grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-soft-gray p-4 border border-hairline flex items-start gap-3">
            <div className="w-8 h-8 rounded bg-black text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
              01
            </div>
            <div>
              <div className="text-xs font-black uppercase text-black mb-1 flex items-center gap-2">
                <span>Chặng 1: Sơ Tuyển Ma Sát (90 Giây)</span>
                <span className="badge-live-red text-[10px] py-0">BỘ LỌC SÀNG LỌC</span>
              </div>
              <p className="text-xs text-muted-gray leading-normal">
                Xử lý 8 mã log lỗi dồn dập. Nếu thao tác ẩu hoặc nhấp bừa mà không đọc quy tắc, hệ thống sẽ kích hoạt dừng sớm (Early Exit) để tránh lãng phí thời gian.
              </p>
            </div>
          </div>

          <div className="bg-soft-gray p-4 border border-hairline flex items-start gap-3">
            <div className="w-8 h-8 rounded bg-accent text-black flex items-center justify-center font-bold text-xs flex-shrink-0">
              02
            </div>
            <div>
              <div className="text-xs font-black uppercase text-black mb-1 flex items-center gap-2">
                <span>Chặng 2: Năng Lực Cốt Lõi (3.5 Phút)</span>
                <span className="bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">GIỜ G</span>
              </div>
              <p className="text-xs text-muted-gray leading-normal">
                Đối soát 3 nguồn thông tin (khiếu nại, log server, lịch sử deploy) để tìm ra nguyên nhân gốc sập cổng thanh toán Flash-Sale dưới áp lực đếm ngược.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Industry Cards Grid */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 bg-black inline-block" />
          <h2 className="text-sm font-black uppercase tracking-wider text-black">
            Danh Mục Cụm Ngành Sẵn Sàng Trải Nghiệm
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {industries.map(ind => (
            <div
              key={ind.id}
              className="card-hairline hover:border-black transition-colors flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold text-accent uppercase tracking-wider">
                    {ind.id}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-muted-gray">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Tổng thời gian: 5 phút</span>
                  </div>
                </div>

                <h3 className="text-xl font-black uppercase mb-2 group-hover:text-accent transition-colors">
                  {ind.name}
                </h3>
                <p className="text-xs text-muted-gray leading-relaxed mb-6">
                  {ind.headline}
                </p>

                <div className="space-y-2 mb-6 text-xs text-gray-700">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-live-red" />
                    <span>Thử thách 1: Phân loại mã log lỗi cổng thanh toán (90s)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-black" />
                    <span>Thử thách 2: Điều tra đứt gãy SSL và ra lệnh Rollback (210s)</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectIndustry(ind.id)}
                className="btn-pill-dark w-full justify-between"
              >
                <span>VÀO PHÒNG MÔ PHỎNG TÁC VỤ</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}

          {/* Upcoming Industry Teaser */}
          <div className="card-hairline bg-soft-gray border-dashed border-gray-300 flex flex-col justify-between opacity-75">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  IND_LOG_SCM
                </span>
                <span className="text-[11px] font-bold uppercase bg-gray-200 px-2 py-0.5 rounded text-gray-600">
                  SẮP RA MẮT (v2.0)
                </span>
              </div>

              <h3 className="text-xl font-black uppercase text-gray-500 mb-2">
                Logistics &amp; Quản Trị Chuỗi Cung Ứng
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                Điều phối đội xe, đối soát tải trọng container và giải quyết sự cố sạt lở đường vận tải biển Cát Lái.
              </p>
            </div>

            <button
              disabled
              className="btn-pill-outline w-full justify-center text-gray-400 border-gray-300 cursor-not-allowed"
            >
              CHƯA MỞ CHO ĐỢT THỰC NGHIỆM NÀY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustrySelector;
