import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../../src/App';

describe('Sanity & Design Tokens Test Suite', () => {
  it('renders the console header and logo block correctly', () => {
    render(<App />);
    expect(screen.getByRole('banner')).toHaveTextContent(/LUCIDTASK/i);
    expect(screen.getByText(/TELEMETRY: ACTIVE/i)).toBeInTheDocument();
  });

  it('renders the editorial hard-news pill buttons and badges', () => {
    render(<App />);
    const primaryBtn = screen.getByRole('button', { name: /VÀO PHÒNG MÔ PHỎNG TÁC VỤ/i });
    expect(primaryBtn).toBeInTheDocument();
    expect(primaryBtn).toHaveClass('btn-pill-dark');

    const outlineBtn = screen.getByRole('button', { name: /CHƯA MỞ CHO ĐỢT THỰC NGHIỆM NÀY/i });
    expect(outlineBtn).toBeInTheDocument();
    expect(outlineBtn).toHaveClass('btn-pill-outline');

    const liveBadge = screen.getByText(/BỘ LỌC SÀNG LỌC/i);
    expect(liveBadge).toBeInTheDocument();
    expect(liveBadge).toHaveClass('badge-live-red');
  });

  it('renders the 2 progressive stages overview', () => {
    render(<App />);
    expect(screen.getByText(/Chặng 1: Sơ Tuyển Ma Sát/i)).toBeInTheDocument();
    expect(screen.getByText(/Chặng 2: Năng Lực Cốt Lõi/i)).toBeInTheDocument();
  });
});
