import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../../src/App';

describe('LucidTask v2.0 Landing & 2-Mission Registry Sanity Suite', () => {
  it('renders the console header and active telemetry indicator', () => {
    render(<App />);
    expect(screen.getByRole('banner')).toHaveTextContent(/LUCIDTASK/i);
    expect(screen.getByText(/TELEMETRY: ACTIVE/i)).toBeInTheDocument();
  });

  it('renders strictly the 2 flagship MVP missions: Logistics Cold-Chain and QA / Data Cleaning', () => {
    render(<App />);

    const logBtn = screen.getByRole('button', { name: /VÀO BẢNG ĐIỀU PHỐI LOGISTICS/i });
    const qaBtn = screen.getByRole('button', { name: /VÀO TRẠM SĂN LỖI QA & DỮ LIỆU/i });

    expect(logBtn).toBeInTheDocument();
    expect(qaBtn).toBeInTheDocument();
    expect(logBtn).toHaveClass('btn-pill-dark');
    expect(qaBtn).toHaveClass('btn-pill-dark');

    // Old obsolete industries must not appear
    expect(screen.queryByText(/Luật Kinh tế/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Marketing & Tổ chức Sự kiện/i)).not.toBeInTheDocument();
  });
});
