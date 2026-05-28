/* ============================================================
   app.js – BobaViet · Full Website JavaScript
   Gồm: Giỏ hàng, Thực đơn, Đặt hàng, Liên hệ, Đăng nhập
   ============================================================ */

/* ────────────────────────────────────────────────────────────
   1. DỮ LIỆU SẢN PHẨM (Mock Database)
   ──────────────────────────────────────────────────────────── */
const PRODUCTS = [
  { id: 1,  name: 'Trà Sữa Trân Châu',      desc: 'Trân châu đen, sữa tươi, trà đen thơm',    price: 35000, cat: 'tra-sua',    badge: 'hot',  emoji: '🧋', bg: '#FBEAF0', stars: 5, reviews: 128 },
  { id: 2,  name: 'Trà Đào Cam Sả',          desc: 'Đào tươi, cam vắt, sả thơm mát',           price: 40000, cat: 'tra-trai',   badge: 'new',  emoji: '🍵', bg: '#E1F5EE', stars: 4, reviews: 84  },
  { id: 3,  name: 'Cà Phê Sữa Đá',           desc: 'Robusta, sữa đặc, đá viên',                price: 30000, cat: 'ca-phe',     badge: 'hot',  emoji: '☕', bg: '#FAEEDA', stars: 5, reviews: 210 },
  { id: 4,  name: 'Nước Ép Dưa Hấu',         desc: 'Dưa hấu tươi, không đường, mát lạnh',     price: 25000, cat: 'nuoc-ep',    badge: '',     emoji: '🧃', bg: '#EEEDFE', stars: 4, reviews: 56  },
  { id: 5,  name: 'Khoai Tây Chiên',          desc: 'Giòn rụm, muối phô mai, sốt tương cà',   price: 20000, cat: 'an-vat',     badge: 'sale', emoji: '🍟', bg: '#EAF3DE', stars: 4, reviews: 97  },
  { id: 6,  name: 'Bánh Bông Lan Pho Mai',   desc: 'Mềm mịn, cream cheese tươi, ngọt vừa',   price: 22000, cat: 'banh',       badge: '',     emoji: '🍰', bg: '#FBEAF0', stars: 5, reviews: 73  },
  { id: 7,  name: 'Matcha Latte',             desc: 'Bột matcha Nhật, sữa tươi, đường nâu',   price: 45000, cat: 'tra-sua',    badge: 'new',  emoji: '🍵', bg: '#E1F5EE', stars: 5, reviews: 62  },
  { id: 8,  name: 'Bánh Tráng Nướng',        desc: 'Hành mỡ, ruốc, trứng cút thơm ngon',     price: 18000, cat: 'an-vat',     badge: 'sale', emoji: '🍢', bg: '#FAEEDA', stars: 4, reviews: 145 },
  { id: 9,  name: 'Hồng Trà Sữa Tươi',       desc: 'Hồng trà đậm, sữa tươi 100%, béo ngậy', price: 38000, cat: 'tra-sua',    badge: '',     emoji: '🧋', bg: '#FBEAF0', stars: 4, reviews: 91  },
  { id: 10, name: 'Nước Ép Cam Tươi',         desc: 'Cam vắt nguyên chất, vitamin C cao',      price: 28000, cat: 'nuoc-ep',    badge: '',     emoji: '🍊', bg: '#FAEEDA', stars: 5, reviews: 103 },
  { id: 11, name: 'Xúc Xích Chiên',           desc: 'Xúc xích Đức, giòn ngoài mềm trong',    price: 25000, cat: 'an-vat',     badge: '',     emoji: '🌭', bg: '#FBEAF0', stars: 4, reviews: 67  },
  { id: 12, name: 'Cà Phê Bạc Xỉu',          desc: 'Cà phê arabica, sữa tươi, đá bào mịn',  price: 32000, cat: 'ca-phe',     badge: '',     emoji: '☕', bg: '#FAEEDA', stars: 5, reviews: 188 },
];

const VOUCHERS = {
  'BOBA20':   { discount: 20000, desc: 'Giảm 20.000đ cho đơn từ 50.000đ' },
  'FREESHIP': { discount: 15000, desc: 'Miễn phí giao hàng'               },
  'NEWUSER':  { discount: 30000, desc: 'Ưu đãi khách hàng mới -30.000đ'  },
  'SALE10':   { discount: 10000, desc: 'Giảm 10.000đ mọi đơn hàng'        },
};

const SHIP_FEE = 15000;


/* ────────────────────────────────────────────────────────────
   2. GIỎ HÀNG (Cart) – Lưu vào localStorage
   ──────────────────────────────────────────────────────────── */
