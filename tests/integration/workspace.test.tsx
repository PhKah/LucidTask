import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import TaskWorkspace from '../../src/components/TaskWorkspace';
import CountdownTimer from '../../src/components/CountdownTimer';
import { IndustryRegistry } from '../../src/registry/index';
import { telemetryBus } from '../../src/engine/TelemetryBus';

describe('Sprint 2 Workspace Integration Tests (IT-WORK-01 & IT-WORK-02)', () => {
  beforeEach(() => {
    telemetryBus.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders Stage 1 TriageClassifier, updates progress, and publishes item_classified (IT-WORK-01)', () => {
    const stage1Task = IndustryRegistry.getStageTask('IND_TECH_SW', 1)!;
    const onStage1Complete = vi.fn();
    const onStage2Complete = vi.fn();
    const onEarlyExit = vi.fn();

    render(
      <TaskWorkspace
        currentStage={1}
        task={stage1Task}
        onStage1Complete={onStage1Complete}
        onStage2Complete={onStage2Complete}
        onEarlyExit={onEarlyExit}
      />
    );

    // Verify initial Stepper & Task Header
    expect(screen.getByText(/Chặng 1: Ma Sát/i)).toBeInTheDocument();
    expect(screen.getByText(/Mã Log Cần Xử Lý:/i)).toBeInTheDocument();
    expect(screen.getByText('1 / 8')).toBeInTheDocument();

    // Click Bin 1: Lỗi Kết Nối Mạng
    const binConnBtn = screen.getByRole('button', { name: /Thùng 1: Lỗi Kết Nối Mạng/i });
    fireEvent.click(binConnBtn);

    // Verify progress advanced to 2 / 8
    expect(screen.getByText('2 / 8')).toBeInTheDocument();

    // Verify TelemetryBus received item_classified
    const events = telemetryBus.getEventsByType('item_classified');
    expect(events.length).toBe(1);
    expect(events[0].payload.item_id).toBe('TICKET-01');
    expect(events[0].payload.target_id).toBe('CONN_ERR');
    expect(events[0].payload.is_correct).toBe(true);
  });

  it('turns countdown timer border red and triggers stress_spike_entered when time <= 60s (IT-WORK-02)', () => {
    const onTimeUp = vi.fn();

    render(
      <CountdownTimer
        initialSeconds={65}
        isRunning={true}
        onTimeUp={onTimeUp}
        pendingTasksCount={4}
      />
    );

    const timerElem = screen.getByRole('timer');
    expect(timerElem).toHaveTextContent('01:05');
    expect(timerElem).not.toHaveClass('border-live-red');

    // Advance timer by 6 seconds (from 65s down to 59s)
    act(() => {
      vi.advanceTimersByTime(6000);
    });

    expect(timerElem).toHaveTextContent('00:59');
    expect(timerElem).toHaveClass('border-live-red');
    expect(screen.getByText(/GIỜ G/i)).toBeInTheDocument();

    // Verify telemetry stress spike event
    const stressEvents = telemetryBus.getEventsByType('stress_spike_entered');
    expect(stressEvents.length).toBe(1);
    expect(stressEvents[0].payload.remaining_sec).toBe(60);
    expect(stressEvents[0].payload.pending_tasks).toBe(4);
  });

  it('opens and closes HandbookDrawer and records handbook_viewed event', () => {
    const stage1Task = IndustryRegistry.getStageTask('IND_TECH_SW', 1)!;

    render(
      <TaskWorkspace
        currentStage={1}
        task={stage1Task}
        onStage1Complete={vi.fn()}
        onStage2Complete={vi.fn()}
        onEarlyExit={vi.fn()}
      />
    );

    // Open handbook
    const handbookBtn = screen.getByRole('button', { name: /Sổ Tay/i });
    fireEvent.click(handbookBtn);

    expect(screen.getByText(/SỔ TAY QUY TẮC NGHIỆP VỤ/i)).toBeInTheDocument();

    // Advance time while reading
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // Close handbook
    const closeBtn = screen.getByRole('button', { name: /ĐÃ HIỂU QUY TẮC/i });
    fireEvent.click(closeBtn);

    // Verify handbook event
    const handbookEvents = telemetryBus.getEventsByType('handbook_viewed');
    expect(handbookEvents.length).toBe(1);
    expect(handbookEvents[0].payload.view_count).toBe(1);
  });

  it('renders MultiSourceInspector in Stage 2 and handles tab switching and rollback action', () => {
    const stage2Task = IndustryRegistry.getStageTask('IND_TECH_SW', 2)!;
    const onStage2Complete = vi.fn();

    render(
      <TaskWorkspace
        currentStage={2}
        task={stage2Task}
        onStage1Complete={vi.fn()}
        onStage2Complete={onStage2Complete}
        onEarlyExit={vi.fn()}
      />
    );

    expect(screen.getByText(/Chặng 2: Năng Lực/i)).toBeInTheDocument();
    expect(screen.getByText(/1\. Khiếu Nại Khách Hàng/i)).toBeInTheDocument();

    // Switch to Tab 3: Lịch Sử Deploy
    const deployTabBtn = screen.getByRole('button', { name: /3\. Lịch Sử Deploy/i });
    fireEvent.click(deployTabBtn);

    expect(screen.getAllByText(/Bản build v2\.1/i).length).toBeGreaterThanOrEqual(1);

    const tabEvents = telemetryBus.getEventsByType('tab_switched');
    expect(tabEvents.length).toBe(1);
    expect(tabEvents[0].payload.to_tab).toBe('TAB_DEPLOY');

    // Select the Rollback Action radio button
    const rollbackRadio = screen.getByRole('radio', { name: /ROLLBACK/i });
    fireEvent.click(rollbackRadio);

    // Confirm action
    const confirmBtn = screen.getByRole('button', { name: /XÁC NHẬN RA LỆNH XỬ LÝ/i });
    fireEvent.click(confirmBtn);

    expect(onStage2Complete).toHaveBeenCalledWith(
      'ACTION_ROLLBACK',
      true,
      expect.objectContaining({ tabSwitches: 1 })
    );
  });

  it('triggers onEarlyExit when user makes multiple incorrect triage classifications', () => {
    const stage1Task = IndustryRegistry.getStageTask('IND_TECH_SW', 1)!;
    const onStage1Complete = vi.fn();
    const onEarlyExit = vi.fn();

    render(
      <TaskWorkspace
        currentStage={1}
        task={stage1Task}
        onStage1Complete={onStage1Complete}
        onStage2Complete={vi.fn()}
        onEarlyExit={onEarlyExit}
      />
    );

    // Click Bin 2 (DATA_ERR) repeatedly for all 8 items
    // (Only 4 items are DATA_ERR, 4 items are CONN_ERR, so accuracy = 4/8 = 50% < 60%)
    for (let i = 0; i < 8; i++) {
      const dataErrBtn = screen.getByRole('button', { name: /Thùng 2: Lỗi Dữ Liệu/i });
      fireEvent.click(dataErrBtn);
    }

    // Since accuracy is 50% < 60%, onEarlyExit must be triggered with LOW_ACCURACY
    expect(onEarlyExit).toHaveBeenCalledWith(
      'LOW_ACCURACY',
      0.5,
      expect.any(Number)
    );
    expect(onStage1Complete).not.toHaveBeenCalled();
  });
});
