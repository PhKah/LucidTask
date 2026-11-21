import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../src/App';

describe('E2E Integration: Logistics Cold-Chain Dispatch Flow (Passive Ledger + AI Trap Override)', () => {
  it('completes full flow: Briefing -> AI Trap Trigger -> Passive 18t check -> Reject AI -> Optimal 42t -> Debrief (72M) -> Blind Matching -> A4 Report', () => {
    render(<App />);

    // 1. Select Logistics Mission
    fireEvent.click(screen.getByRole('button', { name: /VÀO BẢNG ĐIỀU PHỐI LOGISTICS/i }));
    expect(screen.getByText(/Điều Phối Chuỗi Cung Ứng Lạnh/i)).toBeInTheDocument();

    // 2. Start from Briefing
    fireEvent.click(screen.getByRole('button', { name: /VÀO BÀN LÀM VIỆC NGAY/i }));
    expect(screen.getByTestId('passive-resource-ledger')).toBeInTheDocument();

    // 3. Trigger AI Co-pilot Trap (Hạng mục 4/4)
    fireEvent.click(screen.getByRole('button', { name: /AI Co-pilot: Tối ưu lịch trình/i }));
    expect(screen.getByTestId('ai-copilot-banner')).toBeInTheDocument();

    // Verify PASSIVE LEDGER INVARIANT (Hạng mục 3/4): shows raw "18 tấn" with NO red overload warning text
    const ledger = screen.getByTestId('passive-resource-ledger');
    expect(screen.getByTestId('ledger-slot-TRUCK_20FT')).toHaveTextContent('18 tấn');
    expect(ledger.textContent).not.toMatch(/QUÁ TẢI/i);

    // 4. Reject & Override AI Co-pilot
    fireEvent.click(
      screen.getByRole('button', { name: /Bác bỏ & Khôi phục cấu hình an toàn/i })
    );
    expect(screen.queryByTestId('ai-copilot-banner')).not.toBeInTheDocument();
    expect(screen.getByTestId('ledger-slot-TRUCK_20FT')).toHaveTextContent('0 tấn');

    // Phase 1 branch: use legacy +/- table for the original integration scenario.
    fireEvent.click(screen.getByRole('tab', { name: /Bảng truyền thống/i }));

    // 5. Manually enter optimal 42-ton allocation
    fireEvent.change(screen.getByLabelText('Lô #A - Xe 20ft #1'), { target: { value: '15' } });
    fireEvent.change(screen.getByLabelText('Lô #A - Xe Van #1'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('Lô #A - Bãi chờ 03:30'), { target: { value: '2' } });

    fireEvent.change(screen.getByLabelText('Lô #B - Xe Van #1'), { target: { value: '4' } });
    fireEvent.change(screen.getByLabelText('Lô #B - Xe Van #2'), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText('Lô #B - Xe Van #3'), { target: { value: '5' } });

    fireEvent.change(screen.getByLabelText('Lô #C - Kho lạnh HP'), { target: { value: '10' } });

    expect(ledger).toHaveTextContent('42 / 42 tấn');

    // 6. Write Contingency Dispatch Plan & Submit
    fireEvent.change(screen.getByLabelText(/Thiệt hại tài chính dự kiến/i), {
      target: { value: '72' },
    });
    fireEvent.change(screen.getByLabelText(/Lý do chọn phương án đánh đổi/i), {
      target: {
        value:
          'Bác bỏ AI xếp quá tải 18t lên xe 15t. Cứu 14t trái cây tránh hỏng 160tr, chấp nhận phạt SLA 72tr cho 2t cá hồi.',
      },
    });

    fireEvent.click(screen.getByRole('button', { name: /CHỐT LỆNH ĐIỀU PHỐI/i }));
    expect(screen.getByRole('dialog', { name: 'Sẵn sàng chốt lệnh!' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Xác nhận chốt lệnh' }));

    // 7. Debrief Verification (Closure & Catharsis)
    expect(screen.getByText(/PHẢN BIỆN ĐỘC LẬP XUẤT SẮC/i)).toBeInTheDocument();
    expect(screen.getAllByText(/72\.000\.000đ/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Số bạn tự tính trước đó/i)).toBeInTheDocument();
    expect(screen.getByText(/Khớp chuẩn!/i)).toBeInTheDocument();
    expect(screen.getByText(/Bản giải trình bạn đã gửi Giám Đốc Vận Hành/i)).toBeInTheDocument();

    // 8. Proceed to Blind Matching & verify IT-BLIND-01
    fireEvent.click(
      screen.getByRole('button', { name: /XEM HỒ SƠ BIG FIVE \/ RIASEC & GHÉP NỐI TRƯỜNG ẨN DANH/i })
    );
    expect(screen.getByText(/MÃ HOLLAND: R-E-C/i)).toBeInTheDocument();
    expect(screen.getByText(/CHẾ ĐỘ ẨN DANH/i)).toBeInTheDocument();
    expect(screen.queryByText(/Đại học Giao thông Vận tải/i)).not.toBeInTheDocument();

    // 9. Reveal & Open Parent Alignment Kit A4 Report
    fireEvent.click(screen.getByRole('button', { name: /MỞ KHÓA DANH TÍNH CƠ SỞ ĐÀO TẠO/i }));
    fireEvent.click(screen.getByRole('button', { name: /TIẾN VÀO BÁO CÁO ĐỒNG THUẬN GIA ĐÌNH/i }));
    expect(screen.getByText(/Báo Cáo Đồng Thuận Định Hướng Nghề Nghiệp/i)).toBeInTheDocument();
    expect(screen.getByText(/VÙNG ĐỒNG THUẬN GIA ĐÌNH/i)).toBeInTheDocument();
  });

  it('resets aiTriggered when clicking Đặt lại after AI Co-pilot so a subsequent manual overload is not labeled TRIGGERED_AND_ACCEPTED', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /VÀO BẢNG ĐIỀU PHỐI LOGISTICS/i }));
    fireEvent.click(screen.getByRole('button', { name: /VÀO BÀN LÀM VIỆC NGAY/i }));

    // Trigger AI Co-pilot then click Đặt lại (instead of Bác bỏ)
    fireEvent.click(screen.getByRole('button', { name: /AI Co-pilot: Tối ưu lịch trình/i }));
    expect(screen.getByTestId('ai-copilot-banner')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Đặt lại/i }));
    expect(screen.queryByTestId('ai-copilot-banner')).not.toBeInTheDocument();
    expect(screen.getByTestId('ledger-slot-TRUCK_20FT')).toHaveTextContent('0 tấn');
    // Chuyển sang bảng nhập số liệu truyền thống.
    fireEvent.click(screen.getByRole('tab', { name: /Bảng truyền thống/i }));
    // Manually enter 42t with a 6t overload on Van #1 (max 5t)
    fireEvent.change(screen.getByLabelText('Lô #A - Xe 20ft #1'), { target: { value: '15' } });
    fireEvent.change(screen.getByLabelText('Lô #A - Xe Van #1'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('Lô #A - Bãi chờ 03:30'), { target: { value: '2' } });

    fireEvent.change(screen.getByLabelText('Lô #B - Xe Van #1'), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText('Lô #B - Xe Van #2'), { target: { value: '4' } });
    fireEvent.change(screen.getByLabelText('Lô #B - Xe Van #3'), { target: { value: '5' } });

    fireEvent.change(screen.getByLabelText('Lô #C - Kho lạnh HP'), { target: { value: '10' } });

    fireEvent.change(screen.getByLabelText(/Lý do chọn phương án đánh đổi/i), {
      target: { value: 'Tự nhập thủ công sau khi đặt lại bảng điều phối.' },
    });

    fireEvent.click(screen.getByRole('button', { name: /CHỐT LỆNH ĐIỀU PHỐI/i }));

    expect(screen.getByRole('dialog', { name: 'Có rủi ro trước khi chốt' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Vẫn chốt để nhận đánh giá' }));

    expect(screen.getByText(/AI CO-PILOT: KHÔNG SỬ DỤNG TRONG LƯỢT NÀY/i)).toBeInTheDocument();
    expect(screen.queryByText(/BẠN ĐÃ DÍNH BẪY AI CO-PILOT!/i)).not.toBeInTheDocument();
    expect(screen.getByText(/QUÁ TẢI \+1 TẤN/i)).toBeInTheDocument();
  });
});
