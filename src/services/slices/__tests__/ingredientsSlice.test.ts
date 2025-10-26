import { describe, it, expect } from '@jest/globals';
import ingredientsReducer, { fetchIngredients } from '../ingredientsSlice';

describe('ingredientsSlice', () => {
  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  it('should handle initial state', () => {
    const result = ingredientsReducer(undefined, { type: 'unknown' });
    expect(result).toBeDefined();
  });

  describe('fetchIngredients async actions', () => {
    it('should handle fetchIngredients.pending', () => {
      const action = { type: fetchIngredients.pending.type };
      const newState = ingredientsReducer(initialState, action);

      expect(newState.isLoading).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('should handle fetchIngredients.fulfilled', () => {
      const mockIngredients = [
        {
          _id: 'ingredient-1',
          name: 'Краторная булка',
          type: 'bun',
          proteins: 80,
          fat: 24,
          carbohydrates: 53,
          calories: 420,
          price: 1255,
          image: 'bun-image.jpg',
          image_mobile: 'bun-mobile.jpg',
          image_large: 'bun-large.jpg'
        }
      ];

      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };

      const newState = ingredientsReducer(
        { ...initialState, isLoading: true },
        action
      );

      expect(newState.isLoading).toBe(false);
      expect(newState.ingredients).toBeDefined();
    });

    it('should handle fetchIngredients.rejected', () => {
      const errorMessage = 'Network error';
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: errorMessage }
      };

      const newState = ingredientsReducer(
        { ...initialState, isLoading: true },
        action
      );

      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBeDefined();
    });
  });
});
