AOS.init({ once: true, offset: 100 });

const style = document.createElement('style');
style.innerHTML = `@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }`;
document.head.appendChild(style);

// Global User State & Single-Use Coupon Tracker
let currentUser = null; 
const usedCoupons = {}; 

// Mobile Navigation Toggle Logic with Overlay Integration
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
const closeMobileMenuBtn = document.getElementById('close-mobile-menu');

function toggleMobileMenu() {
    mobileMenuDrawer.classList.toggle('translate-x-full');
    mobileNavOverlay.classList.toggle('hidden');
}

if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMobileMenu);
if (closeMobileMenuBtn) closeMobileMenuBtn.addEventListener('click', toggleMobileMenu);
if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', toggleMobileMenu);
}

// Close mobile menu when clicking nav links
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', toggleMobileMenu);
});

// Authentication Modal Logic
const authModal = document.getElementById('auth-modal-overlay');
const openAuthBtn = document.getElementById('open-auth-modal');
const mobileOpenAuthBtn = document.getElementById('mobile-open-auth-modal');
const closeAuthBtn = document.getElementById('close-auth-modal');
const authNavLabel = document.getElementById('auth-nav-label');
const mobileAuthNavLabel = document.getElementById('mobile-auth-nav-label');
const emailLoginForm = document.getElementById('email-login-form');
const loginEmailInput = document.getElementById('login-email');

function toggleAuthModal() {
    authModal.classList.toggle('hidden');
}

function handleAuthClick() {
    if (currentUser) {
        if (confirm(`Logged in as ${currentUser}. Do you want to log out?`)) {
            currentUser = null;
            authNavLabel.innerText = 'Login';
            if (mobileAuthNavLabel) mobileAuthNavLabel.innerText = 'Login';
            alert('You have been logged out.');
        }
    } else {
        toggleAuthModal();
    }
}

if (openAuthBtn) openAuthBtn.addEventListener('click', handleAuthClick);
if (mobileOpenAuthBtn) mobileOpenAuthBtn.addEventListener('click', handleAuthClick);
if (closeAuthBtn) closeAuthBtn.addEventListener('click', toggleAuthModal);
if (authModal) {
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) toggleAuthModal();
    });
}

function handleSuccessfulLogin(identifier) {
    currentUser = identifier;
    const shortId = identifier.length > 12 ? identifier.substring(0, 10) + '...' : identifier;
    authNavLabel.innerText = shortId;
    if (mobileAuthNavLabel) mobileAuthNavLabel.innerText = shortId;
    toggleAuthModal();
    alert(`Successfully logged in as ${identifier}!`);
}

window.mockSocialLogin = function(provider) {
    const fakeId = `user_${provider.toLowerCase()}_${Math.floor(Math.random() * 1000)}`;
    handleSuccessfulLogin(fakeId);
};

if (emailLoginForm) {
    emailLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginEmailInput.value.trim();
        if (email) {
            handleSuccessfulLogin(email);
        }
    });
}

// Privacy Policy Modal Logic
const privacyModal = document.getElementById('privacy-modal-overlay');
const openPrivacyBtn = document.getElementById('open-privacy-modal');
const closePrivacyBtn = document.getElementById('close-privacy-modal');

function togglePrivacyModal() {
    privacyModal.classList.toggle('hidden');
}

if (openPrivacyBtn) openPrivacyBtn.addEventListener('click', togglePrivacyModal);
if (closePrivacyBtn) closePrivacyBtn.addEventListener('click', togglePrivacyModal);
if (privacyModal) {
    privacyModal.addEventListener('click', (e) => {
        if (e.target === privacyModal) togglePrivacyModal();
    });
}

// Terms Modal Logic
const termsModal = document.getElementById('terms-modal-overlay');
const openTermsBtn = document.getElementById('open-terms-modal');
const closeTermsBtn = document.getElementById('close-terms-modal');

function toggleTermsModal() {
    termsModal.classList.toggle('hidden');
}