const Cart = {
  _key: 'bobaviet_cart',

  /** Lấy toàn bộ giỏ hàng */
  get() {
    try { return JSON.parse(localStorage.getItem(this._key)) || []; }
    catch { return []; }
  },

  /** Lưu giỏ hàng */
  save(items) {
    localStorage.setItem(this._key, JSON.stringify(items));
    this._broadcast();
  },

  /** Thêm sản phẩm */
  add(productId, qty = 1) {
    const items = this.get();
    const idx   = items.findIndex(i => i.id === productId);
    if (idx > -1) items[idx].qty += qty;
    else {
      const p = PRODUCTS.find(p => p.id === productId);
      if (p) items.push({ id: p.id, name: p.name, price: p.price, emoji: p.emoji, bg: p.bg, qty });
    }
    this.save(items);
    Toast.show(`🛒 Đã thêm vào giỏ hàng!`, 'success');
  },

  /** Cập nhật số lượng */
  updateQty(productId, qty) {
    const items = this.get();
    const idx   = items.findIndex(i => i.id === productId);
    if (idx > -1) {
      if (qty <= 0) items.splice(idx, 1);
      else items[idx].qty = qty;
    }
    this.save(items);
  },

  /** Xóa sản phẩm */
  remove(productId) {
    const items = this.get().filter(i => i.id !== productId);
    this.save(items);
    Toast.show('🗑️ Đã xóa khỏi giỏ hàng', 'info');
  },

  /** Xóa toàn bộ */
  clear() { localStorage.removeItem(this._key); this._broadcast(); },

  /** Tổng số lượng */
  totalQty() { return this.get().reduce((s, i) => s + i.qty, 0); },

  /** Tổng tiền hàng */
  totalPrice() { return this.get().reduce((s, i) => s + i.price * i.qty, 0); },

  /** Phát sự kiện cập nhật */
  _broadcast() {
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
};


/* ────────────────────────────────────────────────────────────
   3. TOAST NOTIFICATIONS
   ──────────────────────────────────────────────────────────── */
const Toast = {
  container: null,

  init() {
    if (document.getElementById('toast-container')) return;
    const el = document.createElement('div');
    el.id = 'toast-container';
    el.style.cssText = `
      position:fixed; bottom:24px; right:24px; z-index:9999;
      display:flex; flex-direction:column; gap:10px;
    `;
    document.body.appendChild(el);
    this.container = el;
  },

  show(msg, type = 'success', duration = 3000) {
    this.init();
    const colors = {
      success: { bg: '#EAF3DE', border: '#97C459', color: '#27500A' },
      error:   { bg: '#FEE2E2', border: '#FCA5A5', color: '#B91C1C' },
      info:    { bg: '#EEEDFE', border: '#A5A0F0', color: '#3C3489' },
      warning: { bg: '#FAEEDA', border: '#F0C674', color: '#633806' },
    };
    const c = colors[type] || colors.success;
    const t = document.createElement('div');
    t.style.cssText = `
      background:${c.bg}; border:1.5px solid ${c.border}; color:${c.color};
      padding:12px 18px; border-radius:12px; font-size:13px; font-weight:600;
      font-family:'Nunito',sans-serif; box-shadow:0 4px 20px rgba(0,0,0,.12);
      max-width:300px; animation:slideIn .3s ease;
    `;
    t.textContent = msg;

    if (!document.getElementById('toast-anim')) {
      const s = document.createElement('style');
      s.id = 'toast-anim';
      s.textContent = `
        @keyframes slideIn { from { transform:translateX(120%); opacity:0 } to { transform:translateX(0); opacity:1 } }
        @keyframes slideOut{ from { transform:translateX(0); opacity:1 } to { transform:translateX(120%); opacity:0 } }
      `;
      document.head.appendChild(s);
    }

    this.container.appendChild(t);
    setTimeout(() => {
      t.style.animation = 'slideOut .3s ease forwards';
      setTimeout(() => t.remove(), 300);
    }, duration);
  },
};


/* ────────────────────────────────────────────────────────────
   4. CẬP NHẬT BADGE GIỎ HÀNG TRÊN NAV
   ──────────────────────────────────────────────────────────── */
function updateCartBadge() {
  const badges = document.querySelectorAll('.cart-badge');
  const qty    = Cart.totalQty();
  badges.forEach(b => {
    b.textContent = qty;
    b.style.display = qty > 0 ? 'flex' : 'none';
  });
}

document.addEventListener('cart:updated', updateCartBadge);


/* ────────────────────────────────────────────────────────────
   5. TRANG CHỦ (index.html)
   ──────────────────────────────────────────────────────────── */
function initHomePage() {
  if (!document.querySelector('.hero')) return;

  updateCartBadge();

  /* Danh mục filter */
  document.querySelectorAll('.cat-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

  /* Nút thêm giỏ hàng trang chủ */
  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const card = btn.closest('.prod-card');
      const name = card?.querySelector('.prod-name')?.textContent || '';
      /* Tìm product theo tên */
      const p = PRODUCTS.find(p => name.includes(p.name.split(' ')[0]));
      if (p) Cart.add(p.id);
      else Toast.show('🛒 Đã thêm vào giỏ hàng!', 'success');

      btn.textContent = '✓';
      btn.style.background = '#1A8C6E';
      setTimeout(() => { btn.textContent = '+'; btn.style.background = ''; }, 1500);
    });
  });

  /* Đếm ngược khuyến mãi */
  initCountdown();
}


/* ────────────────────────────────────────────────────────────
   6. ĐỒNG HỒ ĐẾM NGƯỢC KHUYẾN MÃI
   ──────────────────────────────────────────────────────────── */
function initCountdown() {
  const el = document.getElementById('countdown');
  if (!el) return;

  const end = new Date();
  end.setHours(23, 59, 59, 0);

  function tick() {
    const now  = new Date();
    const diff = Math.max(0, Math.floor((end - now) / 1000));
    const h    = String(Math.floor(diff / 3600)).padStart(2, '0');
    const m    = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
    const s    = String(diff % 60).padStart(2, '0');
    el.textContent = `${h}:${m}:${s}`;
  }

  tick();
  setInterval(tick, 1000);
}


