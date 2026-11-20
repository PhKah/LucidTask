import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BlindMatchingCards from '../../src/components/BlindMatchingCards';
import { IndustryRegistry } from '../../src/registry/index';
import { ScoringEngine } from '../../src/engine/ScoringEngine';

describe('Blind Matching Invariant & Reveal Suite (IT-BLIND-01 & IT-REVEAL-01)', () => {
  const allPrograms = IndustryRegistry.getAllPrograms();
  const mockProfile = {
    logic_score: 85,
    patience_score: 90,
    resilience_score: 75,
    composite_score: 82.5,
    qualitative_insights: ['Cẩn trọng', 'Bình tĩnh'],
    early_exit_triggered: false,
  };

  const rankedPrograms = ScoringEngine.rankPrograms(mockProfile, allPrograms);

  it('verifies INVARIANT: real institution names MUST NOT exist in DOM before reveal (IT-BLIND-01)', () => {
    const onSelectProgram = vi.fn();
    const onReveal = vi.fn();
    const onProceed = vi.fn();

    const { container } = render(
      <BlindMatchingCards
        matchedPrograms={rankedPrograms}
        selectedProgramId={null}
        onSelectProgram={onSelectProgram}
        isRevealed={false}
        onReveal={onReveal}
        onProceedToReport={onProceed}
      />
    );

    // Verify anonymous indicators and match percentages exist
    expect(screen.getByText(/CHẾ ĐỘ ẨN DANH/i)).toBeInTheDocument();
    expect(screen.getByText(/THẺ ALPHA/i)).toBeInTheDocument();
    expect(screen.getAllByText(/TƯƠNG THÍCH/i).length).toBeGreaterThanOrEqual(1);

    // DOM INVARIANT ASSERTION: Zero leakage of real university names in DOM HTML
    const domHtml = container.innerHTML;
    expect(domHtml).not.toContain('Đại học Bách Khoa');
    expect(domHtml).not.toContain('Đại học FPT');
    expect(domHtml).not.toContain('RMIT');
    expect(domHtml).not.toContain('Cao Thắng');
    expect(domHtml).not.toContain('Khoa học Tự nhiên');
    expect(domHtml).not.toContain('Kinh tế TP.HCM');
  });

  it('triggers reveal action and renders real university names after reveal (IT-REVEAL-01)', () => {
    const onSelectProgram = vi.fn();
    const onReveal = vi.fn();
    const onProceed = vi.fn();

    const { rerender } = render(
      <BlindMatchingCards
        matchedPrograms={rankedPrograms}
        selectedProgramId={rankedPrograms[0].program.id}
        onSelectProgram={onSelectProgram}
        isRevealed={false}
        onReveal={onReveal}
        onProceedToReport={onProceed}
      />
    );

    // Click Unlock button
    const unlockBtn = screen.getByRole('button', { name: /MỞ KHÓA DANH TÍNH CƠ SỞ ĐÀO TẠO/i });
    fireEvent.click(unlockBtn);
    expect(onReveal).toHaveBeenCalledTimes(1);

    // Re-render in revealed state
    rerender(
      <BlindMatchingCards
        matchedPrograms={rankedPrograms}
        selectedProgramId={rankedPrograms[0].program.id}
        onSelectProgram={onSelectProgram}
        isRevealed={true}
        onReveal={onReveal}
        onProceedToReport={onProceed}
      />
    );

    // Now real university names and tuition details MUST be in DOM
    expect(screen.getByText(/DANH TÍNH ĐÃ MỞ KHÓA/i)).toBeInTheDocument();
    expect(screen.getByText(rankedPrograms[0].program.revealed_profile.institution_name)).toBeInTheDocument();
    expect(screen.getAllByText(/Học Phí Ước Tính:/i).length).toBeGreaterThanOrEqual(1);

    // Verify next step button
    const proceedBtn = screen.getByRole('button', { name: /TIẾN VÀO BÁO CÁO ĐỒNG THUẬN GIA ĐÌNH/i });
    expect(proceedBtn).toBeInTheDocument();
    fireEvent.click(proceedBtn);
    expect(onProceed).toHaveBeenCalledTimes(1);
  });
});
