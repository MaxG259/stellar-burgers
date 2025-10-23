import { describe, it, expect } from '@jest/globals';
import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from '../ingredientsSlice';
import feedReducer from '../feedSlice';
import constructorReducer from '../constructorSlice';
import userReducer from '../userSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  feed: feedReducer,
  burgerConstructor: constructorReducer,
  user: userReducer
});

describe('rootReducer', () => {
  it('should return initial state for unknown action', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };
    const initialState = rootReducer(undefined, unknownAction);
    
    // Проверяем что все слайсы присутствуют
    expect(initialState.ingredients).toBeDefined();
    expect(initialState.feed).toBeDefined();
    expect(initialState.burgerConstructor).toBeDefined();
    expect(initialState.user).toBeDefined();
  });
});