/* ────────────────────────────────────────────────────────────
   7. TRANG THỰC ĐƠN (menu.html)
   ──────────────────────────────────────────────────────────── */
function initMenuPage() {
  if (!document.querySelector('.menu-layout')) return;

  updateCartBadge();

  let currentCat    = 'all';
  let currentSort   = 'default';
  let currentSearch = '';
  let currentFilters = [];
  let currentPage   = 1;
  const PER_PAGE    = 8;

  /* --- Render sản phẩm --- */
  function renderProducts() {
    let list = [...PRODUCTS];

    // Filter by category
    if (currentCat !== 'all') list = list.filter(p => p.cat === currentCat);

    // Filter by chip
    if (currentFilters.includes('hot'))  list = list.filter(p => p.badge === 'hot');
    if (currentFilters.includes('new'))  list = list.filter(p => p.badge === 'new');
    if (currentFilters.includes('sale')) list = list.filter(p => p.badge === 'sale');
    if (currentFilters.includes('top'))  list = list.filter(p => p.stars === 5);

    // Search
    if (currentSearch) {
      const q = currentSearch.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
    }

    // Sort
    if (currentSort === 'price-asc')  list.sort((a, b) => a.price - b.price);
    if (currentSort === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (currentSort === 'popular')    list.sort((a, b) => b.reviews - a.reviews);
    if (currentSort === 'newest')     list.sort((a, b) => b.id - a.id);

    // Pagination
    const total     = list.length;
    const pages     = Math.ceil(total / PER_PAGE);
    currentPage     = Math.min(currentPage, pages || 1);
    const start     = (currentPage - 1) * PER_PAGE;
    const paginated = list.slice(start, start + PER_PAGE);

    // Info
    const infoEl = document.querySelector('.result-info');
    if (infoEl) infoEl.textContent = `Hiển thị ${paginated.length} / ${total} sản phẩm`;

    // Grid
    const grid = document.querySelector('.prod-grid');
    if (!grid) return;

    if (paginated.length === 0) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:#9999BB;font-size:15px;">
        😔 Không tìm thấy sản phẩm phù hợp.
      </div>`;
    } else {
      grid.innerHTML = paginated.map(p => `
        <div class="prod-card" data-id="${p.id}">
          <div class="prod-thumb" style="background:${p.bg};">
            <span style="font-size:56px;">${p.emoji}</span>
            ${p.badge ? `<span class="prod-badge badge-${p.badge}">${badgeLabel(p.badge)}</span>` : ''}
          </div>
          <div class="prod-body">
            <div class="prod-name">${p.name}</div>
            <div class="prod-desc">${p.desc}</div>
            <div class="prod-foot">
              <div>
                <div class="prod-price">${fmt(p.price)}</div>
                <div class="prod-stars">
                  <span>${'★'.repeat(p.stars)}${'☆'.repeat(5 - p.stars)}</span> (${p.reviews})
                </div>
              </div>
              <button class="add-btn" data-id="${p.id}">+</button>
            </div>
          </div>
        </div>
      `).join('');

      // Gắn sự kiện thêm giỏ
      grid.querySelectorAll('.add-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          e.stopPropagation();
          Cart.add(parseInt(btn.dataset.id));
          btn.textContent = '✓';
          btn.style.background = '#1A8C6E';
          setTimeout(() => { btn.textContent = '+'; btn.style.background = ''; }, 1500);
          renderCartMini();
        });
      });

      // Mở modal chi tiết khi click card
      grid.querySelectorAll('.prod-card').forEach(card => {
        card.addEventListener('click', e => {
          if (e.target.classList.contains('add-btn')) return;
          openProductModal(parseInt(card.dataset.id));
        });
      });
    }

    renderPagination(pages);
  }

  function badgeLabel(badge) {
    return { hot: 'Hot 🔥', new: 'Mới ✨', sale: 'Sale 🏷️' }[badge] || '';
  }

  /* --- Pagination --- */
  function renderPagination(pages) {
    const el = document.querySelector('.pagination');
    if (!el) return;
    if (pages <= 1) { el.innerHTML = ''; return; }

    let html = `<button class="page-btn" onclick="menuGoPage(${currentPage - 1})">‹</button>`;
    for (let i = 1; i <= pages; i++) {
      html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="menuGoPage(${i})">${i}</button>`;
    }
    html += `<button class="page-btn" onclick="menuGoPage(${currentPage + 1})">›</button>`;
    el.innerHTML = html;
  }

  window.menuGoPage = function(p) {
    const pages = Math.ceil(filterList().length / PER_PAGE);
    currentPage = Math.max(1, Math.min(p, pages || 1));
    renderProducts();
    document.querySelector('.menu-layout')?.scrollIntoView({ behavior: 'smooth' });
  };

  function filterList() {
    let list = [...PRODUCTS];
    if (currentCat !== 'all') list = list.filter(p => p.cat === currentCat);
    if (currentSearch) { const q = currentSearch.toLowerCase(); list = list.filter(p => p.name.toLowerCase().includes(q)); }
    return list;
  }

  /* --- Danh mục sidebar --- */
  document.querySelectorAll('.cat-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.cat-item').forEach(c => c.classList.remove('active'));
      item.classList.add('active');
      currentCat  = item.dataset.cat || 'all';
      currentPage = 1;
      renderProducts();
    });
  });

  /* --- Chip filter --- */
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('on');
      const key = chip.dataset.filter;
      if (currentFilters.includes(key)) currentFilters = currentFilters.filter(f => f !== key);
      else currentFilters.push(key);
      currentPage = 1;
      renderProducts();
    });
  });

  /* --- Tìm kiếm --- */
  const searchInput = document.querySelector('.search-wrap input');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(e => {
      currentSearch = e.target.value.trim();
      currentPage   = 1;
      renderProducts();
    }, 350));
  }

  /* --- Sắp xếp --- */
  const sortSel = document.querySelector('.sort-sel');
  if (sortSel) {
    sortSel.addEventListener('change', e => {
      const map = { '0': 'default', '1': 'price-asc', '2': 'price-desc', '3': 'popular', '4': 'newest' };
      currentSort = map[e.target.selectedIndex] || 'default';
      currentPage = 1;
      renderProducts();
    });
  }

  /* --- Lọc giá --- */
  document.querySelectorAll('input[name="price"]').forEach(radio => {
    radio.addEventListener('change', () => { currentPage = 1; renderProducts(); });
  });

  /* --- Cart mini --- */
  function renderCartMini() {
    const items = Cart.get();
    const listEl = document.querySelector('.cart-mini-items');
    const totalEl = document.querySelector('.cart-total-price');
    if (listEl) {
      listEl.innerHTML = items.length === 0
        ? '<p style="font-size:12px;color:#9999BB;text-align:center;padding:8px 0;">Giỏ hàng trống</p>'
        : items.map(i => `
            <div class="cart-mini-item">
              <span>${i.emoji} ${i.name} ×${i.qty}</span>
              <span>${fmt(i.price * i.qty)}</span>
            </div>`).join('');
    }
    if (totalEl) totalEl.textContent = fmt(Cart.totalPrice());
    updateCartBadge();
  }

  document.addEventListener('cart:updated', renderCartMini);
  renderCartMini();
  renderProducts();
}

