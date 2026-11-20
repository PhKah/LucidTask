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
    const primaryBtn = screen.getByRole('button', { name: /BẮT ĐẦU TRẢI NGHIỆM/i });
    expect(primaryBtn).toBeInTheDocument();
    expect(primaryBtn).toHaveClass('btn-pill-dark');

    const outlineBtn = screen.getByRole('button', { name: /XEM BẢN ĐẶC TẢ/i });
    expect(outlineBtn).toBeInTheDocument();
    expect(outlineBtn).toHaveClass('btn-pill-outline');

    const liveBadge = screen.getByText(/CHẾ ĐỘ SƠ TUYỂN MA SÁT/i);
    expect(liveBadge).toBeInTheDocument();
    expect(liveBadge).toHaveClass('badge-live-red');
  });

  it('renders the 3 core pillars', () => {
    render(<App />);
    expect(screen.getByText(/Chặng 1: Ma Sát/i)).toBeInTheDocument();
    expect(screen.getByText(/Chặng 2: Năng Lực/i)).toBeInTheDocument();
    expect(screen.getByText(/Blind Matching/i)).toBeInTheDocument();
  });
});
