import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TelemetryBus } from '../../src/engine/TelemetryBus';

describe('UT-BUS-01: TelemetryBus Pub/Sub & Latency Suite (v2.0)', () => {
  let bus: TelemetryBus;

  beforeEach(() => {
    bus = new TelemetryBus();
  });

  it('records active manipulation events with correct payload, id, and timestamp', () => {
    const event = bus.publish('allocation_updated', {
      lot_id: 'LOT_A',
      resource_id: 'TRUCK_20FT',
      tons: 15,
    });

    expect(event.event_name).toBe('allocation_updated');
    expect(event.payload).toEqual({ lot_id: 'LOT_A', resource_id: 'TRUCK_20FT', tons: 15 });
    expect(event.event_id).toMatch(/^EVT_\d+_/);
    expect(event.timestamp_ms).toBeGreaterThan(0);
    expect(bus.getEvents().length).toBe(1);
  });

  it('dispatches AI Co-pilot trap events to specific and wildcard listeners in < 50ms', () => {
    const specificListener = vi.fn();
    const wildcardListener = vi.fn();

    const unsubSpecific = bus.subscribe('ai_copilot_triggered', specificListener);
    const unsubWildcard = bus.subscribe('*', wildcardListener);

    const t0 = performance.now();
    bus.publish('ai_copilot_triggered', { mission_id: 'IND_LOG_COLDCHAIN' });
    const latency = performance.now() - t0;

    expect(latency).toBeLessThan(50);
    expect(specificListener).toHaveBeenCalledTimes(1);
    expect(wildcardListener).toHaveBeenCalledTimes(1);

    unsubSpecific();
    bus.publish('ai_copilot_overridden', {
      mission_id: 'IND_LOG_COLDCHAIN',
      method: 'EXPLICIT_BUTTON',
    });

    expect(specificListener).toHaveBeenCalledTimes(1);
    expect(wildcardListener).toHaveBeenCalledTimes(2);
    unsubWildcard();
  });

  it('filters events by type and clears cleanly', () => {
    bus.publish('data_cell_flagged', { order_id: 'ORD-02', defect_category: 'INVALID_DATE' });
    bus.publish('tab_switched', { from_tab: 'DATA_GRID', to_tab: 'LOGIC_FLOW' });
    bus.publish('data_cell_flagged', { order_id: 'ORD-04', defect_category: 'NEGATIVE_OR_MATH_ERROR' });

    expect(bus.getEventsByType('data_cell_flagged').length).toBe(2);
    bus.clear();
    expect(bus.getEventCount()).toBe(0);
  });
});
