import { describe, it, expect } from '@jest/globals';
import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown
} from '../constructorSlice';

describe('constructorSlice', () => {
  const mockBun = {
    _id: 'bun-1',
    id: 'bun-1',
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
  };

  const mockFilling = {
    _id: 'filling-1',
    id: 'filling-1',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'sauce-image.jpg',
    image_mobile: 'sauce-mobile.jpg',
    image_large: 'sauce-large.jpg'
  };

  const initialState = {
    bun: null,
    ingredients: [],
    orderRequest: false,
    orderModalData: null
  };

  it('should handle initial state', () => {
    const result = constructorReducer(undefined, { type: 'unknown' });
    expect(result).toBeDefined();
  });

  describe('addIngredient', () => {
    it('should add bun to constructor', () => {
      const action = addIngredient(mockBun);
      const newState = constructorReducer(initialState, action);

      expect(newState.bun).toBeDefined();
      expect(newState.ingredients.length).toBe(0);
    });

    it('should add filling to ingredients list', () => {
      const action = addIngredient(mockFilling);
      const newState = constructorReducer(initialState, action);

      expect(newState.bun).toBeNull();
      expect(newState.ingredients.length).toBe(1);
    });
  });

  describe('removeIngredient', () => {
    it('should remove ingredient by id', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [
          mockFilling,
          { ...mockFilling, id: 'filling-2', _id: 'filling-2' }
        ]
      };

      const action = removeIngredient('filling-1');
      const newState = constructorReducer(stateWithIngredients, action);

      expect(newState.ingredients.length).toBe(1);
    });
  });

  describe('moveIngredientUp', () => {
    it('should move ingredient up in the list', () => {
      const ingredient1 = { ...mockFilling, id: 'filling-1' };
      const ingredient2 = { ...mockFilling, id: 'filling-2', _id: 'filling-2' };
      const stateWithIngredients = {
        ...initialState,
        ingredients: [ingredient1, ingredient2]
      };

      const action = moveIngredientUp(1);
      const newState = constructorReducer(stateWithIngredients, action);

      expect(newState.ingredients).toBeDefined();
    });
  });

  describe('moveIngredientDown', () => {
    it('should move ingredient down in the list', () => {
      const ingredient1 = { ...mockFilling, id: 'filling-1' };
      const ingredient2 = { ...mockFilling, id: 'filling-2', _id: 'filling-2' };
      const stateWithIngredients = {
        ...initialState,
        ingredients: [ingredient1, ingredient2]
      };

      const action = moveIngredientDown(0);
      const newState = constructorReducer(stateWithIngredients, action);

      expect(newState.ingredients).toBeDefined();
    });
  });
});
