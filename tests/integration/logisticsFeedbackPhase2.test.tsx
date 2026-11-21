import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../../src/App';

const enterLogisticsMission = () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /VÀO BẢNG ĐIỀU PHỐI LOGISTICS/i }));
  fireEvent.click(screen.getByRole('button', { name: /VÀO BÀN LÀM VIỆC NGAY/i }));
};

const updateTon = (lot: string, resource: string, tons: number) => {
  fireEvent.change(screen.getByLabelText(`${lot} - ${resource}`), { target: { value: String(tons) } });
};

describe('Logistics Phase 2: large audit and submission feedback', () => {
  it('shows a large failure dialog and highlights the exact cold-storage conflict', () => {
    enterLogisticsMission();
    fireEvent.click(screen.getByRole('button', { name: 'Chọn Lô #B, còn 14 tấn' }));
    fireEvent.click(screen.getByRole('button', { name: 'Xếp lô đang chọn vào Kho lạnh HP' }));
    fireEvent.click(screen.getByRole('button', { name: /Kiểm tra phương án/i }));

    expect(screen.getByRole('dialog', { name: 'Phương án chưa đạt' })).toBeInTheDocument();
    expect(screen.getByTestId('allocation-audit-results')).toHaveTextContent('5 tấn trái cây Lô #B');
    expect(screen.getByTestId('allocation-audit-results')).toHaveTextContent('Gợi ý sửa');
    fireEvent.click(screen.getByRole('button', { name: 'Quay lại sửa phương án' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByTestId('drop-target-COLD_STORAGE_HP').className).toContain('border-red-600');
    expect(screen.getByTestId('draggable-LOT_B').className).toContain('lt-audit-warning');

    fireEvent.click(screen.getByRole('button', { name: 'Lấy lại 1 tấn Lô #B từ Kho lạnh HP' }));
    expect(screen.getByTestId('drop-target-COLD_STORAGE_HP').className).not.toContain('lt-audit-warning');
  });

  it('keeps the misleading AI recommendation auditable without changing the evaluator', () => {
    enterLogisticsMission();
    fireEvent.click(screen.getByRole('button', { name: /AI Co-pilot: Tối ưu lịch trình/i }));
    fireEvent.click(screen.getByRole('button', { name: /Kiểm tra phương án/i }));
    expect(screen.getByRole('dialog', { name: 'Phương án chưa đạt' })).toBeInTheDocument();
    expect(screen.getByTestId('allocation-audit-results')).toHaveTextContent('vượt 3 tấn');
    fireEvent.click(screen.getByRole('button', { name: 'Quay lại sửa phương án' }));
    fireEvent.click(screen.getByRole('button', { name: /Bác bỏ & Khôi phục cấu hình an toàn/i }));
    expect(screen.getByTestId('ledger-slot-TRUCK_20FT')).toHaveTextContent('0 tấn');
  });

  it('shows success for valid basic constraints, and asks confirmation on finalize', () => {
    enterLogisticsMission();
    fireEvent.click(screen.getByRole('tab', { name: /Bảng truyền thống/i }));
    // 15+3t A, 5+5+4t B, 10t C. All basic constraints are valid.
    updateTon('Lô #A', 'Xe 20ft #1', 15);
    updateTon('Lô #A', 'Bãi chờ 03:30', 3);
    updateTon('Lô #B', 'Xe Van #1', 5);
    updateTon('Lô #B', 'Xe Van #2', 5);
    updateTon('Lô #B', 'Xe Van #3', 4);
    updateTon('Lô #C', 'Kho lạnh HP', 10);

    fireEvent.click(screen.getByRole('tab', { name: /Kéo thả \(thử nghiệm\)/i }));
    fireEvent.click(screen.getByRole('button', { name: /Kiểm tra phương án/i }));
    expect(screen.getByRole('dialog', { name: 'Rà soát hoàn tất!' })).toBeInTheDocument();
    expect(screen.getByTestId('allocation-audit-results')).toHaveTextContent('đã vượt qua bước rà soát');
    fireEvent.click(screen.getByRole('button', { name: 'Quay lại bàn điều phối' }));

    fireEvent.change(screen.getByLabelText(/Lý do chọn phương án đánh đổi/i), { target: { value: 'Ưu tiên cứu hàng B, giữ A chờ chuyến sáng mai và đảm bảo C trong kho lạnh.' } });
    fireEvent.click(screen.getByRole('button', { name: /CHỐT LỆNH ĐIỀU PHỐI/i }));
    expect(screen.getByRole('dialog', { name: 'Sẵn sàng chốt lệnh!' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Xác nhận chốt lệnh' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getAllByText(/72\.000\.000đ/i).length).toBeGreaterThanOrEqual(1);
  });

  it('warns about overloaded AI advice but still allows grading a risky submission', () => {
    enterLogisticsMission();
    fireEvent.click(screen.getByRole('button', { name: /AI Co-pilot: Tối ưu lịch trình/i }));
    fireEvent.change(screen.getByLabelText(/Lý do chọn phương án đánh đổi/i), {
      target: { value: 'Tôi cân nhắc phương án AI và muốn xem kết quả đánh giá.' },
    });
    fireEvent.click(screen.getByRole('button', { name: /CHỐT LỆNH ĐIỀU PHỐI/i }));
    expect(screen.getByRole('dialog', { name: 'Có rủi ro trước khi chốt' })).toBeInTheDocument();
    expect(screen.getByTestId('allocation-audit-results')).toHaveTextContent('vượt 3 tấn');
    fireEvent.click(screen.getByRole('button', { name: 'Vẫn chốt để nhận đánh giá' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByText(/BẠN ĐÃ DÍNH BẪY AI CO-PILOT/i)).toBeInTheDocument();
  });

  it('does not permit an incomplete plan to be submitted, but explains why in a dialog', () => {
    enterLogisticsMission();
    fireEvent.click(screen.getByRole('button', { name: /CHỐT LỆNH ĐIỀU PHỐI/i }));
    expect(screen.getByRole('dialog', { name: 'Chưa thể chốt lệnh' })).toBeInTheDocument();
    expect(screen.getByTestId('allocation-audit-results')).toHaveTextContent('Bản giải trình chưa hoàn tất');
    expect(screen.queryByRole('button', { name: /Xác nhận chốt lệnh|Vẫn chốt để nhận đánh giá/i })).not.toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