if (openTermsBtn) openTermsBtn.addEventListener('click', toggleTermsModal);
if (closeTermsBtn) closeTermsBtn.addEventListener('click', toggleTermsModal);
if (termsModal) {
    termsModal.addEventListener('click', (e) => {
        if (e.target === termsModal) toggleTermsModal();
    });
}

// Cookie Banner Logic
const cookieBanner = document.getElementById('cookie-banner');
const acceptCookiesBtn = document.getElementById('accept-cookies');
const declineCookiesBtn = document.getElementById('decline-cookies');

if (!localStorage.getItem('cookieConsent')) {
    cookieBanner.classList.remove('hidden');
}

if (acceptCookiesBtn) {
    acceptCookiesBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        cookieBanner.classList.add('hidden');
    });
}

if (declineCookiesBtn) {
    declineCookiesBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        cookieBanner.classList.add('hidden');
    });
}

// Helper to get strict UK Time Date object
function getUKTime() {
    const now = new Date();
    const ukTimeStr = now.toLocaleString("en-US", { timeZone: "Europe/London" });
    return new Date(ukTimeStr);
}

// Automatic Store Open/Closed Check based on UK time (12:00 PM to 11:30 PM daily)
function checkStoreHours() {
    const ukNow = getUKTime();
    const currentHour = ukNow.getHours();
    const currentMinute = ukNow.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    
    const openTimeInMinutes = 12 * 60; // 12:00 PM
    const closeTimeInMinutes = 23 * 60 + 30; // 11:30 PM

    const banner = document.getElementById('store-status-banner');
    if (banner) {
        if (currentTimeInMinutes < openTimeInMinutes || currentTimeInMinutes > closeTimeInMinutes) {
            banner.classList.remove('hidden');
        } else {
            banner.classList.add('hidden');
        }
    }
}
checkStoreHours();

// Conditional Friday Check using UK Time
function checkFridayFusionAvailability() {
    const ukNow = getUKTime();
    const dayOfWeek = ukNow.getDay(); // 5 represents Friday in UK time
    const fridayContainer = document.getElementById('friday-fusion-container');
    
    if (fridayContainer) {
        if (dayOfWeek === 5) {
            fridayContainer.style.display = 'block';
        } else {
            fridayContainer.style.display = 'none';
        }
    }
}
checkFridayFusionAvailability();

// Lenis Smooth Scroll Setup
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Single-click smooth scroll for Order Now buttons
document.querySelectorAll('.smooth-scroll-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector('#menu');
        if (target) {
            lenis.scrollTo(target);
        }
    });
});

// Real Synchronized Friday Countdown Target Logic using UK Time
function updateCountdown() {
    const ukNow = getUKTime();
    const target = new Date(ukNow);
    
    let dayOfWeek = ukNow.getDay();
    let daysUntilFriday = (5 - dayOfWeek + 7) % 7;
    if (daysUntilFriday === 0 && (ukNow.getHours() > 23 || (ukNow.getHours() === 23 && ukNow.getMinutes() >= 59))) {
        daysUntilFriday = 7;
    }
    
    target.setDate(ukNow.getDate() + daysUntilFriday);
    target.setHours(23, 59, 59, 999);

    const distance = target - ukNow;
    if (distance < 0) return;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minsEl = document.getElementById("minutes");
    const secsEl = document.getElementById("seconds");

    if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
    if (minsEl) minsEl.innerText = String(minutes).padStart(2, '0');
    if (secsEl) secsEl.innerText = String(seconds).padStart(2, '0');
}
setInterval(updateCountdown, 1000);
updateCountdown();

// Validated Signup Form Handler with strict SMS phone checking
const signupForm = document.getElementById('signup-form');
const signupSuccessMsg = document.getElementById('signup-success-msg');
const signupError = document.getElementById('signup-error');
const emailInput = document.getElementById('signup-email');
const phoneInput = document.getElementById('signup-phone');
const consentEmail = document.getElementById('consent-email');
const consentSms = document.getElementById('consent-sms');

