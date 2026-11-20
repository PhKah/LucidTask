import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../src/App';
import TaskWorkspace from '../../src/components/TaskWorkspace';
import CompetencyRadar from '../../src/components/CompetencyRadar';
import { IndustryRegistry } from '../../src/registry/index';
import { ScoringEngine } from '../../src/engine/ScoringEngine';

describe('Sprint 6: Diegetic UI, 3 Specific Careers (6 Micro-Tasks), Big Five & RIASEC', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('IT-DIEGETIC-01: loads all 3 specific industries (Data/IT, Economic Law, Marketing) with 6 Micro-Tasks', () => {
    const industries = IndustryRegistry.getAllIndustries();
    expect(industries.length).toBe(3);
    expect(industries.map(i => i.id)).toEqual([
      'IND_TECH_SW',
      'IND_ECON_LAW',
      'IND_MARKETING',
    ]);

    // Verify Economic Law tasks & programs
    const lawStage1 = IndustryRegistry.getStageTask('IND_ECON_LAW', 1)!;
    const lawStage2 = IndustryRegistry.getStageTask('IND_ECON_LAW', 2)!;
    const lawPrograms = IndustryRegistry.getPrograms('IND_ECON_LAW');
    expect(lawStage1.work_items?.length).toBe(8);
    expect(lawStage2.investigation_sources?.length).toBe(3);
    expect(lawPrograms.length).toBeGreaterThanOrEqual(3);

    // Verify Marketing tasks & programs
    const mktStage1 = IndustryRegistry.getStageTask('IND_MARKETING', 1)!;
    const mktStage2 = IndustryRegistry.getStageTask('IND_MARKETING', 2)!;
    const mktPrograms = IndustryRegistry.getPrograms('IND_MARKETING');
    expect(mktStage1.work_items?.length).toBe(8);
    expect(mktStage2.investigation_sources?.length).toBe(3);
    expect(mktPrograms.length).toBeGreaterThanOrEqual(3);
  });

  it('IT-DIEGETIC-02: renders 3 Trade-off Bars, Pinned 3-Line SOP Rulebook, Work Chat Feed and supports A/D hotkeys', () => {
    const lawStage1 = IndustryRegistry.getStageTask('IND_ECON_LAW', 1)!;

    render(
      <TaskWorkspace
        currentStage={1}
        task={lawStage1}
        onStage1Complete={vi.fn()}
        onStage2Complete={vi.fn()}
        onEarlyExit={vi.fn()}
      />
    );

    // Assert 3 Trade-off Bars
    expect(
      screen.getByText(/HỆ THỐNG 3 THANH CHỈ SỐ ĐÁNH ĐỔI LAO ĐỘNG/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/1\. Chất Lượng \/ Độ Chuẩn/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. Hài Lòng Sếp \/ Khách/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. Tinh Thần & Sức Bền/i)).toBeInTheDocument();

    // Assert Pinned 3-Line SOP Rulebook & Work Chat Feed
    expect(screen.getByText(/BẢNG QUY ĐỊNH SOP 3 DÒNG \(ĐỀ MỞ\)/i)).toBeInTheDocument();
    expect(screen.getByText(/KHUNG CHAT CÔNG VIỆC/i)).toBeInTheDocument();
    expect(screen.getByText(/Chị Lan \(Trưởng Phòng Pháp Chế\)/i)).toBeInTheDocument();

    // Assert initial item is LAW-01 (1 / 8)
    expect(screen.getByText('1 / 8')).toBeInTheDocument();

    // Trigger keyboard shortcut 'A' to stamp item 1
    fireEvent.keyDown(window, { key: 'a' });

    // Progress advances to 2 / 8 and Boss live reaction appears
    expect(screen.getByText('2 / 8')).toBeInTheDocument();
    expect(screen.getByText(/Phản hồi tức thì/i)).toBeInTheDocument();
  });

  it('IT-DIEGETIC-03: allows pinning evidence lines in Stage 2 MultiSourceInspector War Room', () => {
    const mktStage2 = IndustryRegistry.getStageTask('IND_MARKETING', 2)!;

    render(
      <TaskWorkspace
        currentStage={2}
        task={mktStage2}
        onStage1Complete={vi.fn()}
        onStage2Complete={vi.fn()}
        onEarlyExit={vi.fn()}
      />
    );

    expect(screen.getByText(/Bằng chứng đã ghim: 0/i)).toBeInTheDocument();

    // Click on a line of evidence to pin it
    const budgetEvidence = screen.getByText(/3\.000\.000 VNĐ tiền mặt/i);
    fireEvent.click(budgetEvidence);

    expect(screen.getByText(/Bằng chứng đã ghim: 1/i)).toBeInTheDocument();
    expect(screen.getByText(/BẢNG BẰNG CHỨNG ĐÃ GHIM \(1\)/i)).toBeInTheDocument();
  });

  it('IT-DIEGETIC-04: computes Big Five (OCEAN), Holland RIASEC and renders 5-Micro-Task Adaptive Loop', () => {
    const profile = ScoringEngine.generateCompetencyProfile(
      { accuracy: 0.9, rootCauseIsolated: true, optimalPathTaken: true },
      { handbookReadingMs: 18000, tabSwitchCount: 4 },
      { errorRateNormal: 0.1, errorRateStress: 0.1, panicClicksCount: 0 },
      0.88,
      false,
      4
    );

    expect(profile.big_five).toBeDefined();
    expect(profile.riasec).toBeDefined();
    expect(profile.completed_micro_tasks_count).toBe(4);
    expect(profile.confidence_level).toBe(80);
    expect(profile.riasec?.top_code).toMatch(/^[RIASEC]-[RIASEC]-[RIASEC]$/);

    const onStartRecommended = vi.fn();
    render(
      <CompetencyRadar
        profile={profile}
        recommendedNextIndustry={{
          id: 'IND_MARKETING',
          name: 'Marketing & Quản Trị Truyền Thông Sự Kiện',
          headline: 'Tối ưu ngân sách truyền thông',
        }}
        onStartRecommendedIndustry={onStartRecommended}
      />
    );

    expect(
      screen.getByText(/4 \/ 5 MICRO-TASKS HOÀN THÀNH \(ĐỘ TIN CẬY: 80%\)/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Nền Tảng Tâm Lý Học Big Five \(OCEAN\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Khung Môi Trường Nghề Nghiệp RIASEC/i)).toBeInTheDocument();

    const recBtn = screen.getByRole('button', {
      name: /LÀM TIẾP: Marketing & Quản Trị Truyền Thông Sự Kiện/i,
    });
    fireEvent.click(recBtn);
    expect(onStartRecommended).toHaveBeenCalledWith('IND_MARKETING');
  });

  it('IT-DIEGETIC-05: renders all 3 industry cards on home screen and allows launching Economic Law', () => {
    render(<App />);

    expect(screen.getByText(/Khoa học Dữ liệu & Công nghệ Thông tin|Kỹ thuật Phần mềm & Công nghệ Thông tin/i)).toBeInTheDocument();
    expect(screen.getByText(/Luật Kinh Tế & Pháp Chế Doanh Nghiệp/i)).toBeInTheDocument();
    expect(screen.getByText(/Marketing & Quản Trị Truyền Thông Sự Kiện/i)).toBeInTheDocument();

    const lawBtn = screen.getByRole('button', {
      name: /KHÁM PHÁ MICRO-TASK: IND_ECON_LAW/i,
    });
    fireEvent.click(lawBtn);

    expect(
      screen.getByText(/Micro-Task 3: Bàn Kiểm Duyệt Bẫy Hợp Đồng/i)
    ).toBeInTheDocument();
  });
});