/* --- Modal chi tiết sản phẩm --- */
function openProductModal(id) {
  const p = PRODUCTS.find(p => p.id === id);
  if (!p) return;

  const existing = document.getElementById('product-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'product-modal';
  modal.style.cssText = `
    position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,.5);
    display:flex;align-items:center;justify-content:center;padding:20px;
    animation:fadeIn .2s ease;
  `;

  modal.innerHTML = `
    <div style="
      background:#fff;border-radius:20px;max-width:480px;width:100%;
      overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.2);
      animation:slideUp .3s ease;
    ">
      <div style="background:${p.bg};height:160px;display:flex;align-items:center;justify-content:center;font-size:80px;position:relative;">
        ${p.emoji}
        <button onclick="document.getElementById('product-modal').remove()" style="
          position:absolute;top:12px;right:12px;width:32px;height:32px;border-radius:50%;
          border:none;background:rgba(255,255,255,.8);font-size:18px;cursor:pointer;
        ">✕</button>
        ${p.badge ? `<span style="
          position:absolute;top:12px;left:12px;font-size:11px;font-weight:700;
          padding:3px 10px;border-radius:20px;
          background:${p.badge==='hot'?'#FEE2E2':p.badge==='new'?'#EEEDFE':'#FAEEDA'};
          color:${p.badge==='hot'?'#B91C1C':p.badge==='new'?'#534AB7':'#D97706'};
        ">${p.badge==='hot'?'Hot 🔥':p.badge==='new'?'Mới ✨':'Sale 🏷️'}</span>` : ''}
      </div>
      <div style="padding:24px;">
        <h2 style="font-family:'Playfair Display',serif;font-size:22px;margin-bottom:6px;">${p.name}</h2>
        <p style="font-size:13px;color:#5C5C7A;margin-bottom:12px;">${p.desc}</p>
        <div style="display:flex;gap:4px;margin-bottom:16px;color:#F59E0B;font-size:14px;">
          ${'★'.repeat(p.stars)}${'☆'.repeat(5-p.stars)}
          <span style="font-size:12px;color:#9999BB;margin-left:4px;">(${p.reviews} đánh giá)</span>
        </div>
        <div style="margin-bottom:16px;">
          <p style="font-size:12px;font-weight:600;color:#5C5C7A;margin-bottom:8px;">Chọn size:</p>
          <div style="display:flex;gap:8px;" id="size-opts">
            <button onclick="selectSize(this,'S')" class="size-btn" style="padding:6px 16px;border-radius:8px;border:1.5px solid #E8E8F0;background:#fff;cursor:pointer;font-size:13px;font-weight:600;">S</button>
            <button onclick="selectSize(this,'M')" class="size-btn active-size" style="padding:6px 16px;border-radius:8px;border:1.5px solid #D4537E;background:#FBEAF0;color:#D4537E;cursor:pointer;font-size:13px;font-weight:600;">M</button>
            <button onclick="selectSize(this,'L')" class="size-btn" style="padding:6px 16px;border-radius:8px;border:1.5px solid #E8E8F0;background:#fff;cursor:pointer;font-size:13px;font-weight:600;">L</button>
          </div>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div>
            <span style="font-size:11px;color:#9999BB;">Giá</span>
            <div style="font-size:26px;font-weight:700;color:#D4537E;">${fmt(p.price)}</div>
          </div>
          <div style="display:flex;align-items:center;gap:10px;">
            <div style="display:flex;align-items:center;gap:8px;border:1.5px solid #E8E8F0;border-radius:10px;padding:4px 12px;">
              <button onclick="modalQty(-1)" style="background:none;border:none;font-size:20px;cursor:pointer;color:#5C5C7A;">−</button>
              <span id="modal-qty" style="font-size:16px;font-weight:700;min-width:20px;text-align:center;">1</span>
              <button onclick="modalQty(1)" style="background:none;border:none;font-size:20px;cursor:pointer;color:#5C5C7A;">+</button>
            </div>
            <button onclick="modalAddCart(${p.id})" style="
              padding:10px 22px;background:#D4537E;color:#fff;border:none;
              border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;
            ">🛒 Thêm vào giỏ</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });

  if (!document.getElementById('modal-anim')) {
    const s = document.createElement('style');
    s.id = 'modal-anim';
    s.textContent = `
      @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
      @keyframes slideUp { from{transform:translateY(30px);opacity:0} to{transform:translateY(0);opacity:1} }
    `;
    document.head.appendChild(s);
  }
}

window.selectSize = function(btn, size) {
  document.querySelectorAll('.size-btn').forEach(b => {
    b.style.borderColor = '#E8E8F0';
    b.style.background = '#fff';
    b.style.color = '';
  });
  btn.style.borderColor = '#D4537E';
  btn.style.background = '#FBEAF0';
  btn.style.color = '#D4537E';
};

window.modalQty = function(delta) {
  const el = document.getElementById('modal-qty');
  if (!el) return;
  let v = parseInt(el.textContent) + delta;
  el.textContent = Math.max(1, v);
};

window.modalAddCart = function(id) {
  const qty = parseInt(document.getElementById('modal-qty')?.textContent || 1);
  Cart.add(id, qty);
  document.getElementById('product-modal')?.remove();
};


/* ────────────────────────────────────────────────────────────
   8. TRANG ĐẶT HÀNG (order.html)
   ──────────────────────────────────────────────────────────── */
function initOrderPage() {
  if (!document.querySelector('.order-layout')) return;

  updateCartBadge();

  let appliedVoucher = null;

  /* --- Render đơn hàng từ Cart --- */
  function renderOrderItems() {
    const items  = Cart.get();
    const listEl = document.getElementById('order-items-list');
    if (!listEl) return;

    if (items.length === 0) {
      listEl.innerHTML = `
        <div style="text-align:center;padding:24px;color:#9999BB;">
          <div style="font-size:40px;margin-bottom:8px;">🛒</div>
          <p>Giỏ hàng trống. <a href="menu.html" style="color:#D4537E;font-weight:600;">Chọn món ngay!</a></p>
        </div>`;
      updateTotals();
      return;
    }

    listEl.innerHTML = items.map(item => `
      <div class="order-item" id="item-${item.id}">
        <div class="item-thumb" style="background:${item.bg}">${item.emoji}</div>
        <div class="item-info">
          <div class="item-name">${item.name}</div>
          <div class="item-sub">Đơn giá: ${fmt(item.price)}</div>
        </div>
        <div class="item-qty">
          <button class="qty-btn" onclick="orderQty(${item.id}, -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="orderQty(${item.id}, 1)">+</button>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
          <div class="item-price">${fmt(item.price * item.qty)}</div>
          <button onclick="orderRemove(${item.id})" style="background:none;border:none;font-size:11px;color:#9999BB;cursor:pointer;padding:0;">🗑️ Xóa</button>
        </div>
      </div>`).join('');

    updateTotals();
  }

  window.orderQty = function(id, delta) {
    const items = Cart.get();
    const item  = items.find(i => i.id === id);
    if (item) Cart.updateQty(id, item.qty + delta);
    renderOrderItems();
  };

  window.orderRemove = function(id) {
    Cart.remove(id);
    renderOrderItems();
  };

  /* --- Tính tổng --- */
  function updateTotals() {
    const sub      = Cart.totalPrice();
    const discount = appliedVoucher ? appliedVoucher.discount : 0;
    const ship     = sub > 0 ? (sub >= 100000 ? 0 : SHIP_FEE) : 0;
    const total    = Math.max(0, sub + ship - discount);

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('subtotal',    fmt(sub));
    set('ship-fee',    ship === 0 ? 'Miễn phí 🎉' : fmt(ship));
    set('total-price', fmt(total));

    const discountRow = document.getElementById('discount-row');
    if (discountRow) discountRow.style.display = discount > 0 ? 'flex' : 'none';

    const discountAmt = document.getElementById('discount-amount');
    if (discountAmt) discountAmt.textContent = `− ${fmt(discount)}`;

    const freeshipNote = document.getElementById('freeship-note');
    if (freeshipNote) {
      freeshipNote.style.display = sub > 0 && sub < 100000 ? 'block' : 'none';
      if (freeshipNote.style.display !== 'none') {
        freeshipNote.textContent = `🚚 Thêm ${fmt(100000 - sub)} để được miễn phí ship!`;
      }
    }
  }

  /* --- Áp voucher --- */
  window.applyVoucher = function() {
    const input = document.getElementById('voucher-input');
    if (!input) return;
    const code  = input.value.trim().toUpperCase();
    const v     = VOUCHERS[code];
    const okEl  = document.getElementById('voucher-ok');
    const errEl = document.getElementById('voucher-err');

    if (v) {
      appliedVoucher = v;
      if (okEl) { okEl.style.display = 'flex'; okEl.querySelector('span').textContent = `✅ ${v.desc}`; }
      if (errEl) errEl.style.display = 'none';
      Toast.show(`🎉 Áp dụng mã ${code} thành công!`, 'success');
      updateTotals();
    } else {
      if (errEl) errEl.style.display = 'block';
      if (okEl) okEl.style.display = 'none';
      appliedVoucher = null;
      Toast.show('❌ Mã giảm giá không hợp lệ!', 'error');
      updateTotals();
    }
    setTimeout(() => { if (errEl) errEl.style.display = 'none'; }, 3000);
  };

  /* --- Chọn phương thức giao & thanh toán --- */
  window.selectMethod = function(el, group) {
    el.closest(`.${group}-methods`)?.querySelectorAll('.method-card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
  };

  window.selectPay = function(el) {
    document.querySelectorAll('.pay-option').forEach(c => {
      c.classList.remove('selected');
      const chk = c.querySelector('.pay-check'); if (chk) chk.remove();
    });
    el.classList.add('selected');
    const chk = document.createElement('div');
    chk.className = 'pay-check';
    chk.textContent = '✓';
    el.appendChild(chk);
  };

  /* --- Validate form --- */
  function validateForm() {
    const name  = document.getElementById('recipient-name')?.value.trim();
    const phone = document.getElementById('recipient-phone')?.value.trim();
    const addr  = document.getElementById('delivery-addr')?.value.trim();

    if (!name)  { Toast.show('⚠️ Vui lòng nhập họ và tên!', 'warning'); return false; }
    if (!phone) { Toast.show('⚠️ Vui lòng nhập số điện thoại!', 'warning'); return false; }
    if (!/^0\d{9}$/.test(phone)) { Toast.show('⚠️ Số điện thoại không hợp lệ!', 'warning'); return false; }
    if (!addr)  { Toast.show('⚠️ Vui lòng nhập địa chỉ giao hàng!', 'warning'); return false; }
    if (Cart.totalQty() === 0) { Toast.show('⚠️ Giỏ hàng đang trống!', 'warning'); return false; }
    return true;
  }

  /* --- Đặt hàng --- */
  window.submitOrder = function() {
    if (!validateForm()) return;

    const orderId = 'BV' + Date.now().toString().slice(-8);
    const box     = document.getElementById('success-box');
    const idEl    = document.getElementById('order-id');

    if (idEl) idEl.textContent = `#${orderId}`;
    if (box)  { box.style.display = 'block'; box.scrollIntoView({ behavior: 'smooth', block: 'center' }); }

    // Lưu đơn vào localStorage
    const order = {
      id: orderId,
      items: Cart.get(),
      total: Cart.totalPrice() + (Cart.totalPrice() >= 100000 ? 0 : SHIP_FEE) - (appliedVoucher?.discount || 0),
      date: new Date().toISOString(),
      status: 'confirmed',
    };
    const history = JSON.parse(localStorage.getItem('bobaviet_orders') || '[]');
    history.unshift(order);
    localStorage.setItem('bobaviet_orders', JSON.stringify(history));

    Cart.clear();
    updateCartBadge();
    renderOrderItems();
    Toast.show('🎉 Đặt hàng thành công!', 'success', 5000);
  };

  /* Lắng nghe cập nhật cart */
  document.addEventListener('cart:updated', renderOrderItems);

  renderOrderItems();

  /* Phương thức mặc định */
  const firstPay = document.querySelector('.pay-option');
  if (firstPay) firstPay.classList.add('selected');
}


/* ────────────────────────────────────────────────────────────
   9. TRANG LIÊN HỆ (contact.html)
   ──────────────────────────────────────────────────────────── */
function initContactPage() {
  if (!document.querySelector('.contact-layout')) return;

  updateCartBadge();

  /* --- Gửi form liên hệ --- */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      sendContactForm();
    });
  }

  window.sendMessage = function() { sendContactForm(); };

  function sendContactForm() {
    const name    = document.getElementById('contact-name')?.value.trim();
    const email   = document.getElementById('contact-email')?.value.trim();
    const content = document.getElementById('contact-content')?.value.trim();

    if (!name)    { Toast.show('⚠️ Vui lòng nhập họ và tên!', 'warning'); return; }
    if (!email || !email.includes('@')) { Toast.show('⚠️ Email không hợp lệ!', 'warning'); return; }
    if (!content) { Toast.show('⚠️ Vui lòng nhập nội dung tin nhắn!', 'warning'); return; }

    const box = document.getElementById('success-box');
    if (box) { box.style.display = 'block'; setTimeout(() => box.style.display = 'none', 5000); }
    Toast.show('📨 Gửi tin nhắn thành công!', 'success');

    // Reset form
    document.getElementById('contact-name').value    = '';
    document.getElementById('contact-email').value   = '';
    document.getElementById('contact-content').value = '';
    const phoneEl = document.getElementById('contact-phone');
    if (phoneEl) phoneEl.value = '';
  }

  /* --- FAQ Accordion --- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const header = item.querySelector('.faq-header');
    if (header) {
      header.addEventListener('click', () => toggleFaq(item));
    }
  });

  window.toggleFaq = function(item) {
    const answer = item.querySelector('.faq-answer');
    const arrow  = item.querySelector('.faq-arrow');
    const open   = answer.style.display === 'block';
    // Đóng tất cả
    document.querySelectorAll('.faq-item').forEach(fi => {
      fi.querySelector('.faq-answer').style.display = 'none';
      const a = fi.querySelector('.faq-arrow');
      if (a) a.style.transform = 'rotate(0deg)';
    });
    // Mở cái được chọn (nếu chưa mở)
    if (!open) {
      answer.style.display = 'block';
      if (arrow) arrow.style.transform = 'rotate(180deg)';
    }
  };

  /* --- Google Maps link --- */
  const mapBox = document.querySelector('.map-box');
  if (mapBox) {
    mapBox.style.cursor = 'pointer';
    mapBox.title = 'Click để mở Google Maps';
    mapBox.addEventListener('click', () => {
      window.open('https://maps.google.com/?q=123+Le+Loi,+Ho+Chi+Minh+City', '_blank');
    });
  }
}


