import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import {
  orderBurger,
  clearOrder
} from '../../services/slices/constructorSlice';
import { fetchFeed } from '../../services/slices/feedSlice';

export const BurgerConstructor: FC = () => {
  const constructorState = useSelector((state) => state.burgerConstructor);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const constructorItems = {
    bun: constructorState.bun,
    ingredients: constructorState.ingredients
  };

  const orderRequest = constructorState.orderRequest;
  const orderModalData = constructorState.orderModalData;

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!isAuthenticated) {
      // Проверка авторизации
      navigate('/login');
      return;
    }
    // Оформляем заказ
    dispatch(orderBurger()).then(() => {
      // Обновляем ленту после успешного заказа
      dispatch(fetchFeed());
    });
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  // return null;

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
