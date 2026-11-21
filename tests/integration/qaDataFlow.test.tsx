import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../src/App';

describe('E2E Integration: QA & Data Cleaning Flow (15 Orders + Vietnamese Logic Flowchart)', () => {
  it('completes full flow: Briefing -> Flag Orders on 15-row Grid -> Flag Logic Bugs on Flowchart -> Block Release -> Debrief -> Blind Matching', () => {
    render(<App />);

    // 1. Select QA & Data Cleaning Mission
    fireEvent.click(screen.getByRole('button', { name: /VÀO TRẠM SĂN LỖI QA & DỮ LIỆU/i }));
    expect(screen.getByText(/Săn Lỗi Bảng Dữ Liệu 15 Đơn Hàng/i)).toBeInTheDocument();

    // 2. Enter Workbench
    fireEvent.click(screen.getByRole('button', { name: /VÀO BÀN LÀM VIỆC NGAY/i }));
    expect(screen.getByTestId('order-row-ORD-02')).toBeInTheDocument();
    expect(screen.getByTestId('order-row-ORD-15')).toBeInTheDocument();

    // 3. Actively click order rows to tag defects inline
    fireEvent.click(screen.getByTestId('order-row-ORD-02'));
    fireEvent.click(screen.getByRole('button', { name: 'LỖI NGÀY' }));

    fireEvent.click(screen.getByTestId('order-row-ORD-04'));
    fireEvent.click(screen.getByRole('button', { name: 'GIÁ / TÍNH TOÁN' }));

    fireEvent.click(screen.getByTestId('order-row-ORD-10'));
    fireEvent.click(screen.getByRole('button', { name: 'TRÙNG ĐƠN' }));

    // 4. Switch to Tab 2: Vietnamese Logic Flowchart (zero code syntax)
    expect(screen.getByText('CHƯA MỞ')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: /Sơ Đồ Luồng Tiếng Việt/i }));
    expect(screen.queryByText('CHƯA MỞ')).not.toBeInTheDocument();
    expect(screen.getByTestId('flow-node-NODE_3')).toBeInTheDocument();
    expect(screen.getByTestId('flow-node-NODE_5')).toBeInTheDocument();

    // Flag Logic Bug #1 at Step 3
    fireEvent.click(screen.getByTestId('flow-node-NODE_3').querySelector('button')!);
    fireEvent.click(screen.getByRole('button', { name: /Thiếu chặn Tổng >= 0đ/i }));

    // Flag Logic Bug #2 at Step 5
    fireEvent.click(screen.getByTestId('flow-node-NODE_5').querySelector('button')!);
    fireEvent.click(
      screen.getByRole('button', { name: /Trừ tiền TRƯỚC khi kiểm tra tồn kho/i })
    );

    // 5. Choose BLOCK RELEASE & write bug summary
    fireEvent.click(screen.getByRole('button', { name: /CHẶN RELEASE/i }));
    fireEvent.change(screen.getByLabelText(/Tóm tắt các lỗi nghiêm trọng nhất/i), {
      target: {
        value:
          'Chặn release do có lỗi ngày 30/02, giá âm, đơn trùng lặp và 2 lỗi logic Bước 3 âm tiền giảm giá, Bước 5 trừ ví không hoàn tiền.',
      },
    });

    fireEvent.click(screen.getByRole('button', { name: /GỬI BÁO CÁO QA & CHỐT RELEASE/i }));

    // 6. Verify Debrief shows 2/2 Logic Bugs & BLOCK RELEASE correct
    expect(screen.getByText(/2 \/ 2 lỗ hổng logic/i)).toBeInTheDocument();
    expect(screen.getByText(/CHẶN RELEASE — ĐÚNG/i)).toBeInTheDocument();
    expect(screen.getByText(/Bản báo cáo lỗi bạn đã gửi Đội Kỹ Thuật/i)).toBeInTheDocument();

    // 7. Proceed to Blind Matching & verify Holland code
    fireEvent.click(
      screen.getByRole('button', { name: /XEM HỒ SƠ BIG FIVE \/ RIASEC & GHÉP NỐI TRƯỜNG ẨN DANH/i })
    );
    expect(screen.getByText(/MÃ HOLLAND:/i)).toBeInTheDocument();
    expect(screen.getByText(/CHẾ ĐỘ ẨN DANH/i)).toBeInTheDocument();
  });

  it('keeps CHƯA MỞ badge and footer Tab 2 warning visible after AI Auto-QA until Tab 2 is opened', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /VÀO TRẠM SĂN LỖI QA & DỮ LIỆU/i }));
    fireEvent.click(screen.getByRole('button', { name: /VÀO BÀN LÀM VIỆC NGAY/i }));

    expect(screen.getByText('CHƯA MỞ')).toBeInTheDocument();
    expect(screen.getByText(/Lưu ý: Bạn chưa mở Tab 2/i)).toBeInTheDocument();

    // Trigger AI Auto-QA without opening Tab 2 (AI pre-tags NODE_3)
    fireEvent.click(screen.getByRole('button', { name: /AI Auto-QA: Quét lỗi tự động/i }));

    expect(screen.getByText('CHƯA MỞ')).toBeInTheDocument();
    expect(screen.getByText(/Lưu ý: Bạn chưa mở Tab 2/i)).toBeInTheDocument();

    // Switching to Tab 2 clears both cues
    fireEvent.click(screen.getByRole('tab', { name: /Sơ Đồ Luồng Tiếng Việt/i }));
    expect(screen.queryByText('CHƯA MỞ')).not.toBeInTheDocument();
    expect(screen.queryByText(/Lưu ý: Bạn chưa mở Tab 2/i)).not.toBeInTheDocument();
  });
});
