/// <reference types="cypress" />
describe('Constructor tests', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  // тесты для загрузки ингредиентов
  it('should load ingredients from fixture', () => {
    cy.get('[data-testid="ingredient-item"]').should('have.length.greaterThan', 0);
  });

  // тесты для конструктора
  it('adds bun and filling to constructor', () => {
    // Находим первый ингредиент (булку) и добавляем
    cy.get('[data-testid="ingredient-item"]').first().within(() => {
      cy.get('button').contains('Добавить').click({ force: true });
    });
  
    // Проверяем что булка появилась в конструкторе (текст "Выберите булки" исчез)
    // Проверяем что исчезла надпись "Выберите булки"
    cy.get('[data-testid="constructor-zone"]').should('not.contain', 'Выберите булки');
    // И проверяем что появился конкретный ингредиент
    cy.get('[data-testid="constructor-zone"]').should('contain', 'Краторная булка N-200i');
    
    // Находим начинку (не булку) и добавляем
    cy.get('[data-testid="ingredient-item"]').eq(2).within(() => {
      cy.get('button').contains('Добавить').click({ force: true });
    });
  
    // Проверяем что начинка появилась (текст "Выберите начинку" исчез)
    cy.get('[data-testid="constructor-zone"]').should('not.contain', 'Выберите начинку');
    cy.get('[data-testid="constructor-zone"]').should('contain', 'Биокотлета из марсианской Магнолии');
  });

  // тесты для модалки ингредиента
  it('opens ingredient modal on click', () => {
    // Кликаем на первый ингредиент
    cy.get('[data-testid="ingredient-item"] a').first().click({ force: true });
    
    // Проверяем что URL изменился (модалка через роутинг)
    cy.url().should('include', '/ingredients/');
    
    // Проверяем что модалка существует
    cy.get('[data-testid="modal"]').should('exist');
    
    // Проверяем что модалка содержит заголовок
    cy.get('[data-testid="modal"]').should('contain', 'Детали ингредиента');
  });

  // тесты для закрытия модалки ингредиента
  it('closes ingredient modal on close button click', () => {
    // Кликаем на ссылку ингредиента с force
    cy.get('[data-testid="ingredient-item"] a').first().click({ force: true });
    
    // Проверяем что URL изменился
    cy.url().should('include', '/ingredients/');
    
    // Проверяем что модалка существует
    cy.get('[data-testid="modal"]').should('exist');
    
    // Закрываем через навигацию назад (как работает кнопка)
    cy.go('back')
    
    // Проверяем что модалка закрылась
    cy.get('[data-testid="modal"]').should('not.exist');
  });
  
  it('closes ingredient modal on overlay click', () => {
    // Открываем модалку
    cy.get('[data-testid="ingredient-item"] a').first().click({ force: true });
    
    // Проверяем что URL изменился
    cy.url().should('include', '/ingredients/');
    
    // Кликаем на оверлей
    cy.get('[data-testid="modal-overlay"]').click({ force: true });
    
    // Проверяем что модалка закрылась
    cy.get('[data-testid="modal"]').should('not.exist');
  });

   // 
  
  // тесты для оформления заказа
  it('creates order successfully', () => {
    // Перехватываем API запросы
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as('createOrder');
    
    // Устанавливаем моковые токены ПЕРЕД загрузкой страницы
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'mock-refresh-token');
      win.document.cookie = 'accessToken=mock-access-token';
    });
    
    // Перехватываем запрос пользователя (он произойдет при checkUserAuth)
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUser');
    
    // Перезагружаем страницу чтобы checkUserAuth сработал с новыми токенами
    cy.reload();
    
    // Ждем пока авторизация завершится
    cy.wait('@getUser');
    
    // Собираем бургер
    cy.get('[data-testid="ingredient-item"]').first().within(() => {
      cy.get('button').contains('Добавить').click({ force: true });
    });
    
    cy.get('[data-testid="ingredient-item"]').eq(2).within(() => {
      cy.get('button').contains('Добавить').click({ force: true });
    });
    
    // Проверяем что конструктор не пуст
    cy.get('[data-testid="constructor-zone"]').should('not.contain', 'Выберите булки');
    cy.get('[data-testid="constructor-zone"]').should('not.contain', 'Выберите начинку');
    
    // Кликаем "Оформить заказ"
    cy.get('button').contains('Оформить заказ').click({ force: true });
    
    // Ждем запрос создания заказа
    cy.wait('@createOrder');
    
    // Проверяем что модальное окно открылось
    cy.get('[data-testid="modal"]').should('exist');
    cy.get('[data-testid="modal"]').should('contain', '12345');
    
    // Переходим на главную страницу напрямую
    cy.visit('/');
    
    // Проверяем что модальное окно закрылось
    cy.get('[data-testid="modal"]').should('not.exist');
    
    // Проверяем что конструктор пуст
    cy.get('[data-testid="constructor-zone"]').should('contain', 'Выберите булки');
    cy.get('[data-testid="constructor-zone"]').should('contain', 'Выберите начинку');

    // Очищаем хранилище после теста
    cy.window().then((win) => {
      win.localStorage.clear();
      win.document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    });
  });

});
