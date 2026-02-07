// Инициализация корзины
let cart = [];
let currentCategory = 'all';

// Данные товаров
const products = {
    all: [
        { id: 1, name: 'Spotify Premium 1 месяц', category: 'spotify', price: 199, icon: '🎵', desc: 'Премиум подписка на 30 дней' },
        { id: 2, name: 'Spotify Premium 3 месяца', category: 'spotify', price: 499, icon: '🎵', desc: 'Премиум подписка на 90 дней' },
        { id: 3, name: 'Spotify Premium 12 месяцев', category: 'spotify', price: 1599, icon: '🎵', desc: 'Годовая подписка со скидкой' },
        { id: 4, name: 'Steam 500₽', category: 'steam', price: 500, icon: '🎮', desc: 'Пополнение баланса на 500 рублей' },
        { id: 5, name: 'Steam 1000₽', category: 'steam', price: 950, icon: '🎮', desc: 'Пополнение баланса на 1000 рублей' },
        { id: 6, name: 'Steam 2000₽', category: 'steam', price: 1800, icon: '🎮', desc: 'Пополнение баланса на 2000 рублей' },
        { id: 7, name: 'Discord Nitro Basic', category: 'discord', price: 299, icon: '💬', desc: '1 месяц подписки' },
        { id: 8, name: 'Discord Nitro Full', category: 'discord', price: 499, icon: '💬', desc: '1 месяц полной подписки' },
        { id: 9, name: 'Discord Nitro 3 месяца', category: 'discord', price: 1299, icon: '💬', desc: '3 месяца полной подписки' }
    ],
    spotify: [
        { id: 1, name: 'Spotify Premium 1 месяц', category: 'spotify', price: 199, icon: '🎵', desc: 'Премиум подписка на 30 дней' },
        { id: 2, name: 'Spotify Premium 3 месяца', category: 'spotify', price: 499, icon: '🎵', desc: 'Премиум подписка на 90 дней' },
        { id: 3, name: 'Spotify Premium 12 месяцев', category: 'spotify', price: 1599, icon: '🎵', desc: 'Годовая подписка со скидкой' }
    ],
    steam: [
        { id: 4, name: 'Steam 500₽', category: 'steam', price: 500, icon: '🎮', desc: 'Пополнение баланса на 500 рублей' },
        { id: 5, name: 'Steam 1000₽', category: 'steam', price: 950, icon: '🎮', desc: 'Пополнение баланса на 1000 рублей' },
        { id: 6, name: 'Steam 2000₽', category: 'steam', price: 1800, icon: '🎮', desc: 'Пополнение баланса на 2000 рублей' }
    ],
    discord: [
        { id: 7, name: 'Discord Nitro Basic', category: 'discord', price: 299, icon: '💬', desc: '1 месяц подписки' },
        { id: 8, name: 'Discord Nitro Full', category: 'discord', price: 499, icon: '💬', desc: '1 месяц полной подписки' },
        { id: 9, name: 'Discord Nitro 3 месяца', category: 'discord', price: 1299, icon: '💬', desc: '3 месяца полной подписки' }
    ]
};

// Инициализация приложения
function init() {
    // Проверяем, запущено ли приложение в Telegram
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = Telegram.WebApp;
        
        // Получаем данные пользователя
        const initDataUnsafe = tg.initDataUnsafe;
        if (initDataUnsafe && initDataUnsafe.user) {
            const userName = initDataUnsafe.user.first_name || 'друг';
            document.getElementById('user-name').textContent = userName;
        }
        
        // Настройка темы
        tg.expand();
        tg.ready();
    }
    
    // Загружаем товары
    loadProducts('all');
    
    // Загружаем корзину из локального хранилища
    loadCart();
}

// Загрузка товаров
function loadProducts(category) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    
    const items = products[category] || products.all;
    
    items.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">${product.icon}</div>
            <div class="product-title">${product.name}</div>
            <div class="product-desc">${product.desc}</div>
            <div class="product-price">${product.price} ₽</div>
        `;
        card.onclick = () => toggleProduct(product);
        container.appendChild(card);
    });
}

// Переключение категории
function showCategory(category) {
    currentCategory = category;
    
    // Обновляем активные кнопки
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Загружаем товары
    loadProducts(category);
}

// Добавление/удаление товара из корзины
function toggleProduct(product) {
    const index = cart.findIndex(item => item.id === product.id);
    
    if (index === -1) {
        // Добавляем в корзину
        cart.push({...product, quantity: 1});
        showNotification(`${product.name} добавлен в корзину!`);
    } else {
        // Удаляем из корзины
        cart.splice(index, 1);
        showNotification(`${product.name} удален из корзины`);
    }
    
    // Обновляем интерфейс
    updateCart();
    saveCart();
}

// Обновление корзины
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const totalPrice = document.getElementById('total-price');
    
    // Обновляем счетчик
    cartCount.textContent = cart.length;
    
    // Обновляем список товаров
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Корзина пуста</p>';
    } else {
        cartItems.innerHTML = '';
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${item.price} ₽</div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">×</button>
            `;
            cartItems.appendChild(cartItem);
        });
    }
    
    // Обновляем общую сумму
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    totalPrice.textContent = total;
}

// Удаление товара из корзины
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    saveCart();
    showNotification('Товар удален из корзины');
}

// Переключение видимости корзины
function toggleCart() {
    const cart = document.getElementById('cart');
    cart.classList.toggle('active');
}

// Оформление заказа
function checkout() {
    if (cart.length === 0) {
        showNotification('Корзина пуста!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>🛍️ Оформление заказа</h3>
            <p>Вы собираетесь купить:</p>
            <div style="text-align: left; margin-bottom: 20px;">
                ${cart.map(item => `• ${item.name} - ${item.price} ₽`).join('<br>')}
            </div>
            <p><strong>Итого: ${total} ₽</strong></p>
            <div class="modal-buttons">
                <button class="modal-btn cancel" onclick="closeModal()">Отмена</button>
                <button class="modal-btn confirm" onclick="confirmOrder()">Подтвердить</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Показываем модальное окно
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

// Подтверждение заказа
function confirmOrder() {
    // Здесь будет логика отправки заказа
    // Пока просто отправляем данные в бота через Telegram WebApp
    
    const orderData = {
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price, 0),
        timestamp: new Date().toISOString()
    };
    
    // Отправляем данные в бота
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = Telegram.WebApp;
        tg.sendData(JSON.stringify(orderData));
    }
    
    // Показываем сообщение об успехе
    showSuccessModal();
    
    // Очищаем корзину
    cart = [];
    updateCart();
    saveCart();
}

// Закрытие модального окна
function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
}

// Показать модальное окно успеха
function showSuccessModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>✅ Заказ оформлен!</h3>
            <p>Ваш заказ успешно отправлен. Ожидайте инструкции по оплате и доставке в чате с ботом.</p>
            <button class="modal-btn confirm" onclick="closeModal()">Хорошо</button>
        </div>
    `;
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

// Показать уведомление
function showNotification(message) {
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = Telegram.WebApp;
        tg.showPopup({
            title: "efshop",
            message: message,
            buttons: [{type: "ok"}]
        });
    } else {
        alert(message);
    }
}

// Сохранение корзины в локальное хранилище
function saveCart() {
    localStorage.setItem('efshop_cart', JSON.stringify(cart));
}

// Загрузка корзины из локального хранилища
function loadCart() {
    const savedCart = localStorage.getItem('efshop_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// Инициализируем приложение при загрузке
window.onload = init;
