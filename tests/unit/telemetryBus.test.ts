import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TelemetryBus } from '../../src/engine/TelemetryBus';

describe('UT-BUS-01: TelemetryBus Pub/Sub & Latency Suite', () => {
  let bus: TelemetryBus;

  beforeEach(() => {
    bus = new TelemetryBus();
  });

  it('records events with correct payload, id, and timestamp (UT-BUS-01)', () => {
    const event = bus.publish('handbook_viewed', {
      duration_ms: 12400,
      view_count: 2,
    });

    expect(event.event_name).toBe('handbook_viewed');
    expect(event.payload.duration_ms).toBe(12400);
    expect(event.payload.view_count).toBe(2);
    expect(event.event_id).toMatch(/^EVT_\d+_/);
    expect(event.timestamp_ms).toBeGreaterThan(0);

    const recorded = bus.getEvents();
    expect(recorded.length).toBe(1);
    expect(recorded[0].payload).toEqual({ duration_ms: 12400, view_count: 2 });
  });

  it('dispatches to specific and wildcard listeners without blocking (< 50ms)', () => {
    const specificListener = vi.fn();
    const wildcardListener = vi.fn();

    const unsubSpecific = bus.subscribe('item_classified', specificListener);
    const unsubWildcard = bus.subscribe('*', wildcardListener);

    const t0 = performance.now();
    bus.publish('item_classified', {
      item_id: 'TICKET-01',
      target_id: 'CONN_ERR',
      is_correct: true,
      latency_ms: 1500,
    });
    const dispatchLatency = performance.now() - t0;

    expect(dispatchLatency).toBeLessThan(50); // Under 50ms requirement
    expect(specificListener).toHaveBeenCalledTimes(1);
    expect(wildcardListener).toHaveBeenCalledTimes(1);

    // Unsubscribe check
    unsubSpecific();
    bus.publish('item_classified', {
      item_id: 'TICKET-02',
      target_id: 'DATA_ERR',
      is_correct: true,
      latency_ms: 1800,
    });

    expect(specificListener).toHaveBeenCalledTimes(1);
    expect(wildcardListener).toHaveBeenCalledTimes(2);

    unsubWildcard();
  });

  it('filters events by type and cleans up correctly', () => {
    bus.publish('handbook_viewed', { duration_ms: 5000, view_count: 1 });
    bus.publish('tab_switched', { from_tab: 'TAB_USER', to_tab: 'TAB_LOGS' });
    bus.publish('handbook_viewed', { duration_ms: 3000, view_count: 2 });

    const handbookEvents = bus.getEventsByType('handbook_viewed');
    expect(handbookEvents.length).toBe(2);

    bus.clear();
    expect(bus.getEventCount()).toBe(0);
  });
});

