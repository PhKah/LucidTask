import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import App from '../../src/App';
import ParentAlignmentKit from '../../src/components/ParentAlignmentKit';
import { CompetencyProfile, ProgramMatchResult } from '../../src/types/state';
import { IndustryRegistry } from '../../src/registry/index';

describe('Sprint 4: Parent Alignment Kit & E2E Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.print = vi.fn();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  const mockProfile: CompetencyProfile = {
    logic_score: 88,
    patience_score: 92,
    resilience_score: 75,
    composite_score: 85,
    qualitative_insights: [
      'Khả năng tư duy logic phản biện sắc sảo, tự cô lập lỗi độc lập.',
      'Độ tập trung cao độ, không bị xao nhãng bởi các cảnh báo giả.',
    ],
    early_exit_triggered: false,
  };

  const allPrograms = IndustryRegistry.getAllPrograms();
  const mockMatchedPrograms: ProgramMatchResult[] = allPrograms.map((p, idx) => ({
    program: p,
    match_percentage: idx === 0 ? 91 : 84 - idx * 5,
    is_revealed: true,
    rank: idx + 1,
  }));

  const mockIndustry = IndustryRegistry.getIndustry('IND_TECH_SW');

  it('IT-REPORT-01: renders 2-column comparative layout, 185M risk, and 3 dinner questions', () => {
    render(
      <ParentAlignmentKit
        profile={mockProfile}
        matchedPrograms={mockMatchedPrograms}
        selectedProgramId={mockMatchedPrograms[0].program.id}
        marketIntelligence={mockIndustry?.marketIntelligence}
        stage1Summary={{
          accuracy: 0.94,
          totalItems: 8,
          correctCount: 7,
          durationSeconds: 45,
        }}
        stage2Result={{
          actionId: 'ACT_SWE_ROLLBACK',
          isOptimal: true,
          stats: { tabSwitches: 3, panicClicks: 0 },
        }}
        onBackToBlindMatching={vi.fn()}
        onResetSession={vi.fn()}
      />
    );

    // Assert Column 1 & Column 2 Headers
    expect(screen.getByText(/CỘT 1: NĂNG LỰC THỰC CHỨNG CON/i)).toBeInTheDocument();
    expect(screen.getByText(/CỘT 2: THỊ TRƯỜNG & CHI PHÍ RỦI RO/i)).toBeInTheDocument();

    // Assert 3-Axis Scores
    expect(screen.getByText('88/100')).toBeInTheDocument();
    expect(screen.getByText('92/100')).toBeInTheDocument();
    expect(screen.getByText('75/100')).toBeInTheDocument();

    // Assert 185M VND Risk Calculation
    expect(screen.getByText(/185 TRIỆU VNĐ/i)).toBeInTheDocument();
    expect(screen.getByText(/45.000.000 đ/i)).toBeInTheDocument();
    expect(screen.getByText(/60.000.000 đ/i)).toBeInTheDocument();
    expect(screen.getByText(/80.000.000 đ/i)).toBeInTheDocument();

    // Assert AI Risk
    expect(screen.getByText(/RỦI RO TRÍ TUỆ NHÂN TẠO/i)).toBeInTheDocument();
    expect(screen.getByText(/AI đã bắt đầu tự động hóa lập trình viên gõ code cơ bản/i)).toBeInTheDocument();

    // Assert Alignment Zone & 3 Dinner Conversation Questions
    expect(screen.getByText(/VÙNG ĐỒNG THUẬN GIA ĐÌNH/i)).toBeInTheDocument();
    expect(screen.getByText(/3 Câu Hỏi Gợi Mở Đối Thoại Bữa Tối Gia Đình/i)).toBeInTheDocument();
    expect(screen.getByText(/Con cảm thấy thế nào khi ngồi rà soát từng dòng lỗi log/i)).toBeInTheDocument();
    expect(screen.getByText(/Mức học phí/i)).toBeInTheDocument();
    expect(screen.getByText(/Con sẵn sàng cam kết tự học thêm tiếng Anh chuyên ngành/i)).toBeInTheDocument();
  });

  it('IT-PRINT-01: triggers window.print when print button is clicked', () => {
    render(
      <ParentAlignmentKit
        profile={mockProfile}
        matchedPrograms={mockMatchedPrograms}
        selectedProgramId={mockMatchedPrograms[0].program.id}
        marketIntelligence={mockIndustry?.marketIntelligence}
        onBackToBlindMatching={vi.fn()}
        onResetSession={vi.fn()}
      />
    );

    const printButtons = screen.getAllByRole('button', { name: /IN BÁO CÁO A4 \(PDF\)/i });
    expect(printButtons.length).toBeGreaterThanOrEqual(1);

    fireEvent.click(printButtons[0]);
    expect(window.print).toHaveBeenCalledTimes(1);
  });

  it('IT-SHARE-01: copies summary text when share button is clicked', async () => {
    render(
      <ParentAlignmentKit
        profile={mockProfile}
        matchedPrograms={mockMatchedPrograms}
        selectedProgramId={mockMatchedPrograms[0].program.id}
        marketIntelligence={mockIndustry?.marketIntelligence}
        onBackToBlindMatching={vi.fn()}
        onResetSession={vi.fn()}
      />
    );

    const shareButtons = screen.getAllByRole('button', { name: /CHIA SẺ ZALO/i });
    fireEvent.click(shareButtons[0]);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      expect.stringContaining('Báo cáo Đồng thuận Hướng nghiệp LucidTask')
    );
  });

  it('E2E-UAT-02: executes complete 2-stage task flow to revealed parent alignment report', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    render(<App />);

    // Step 1: User starts on IDLE screen with IndustrySelector
    expect(
      screen.getByText(/Chọn Cụm Ngành Để Bắt Đầu Chuỗi Tác Vụ Lũy Tiến/i)
    ).toBeInTheDocument();
    const startButton = screen.getByRole('button', {
      name: /VÀO PHÒNG MÔ PHỎNG TÁC VỤ/i,
    });
    fireEvent.click(startButton);

    // Step 2: Moves into STAGE1_TASK
    expect(screen.getByText(/Chặng 1: Ma Sát/i)).toBeInTheDocument();

    // Classify all 8 items with deliberate pacing (2.0s per item to pass Gatekeeper)
    // 8 items expected targets: 1, 1, 1, 2, 2, 2, 1, 2
    const targetSequence = [1, 1, 1, 2, 2, 2, 1, 2];

    for (let i = 0; i < 8; i++) {
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      if (targetSequence[i] === 1) {
        const bin1 = screen.getByRole('button', {
          name: /Thùng 1: Lỗi Kết Nối Mạng/i,
        });
        fireEvent.click(bin1);
      } else {
        const bin2 = screen.getByRole('button', {
          name: /Thùng 2: Lỗi Dữ Liệu/i,
        });
        fireEvent.click(bin2);
      }
    }

    // Step 3: Transition to STAGE2_TASK
    expect(screen.getByText(/Chặng 2: Năng Lực/i)).toBeInTheDocument();

    // Find and select the optimal resolution action: Rollback build v2.0
    const rollbackRadio = screen.getByRole('radio', { name: /ROLLBACK/i });
    fireEvent.click(rollbackRadio);

    // Confirm execution
    const confirmBtn = screen.getByRole('button', {
      name: /XÁC NHẬN RA LỆNH XỬ LÝ/i,
    });
    fireEvent.click(confirmBtn);

    // Step 4: Transitions to BLIND_MATCHING
    expect(
      screen.getByText(/Hồ Sơ Năng Lực 3 Trục Đo Khách Quan/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/CHẾ ĐỘ ẨN DANH \(BLIND MODE\)/i)
    ).toBeInTheDocument();

    // IT-BLIND-01 Invariant check: Real university name is NOT in DOM
    expect(document.body.innerHTML).not.toContain('Đại học Bách Khoa');
    expect(document.body.innerHTML).not.toContain('Đại học FPT');
    expect(document.body.innerHTML).not.toContain('RMIT');

    // Click Unlock button
    const unlockBtn = screen.getByRole('button', {
      name: /MỞ KHÓA DANH TÍNH CƠ SỞ ĐÀO TẠO/i,
    });
    fireEvent.click(unlockBtn);

    // IT-REVEAL-01: Real school names now visible
    expect(screen.getByText(/Đại học Bách Khoa \(ĐHQG\)/i)).toBeInTheDocument();

    // Click Proceed to Family Report button
    const proceedBtn = screen.getByRole('button', {
      name: /TIẾN VÀO BÁO CÁO ĐỒNG THUẬN GIA ĐÌNH/i,
    });
    fireEvent.click(proceedBtn);

    // Step 5: Transition to REVEALED_REPORT (ParentAlignmentKit)
    expect(
      screen.getByText(/BÁO CÁO ĐỒNG THUẬN ĐỊNH HƯỚNG NGHỀ NGHIỆP/i)
    ).toBeInTheDocument();

    // Verify 185M risk and alignment zone
    expect(screen.getByText(/185 TRIỆU VNĐ/i)).toBeInTheDocument();
    expect(screen.getByText(/VÙNG ĐỒNG THUẬN GIA ĐÌNH/i)).toBeInTheDocument();
    expect(
      screen.getByText(/3 Câu Hỏi Gợi Mở Đối Thoại Bữa Tối Gia Đình/i)
    ).toBeInTheDocument();

    vi.useRealTimers();
  });
});