if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailVal = emailInput.value.trim();
        const phoneVal = phoneInput.value.trim();
        const hasEmailConsent = consentEmail.checked;
        const hasSmsConsent = consentSms.checked;
        const hasAnyConsent = hasEmailConsent || hasSmsConsent;

        if (hasSmsConsent && !phoneVal) {
            signupError.innerText = 'Please provide a phone number to receive SMS/WhatsApp updates.';
            signupError.classList.remove('hidden');
            signupSuccessMsg.classList.add('hidden');
            return;
        }

        if (!emailVal || !emailVal.includes('@') || !hasAnyConsent) {
            signupError.innerText = 'Please provide a valid email and check at least one consent box.';
            signupError.classList.remove('hidden');
            signupSuccessMsg.classList.add('hidden');
            return;
        }

        signupError.classList.add('hidden');
        signupSuccessMsg.classList.remove('hidden');
    });
}

// Cart State & Logic with Stable IDs & Single-Use Per-User Promo Code Validation
let cart = [];
let discountActive = false;

const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const openCartBtn = document.getElementById('open-cart');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const cartCountElement = document.getElementById('cart-count');
const checkoutBtnCard = document.getElementById('checkout-btn-card');
const checkoutBtnWA = document.getElementById('checkout-btn-wa');
const specialInstructionsInput = document.getElementById('special-instructions');
const promoInput = document.getElementById('promo-code');
const applyPromoBtn = document.getElementById('apply-promo');
const promoMsg = document.getElementById('promo-msg');
const discountRow = document.getElementById('discount-row');
const cartDiscountElement = document.getElementById('cart-discount');

function toggleCart() {
    cartDrawer.classList.toggle('translate-x-full');
    cartOverlay.classList.toggle('hidden');
}

if (openCartBtn) openCartBtn.addEventListener('click', toggleCart);
if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);

if (applyPromoBtn) {
    applyPromoBtn.addEventListener('click', () => {
        const code = promoInput.value.trim().toUpperCase();
        
        if (!currentUser) {
            promoMsg.classList.remove('hidden');
            promoMsg.innerText = 'Please log in first to apply promo codes.';
            toggleAuthModal();
            return;
        }

        if (!usedCoupons[currentUser]) {
            usedCoupons[currentUser] = new Set();
        }

        if (usedCoupons[currentUser].has(code)) {
            promoMsg.classList.remove('hidden');
            promoMsg.innerText = 'You have already used this coupon code!';
            return;
        }

        if (code === 'WELCOME10') {
            discountActive = true;
            usedCoupons[currentUser].add(code);
            promoMsg.classList.remove('hidden');
            promoMsg.innerText = '10% discount applied successfully!';
            renderCart();
        } else {
            promoMsg.classList.remove('hidden');
            promoMsg.innerText = 'Invalid promo code.';
        }
    });
}

// Attach event listeners using stable semantic <button> elements
document.querySelectorAll('.menu-card').forEach(card => {
    const minusBtn = card.querySelector('.minus-btn');
    const plusBtn = card.querySelector('.plus-btn');
    const qtyDisplay = card.querySelector('.qty-display');
    const nameEl = card.querySelector('.item-name');
    const priceEl = card.querySelector('.item-price');

    if (minusBtn && plusBtn && qtyDisplay && nameEl && priceEl) {
        const itemId = nameEl.getAttribute('data-id') || nameEl.innerText.trim();
        const itemName = nameEl.innerText.trim();
        const itemPrice = parseFloat(priceEl.getAttribute('data-price') || priceEl.innerText.replace('£', '').trim());
        let currentQty = 0;

        plusBtn.addEventListener('click', () => {
            currentQty++;
            qtyDisplay.innerText = currentQty;
            updateCartItem(itemId, itemName, itemPrice, currentQty);
        });

        minusBtn.addEventListener('click', () => {
            if (currentQty > 0) {
                currentQty--;
                qtyDisplay.innerText = currentQty;
                updateCartItem(itemId, itemName, itemPrice, currentQty);
            }
        });
    }
});

