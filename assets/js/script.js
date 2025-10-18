// Final site JS: products, cart, featured, shop, product detail, testimonials, AOS hookup, header scroll, popup
// Uses your images at assets/images/img*.jpg and logo.png

const products = [
  { id:1, title:"Lemons (500g)", price:2.99, img:"assets/images/img4.jpg", category:"fruits", desc:"Fresh zesty lemons perfect for juices and cooking." },
  { id:2, title:"Grapes Mix (500g)", price:3.99, img:"assets/images/img5.jpg", category:"fruits", desc:"Sweet assorted grapes — red, green and black." },
  { id:3, title:"Broccoli (1pc)", price:1.89, img:"assets/images/img6.jpg", category:"vegetables", desc:"Fresh green broccoli, full of vitamins." },
  { id:4, title:"Yellow Peppers (pack)", price:2.49, img:"assets/images/img7.jpg", category:"vegetables", desc:"Crisp yellow peppers for salads & cooking." },
  { id:5, title:"Avocado Mix Pack", price:4.99, img:"assets/images/img8.jpg", category:"pantry", desc:"Creamy avocados and mixed veg bundle." },
  { id:6, title:"Organic Tea (250ml)", price:3.25, img:"assets/images/img9.jpg", category:"beverages", desc:"Hand-brewed organic tea — calming & pure." },
  { id:7, title:"Fresh Tomato (1pc)", price:0.99, img:"assets/images/img10.jpg", category:"vegetables", desc:"Ripe tomato, perfect for sauces." },
  { id:8, title:"Red Apples (1kg)", price:4.49, img:"assets/images/img11.jpg", category:"fruits", desc:"Crisp red apples — sweet & crunchy." },
  { id:9, title:"Strawberries (250g)", price:3.99, img:"assets/images/img12.jpg", category:"fruits", desc:"Juicy strawberries, ideal for desserts." },
  { id:10, title:"Pantry Jars (set)", price:14.99, img:"assets/images/img2.jpg", category:"pantry", desc:"Stylish pantry jar set for kitchen organizing." }
];

// CART (localStorage)
const CART_KEY = 'organify_cart_final';
function loadCart(){ try{ return JSON.parse(localStorage.getItem(CART_KEY)) || []; }catch(e){ return []; } }
function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateCartCount(); }
function addToCart(id, qty=1){
  const cart = loadCart();
  const idx = cart.findIndex(i=>i.id===id);
  if(idx > -1) cart[idx].qty += qty;
  else cart.push({ id, qty });
  saveCart(cart);
  showAddPopup(`${getProduct(id).title} added`);
}
function removeFromCart(id){ let cart = loadCart().filter(i=>i.id!==id); saveCart(cart); showToast('Removed from cart'); }
function changeQty(id, qty){ const cart = loadCart(); const it = cart.find(i=>i.id===id); if(it){ it.qty = Math.max(1, qty); saveCart(cart);} }
function updateCartCount(){ const count = loadCart().reduce((s,i)=>s+i.qty,0); document.querySelectorAll('#cartCount, #cartCountShop').forEach(el=>{ if(el) el.textContent = count; }); }

function getProduct(id){ return products.find(p=>p.id===id); }

// show small add-to-cart popup (animated)
function showAddPopup(msg){
  const el = document.getElementById('addCartPopup');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(()=> el.classList.remove('show'), 1600);
}

// small toast (text)
function showToast(msg){
  const t = document.createElement('div');
  t.className = 'toast-feedback';
  t.textContent = msg;
  Object.assign(t.style,{ position:'fixed', right:'20px', bottom:'20px', background: 'rgba(30,100,40,0.95)', color:'#fff', padding:'10px 14px', borderRadius:'8px', zIndex:1200 });
  document.body.appendChild(t);
  setTimeout(()=> t.style.opacity = '0', 1500);
  setTimeout(()=> t.remove(), 1900);
}

