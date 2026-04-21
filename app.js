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

  grid.innerHTML = productos.filter(p => p.nombre && p.nombre !== "").map(p => {
    const fotosValidas = p.fotos.filter(f => f !== null);
    const totalFotos = p.fotos.length;
    const precio = p.precio || getPrecio(p.precioVar);

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
// ============================================================
// ASISTENTE IA — GEMINI
// ============================================================

const GEMINI_API_KEY = CONFIG.GEMINI_API_KEY;

function toggleChat() {
  const box = document.getElementById('chat-box');
  box.classList.toggle('open');
  if (box.classList.contains('open')) {
    document.getElementById('chat-input').focus();
  }
}

function handleKey(event) {
  if (event.key === 'Enter') sendMessage();
}

function addMessage(text, type) {
  const messages = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = `msg ${type}`;
  div.innerHTML = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  return div;
}

function buildProductContext() {
  const todos = [
    ...(PRODUCTOS.oro || []),
    ...(PRODUCTOS.plata || [])
  ];
  return todos
    .filter(p => p.nombre)
    .map(p =>
      `ID: ${p.id} | Nombre: ${p.nombre} | Material: ${p.material} | Precio: ${p.precio} | Descripción: ${p.descripcion}`
    ).join('\n');
}

function buildWhatsAppLink(producto) {
  const texto = encodeURIComponent(
    `Hola! Vi el catálogo y me interesó la argolla "${producto.nombre}" (${producto.precio}). ¿Podrían darme más información? 💍`
  );
  return `https://wa.me/56945460876?text=${texto}`;
}

async function sendMessage() {
  const input = document.getElementById('chat-input');
  const pregunta = input.value.trim();
  if (!pregunta) return;

  input.value = '';
  addMessage(pregunta, 'user');
  const loading = addMessage('Buscando...⌛', 'loading');

  const contexto = buildProductContext();

  const prompt = `Eres el asistente virtual de Joyas KM, una joyería artesanal con 16 años de experiencia ubicada en Mall Arauco Estación, Local 1065, Santiago, Chile.

Tu trabajo es ayudar a los clientes a encontrar argollas de matrimonio según sus necesidades.

CATÁLOGO ACTUAL (SOLO ESTOS PRODUCTOS EXISTEN, NO INVENTES NINGUNO):
${contexto}

PREGUNTA DEL CLIENTE: "${pregunta}"

INSTRUCCIONES ESTRICTAS:
- Responde SIEMPRE en español, de forma cálida y profesional
- SOLO puedes recomendar productos que aparezcan en el catálogo de arriba
- NUNCA inventes productos que no estén en el catálogo
- Si el cliente busca un producto específico recomienda máximo 3 opciones del catálogo
- Para cada recomendación incluye al final de tu respuesta exactamente este formato:
  [PRODUCTOS: id1,id2,id3]
- Si no encuentras productos que coincidan exactamente recomienda los más parecidos
- Si la pregunta es sobre horarios, ubicación o garantía responde sin recomendar productos
- La tienda está en Mall Arauco Estación Local 1065, Santiago, Chile
- Todos los productos incluyen grabación personalizada, estuche y garantía indefinida
- WhatsApp: +56 9 4546 0876
- Tenemos argollas en Oro 18K, Plata 925, Plata 950 y combinaciones Plata con Oro 14K`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    const respuesta = data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Lo siento, no pude procesar tu consulta. Contáctanos directamente por WhatsApp 💍";

    loading.remove();

    const match = respuesta.match(/\[PRODUCTOS:\s*([^\]]+)\]/);
    const textoLimpio = respuesta.replace(/\[PRODUCTOS:[^\]]+\]/g, '').trim();

    addMessage(textoLimpio, 'bot');

    if (match) {
      const ids = match[1].split(',').map(id => id.trim());
      const todos = [
        ...(PRODUCTOS.oro || []),
        ...(PRODUCTOS.plata || [])
      ];

      ids.forEach(id => {
        const producto = todos.find(p => p.id === id);
        if (producto) {
          const foto = producto.fotos.find(f => f !== null) || '';
          const messages = document.getElementById('chat-messages');
          const card = document.createElement('div');
          card.className = 'product-card-chat';
          card.innerHTML = `
            ${foto ? `<img src="${foto}" alt="${producto.nombre}">` : ''}
            <strong>💍 ${producto.nombre}</strong>
            ${producto.material} — ${producto.precio}<br>
            <small>${producto.descripcion.substring(0, 100)}...</small>
            <br>
            <a href="${buildWhatsAppLink(producto)}" target="_blank">
              💬 Consultar por WhatsApp
            </a>
          `;
          messages.appendChild(card);
          messages.scrollTop = messages.scrollHeight;
        }
      });
    }

  } catch (error) {
    loading.remove();
    addMessage('Hubo un error al conectar. Por favor contáctanos directamente por WhatsApp 💍', 'bot');
  }
}