import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder, TUser } from '@utils-types';
import {
  loginUserApi,
  registerUserApi,
  getOrdersApi,
  updateUserApi,
  logoutApi,
  getUserApi
} from '@api';
import { setCookie, deleteCookie, getCookie } from '../../utils/cookie';

interface UserState {
  user: TUser | null;
  isAuthenticated: boolean;
  isAuthChecked: boolean; // новое
  isLoading: boolean;
  error: string | null;
  orders: TOrder[] | null;
  ordersLoading: boolean;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  isAuthChecked: false, // новое
  isLoading: false,
  error: null,
  orders: null,
  ordersLoading: false
};

const loginUser = createAsyncThunk(
  'user/loginUser',
  async (loginData: { email: string; password: string }) => {
    const data = await loginUserApi(loginData);
    // Сохраняем токены после успешного входа
    localStorage.setItem('refreshToken', data.refreshToken);
    setCookie('accessToken', data.accessToken);
    return data;
  }
);

const registerUser = createAsyncThunk(
  'user/registerUser',
  async (registerData: { name: string; email: string; password: string }) => {
    const data = await registerUserApi(registerData);
    // Сохраняем токены после успешной регистрации
    localStorage.setItem('refreshToken', data.refreshToken);
    setCookie('accessToken', data.accessToken);
    return data;
  }
);

const getUserOrders = createAsyncThunk('user/getUserOrders', async () => {
  const data = await getOrdersApi();
  return data;
});

const updateUser = createAsyncThunk(
  'user/updateUser',
  async (userData: { name: string; email: string; password?: string }) => {
    const data = await updateUserApi(userData);
    return data;
  }
);

/* const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  await logoutApi();
  // Очищаем токены
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
}); */

const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  await logoutApi();
  return {};
});

const checkUserAuth = createAsyncThunk('user/checkUserAuth', async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  const accessToken = getCookie('accessToken');

  if (!refreshToken || !accessToken) {
    throw new Error('No tokens');
  }

  const data = await getUserApi();
  return data.user;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка входа';
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка регистрации';
      })
      .addCase(getUserOrders.pending, (state) => {
        state.ordersLoading = true;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.orders = action.payload;
      })
      .addCase(getUserOrders.rejected, (state) => {
        state.ordersLoading = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка обновления';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        // Очищаем токены
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
        // Очищаем состояние
        state.user = null;
        state.isAuthenticated = false;
        state.orders = null;
        state.error = null;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.isLoading = false;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
        state.isAuthenticated = false;
        state.user = null;
        state.isLoading = false;
        state.isAuthChecked = true;
      });
  }
});

export const {} = userSlice.actions;
export default userSlice.reducer;
export {
  loginUser,
  registerUser,
  getUserOrders,
  updateUser,
  logoutUser,
  checkUserAuth
};
