import React from 'react';
import { Activity, ShieldCheck, ArrowRight } from 'lucide-react';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-roboto">
      {/* Al Jazeera Hard-News Top Console Bar */}
      <header className="bg-night-navy text-white px-6 py-3 border-b border-black flex items-center justify-between no-print">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-accent flex-shrink-0" />
          <span className="font-black text-lg tracking-wider uppercase font-roboto">
            LUCIDTASK <span className="text-accent text-xs font-normal">v1.0 MVP</span>
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-live-red animate-pulse" />
            <span className="text-gray-300 font-mono">TELEMETRY: ACTIVE (&lt;50ms)</span>
          </div>
          <span className="text-gray-500">|</span>
          <span className="text-gray-400">ĐỀ TÀI ĐMST 2026</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
        <div className="card-hairline mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="eyebrow-marker" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-gray">
              NỀN TẢNG HƯỚNG NGHIỆP THỰC CHỨNG
            </span>
          </div>
          <h1 className="text-3xl font-black mb-4 uppercase tracking-tight">
            Trải Nghiệm Tác Vụ Thực Tế &amp; Ghép Nối Chương Trình Đào Tạo Ẩn Danh
          </h1>
          <p className="text-muted-gray leading-relaxed mb-6 max-w-3xl">
            Thay thế các bài trắc nghiệm tính cách cảm tính bằng chuỗi vi tác vụ kỹ thuật thực tế. 
            Đo lường độ kiên nhẫn, tư duy logic và sức bền dưới áp lực thời gian để đối soát khách quan với thị trường lao động.
          </p>

          <div className="flex flex-wrap gap-4 items-center">
            <button className="btn-pill-dark group">
              <span>BẮT ĐẦU TRẢI NGHIỆM</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="btn-pill-outline">
              XEM BẢN ĐẶC TẢ
            </button>
            <div className="badge-live-red ml-auto">
              CHẾ ĐỘ SƠ TUYỂN MA SÁT (90S)
            </div>
          </div>
        </div>

        {/* 3 Core Pillars Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-hairline">
            <div className="flex items-center gap-2 mb-2 font-black text-sm uppercase text-accent">
              <Activity className="w-4 h-4" />
              <span>Chặng 1: Ma Sát (90s)</span>
            </div>
            <p className="text-xs text-muted-gray leading-relaxed">
              Bộ lọc sàng lọc sớm Gatekeeper. Phát hiện thao tác click ẩu và thiếu kiên nhẫn để kích hoạt dừng sớm.
            </p>
          </div>

          <div className="card-hairline">
            <div className="flex items-center gap-2 mb-2 font-black text-sm uppercase text-accent">
              <ShieldCheck className="w-4 h-4" />
              <span>Chặng 2: Năng Lực (3.5m)</span>
            </div>
            <p className="text-xs text-muted-gray leading-relaxed">
              Thách thức giải quyết sự cố đa biến số. Đối soát 3 tab nhật ký hệ thống dưới áp lực đếm ngược.
            </p>
          </div>

          <div className="card-hairline">
            <div className="flex items-center gap-2 mb-2 font-black text-sm uppercase text-accent">
              <span className="w-2.5 h-2.5 bg-black" />
              <span>Blind Matching</span>
            </div>
            <p className="text-xs text-muted-gray leading-relaxed">
              Che toàn bộ thương hiệu trường đại học. Ghép nối dựa trên % tương thích và mở khóa sau khi chọn.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-hairline py-4 px-6 text-center text-xs text-muted-gray no-print">
        LucidTask — Nền tảng Hướng nghiệp Thực chứng © 2026. Kiến trúc theo chuẩn IEEE 830 &amp; IEEE 1016.
      </footer>
    </div>
  );
};

export default App;

