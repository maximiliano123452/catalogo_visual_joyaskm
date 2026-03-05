/* ============================================================
   JOYAS KM — LÓGICA
   No es necesario modificar este archivo.
   ============================================================ */

function getPrecio(varName) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(varName).trim().replace(/"/g, '');
}

function renderGrid(categoria) {
  const grid = document.getElementById(`grid-${categoria}`);
  const productos = PRODUCTOS[categoria];

  grid.innerHTML = productos.map(p => {
    const fotosValidas = p.fotos.filter(f => f !== null);
    const totalFotos = p.fotos.length;
    const precio = getPrecio(p.precioVar);

    let mainImgs = '';
    let thumbs = '';

    if (fotosValidas.length > 0) {
      fotosValidas.forEach((url, i) => {
        mainImgs += `<img src="${url}" alt="${p.nombre} vista ${i + 1}" class="${i === 0 ? 'active' : ''}" loading="lazy">`;
        thumbs += `<img src="${url}" alt="miniatura ${i + 1}" class="thumb ${i === 0 ? 'active' : ''}" onclick="selectThumb(this, '${p.id}', ${i})">`;
      });
      for (let i = fotosValidas.length; i < totalFotos; i++) {
        thumbs += `<div class="thumb-placeholder">foto<br>${i + 1}</div>`;
      }
    } else {
      mainImgs = `
        <div class="img-placeholder">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <span>Foto próximamente</span>
        </div>`;
      for (let i = 0; i < totalFotos; i++) {
        thumbs += `<div class="thumb-placeholder">foto<br>${i + 1}</div>`;
      }
    }

    return `
    <div class="product-card" id="${p.id}">
      ${p.badge ? `<div class="badge">${p.badge}</div>` : ''}
      <div class="gallery-main">${mainImgs}</div>
      <div class="gallery-thumbs">${thumbs}</div>
      <div class="product-info">
        <div class="product-name">${p.nombre}</div>
        <div class="product-material">${p.material} — Joyas KM</div>
        <div class="product-desc">${p.descripcion}</div>
        <div class="product-price">${precio}</div>
      </div>
    </div>`;
  }).join('');
}

function selectThumb(thumbEl, productId, index) {
  const card = document.getElementById(productId);
  card.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
  card.querySelectorAll('.gallery-main img').forEach(img => img.classList.remove('active'));
  thumbEl.classList.add('active');
  const imgs = card.querySelectorAll('.gallery-main img');
  if (imgs[index]) imgs[index].classList.add('active');
}

function showTab(tab, btn) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`tab-${tab}`).classList.add('active');
  btn.classList.add('active');
}

renderGrid('oro');
renderGrid('plata');