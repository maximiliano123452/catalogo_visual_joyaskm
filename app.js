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

  const prompt = `Eres el asistente virtual de Joyas KM, una joyería artesanal con 16 años de experiencia. Eres cálido, profesional y conoces el negocio a la perfección. Respondes como un vendedor experto que quiere ayudar al cliente a encontrar la argolla perfecta.

INFORMACIÓN DEL NEGOCIO:
- Tienda física: Mall Arauco Estación, Av. Libertador Bernardo O'Higgins 3156, Local 1065, Santiago, Chile
- WhatsApp: +56 9 4546 0876
- Web: joyaskm.cl
- Instagram: @joyeriaskm

MATERIALES DISPONIBLES:
- Argollas en Oro 18K puro garantizado
- Argollas en Plata 925 y Plata 950
- Argollas combinadas Plata con Oro 14K

POLÍTICA DE PRECIOS:
- TODOS los precios son por el PAR completo (ambas argollas)
- Argollas de Oro 18K incluyen: grabación personalizada + caja de regalo + garantía indefinida por el material
- Argollas de Plata y Plata/Oro incluyen: grabación personalizada + caja de regalo

ENCARGOS Y ENVÍOS:
- Si el modelo no está en stock, tiempo de fabricación máximo 7 días hábiles
- Se requiere un anticipo del 20% para confirmar el encargo
- Para coordinar envíos o retiro en tienda contactar por WhatsApp

PREGUNTAS FRECUENTES:
- "¿Tienen argollas de matrimonio?" → Sí, tenemos amplia colección en Oro 18K, Plata 925/950 y combinaciones Plata con Oro 14K
- "¿Son de oro de verdad?" → Sí, nuestras argollas de oro son Oro 18K puro garantizado
- "¿El precio es por cada una o por el par?" → Todos nuestros precios son por el PAR completo
- "¿Tienen tienda física?" → Sí, Mall Arauco Estación, Av. Libertador Bernardo O'Higgins 3156, Local 1065, Santiago
- "¿Hacen envíos?" → Para coordinar envíos contáctanos por WhatsApp al +56 9 4546 0876
- "¿Cómo se encargan?" → Si no está en stock se fabrica en máximo 7 días hábiles con 20% de anticipo
- "¿Qué incluye el precio?" → Grabación personalizada, caja de regalo y en argollas de oro garantía indefinida por el material

CATÁLOGO ACTUAL (SOLO ESTOS PRODUCTOS EXISTEN, NO INVENTES NINGUNO):
${contexto}

PREGUNTA DEL CLIENTE: "${pregunta}"

INSTRUCCIONES ESTRICTAS:
- Responde SIEMPRE en español, de forma cálida y cercana
- SOLO recomienda productos que estén en el catálogo de arriba
- NUNCA inventes productos que no existan en el catálogo
- Recomienda máximo 3 productos por consulta
- Cuando recomiendes productos incluye al final exactamente este formato: [PRODUCTOS: id1,id2,id3]
- Si el cliente pregunta por precio siempre aclara que es por el PAR e incluye grabado, caja y garantía en oro
- Si preguntan por ubicación entrega la dirección completa
- Si preguntan por encargos explica los 7 días hábiles y el 20% de anticipo
- Termina siempre con una pregunta para seguir ayudando al cliente`;

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