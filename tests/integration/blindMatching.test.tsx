import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BlindMatchingCards from '../../src/components/BlindMatchingCards';
import { IndustryRegistry } from '../../src/registry/index';
import { ScoringEngine } from '../../src/engine/ScoringEngine';
import { CompetencyProfile } from '../../src/types/state';

describe('Blind Matching Invariant & Reveal Suite (IT-BLIND-01 & IT-REVEAL-01)', () => {
  const allPrograms = IndustryRegistry.getAllPrograms();
  const mockProfile: CompetencyProfile = {
    mission_id: 'IND_LOG_COLDCHAIN',
    mission_title: 'Logistics',
    logic_score: 85,
    patience_score: 90,
    resilience_score: 82,
    composite_score: 86,
    qualitative_insights: ['Cẩn trọng', 'Bình tĩnh'],
    big_five: {
      conscientiousness: 90,
      openness: 85,
      emotional_stability: 82,
      agreeableness: 78,
      extraversion: 76,
    },
    big_five_weights: { conscientiousness: 50, emotional_stability: 35, openness: 15 },
    riasec: {
      realistic: 88,
      enterprising: 79,
      conventional: 76,
      investigative: 65,
      social: 52,
      artistic: 44,
      top_code: 'R-E-C',
    },
    ai_trap_verdict: 'TRIGGERED_AND_REJECTED',
    criteria_breakdown: [],
    completed_missions_count: 1,
    confidence_level: 60,
  };

  const rankedPrograms = ScoringEngine.rankPrograms(mockProfile, allPrograms);

  it('verifies INVARIANT: real institution names MUST NOT exist in DOM before reveal (IT-BLIND-01)', () => {
    const { container } = render(
      <BlindMatchingCards
        matchedPrograms={rankedPrograms}
        selectedProgramId={null}
        onSelectProgram={vi.fn()}
        isRevealed={false}
        onReveal={vi.fn()}
        onProceedToReport={vi.fn()}
      />
    );

    expect(screen.getByText(/CHẾ ĐỘ ẨN DANH/i)).toBeInTheDocument();
    expect(screen.getByText(/THẺ ALPHA/i)).toBeInTheDocument();

    const domHtml = container.innerHTML;
    expect(domHtml).not.toContain('Đại học Giao thông Vận tải');
    expect(domHtml).not.toContain('Đại học Ngoại thương');
    expect(domHtml).not.toContain('Đại học Kinh tế Quốc dân');
    expect(domHtml).not.toContain('Đại học Bách Khoa');
    expect(domHtml).not.toContain('Đại học FPT');
    expect(domHtml).not.toContain('RMIT');
    expect(domHtml).not.toContain('Cao Thắng');
    expect(domHtml).not.toContain('Khoa học Tự nhiên');
  });

  it('triggers reveal action and renders real university names after reveal (IT-REVEAL-01)', () => {
    const onReveal = vi.fn();
    const onProceed = vi.fn();

    const { rerender } = render(
      <BlindMatchingCards
        matchedPrograms={rankedPrograms}
        selectedProgramId={rankedPrograms[0].program.id}
        onSelectProgram={vi.fn()}
        isRevealed={false}
        onReveal={onReveal}
        onProceedToReport={onProceed}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /MỞ KHÓA DANH TÍNH CƠ SỞ ĐÀO TẠO/i }));
    expect(onReveal).toHaveBeenCalledTimes(1);

    rerender(
      <BlindMatchingCards
        matchedPrograms={rankedPrograms}
        selectedProgramId={rankedPrograms[0].program.id}
        onSelectProgram={vi.fn()}
        isRevealed={true}
        onReveal={onReveal}
        onProceedToReport={onProceed}
      />
    );

    expect(screen.getByText(/DANH TÍNH ĐÃ MỞ KHÓA/i)).toBeInTheDocument();
    expect(
      screen.getByText(rankedPrograms[0].program.revealed_profile.institution_name)
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /TIẾN VÀO BÁO CÁO ĐỒNG THUẬN GIA ĐÌNH/i }));
    expect(onProceed).toHaveBeenCalledTimes(1);
  });
});