// populate featured (home)
function populateFeatured(){
  const container = document.getElementById('featuredProducts'); if(!container) return;
  const featured = [products[7], products[8], products[0], products[5]];
  container.innerHTML = featured.map(p=>`
    <div class="col-sm-6 col-md-3">
      <div class="card product h-100" data-aos="zoom-in">
        <img src="${p.img}" class="card-img-top" alt="${p.title}">
        <div class="card-body d-flex flex-column">
          <h6 class="mb-1">${p.title}</h6>
          <p class="small text-muted mb-2">${p.desc}</p>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <div class="fw-bold">$${p.price.toFixed(2)}</div>
            <div>
              <a href="product.html?id=${p.id}" class="btn btn-sm btn-outline-dark me-2">View</a>
              <button class="btn btn-sm btn-success" onclick="addToCart(${p.id})">Add</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// populate shop
function populateShop(filter='', search=''){
  const grid = document.getElementById('shopGrid'); if(!grid) return;
  const list = products.filter(p=>{
    const byCat = filter ? p.category === filter : true;
    const bySearch = search ? (p.title + ' ' + p.desc).toLowerCase().includes(search.toLowerCase()) : true;
    return byCat && bySearch;
  });
  if(list.length===0){ grid.innerHTML = '<div class="col-12 text-center text-muted">No products found.</div>'; return; }
  grid.innerHTML = list.map(p=>`
    <div class="col-sm-6 col-md-4 col-lg-3">
      <div class="card product h-100" data-aos="fade-up">
        <img src="${p.img}" class="card-img-top" alt="${p.title}">
        <div class="card-body d-flex flex-column">
          <h6 class="mb-1">${p.title}</h6>
          <p class="small text-muted mb-2">${p.desc}</p>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <div class="fw-bold">$${p.price.toFixed(2)}</div>
            <div>
              <a href="product.html?id=${p.id}" class="btn btn-sm btn-outline-dark me-2">View</a>
              <button class="btn btn-sm btn-success" onclick="addToCart(${p.id})">Add</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// populate product detail
function populateProductDetail(){
  const container = document.getElementById('productDetail'); if(!container) return;
  const params = new URLSearchParams(location.search);
  const id = Number(params.get('id')) || products[0].id;
  const p = getProduct(id);
  if(!p){ container.innerHTML = '<div class="text-muted">Product not found.</div>'; return; }
  container.innerHTML = `
    <div class="row g-4">
      <div class="col-md-5">
        <img src="${p.img}" alt="${p.title}" class="img-fluid rounded">
      </div>
      <div class="col-md-7">
        <h2>${p.title}</h2>
        <p class="text-muted">${p.desc}</p>
        <div class="mb-3"><strong class="h4">$${p.price.toFixed(2)}</strong></div>
        <div class="d-flex gap-2 align-items-center mb-3">
          <input type="number" min="1" value="1" id="qtyInput" class="form-control" style="width:100px;">
          <button class="btn btn-success" id="addToCartBtn">Add to cart</button>
        </div>
        <a href="shop.html" class="btn btn-outline-secondary">Back to shop</a>
      </div>
    </div>
  `;
  document.getElementById('addToCartBtn').addEventListener('click', ()=>{
    const q = Number(document.getElementById('qtyInput').value) || 1;
    addToCart(p.id, q);
  });
}

// show cart modal content
function showCart(modalId, listContainerId){
  const modalEl = document.getElementById(modalId);
  const listEl = document.getElementById(listContainerId);
  if(!modalEl || !listEl) return;
  const cart = loadCart();
  if(cart.length===0){ listEl.innerHTML = '<div class="text-center text-muted small">Your cart is empty.</div>'; }
  else{
    listEl.innerHTML = cart.map(item=>{
      const p = getProduct(item.id);
      return `
        <div class="d-flex align-items-center mb-3">
          <img src="${p.img}" alt="${p.title}" style="width:72px;height:72px;object-fit:cover;border-radius:8px" class="me-3">
          <div class="flex-fill">
            <div class="fw-bold">${p.title}</div>
            <div class="small text-muted">$${p.price.toFixed(2)} × ${item.qty}</div>
          </div>
          <div class="d-flex gap-1">
            <button class="btn btn-sm btn-outline-secondary" onclick="changeQty(${p.id}, ${item.qty - 1})">−</button>
            <button class="btn btn-sm btn-outline-secondary" onclick="changeQty(${p.id}, ${item.qty + 1})">+</button>
            <button class="btn btn-sm btn-danger" onclick="removeFromCart(${p.id})">Remove</button>
          </div>
        </div>
      `;
    }).join('');
  }
  const bsModal = new bootstrap.Modal(modalEl);
  bsModal.show();
}

// TESTIMONIALS slider
const testimonials = [
  { text:"Best produce I ever bought online. Fresh and delicious!", author:"Anita R." },
  { text:"Fast delivery and the packaging is eco friendly. Love Organify.", author:"Marcus P." },
  { text:"My family enjoys every order — highly recommend.", author:"Priya S." }
];
let testIndex = 0;
function renderTestimonials(){
  const el = document.getElementById('testimonialSlider');
  if(!el) return;
  el.innerHTML = testimonials.map((t,i)=>`
    <div class="testimonial-slide ${i===0?'active':''}" aria-hidden="${i===0? 'false':'true'}">
      <p class="mb-0">“${t.text}”</p>
      <div class="testimonial-author">${t.author}</div>
    </div>
  `).join('');
}
function startTestimonialRotation(){
  const slides = () => {
    const nodes = document.querySelectorAll('.testimonial-slide');
    nodes.forEach(n=>n.classList.remove('active'));
    testIndex = (testIndex + 1) % nodes.length;
    nodes[testIndex].classList.add('active');
  };
  setInterval(slides, 4500);
}

// contact form demo validation
function setupContactForm(){
  const form = document.getElementById('contactForm'); if(!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    if(!form.checkValidity()){ form.classList.add('was-validated'); return; }
    showToast('Message sent — thank you!');
    form.reset();
    form.classList.remove('was-validated');
  });
}

// header scroll behavior (sticky + blur)
function setupHeaderScroll(){
  const header = document.getElementById('siteHeader') || document.getElementById('siteHeaderShop');
  if(!header) return;
  window.addEventListener('scroll', ()=>{
    if(window.scrollY > 20) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  });
}

// init
document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll("span[id^='year']").forEach(el=> el.textContent = new Date().getFullYear());

  populateFeatured();
  populateShop();
  populateProductDetail();
  updateCartCount();
  setupContactForm();
  renderTestimonials();
  startTestimonialRotation();
  setupHeaderScroll();

  // search & category events (shop page)
  const cat = document.getElementById('catFilter');
  if(cat) cat.addEventListener('change', ()=> populateShop(cat.value, document.getElementById('searchInput')?.value || ''));

  const search = document.getElementById('searchInput');
  if(search) search.addEventListener('input', ()=> populateShop(cat?.value || '', search.value));

  // cart buttons
  document.getElementById('cartBtn')?.addEventListener('click', ()=> showCart('cartModal','cartList'));
  document.getElementById('cartBtnShop')?.addEventListener('click', ()=> showCart('cartModalShop','cartListShop'));
});

