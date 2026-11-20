import React from 'react';
import { Activity, BookOpen, RefreshCw } from 'lucide-react';

interface AppShellProps {
  industryName?: string;
  onResetSession?: () => void;
  onOpenHandbook?: () => void;
  hasHandbook?: boolean;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  industryName,
  onResetSession,
  onOpenHandbook,
  hasHandbook = false,
  children,
}) => {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-roboto">
      {/* Al Jazeera Editorial Hard-News Header Bar */}
      <header
        role="banner"
        className="bg-night-navy text-white px-6 py-3 border-b border-black flex items-center justify-between no-print sticky top-0 z-30"
      >
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-accent flex-shrink-0" />
          <button
            onClick={onResetSession}
            className="font-black text-lg tracking-wider uppercase font-roboto text-left hover:opacity-90 flex items-center gap-2"
          >
            <span>LUCIDTASK</span>
            <span className="text-accent text-xs font-normal">v1.0 MVP</span>
          </button>
          {industryName && (
            <>
              <span className="text-gray-500">|</span>
              <span className="text-xs uppercase tracking-wide text-gray-200 font-bold hidden sm:inline">
                {industryName}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs">
          {hasHandbook && onOpenHandbook && (
            <button
              onClick={onOpenHandbook}
              className="inline-flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1.5 rounded-[18px] border border-gray-600 transition-colors"
              title="Tra cứu Sổ tay Quy tắc"
            >
              <BookOpen className="w-3.5 h-3.5 text-accent" />
              <span className="font-bold hidden sm:inline">Sổ Tay</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded border border-gray-700">
            <span className="w-2 h-2 rounded-full bg-live-red animate-pulse" />
            <span className="text-gray-300 font-mono text-[11px] hidden md:inline">
              TELEMETRY: ACTIVE (&lt;50ms)
            </span>
            <Activity className="w-3.5 h-3.5 text-live-red md:hidden" />
          </div>

          {onResetSession && (
            <button
              onClick={onResetSession}
              className="text-gray-400 hover:text-white transition-colors p-1"
              title="Khởi động lại phiên làm việc"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-hairline py-4 px-6 text-center text-xs text-muted-gray no-print">
        LucidTask — Nền tảng Hướng nghiệp Thực chứng © 2026. Kiến trúc theo chuẩn IEEE 830 &amp; IEEE 1016.
      </footer>
    </div>
  );
};

export default AppShell;

