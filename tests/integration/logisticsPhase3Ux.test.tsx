import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../../src/App';

function start() {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /VÀO BẢNG ĐIỀU PHỐI LOGISTICS/i }));
  fireEvent.click(screen.getByRole('button', { name: /VÀO BÀN LÀM VIỆC NGAY/i }));
}

function setTon(lot: string, resource: string, value: number) {
  fireEvent.change(screen.getByLabelText(`${lot} - ${resource}`), { target: { value: String(value) } });
}

describe('Phase 3 Logistics UX', () => {
  it('labels AI as unverified, without automatically changing the trap', () => {
    start();
    fireEvent.click(screen.getByRole('button', { name: /AI Co-pilot: Tối ưu lịch trình/i }));
    expect(screen.getByTestId('ai-copilot-banner')).toHaveTextContent('CHƯA KIỂM CHỨNG');
    expect(screen.getByTestId('ledger-slot-TRUCK_20FT')).toHaveTextContent('18 tấn');
    fireEvent.click(screen.getByRole('button', { name: /Kiểm tra phương án/i }));
    expect(screen.getByTestId('allocation-audit-results')).toHaveTextContent('vượt 3 tấn');
  });

  it('shows a consistent amber card for 108M, highlights 36M saving, and offers grounded behavior feedback', () => {
    start();
    fireEvent.click(screen.getByRole('tab', { name: /Bảng truyền thống/i }));
    setTon('Lô #A', 'Xe 20ft #1', 15);
    setTon('Lô #A', 'Bãi chờ 03:30', 3);
    setTon('Lô #B', 'Xe Van #1', 5);
    setTon('Lô #B', 'Xe Van #2', 5);
    setTon('Lô #B', 'Xe Van #3', 4);
    setTon('Lô #C', 'Kho lạnh HP', 10);
    fireEvent.change(screen.getByPlaceholderText('Nhập số triệu VNĐ'), { target: { value: '108' } });
    fireEvent.change(screen.getByLabelText(/Lý do chọn phương án đánh đổi/i), {
      target: { value: 'Tôi phân bổ đủ 42 tấn hàng, ưu tiên cứu lô B và giữ lô C trong kho lạnh.' },
    });
    fireEvent.click(screen.getByRole('button', { name: /CHỐT LỆNH ĐIỀU PHỐI/i }));
    expect(screen.getByRole('dialog', { name: 'Sẵn sàng chốt lệnh!' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Xác nhận chốt lệnh' }));
    expect(screen.getByTestId('result-actual-card')).toHaveTextContent('108.000.000đ');
    expect(screen.getByTestId('result-actual-card').className).toContain('border-amber-600');
    expect(screen.getByTestId('damage-comparison')).toHaveTextContent('36.000.000đ');
    fireEvent.click(screen.getByRole('button', { name: /XEM HỒ SƠ BIG FIVE/i }));
    expect(screen.getByTestId('behavior-card-tradeoff')).toHaveTextContent('108 triệu');
    expect(screen.getByTestId('behavior-card-tradeoff')).toHaveTextContent('CÓ THỂ CẢI THIỆN');
  });
});
