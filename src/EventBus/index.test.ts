// @vitest-environment jsdom
import { describe, test, expect, vi, afterAll } from 'vitest';
import { EventBus } from './index.ts';

afterAll(() => {
  EventBus.getInstance().clear();
});
describe('Test EventBus', () => {
  test('should call the subscribed callback with the correct payload', () => {
    const mockCallback = vi.fn();
    const uniqueEvent = `test-event-${Math.random()}`;
    EventBus.getInstance().on(uniqueEvent, mockCallback);
    EventBus.getInstance().emit(uniqueEvent, 'payload');
    expect(mockCallback).toHaveBeenCalledWith('payload');
  });

  test('should call ALL callbacks subscribed to the same event', () => {
    const firstMockCallback = vi.fn();
    const secondMockCallback = vi.fn();
    const uniqueEvent = `test-event-${Math.random()}`;
    EventBus.getInstance().on(uniqueEvent, firstMockCallback);
    EventBus.getInstance().on(uniqueEvent, secondMockCallback);
    EventBus.getInstance().emit(uniqueEvent, 'payload');
    expect(firstMockCallback).toHaveBeenCalledWith('payload');
    expect(secondMockCallback).toHaveBeenCalledWith('payload');
  });

  test('should not throw an error when emitting an event with no subscribers', () => {
    const event = `test-${Math.random()}`;
    expect(() => EventBus.getInstance().emit(event, 'payload')).not.toThrow();
  });

  test('should not call a callback subscribed to a different event', () => {
    const mockCallback = vi.fn();
    const firstEvent = `test-event-${Math.random()}`;
    const secondEvent = `test-event-${Math.random()}`;
    EventBus.getInstance().on(firstEvent, mockCallback);
    EventBus.getInstance().emit(secondEvent, 'payload');
    expect(mockCallback).not.toHaveBeenCalledWith('payload');
  });

  test('should call the callback every time the event is emitted', () => {
    const mockCallback = vi.fn();
    const firstEvent = `test-event-${Math.random()}`;
    const secondEvent = `test-event-${Math.random()}`;
    EventBus.getInstance().on(firstEvent, mockCallback);
    EventBus.getInstance().on(secondEvent, mockCallback);
    EventBus.getInstance().emit(firstEvent, 'payload');
    EventBus.getInstance().emit(secondEvent, 'payload');
    expect(mockCallback).toHaveBeenCalledWith('payload');
    expect(mockCallback).toHaveBeenCalledTimes(2);
  });
});
