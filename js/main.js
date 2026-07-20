/* ==========================================================================
   ApexStore Main Application Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCart();
  initWishlist();
  initCountdownTimer();
  initNewsletter();
  initMobileMenu();
  initAddToCartButtons();
});

/* ==========================================================================
   Cart State & LocalStorage Management
   ========================================================================== */
function getCartItems() {
  const stored = localStorage.getItem('apex_cart');
  return stored ? JSON.parse(stored) : [];
}

function saveCartItems(cart) {
  localStorage.setItem('apex_cart', JSON.stringify(cart));
  updateCartBadge();
}

function initCart() {
  updateCartBadge();
}

function updateCartBadge() {
  const cart = getCartItems();
  const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  
  const badges = document.querySelectorAll('.cart-badge-count');
  badges.forEach(badge => {
    badge.textContent = totalCount;
    badge.style.display = totalCount > 0 ? 'flex' : 'none';
  });

  const totalAmountEl = document.querySelector('.cart-total-val');
  if (totalAmountEl) {
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    totalAmountEl.textContent = `$${totalAmount.toFixed(2)}`;
  }
}

function addToCart(product) {
  let cart = getCartItems();
  const existingIndex = cart.findIndex(item => item.id === product.id);

  if (existingIndex > -1) {
    cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCartItems(cart);
  showToast('Item Added to Cart!', `${product.title} has been added to your shopping bag.`);
}

function initAddToCartButtons() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-add-cart');
    if (!btn) return;

    e.preventDefault();
    const card = btn.closest('.product-card');
    if (!card) return;

    const productId = card.dataset.id || Math.random().toString(36).substring(2, 9);
    const title = card.querySelector('.product-title')?.textContent?.trim() || 'Featured Product';
    const priceText = card.querySelector('.current-price')?.textContent?.replace(/[^0-9.]/g, '') || '49.99';
    const price = parseFloat(priceText);

    // Button animation feedback
    const originalText = btn.innerHTML;
    btn.style.pointerEvents = 'none';
    btn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="spin">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg> Added!
    `;

    addToCart({ id: productId, title, price });

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.pointerEvents = 'all';
    }, 1000);
  });
}

/* ==========================================================================
   Wishlist Functionality
   ========================================================================== */
function initWishlist() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.wishlist-btn');
    if (!btn) return;

    e.preventDefault();
    btn.classList.toggle('active');
    const isSaved = btn.classList.contains('active');
    
    const svg = btn.querySelector('svg');
    if (svg) {
      if (isSaved) {
        svg.setAttribute('fill', '#ef4444');
        svg.setAttribute('stroke', '#ef4444');
        showToast('Added to Wishlist', 'Item saved to your personal wishlist.');
      } else {
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        showToast('Removed from Wishlist', 'Item removed from your wishlist.');
      }
    }
  });
}

/* ==========================================================================
   Toast Notification System
   ========================================================================== */
function showToast(title, message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <div class="toast-icon">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    </div>
    <div class="toast-content">
      <p>${title}</p>
      <span>${message}</span>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ==========================================================================
   Flash Sale Countdown Timer
   ========================================================================== */
function initCountdownTimer() {
  const hoursEl = document.getElementById('timer-hours');
  const minsEl = document.getElementById('timer-mins');
  const secsEl = document.getElementById('timer-secs');

  if (!hoursEl || !minsEl || !secsEl) return;

  // Set target to 12 hours from now
  let totalSeconds = (12 * 3600) + (45 * 60) + 30;

  const timer = setInterval(() => {
    if (totalSeconds <= 0) {
      clearInterval(timer);
      return;
    }

    totalSeconds--;

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);

    hoursEl.textContent = String(h).padStart(2, '0');
    minsEl.textContent = String(m).padStart(2, '0');
    secsEl.textContent = String(s).padStart(2, '0');
  }, 1000);
}

/* ==========================================================================
   Newsletter Form Handler
   ========================================================================== */
function initNewsletter() {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (!input || !input.value) return;

    showToast('Subscribed Successfully!', 'Thank you for joining our VIP newsletter list.');
    input.value = '';
  });
}

/* ==========================================================================
   Mobile Navigation Toggle
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
  });
}
