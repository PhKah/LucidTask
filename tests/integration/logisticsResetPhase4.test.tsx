
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import LogisticsDispatchBoard from '../../src/components/missions/LogisticsDispatchBoard';
import { LOGISTICS_COLDCHAIN_SCENARIO } from '../../src/registry/logistics_coldchain/scenario';

describe('Logistics V4 merge preserves main reset behavior', () => {
  it('resets AI-related banner and rejection status', () => {
    render(<LogisticsDispatchBoard scenario={LOGISTICS_COLDCHAIN_SCENARIO} onSubmit={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /AI Co-pilot: Tối ưu lịch trình/i }));
    expect(screen.getByTestId('ai-copilot-banner')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /^Đặt lại$/i }));
    expect(screen.queryByTestId('ai-copilot-banner')).not.toBeInTheDocument();
    expect(screen.queryByText(/Đã bác bỏ đề xuất AI Co-pilot/i)).not.toBeInTheDocument();
  });
});
