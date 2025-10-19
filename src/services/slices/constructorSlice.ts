import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';
import { TOrder } from '@utils-types';
import { orderBurgerApi } from '@api';

interface ConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
  orderRequest: boolean; // флаг отправки заказа
  orderModalData: TOrder | null; // данные для модалки
}

const initialState: ConstructorState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null
};

// Thunk для создания заказа
export const orderBurger = createAsyncThunk(
  'burgerConstructor/orderBurger',
  async (_, { getState }) => {
    const state = getState() as { burgerConstructor: ConstructorState };
    const { bun, ingredients } = state.burgerConstructor;

    // Собираем массив ID ингредиентов
    const orderData: string[] = [];

    // Добавляем булку (2 раза - верх и низ)
    if (bun) {
      orderData.push(bun._id);
      orderData.push(bun._id);
    }

    // Добавляем начинки
    ingredients.forEach((ingredient) => {
      orderData.push(ingredient._id);
    });

    // Отправляем заказ
    const response = await orderBurgerApi(orderData);
    return response.order;
  }
);

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      const ingredient = action.payload;

      if (ingredient.type === 'bun') {
        // Если булка - заменяем старую
        state.bun = ingredient;
      } else {
        // Если начинка - добавляем в список
        state.ingredients.push(ingredient);
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      // Удаляем ингредиент по его уникальному id
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index > 0) {
        [state.ingredients[index], state.ingredients[index - 1]] = [
          state.ingredients[index - 1],
          state.ingredients[index]
        ];
      }
    },
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index < state.ingredients.length - 1) {
        [state.ingredients[index], state.ingredients[index + 1]] = [
          state.ingredients[index + 1],
          state.ingredients[index]
        ];
      }
    },
    clearOrder: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        // Очищаем конструктор после успешного заказа
        state.bun = null;
        state.ingredients = [];
      })
      .addCase(orderBurger.rejected, (state) => {
        state.orderRequest = false;
      });
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearOrder
} = constructorSlice.actions;
export default constructorSlice.reducer;
