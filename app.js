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

const GEMINI_API_KEY = "const GEMINI_API_KEY = CONFIG.GEMINI_API_KEY;";

function toggleChat() {
  const box = document.getElementById('chat-box');
  box.classList.toggle('open');
  if (box.classList.contains('open')) {
    document.getElementById('chat-input').focus();
  }
}

function handleKey(e) {
  if (e.key === 'Enter') sendMessage();
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

async function sendMessage() {
  const input = document.getElementById('chat-input');
  const texto = input.value.trim();
  if (!texto) return;

  addMessage(texto, 'user');
  input.value = '';

  const loading = addMessage('Buscando...✨', 'loading');

  // Construir contexto con todos los productos
  const todosLosProductos = [...(window.productosOro || []), ...(window.productosPlata || [])];

  const contexto = todosLosProductos.map(p =>
    `ID: ${p.id} | Nombre: ${p.nombre} | Material: ${p.material} | Precio: ${p.precio} | Descripción: ${p.descripcion}`
  ).join('\n');

  const prompt = `Eres un asistente amable y experto de Joyas KM, una joyería chilena con 16 años de historia ubicada en Mall Arauco Estación, Santiago. Tu rol es ayudar a los clientes a encontrar argollas de matrimonio según sus preferencias.

Aquí está el catálogo completo de productos disponibles:
${contexto}

El cliente pregunta: "${texto}"

Responde de manera cálida y profesional en español. Si el cliente busca productos específicos, recomiéndale máximo 3 opciones del catálogo que mejor se ajusten. Para cada producto recomendado incluye exactamente este formato:
[PRODUCTO]id:AQUI_EL_ID|nombre:AQUI_EL_NOMBRE|precio:AQUI_EL_PRECIO|descripcion:AQUI_LA_DESCRIPCION[/PRODUCTO]

Si la pregunta no es sobre productos, responde amablemente y oriéntalo. Nunca inventes productos que no están en el catálogo.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    const respuesta = data.candidates?.[0]?.content?.parts?.[0]?.text || "Lo siento, no pude procesar tu consulta. Intenta de nuevo.";

    loading.remove();
    renderRespuesta(respuesta, todosLosProductos);

  } catch (error) {
    loading.remove();
    addMessage('Hubo un error al conectar. Por favor intenta de nuevo.', 'bot');
  }
}

function renderRespuesta(respuesta, productos) {
  const messages = document.getElementById('chat-messages');

  // Separar texto de productos
  const partes = respuesta.split(/\[PRODUCTO\](.*?)\[\/PRODUCTO\]/gs);

  partes.forEach((parte, index) => {
    if (index % 2 === 0) {
      // Es texto normal
      const texto = parte.trim();
      if (texto) addMessage(texto, 'bot');
    } else {
      // Es un producto
      try {
        const campos = {};
        parte.split('|').forEach(campo => {
          const [key, ...val] = campo.split(':');
          campos[key.trim()] = val.join(':').trim();
        });

        const producto = productos.find(p => p.id === campos.id);
        const foto = producto?.fotos?.[0] || '';
        const wsp = `https://wa.me/56945460876?text=Hola!%20Me%20interesa%20la%20argolla%20*${encodeURIComponent(campos.nombre)}*%20%F0%9F%92%8D`;

        const card = document.createElement('div');
        card.className = 'product-card-chat';
        card.innerHTML = `
          ${foto ? `<img src="${foto}" style="width:100%;border-radius:6px;margin-bottom:6px;">` : ''}
          <strong>${campos.nombre}</strong>
          <span style="color:#c9a84c">${campos.precio}</span><br>
          <small style="color:#aaa">${campos.descripcion?.substring(0, 80)}...</small>
          <br>
          <a href="${wsp}" target="_blank">💬 Consultar por WhatsApp</a>
        `;
        messages.appendChild(card);
        messages.scrollTop = messages.scrollHeight;
      } catch(e) {
        console.log('Error parseando producto', e);
      }
    }
  });
}