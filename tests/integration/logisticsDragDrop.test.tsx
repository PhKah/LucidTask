import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../../src/App';

const enterMission = () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /VÀO BẢNG ĐIỀU PHỐI LOGISTICS/i }));
  fireEvent.click(screen.getByRole('button', { name: /VÀO BÀN LÀM VIỆC NGAY/i }));
};

const firePointerEventWithInvalidClientX = (
  element: HTMLElement,
  type: 'pointermove' | 'pointerup',
  pointerId: number
) => {
  const event = new PointerEvent(type, {
    bubbles: true,
    pointerId,
    clientX: 260,
    clientY: 240,
  });
  Object.defineProperty(event, 'clientX', { value: Number.NaN });
  fireEvent(element, event);
};

describe('Logistics drag-and-drop experimental branch', () => {
  it('keeps the current board and syncs click-to-allocate with legacy matrix', () => {
    enterMission();
    expect(screen.getByTestId('logistics-dnd-panel')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /1 tấn/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Chọn Lô #A, còn 18 tấn' }));
    fireEvent.click(screen.getByRole('button', { name: 'Xếp lô đang chọn vào Xe 20ft #1' }));
    expect(screen.getByTestId('ledger-slot-TRUCK_20FT')).toHaveTextContent('1 tấn');

    fireEvent.click(screen.getByRole('button', { name: /Kiểm tra phương án/i }));
    expect(screen.getByTestId('allocation-audit-results')).toHaveTextContent('Lô #A: đã xếp 1/18 tấn');
    fireEvent.click(screen.getByRole('button', { name: 'Quay lại sửa phương án' }));
    fireEvent.click(screen.getByRole('button', { name: 'Lấy lại 1 tấn Lô #A từ Xe 20ft #1' }));
    expect(screen.queryByTestId('allocation-audit-results')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: /Bảng truyền thống/i }));
    expect(screen.getByLabelText('Lô #A - Xe 20ft #1')).toHaveValue(0);
    fireEvent.change(screen.getByLabelText('Lô #A - Xe 20ft #1'), { target: { value: '3' } });
    fireEvent.click(screen.getByRole('tab', { name: /Kéo thả \(thử nghiệm\)/i }));
    expect(screen.getByTestId('drop-target-TRUCK_20FT')).toHaveTextContent('3/15t');
  });

  it('drags a real small parcel overlay (not the whole card) with Pointer Events', () => {
    enterMission();
    const source = screen.getByTestId('draggable-LOT_B');
    const target = screen.getByTestId('drop-target-VAN_1');
    expect(source).toHaveAttribute('draggable', 'false');
    const oldHitTest = Object.getOwnPropertyDescriptor(document, 'elementFromPoint');
    Object.defineProperty(document, 'elementFromPoint', { configurable: true, value: () => target });
    try {
      fireEvent.pointerDown(source, { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 100, clientY: 110 });
      firePointerEventWithInvalidClientX(source, 'pointermove', 1);
      expect(screen.queryByTestId('cargo-parcel-ghost')).not.toBeInTheDocument();
      fireEvent.pointerMove(source, { pointerId: 1, clientX: 260, clientY: 240 });
      const parcel = screen.getByTestId('cargo-parcel-ghost');
      expect(parcel).toHaveTextContent('5t');
      expect(parcel).toHaveTextContent('LÔ B');
      expect(parcel).toHaveClass('lt-parcel-ghost');
      firePointerEventWithInvalidClientX(source, 'pointerup', 1);
      expect(screen.queryByTestId('cargo-parcel-ghost')).not.toBeInTheDocument();
      expect(screen.getByTestId('cargo-parcel-flight')).toBeInTheDocument();
      expect(screen.getByTestId('cargo-parcel-flight')).toHaveStyle({ left: '272px', top: '252px' });
      expect(screen.getByTestId('ledger-slot-VAN_1')).toHaveTextContent('5 tấn');
      expect(screen.getByTestId('draggable-LOT_B')).toHaveTextContent('9t');
    } finally {
      if (oldHitTest) Object.defineProperty(document, 'elementFromPoint', oldHitTest);
      else delete (document as unknown as { elementFromPoint?: (x: number, y: number) => Element | null }).elementFromPoint;
    }
  });

  it('drops outside any resource without assigning cargo; click-to-place still works', () => {
    enterMission();
    const source = screen.getByTestId('draggable-LOT_A');
    const oldHitTest = Object.getOwnPropertyDescriptor(document, 'elementFromPoint');
    Object.defineProperty(document, 'elementFromPoint', { configurable: true, value: () => null });
    try {
      fireEvent.pointerDown(source, { pointerId: 2, pointerType: 'mouse', button: 0, clientX: 100, clientY: 100 });
      fireEvent.pointerMove(source, { pointerId: 2, clientX: 160, clientY: 150 });
      fireEvent.pointerUp(source, { pointerId: 2, clientX: 160, clientY: 150 });
      expect(screen.getByTestId('ledger-slot-TRUCK_20FT')).toHaveTextContent('0 tấn');
      expect(screen.getByTestId('logistics-dnd-panel')).toHaveTextContent('Chưa xếp hàng');
      fireEvent.click(source);
      fireEvent.click(screen.getByRole('button', { name: 'Xếp lô đang chọn vào Xe 20ft #1' }));
      expect(screen.getByTestId('ledger-slot-TRUCK_20FT')).toHaveTextContent('5 tấn');
    } finally {
      if (oldHitTest) Object.defineProperty(document, 'elementFromPoint', oldHitTest);
      else delete (document as unknown as { elementFromPoint?: (x: number, y: number) => Element | null }).elementFromPoint;
    }
  });

  it('preserves original AI trap and enables user-initiated audit', () => {
    enterMission();
    fireEvent.click(screen.getByRole('button', { name: /AI Co-pilot: Tối ưu lịch trình/i }));
    expect(screen.getByTestId('ledger-slot-TRUCK_20FT')).toHaveTextContent('18 tấn');
    expect(screen.queryByTestId('allocation-audit-results')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Kiểm tra phương án/i }));
    expect(screen.getByTestId('allocation-audit-results')).toHaveTextContent('vượt 3 tấn');
    fireEvent.click(screen.getByRole('button', { name: 'Quay lại sửa phương án' }));
    fireEvent.click(screen.getByRole('button', { name: /Bác bỏ & Khôi phục cấu hình an toàn/i }));
    expect(screen.getByTestId('ledger-slot-TRUCK_20FT')).toHaveTextContent('0 tấn');
    expect(screen.queryByTestId('allocation-audit-results')).not.toBeInTheDocument();
  });
});