/* ────────────────────────────────────────────────────────────
   10. TRANG ĐĂNG NHẬP / ĐĂNG KÝ (login.html)
   ──────────────────────────────────────────────────────────── */
function initLoginPage() {
  if (!document.querySelector('.auth-card')) return;

  /* --- Chuyển tab --- */
  window.switchTab = function(tab) {
    document.getElementById('panel-login')?.classList.toggle('active', tab === 'login');
    document.getElementById('panel-register')?.classList.toggle('active', tab === 'register');
    document.getElementById('tab-login')?.classList.toggle('active', tab === 'login');
    document.getElementById('tab-register')?.classList.toggle('active', tab === 'register');
  };

  /* --- Đăng nhập --- */
  window.doLogin = function() {
    const email = document.getElementById('login-email')?.value.trim();
    const pw    = document.getElementById('login-pw')?.value.trim();

    if (!email) { Toast.show('⚠️ Vui lòng nhập email!', 'warning'); return; }
    if (!pw)    { Toast.show('⚠️ Vui lòng nhập mật khẩu!', 'warning'); return; }
    if (pw.length < 6) { Toast.show('⚠️ Mật khẩu tối thiểu 6 ký tự!', 'warning'); return; }

    // Kiểm tra tài khoản đã đăng ký
    const users = JSON.parse(localStorage.getItem('bobaviet_users') || '[]');
    const user  = users.find(u => u.email === email && u.password === pw);

    if (user || email === 'admin@bobaviet.vn') {
      localStorage.setItem('bobaviet_current_user', JSON.stringify(user || { name: 'Admin', email }));
      showAlert('login-success');
      Toast.show(`👋 Chào mừng ${user?.name || 'bạn'} trở lại!`, 'success');
      setTimeout(() => { window.location.href = 'index.html'; }, 1500);
    } else {
      showAlert('login-error');
      Toast.show('❌ Sai thông tin đăng nhập!', 'error');
    }
  };

  /* --- Đăng ký --- */
  window.doRegister = function() {
    const firstName = document.getElementById('reg-firstname')?.value.trim();
    const lastName  = document.getElementById('reg-lastname')?.value.trim();
    const email     = document.getElementById('reg-email')?.value.trim();
    const phone     = document.getElementById('reg-phone')?.value.trim();
    const pw        = document.getElementById('reg-pw')?.value.trim();
    const pwConfirm = document.getElementById('reg-pw-confirm')?.value.trim();
    const terms     = document.getElementById('reg-terms')?.checked;

    if (!firstName || !lastName) { Toast.show('⚠️ Vui lòng nhập đầy đủ họ tên!', 'warning'); return; }
    if (!email || !email.includes('@')) { Toast.show('⚠️ Email không hợp lệ!', 'warning'); return; }
    if (!phone || !/^0\d{9}$/.test(phone)) { Toast.show('⚠️ Số điện thoại không hợp lệ!', 'warning'); return; }
    if (!pw || pw.length < 8) { Toast.show('⚠️ Mật khẩu tối thiểu 8 ký tự!', 'warning'); return; }
    if (pw !== pwConfirm) { Toast.show('⚠️ Mật khẩu xác nhận không khớp!', 'warning'); return; }
    if (!terms) { Toast.show('⚠️ Vui lòng đồng ý điều khoản dịch vụ!', 'warning'); return; }

    // Kiểm tra email đã tồn tại
    const users = JSON.parse(localStorage.getItem('bobaviet_users') || '[]');
    if (users.find(u => u.email === email)) { Toast.show('⚠️ Email đã được đăng ký!', 'warning'); return; }

    // Lưu tài khoản
    users.push({ name: `${firstName} ${lastName}`, email, phone, password: pw, createdAt: new Date().toISOString() });
    localStorage.setItem('bobaviet_users', JSON.stringify(users));

    showAlert('register-success');
    Toast.show('🎉 Đăng ký thành công! Chào mừng bạn đến với BobaViet!', 'success', 4000);
    setTimeout(() => switchTab('login'), 2000);
  };

  /* --- Đo độ mạnh mật khẩu --- */
  window.checkPwStrength = function(val) {
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    const colors = ['#EF4444', '#F59E0B', '#3B82F6', '#10B981'];
    const labels = ['Rất yếu 😰', 'Trung bình 😐', 'Khá mạnh 💪', 'Rất mạnh 🔒'];

    for (let i = 1; i <= 4; i++) {
      const bar = document.getElementById(`sb${i}`);
      if (bar) bar.style.background = i <= score ? colors[score - 1] : 'var(--border)';
    }
    const lbl = document.getElementById('strength-lbl');
    if (lbl) {
      lbl.textContent = val.length ? labels[score - 1] || 'Rất yếu 😰' : 'Nhập mật khẩu để kiểm tra độ mạnh';
      lbl.style.color = val.length ? colors[score - 1] : '';
    }
  };

  /* --- Quên mật khẩu --- */
  window.forgotPassword = function() {
    const email = prompt('Nhập email đã đăng ký để lấy lại mật khẩu:');
    if (!email) return;
    if (!email.includes('@')) { Toast.show('⚠️ Email không hợp lệ!', 'warning'); return; }
    Toast.show(`📧 Link đặt lại mật khẩu đã gửi đến ${email}`, 'success', 4000);
  };

  /* --- Toggle hiển thị mật khẩu --- */
  document.querySelectorAll('.toggle-pw').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      if (!input) return;
      input.type = input.type === 'password' ? 'text' : 'password';
      btn.textContent = input.type === 'password' ? '👁️' : '🙈';
    });
  });
}

