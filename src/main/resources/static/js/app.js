// app.js - Frontend Logic

const state = {
    books: [],
    cart: JSON.parse(localStorage.getItem('cart')) || [],
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isRegistering: false
};

const API_URL = '/api'; // Using relative path since it's served by the same port

// DOM Elements
const productGrid = document.getElementById('productGrid');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const authBtn = document.getElementById('authBtn');
const authModal = document.getElementById('authModal');
const authForm = document.getElementById('authForm');
const closeModals = document.querySelectorAll('.close-modal');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.querySelector('.cart-count');
const usernameDisplay = document.getElementById('usernameDisplay');
const authTitle = document.getElementById('authTitle');
const switchAuth = document.getElementById('switchAuth');

// Initialize
function init() {
    fetchBooks();
    updateCartUI();
    updateAuthUI();
    setupEventListeners();
}

async function fetchBooks() {
    try {
        const response = await fetch(`${API_URL}/book/fetch-all`);
        state.books = await response.json();
        renderBooks();
    } catch (error) {
        console.error('Error fetching books:', error);
        productGrid.innerHTML = '<p class="error">Failed to load books. Please try again later.</p>';
    }
}

function renderBooks() {
    if (state.books.length === 0) {
        productGrid.innerHTML = '<p class="info">No books available at the moment.</p>';
        return;
    }

    productGrid.innerHTML = state.books.map(book => `
        <div class="book-card">
            <img src="${book.bookImage}" alt="${book.bookName}" class="book-img">
            <div class="book-info">
                <h3>${book.bookName}</h3>
                <p class="book-author">by ${book.authors.map(a => a.authorName).join(', ')}</p>
                <div class="book-footer">
                    <span class="book-price">₹${book.price}</span>
                    <button class="add-to-cart" onclick="addToCart('${book.bookId}')">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function addToCart(bookId) {
    const book = state.books.find(b => b.bookId === bookId);
    if (!book) return;

    const existing = state.cart.find(item => item.bookId === bookId);
    if (existing) {
        existing.quantity += 1;
    } else {
        state.cart.push({ ...book, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    showToast(`${book.bookName} added to cart!`);
}

window.addToCart = addToCart; // Make it global for onclick

function removeFromCart(bookId) {
    state.cart = state.cart.filter(item => item.bookId !== bookId);
    saveCart();
    updateCartUI();
}

window.removeFromCart = removeFromCart; // Make it global for onclick

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(state.cart));
}

function updateCartUI() {
    const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = count;

    cartItemsContainer.innerHTML = state.cart.map(item => `
        <div class="cart-item">
            <img src="${item.bookImage}" class="cart-item-img">
            <div class="cart-item-info">
                <h4>${item.bookName}</h4>
                <div class="cart-item-price">₹${item.price} x ${item.quantity}</div>
            </div>
            <div class="cart-item-remove" onclick="removeFromCart('${item.bookId}')">
                <i class="fas fa-trash"></i>
            </div>
        </div>
    `).join('');

    const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `₹${total.toFixed(2)}`;
}

function updateAuthUI() {
    if (state.user) {
        usernameDisplay.textContent = state.user.username;
        authBtn.classList.add('logged-in');
    } else {
        usernameDisplay.textContent = 'Login';
        authBtn.classList.remove('logged-in');
    }
}

function setupEventListeners() {
    cartBtn.onclick = () => cartModal.style.display = 'flex';
    authBtn.onclick = () => {
        if (state.user) {
            if (confirm('Do you want to logout?')) {
                logout();
            }
        } else {
            authModal.style.display = 'flex';
        }
    };

    closeModals.forEach(btn => {
        btn.onclick = () => {
            cartModal.style.display = 'none';
            authModal.style.display = 'none';
        };
    });

    window.onclick = (e) => {
        if (e.target === cartModal) cartModal.style.display = 'none';
        if (e.target === authModal) authModal.style.display = 'none';
    };

    switchAuth.onclick = (e) => {
        e.preventDefault();
        state.isRegistering = !state.isRegistering;
        authTitle.textContent = state.isRegistering ? 'Register' : 'Login';
        switchAuth.textContent = state.isRegistering ? 'Login' : 'Register';
    };

    authForm.onsubmit = async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (state.isRegistering) {
            handleRegister(username, password);
        } else {
            handleLogin(username, password);
        }
    };

    document.getElementById('checkoutBtn').onclick = handleCheckout;
}

async function handleLogin(username, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            state.token = data.jwt;
            state.user = { username }; 
            localStorage.setItem('token', state.token);
            localStorage.setItem('user', JSON.stringify(state.user));
            updateAuthUI();
            authModal.style.display = 'none';
            showToast('Login successful!');
        } else {
            showToast('Login failed. Check credentials.');
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast('Login error occurred.');
    }
}

async function handleRegister(username, password) {
    try {
        const response = await fetch(`${API_URL}/user/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, userRole: 'USER' })
        });

        if (response.ok) {
            showToast('Registration successful! Please login.');
            state.isRegistering = false;
            authTitle.textContent = 'Login';
            switchAuth.textContent = 'Register';
            authForm.reset();
        } else {
            showToast('Registration failed.');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showToast('Registration error occurred.');
    }
}

async function handleCheckout() {
    if (!state.token) {
        showToast('Please login to place an order.');
        authModal.style.display = 'flex';
        return;
    }

    if (state.cart.length === 0) {
        showToast('Your cart is empty.');
        return;
    }

    showToast('Processing order...');
    
    const bookIds = state.cart.map(item => item.bookId);
    const quantities = state.cart.map(item => item.quantity.toString());
    
    try {
        // Find existing address or use a placeholder for demo
        // Ideally we'd have an address creation step here.
        // For now, let's assume the user has a default address or create one.
        
        // This is a simplification for the demo
        const addressId = "DEFAULT_ADDR";
        
        const response = await fetch(`${API_URL}/order/create/${addressId}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${state.token}`
            },
            body: JSON.stringify([bookIds, quantities])
        });

        if (response.ok) {
            showToast('Order placed successfully!');
            state.cart = [];
            saveCart();
            updateCartUI();
            cartModal.style.display = 'none';
        } else {
            showToast('Checkout failed.');
        }
    } catch (error) {
        console.error('Checkout error:', error);
        showToast('Error during checkout.');
    }
}

function logout() {
    state.user = null;
    state.token = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    updateAuthUI();
    showToast('Logged out.');
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Style toast dynamically
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        background: '#e46533',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        zIndex: '3000',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        animation: 'slideIn 0.3s ease-out'
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = '0.5s';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// Add animation to toast
const style = document.createElement('style');
style.textContent = `
@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}
`;
document.head.appendChild(style);

init();
