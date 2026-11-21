import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../../src/App';

const openLogisticsBoard = () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /VÀO BẢNG ĐIỀU PHỐI LOGISTICS/i }));
  fireEvent.click(screen.getByRole('button', { name: /VÀO BÀN LÀM VIỆC NGAY/i }));
};

describe('Logistics compact workspace — keep original dispatch slots', () => {
  it('keeps all six original drop targets while moving the raw ledger into an optional drawer', () => {
    openLogisticsBoard();

    for (const id of ['TRUCK_20FT', 'VAN_1', 'VAN_2', 'VAN_3', 'COLD_STORAGE_HP', 'NEXT_DAY_PORT']) {
      expect(screen.getByTestId(`drop-target-${id}`)).toBeInTheDocument();
    }

    const ledger = screen.getByTestId('passive-resource-ledger');
    expect(ledger).toHaveClass('hidden');
    expect(screen.getByTestId('ledger-slot-TRUCK_20FT')).toHaveTextContent('0 tấn');

    fireEvent.click(screen.getByRole('button', { name: 'Mở bảng thống kê' }));
    expect(ledger).not.toHaveClass('hidden');
    expect(screen.getByText('Số Tấn Cộng Dồn Theo Phương Tiện / Kho')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Đóng bảng thống kê' }));
    expect(ledger).toHaveClass('hidden');
  });

  it('uses illustrated trucks while preserving their names, departure times, capacity and drop targets', () => {
    openLogisticsBoard();

    const truck = screen.getByTestId('drop-target-TRUCK_20FT');
    expect(truck).toHaveTextContent('Xe 20ft #1');
    expect(truck).toHaveTextContent('Xuất phát 15:00');
    expect(truck).toHaveTextContent('0/15t');
    expect(screen.getByTestId('vehicle-art-TRUCK_20FT')).toHaveAttribute('src', '/logistics-truck-20ft.png');

    for (const id of ['VAN_1', 'VAN_2', 'VAN_3']) {
      const card = screen.getByTestId(`drop-target-${id}`);
      expect(card).toHaveTextContent('Xuất phát 15:00');
      expect(card).toHaveTextContent('0/5t');
      expect(screen.getByTestId(`vehicle-art-${id}`)).toHaveAttribute('src', '/logistics-van-5t.png');
    }

    expect(screen.queryByTestId('vehicle-art-COLD_STORAGE_HP')).not.toBeInTheDocument();
    expect(screen.queryByTestId('vehicle-art-NEXT_DAY_PORT')).not.toBeInTheDocument();
  });

  it('shows the original lot and resource constraints through hover and click', () => {
    openLogisticsBoard();

    fireEvent.mouseEnter(screen.getByRole('button', { name: /Thông tin Lô #A/i }));
    const lotDetail = screen.getByRole('region', { name: 'Chi tiết Lô #A' });
    expect(lotDetail).toHaveTextContent('Cá hồi tươi nhập khẩu');
    expect(lotDetail).toHaveTextContent('Giao siêu thị trước 18:00');

    fireEvent.click(screen.getByRole('button', { name: 'Thông tin định mức xe và kho bãi' }));
    const resourceDetail = screen.getByRole('region', { name: 'Chi tiết định mức xe và kho bãi' });
    expect(resourceDetail).toHaveTextContent('Xe 20ft #1');
    expect(resourceDetail).toHaveTextContent('15t tối đa');
    fireEvent.click(screen.getByRole('button', { name: 'Đóng thông tin tham khảo' }));
    expect(screen.queryByRole('region', { name: 'Chi tiết định mức xe và kho bãi' })).not.toBeInTheDocument();
  });
});