function showAlert(id, duration = 4000) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, duration);
}


/* ────────────────────────────────────────────────────────────
   11. KIỂM TRA ĐĂNG NHẬP – Hiển thị tên user trên nav
   ──────────────────────────────────────────────────────────── */
function initUserNav() {
  const user   = JSON.parse(localStorage.getItem('bobaviet_current_user') || 'null');
  const navEl  = document.querySelector('.nav-actions');
  const userEl = document.querySelector('.nav-user');

  if (user) {
    if (navEl) {
      navEl.innerHTML = `
        <span style="font-size:13px;color:#5C5C7A;">👤 ${user.name}</span>
        <button onclick="logout()" style="
          font-size:13px;font-weight:500;padding:7px 16px;border-radius:30px;
          background:none;border:1.5px solid #E8E8F0;cursor:pointer;color:#5C5C7A;
        ">Đăng xuất</button>
        <a href="order.html" class="btn-cart" style="font-size:13px;font-weight:500;padding:7px 16px;border-radius:30px;position:relative;">
          🛒 Giỏ hàng <span class="cart-badge">0</span>
        </a>
      `;
    }
    if (userEl) userEl.textContent = `👤 ${user.name}`;
  }
}

window.logout = function() {
  localStorage.removeItem('bobaviet_current_user');
  Toast.show('👋 Đăng xuất thành công!', 'info');
  setTimeout(() => window.location.reload(), 1000);
};


