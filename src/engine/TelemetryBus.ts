/**
 * In-Memory Event-Driven Telemetry Bus (< 50ms Latency)
 * Reference: specs/SOFTWARE_DESIGN_DOCUMENT.md & specs/Scenario_&_Scoring_Spec.md
 */

import { TelemetryEvent, TelemetryEventType, TelemetryPayloadMap } from '../types/telemetry';

type EventListener = (event: TelemetryEvent) => void;

export class TelemetryBus {
  private events: TelemetryEvent[] = [];
  private listeners: Map<string, Set<EventListener>> = new Map();
  private maxEvents: number = 2000;

  constructor(maxEvents?: number) {
    if (maxEvents) {
      this.maxEvents = maxEvents;
    }
  }

  /**
   * Publish a typed telemetry micro-event
   */
  public publish<K extends TelemetryEventType>(
    eventName: K,
    payload: TelemetryPayloadMap[K]
  ): TelemetryEvent<K> {
    const timestamp_ms = Date.now();
    const event_id = `EVT_${timestamp_ms}_${Math.random().toString(36).substring(2, 7)}`;

    const event: TelemetryEvent<K> = {
      event_id,
      event_name: eventName,
      timestamp_ms,
      payload,
    };

    if (this.events.length >= this.maxEvents) {
      this.events.shift(); // FIFO circular buffer to prevent memory leakage
    }

    this.events.push(event as TelemetryEvent);

    // Notify specific listeners
    const specificListeners = this.listeners.get(eventName);
    if (specificListeners) {
      specificListeners.forEach(listener => {
        try {
          listener(event as TelemetryEvent);
        } catch (err) {
          console.error(`Error in telemetry listener for ${eventName}:`, err);
        }
      });
    }

    // Notify wildcard '*' listeners
    const wildcardListeners = this.listeners.get('*');
    if (wildcardListeners) {
      wildcardListeners.forEach(listener => {
        try {
          listener(event as TelemetryEvent);
        } catch (err) {
          console.error(`Error in wildcard telemetry listener:`, err);
        }
      });
    }

    return event;
  }

  /**
   * Subscribe to specific or all ('*') events
   * Returns an unsubscribe cleanup function
   */
  public subscribe(
    eventName: TelemetryEventType | '*',
    callback: EventListener
  ): () => void {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }

    const set = this.listeners.get(eventName)!;
    set.add(callback);

    return () => {
      set.delete(callback);
      if (set.size === 0) {
        this.listeners.delete(eventName);
      }
    };
  }

  /**
   * Retrieve all recorded telemetry events in chronological order
   */
  public getEvents(): TelemetryEvent[] {
    return [...this.events];
  }

  /**
   * Filter recorded events by specific event type
   */
  public getEventsByType<K extends TelemetryEventType>(eventName: K): TelemetryEvent<K>[] {
    return this.events.filter(e => e.event_name === eventName) as TelemetryEvent<K>[];
  }

  /**
   * Clear all telemetry history and listeners
   */
  public clear(): void {
    this.events = [];
    this.listeners.clear();
  }

  /**
   * Get total number of recorded events
   */
  public getEventCount(): number {
    return this.events.length;
  }
}

export const telemetryBus = new TelemetryBus();
export default telemetryBus;
