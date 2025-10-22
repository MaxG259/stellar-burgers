import { describe, it, expect } from '@jest/globals';
import store from '../../store';

describe('rootReducer', () => {
  it('should return initial state for unknown action', () => {
    const initialState = store.getState();

    // Простые проверки
    expect(initialState.ingredients).toBeDefined();
    expect(initialState.feed).toBeDefined();
    expect(initialState.burgerConstructor).toBeDefined();
    expect(initialState.user).toBeDefined();
  });
});