/* ────────────────────────────────────────────────────────────
   12. TIỆN ÍCH DÙNG CHUNG
   ──────────────────────────────────────────────────────────── */

/** Format tiền Việt */
function fmt(amount) {
  return amount.toLocaleString('vi-VN') + 'đ';
}

/** Debounce – tránh gọi hàm liên tục */
function debounce(fn, delay) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}

/** Scroll mượt khi click anchor */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/** Active link nav theo trang hiện tại */
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === page);
  });
}

/** Back-to-top button */
function initBackToTop() {
  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.textContent = '↑';
  btn.title = 'Lên đầu trang';
  btn.style.cssText = `
    position:fixed; bottom:80px; right:24px; z-index:999;
    width:42px; height:42px; border-radius:50%;
    background:#D4537E; color:#fff; border:none;
    font-size:18px; cursor:pointer; display:none;
    box-shadow:0 4px 16px rgba(212,83,126,.4);
    transition:.3s;
  `;
  document.body.appendChild(btn);
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', () => {
    btn.style.display = window.scrollY > 300 ? 'flex' : 'none';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
  });
}


/* ────────────────────────────────────────────────────────────
   13. KHỞI CHẠY KHI DOM SẴN SÀNG
   ──────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  initUserNav();
  updateCartBadge();
  initBackToTop();

  initHomePage();
  initMenuPage();
  initOrderPage();
  initContactPage();
  initLoginPage();

  console.log('🧋 BobaViet app.js loaded successfully!');
});


/* ────────────────────────────────────────────────────────────
   14. RENDER SẢN PHẨM TRANG CHỦ (home-prod-grid)
   ──────────────────────────────────────────────────────────── */