function updateCartItem(id, name, price, quantity) {
    const existingIndex = cart.findIndex(item => item.id === id);

    if (quantity > 0) {
        if (existingIndex > -1) {
            cart[existingIndex].quantity = quantity;
        } else {
            cart.push({ id, name, price, quantity });
        }
    } else {
        if (existingIndex > -1) {
            cart.splice(existingIndex, 1);
        }
    }

    renderCart();
}

function renderCart() {
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-gray-400 text-center py-10">Your cart is empty.</p>';
        cartTotalElement.innerText = '£0.00';
        cartCountElement.innerText = '0';
        discountRow.style.display = 'none';
        return;
    }

    let subtotal = 0;
    let totalCount = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        totalCount += item.quantity;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'flex justify-between items-center bg-black/40 p-3 rounded-lg border border-white/5';
        
        // Render editable cart items with inline plus/minus buttons
        itemDiv.innerHTML = `
            <div>
                <h4 class="font-bold text-white text-sm">${item.name}</h4>
                <p class="text-accent text-xs">£${item.price.toFixed(2)} each</p>
            </div>
            <div class="flex items-center gap-3">
                <div class="flex items-center gap-2 bg-black p-1 rounded-full border border-white/10">
                    <button type="button" aria-label="Decrease quantity" onclick="adjustCartQuantity('${item.id}', -1)" class="qty-btn w-6 h-6 text-xs flex items-center justify-center font-bold bg-white/10 rounded-full hover:bg-accent hover:text-black transition">-</button>
                    <span class="font-bold w-5 text-center text-xs text-white">${item.quantity}</span>
                    <button type="button" aria-label="Increase quantity" onclick="adjustCartQuantity('${item.id}', 1)" class="qty-btn w-6 h-6 text-xs flex items-center justify-center font-bold bg-white/10 rounded-full hover:bg-accent hover:text-black transition">+</button>
                </div>
                <div class="font-bebas text-xl text-white min-w-[50px] text-right">£${itemTotal.toFixed(2)}</div>
            </div>
        `;
        cartItemsContainer.appendChild(itemDiv);
    });

    let finalTotal = subtotal;
    if (discountActive) {
        const discountAmt = subtotal * 0.10;
        finalTotal = subtotal - discountAmt;
        discountRow.style.display = 'flex';
        cartDiscountElement.innerText = `-£${discountAmt.toFixed(2)}`;
    } else {
        discountRow.style.display = 'none';
    }

    cartTotalElement.innerText = `£${finalTotal.toFixed(2)}`;
    cartCountElement.innerText = totalCount;
}

// Global helper function to adjust quantities directly from the cart drawer and sync main menu counters
window.adjustCartQuantity = function(id, change) {
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        
        renderCart();
        
        // Sync with main menu card counters if present on the page
        const menuCard = document.querySelector(`.menu-card .item-name[data-id="${id}"]`)?.closest('.menu-card');
        if (menuCard) {
            const qtyDisplay = menuCard.querySelector('.qty-display');
            const matchingCartItem = cart.find(item => item.id === id);
            if (qtyDisplay) {
                qtyDisplay.innerText = matchingCartItem ? matchingCartItem.quantity : 0;
            }
        }
    }
};

if (checkoutBtnCard) {
    checkoutBtnCard.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        alert('Connecting to payment gateway... \n\n(Developer note: Add your Stripe/Square/Payment integration here)');
    });
}

if (checkoutBtnWA) {
    checkoutBtnWA.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        let message = "🍔 *NEW SMASH GUYS ORDER* 🍔\n\n";
        let subtotal = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            message += `• ${item.quantity}x ${item.name} - £${itemTotal.toFixed(2)}\n`;
        });

        let finalTotal = subtotal;
        if (discountActive) {
            const discountAmt = subtotal * 0.10;
            finalTotal = subtotal - discountAmt;
            message += `\nSubtotal: £${subtotal.toFixed(2)}`;
            message += `\nDiscount (WELCOME10): -£${discountAmt.toFixed(2)}`;
        }

        message += `\n*Total Due: £${finalTotal.toFixed(2)}*`;

        const notes = specialInstructionsInput.value.trim();
        if (notes) {
            message += `\n\n*Special Instructions:* ${notes}`;
        }

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    });
}