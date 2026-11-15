// ==== Данные товаров (с реальными картинками из интернета) ====
const products = [
  { id: 1, title: 'Футболка Oversize', price: 1990, category: 'men',   img: 'https://avatars.mds.yandex.net/i?id=3532a8799ca72d5b6907ee05430bc87b973626c5-5222263-images-thumbs&n=13' },
  { id: 2, title: 'Джинсы Slim Fit',   price: 3490, category: 'men',   img: 'https://avatars.mds.yandex.net/i?id=afeab163d0319f50285999355f6a9a4eeec2d4da-4299919-images-thumbs&n=13' },
  { id: 3, title: 'Куртка Bomber',     price: 5990, category: 'women', img: 'https://avatars.mds.yandex.net/i?id=49cb883230890d5a09ecfb40099cc8dd2c3bc0f9-5258229-images-thumbs&n=13' },
  { id: 4, title: 'Худи Basic',        price: 2790, category: 'women', img: 'https://avatars.mds.yandex.net/i?id=630f9374f66ae19fd3d1b5115e020f199db02404-9097903-images-thumbs&n=13' },
  { id: 5, title: 'Кепка Classic',     price: 990,  category: 'accessories', img: 'https://avatars.mds.yandex.net/i?id=7e6d22cb3161282a48d16c56964c22903951a595-10640350-images-thumbs&n=13' },
];

let cart = []; 
let currentFilter = 'all';
let currentUser = null; // Здесь будем хранить имя вошедшего пользователя

// ==== Рендер товаров ====
const productsEl = document.getElementById('products');

function renderProducts() {
  const filtered = currentFilter === 'all'
    ? products
    : products.filter(p => p.category === currentFilter);

  productsEl.innerHTML = filtered.map(p => `
    <div class="card">
      <img src="${p.img}" alt="${p.title}">
      <div class="card__body">
        <div class="card__title">${p.title}</div>
        <div class="card__price">${p.price.toLocaleString('ru-RU')} ₽</div>
        <button class="card__btn" data-id="${p.id}">В корзину</button>
      </div>
    </div>
  `).join('');
}

// ==== Фильтр ====
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.filter-btn.active').classList.remove('active');
    btn.classList.add('active');
    currentFilter = btn.dataset.category;
    renderProducts();
  });
});

// ==== Добавление в корзину ====
productsEl.addEventListener('click', (e) => {
  const btn = e.target.closest('.card__btn');
  if (!btn) return;
  const id = Number(btn.dataset.id);
  addToCart(id);
});

function addToCart(id) {
  const item = cart.find(i => i.id === id);
  if (item) item.qty += 1;
  else cart.push({ id, qty: 1 });
  updateCartUI();
}

// ==== UI корзины ====
const cartCountEl = document.getElementById('cart-count');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const cartModal = document.getElementById('cart-modal');

function updateCartUI() {
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  cartCountEl.textContent = totalQty;

  const totalPrice = cart.reduce((sum, item) => {
    const p = products.find(x => x.id === item.id);
    return sum + p.price * item.qty;
  }, 0);

  cartTotalEl.textContent = totalPrice.toLocaleString('ru-RU');

  cartItemsEl.innerHTML = cart.length === 0
    ? '<li>Корзина пуста</li>'
    : cart.map(item => {
        const p = products.find(x => x.id === item.id);
        return `<li><span>${p.title} × ${item.qty}</span><span>${(p.price * item.qty).toLocaleString('ru-RU')} ₽</span></li>`;
      }).join('');
}

// ==== Модалка корзины ====
document.getElementById('cart-btn').addEventListener('click', () => {
  cartModal.classList.remove('hidden');
  updateCartUI();
});

document.getElementById('close-cart').addEventListener('click', () => {
  cartModal.classList.add('hidden');
});

cartModal.addEventListener('click', (e) => {
  if (e.target === cartModal) cartModal.classList.add('hidden');
});

document.getElementById('checkout-btn').addEventListener('click', () => {
  if (cart.length === 0) return alert('Корзина пуста');
  if (!currentUser) return alert('Пожалуйста, войдите в аккаунт перед оформлением заказа!');
  alert(`Спасибо за заказ, ${currentUser}! (Демо-режим)`);
  cart = [];
  updateCartUI();
  cartModal.classList.add('hidden');
});

// ==== Логика Аккаунта (Вход/Выход) ====
const loginModal = document.getElementById('login-modal');
const loginBtn = document.getElementById('login-btn');
const closeLoginBtn = document.getElementById('close-login');
const doLoginBtn = document.getElementById('do-login');
const usernameInput = document.getElementById('username');

loginBtn.addEventListener('click', () => {
  if (currentUser) {
    // Если уже вошли, кнопка работает как "Выйти"
    currentUser = null;
    loginBtn.textContent = 'Войти';
    alert('Вы вышли из аккаунта.');
  } else {
    loginModal.classList.remove('hidden');
  }
});

closeLoginBtn.addEventListener('click', () => {
  loginModal.classList.add('hidden');
});

doLoginBtn.addEventListener('click', () => {
  const name = usernameInput.value.trim();
  if (name === '') {
    alert('Пожалуйста, введите ваше имя!');
    return;
  }
  currentUser = name;
  loginBtn.textContent = `Привет, ${currentUser}`; // Меняем кнопку при успешном входе
  loginModal.classList.add('hidden');
  usernameInput.value = '';
  document.getElementById('password').value = '';
});

// ==== Старт ====
renderProducts();
updateCartUI();