function initHomeProducts() {
  const grid = document.getElementById('home-prod-grid');
  if (!grid) return;

  // Lấy 4 sản phẩm hot/bán chạy
  const featured = PRODUCTS.filter(p => p.badge === 'hot' || p.stars === 5).slice(0, 4);

  grid.innerHTML = featured.map(p => `
    <div class="prod-card" onclick="openProductModal(${p.id})">
      <div class="prod-thumb" style="background:${p.bg};height:140px;font-size:64px;">
        <span>${p.emoji}</span>
        ${p.badge ? `<span class="prod-badge badge-${p.badge}">${p.badge==='hot'?'Hot 🔥':p.badge==='new'?'Mới ✨':'Sale 🏷️'}</span>` : ''}
      </div>
      <div class="prod-body">
        <div class="prod-name">${p.name}</div>
        <div class="prod-desc">${p.desc}</div>
        <div class="prod-footer">
          <div>
            <div class="prod-price">${fmt(p.price)}</div>
            <div class="prod-stars"><span>${'★'.repeat(p.stars)}${'☆'.repeat(5-p.stars)}</span> (${p.reviews})</div>
          </div>
          <button class="add-btn" onclick="event.stopPropagation();Cart.add(${p.id});this.textContent='✓';this.style.background='#1A8C6E';setTimeout(()=>{this.textContent='+';this.style.background=''},1500)">+</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Gọi initHomeProducts trong DOMContentLoaded
document.addEventListener('DOMContentLoaded', initHomeProducts, { once: false });
