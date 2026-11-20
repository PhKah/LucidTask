import React from 'react';
import { MessageSquare, BellRing } from 'lucide-react';
import { WorkChatMessageItem } from '../types/task';

interface WorkChatFeedProps {
  messages: WorkChatMessageItem[];
  liveReaction?: {
    sender: string;
    text: string;
    isPositive: boolean;
  } | null;
}

/**
 * Diegetic UI Workplace Chat Feed (Zalo / Slack simulation)
 * Simulates real-time stakeholder pressure and instant micro-interaction feedback.
 */
export const WorkChatFeed: React.FC<WorkChatFeedProps> = ({ messages, liveReaction }) => {
  return (
    <div className="bg-white border-2 border-black p-3.5 shadow-[4px_4px_0px_0px_#000] space-y-2.5">
      <div className="flex items-center justify-between border-b border-black pb-2">
        <div className="flex items-center gap-1.5 text-xs font-black uppercase text-black">
          <MessageSquare className="w-3.5 h-3.5 text-accent" />
          <span>KHUNG CHAT CÔNG VIỆC (ZALO / SLACK CA TRỰC)</span>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-night-navy text-white px-2 py-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          TRỰC TUYẾN
        </span>
      </div>

      <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`p-2.5 border text-xs leading-snug ${
              msg.urgency === 'URGENT'
                ? 'border-black bg-amber-50'
                : 'border-hairline bg-neutral-50'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-black text-[11px] uppercase text-black">
                {msg.sender}
              </span>
              {msg.urgency === 'URGENT' && (
                <span className="badge-live-red text-[9px] py-0 px-1.5">
                  <BellRing className="w-2.5 h-2.5" />
                  GẤP
                </span>
              )}
            </div>
            <p className="text-neutral-800">{msg.text}</p>
          </div>
        ))}

        {liveReaction && (
          <div
            className={`p-2.5 border-2 border-black text-xs animate-fadeIn ${
              liveReaction.isPositive ? 'bg-emerald-50' : 'bg-red-50'
            }`}
          >
            <div className="font-black text-[11px] uppercase text-black mb-0.5">
              💬 {liveReaction.sender} (Phản hồi tức thì):
            </div>
            <p className="font-semibold text-black">{liveReaction.text}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkChatFeed;
