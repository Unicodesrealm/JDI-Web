let currentSlide = 0;
  const cards = document.querySelectorAll('.carousel-card');
  const dots = document.querySelectorAll('.dot');
  let autoplayInterval;

  function showSlide(index) {
    const total = cards.length;
    
    // Update dots active class
    dots.forEach((dot, idx) => {
      if (idx === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Update cards classes for 3D stacking
    cards.forEach((card, idx) => {
      card.classList.remove('pos-0', 'pos-1', 'pos-2', 'pos-out', 'pos-hidden');
      
      const diff = (idx - index + total) % total;
      
      if (diff === 0) {
        card.classList.add('pos-0');
      } else if (diff === 1) {
        card.classList.add('pos-1');
      } else if (diff === 2) {
        card.classList.add('pos-2');
      } else if (idx === (index - 1 + total) % total) {
        card.classList.add('pos-out');
      } else {
        card.classList.add('pos-hidden');
      }
    });

    currentSlide = index;
  }

  function nextSlide() {
    let next = (currentSlide + 1) % cards.length;
    showSlide(next);
  }

  function goToSlide(index) {
    showSlide(index);
    resetAutoplay();
  }

  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }

  // Scroll listener to toggle sticky nav class
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.nav-bar');
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // Initialize
  showSlide(0);
  startAutoplay();

// ─── Interactive Map and Directory Implementation ─────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const mapElement = document.getElementById('homepage-map');
  if (!mapElement) return;

  // Coordinate database of Mozambique JDI projects
  const projectsCoords = [
    { id: "project-1", title: "Vivenda T3 em Katembe", loc: "Chamissava, Katembe, Maputo", cat: "habitacao", coords: [-26.0125, 32.5530] },
    { id: "project-2", title: "Campo Polivalente e Parque Infantil", loc: "Massaca, Boane, Maputo", cat: "desporto", coords: [-26.0400, 32.3270] },
    { id: "project-3", title: "Complexo Escolar de Ngunga", loc: "Distrito de Ngunga, Cabo-Delgado", cat: "educacao", coords: [-11.6300, 39.5300] },
    { id: "project-4", title: "Residência de Professores em Ngunga", loc: "Distrito de Ngunga, Cabo-Delgado", cat: "habitacao", coords: [-11.6400, 39.5400] },
    { id: "project-5", title: "Complexo Escolar da Liberdade", loc: "Distrito Liberdade, Cabo-Delgado", cat: "educacao", coords: [-12.9600, 40.5100] },
    { id: "project-6", title: "Reabilitação do Edifício do Governo", loc: "Distrito de Muidumbe, Cabo-Delgado", cat: "infraestrutura", coords: [-11.6800, 39.7300] },
    { id: "project-7", title: "Projecto Escolar Montepuez", loc: "Montepuez, Cabo-Delgado", cat: "educacao", coords: [-13.1200, 38.9900] },
    { id: "project-8", title: "Construção Escolar de Ngalane", loc: "Ngalane, Cabo-Delgado", cat: "educacao", coords: [-12.3000, 39.8000] },
    { id: "project-9", title: "Incubadora de Negócios Namuapala", loc: "Namuapala, Cabo-Delgado", cat: "infraestrutura", coords: [-13.2500, 39.9500] },
    { id: "project-10", title: "Mercado Comunitário de Mecufi", loc: "Mecuffi, Cabo-Delgado", cat: "infraestrutura", coords: [-13.2800, 40.5400] },
    { id: "project-11", title: "Casas de Professores em Mecufi", loc: "Mecuffi, Cabo-Delgado", cat: "habitacao", coords: [-13.2900, 40.5500] },
    { id: "project-12", title: "Bloco Escolar e Sanitários Mecufi", loc: "Mecuffi, Cabo-Delgado", cat: "educacao", coords: [-13.3000, 40.5600] },
    { id: "project-13", title: "Abastecimento de Água Comunitária (PCAA)", loc: "Diversos Distritos, Moçambique", cat: "hidraulica", coords: [-15.1200, 39.2600] },
    { id: "project-14", title: "Campo Polivalente e Parque de Pemba", loc: "Pemba, Cabo-Delgado", cat: "desporto", coords: [-12.9700, 40.5200] },
    { id: "project-15", title: "24 Casas Sociais T0 (Monapo)", loc: "Monapo, Nampula", cat: "habitacao", coords: [-14.9200, 40.1300] },
    { id: "project-16", title: "11 Habitações Sociais T0 (Chuiba)", loc: "Chuiba, Pemba", cat: "habitacao", coords: [-13.0100, 40.5400] },
    { id: "project-17", title: "24 Habitações Sociais (Mecufi)", loc: "Mecuffi, Pemba", cat: "habitacao", coords: [-13.3100, 40.5700] },
    { id: "project-18", title: "Maternidade & Centro de Saúde", loc: "Machava Bedene, Maputo", cat: "infraestrutura", coords: [-25.8928, 32.4967] }
  ];

  // Category Translation Map
  const catNames = {
    habitacao: "Habitação",
    educacao: "Infraestrutura & Educação",
    hidraulica: "Sistemas Hidráulicos",
    infraestrutura: "Governo & Mercados",
    desporto: "Desporto & Lazer"
  };

  // Color mappings based on JDI brand colors
  const catColors = {
    habitacao: "#1b5f90",      // JDI Blue
    educacao: "#1ea8fc",       // JDI Cyan
    hidraulica: "#10b981",     // Emerald Green
    infraestrutura: "#f9ad0a",  // JDI Gold
    desporto: "#d946ef"        // Magenta
  };

  // Initialize Map centered on central Mozambique with reasonable bounds
  const map = L.map('homepage-map', {
    scrollWheelZoom: false,
    maxBounds: [[-27.5, 29.0], [-9.5, 42.0]], // limit scrolling outside Mozambique region
    maxBoundsViscosity: 0.8
  }).setView([-18.6657, 35.5295], 5.5);

  // CartoDB Voyager clean tile layer
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 18,
    minZoom: 4
  }).addTo(map);

  const markersGroup = L.layerGroup().addTo(map);
  const projectMarkers = {}; // keep map markers index by project ID

  // Render markers & set up click behavior
  projectsCoords.forEach(project => {
    const color = catColors[project.cat] || "#1b5f90";
    const catLabel = catNames[project.cat] || "Projecto";

    const popupContent = `
      <div class="map-popup-card">
        <div class="map-popup-meta">
          <span>${catLabel}</span>
        </div>
        <h4 class="map-popup-title">${project.title}</h4>
        <p class="map-popup-loc"><strong>Local:</strong> ${project.loc}</p>
        <button onclick="window.openProjectModalFromId('${project.id}')" class="map-popup-btn">
          Ver Detalhes da Obra
        </button>
      </div>
    `;

    // Circle Marker
    const marker = L.circleMarker(project.coords, {
      radius: 9,
      fillColor: color,
      color: "#ffffff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.9
    });

    marker.bindPopup(popupContent, {
      maxWidth: 260,
      closeButton: true,
      className: 'jdi-map-popup'
    });

    // Hover scale styling
    marker.on('mouseover', function () {
      this.setStyle({
        radius: 12,
        fillOpacity: 1.0
      });
    });

    marker.on('mouseout', function () {
      if (!this.isPopupOpen()) {
        this.setStyle({
          radius: 9,
          fillOpacity: 0.9
        });
      }
    });

    // When popup closes, scale down the marker style back to normal
    marker.on('popupclose', function () {
      this.setStyle({
        radius: 9,
        fillOpacity: 0.9
      });
      // Remove active class from list items when popup is closed
      clearActiveListItems();
    });

    marker.on('popupopen', function() {
      this.setStyle({
        radius: 12,
        fillOpacity: 1.0
      });
      // Mark corresponding list item as active
      setActiveListItem(project.id);
    });

    markersGroup.addLayer(marker);
    projectMarkers[project.id] = marker;
  });

  // Render Sidebar Directory List
  const directoryList = document.getElementById("directory-list");
  const searchInput = document.getElementById("project-search");

  function renderDirectoryList(filterQuery = "") {
    directoryList.innerHTML = "";
    const query = filterQuery.toLowerCase().trim();

    projectsCoords.forEach(project => {
      const matchTitle = project.title.toLowerCase().includes(query);
      const matchLoc = project.loc.toLowerCase().includes(query);
      const matchCat = (catNames[project.cat] || "").toLowerCase().includes(query);

      // If matched, show directory item and add map marker
      if (matchTitle || matchLoc || matchCat) {
        // Add marker back to map if it was removed
        if (!map.hasLayer(projectMarkers[project.id])) {
          markersGroup.addLayer(projectMarkers[project.id]);
        }

        const li = document.createElement("li");
        li.className = "directory-item";
        li.dataset.id = project.id;
        
        li.innerHTML = `
          <div class="directory-item-header">
            <span class="directory-item-title">${project.title}</span>
            <span class="directory-item-cat-badge cat-${project.cat}">${catNames[project.cat] || "Obra"}</span>
          </div>
          <div class="directory-item-loc">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="14" height="14" style="flex-shrink:0; margin-top:2px;">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>${project.loc}</span>
          </div>
          <div class="directory-item-actions">
            <button class="dir-details-btn" onclick="event.stopPropagation(); window.openProjectModalFromId('${project.id}')">
              Ver Detalhes &rarr;
            </button>
          </div>
        `;

        li.addEventListener("click", () => {
          selectProject(project);
        });

        directoryList.appendChild(li);
      } else {
        // Remove marker from map
        if (map.hasLayer(projectMarkers[project.id])) {
          markersGroup.removeLayer(projectMarkers[project.id]);
        }
      }
    });
  }

  function selectProject(project) {
    // Zoom and pan to marker
    map.flyTo(project.coords, 10, {
      animate: true,
      duration: 1.2
    });

    // Open popup
    setTimeout(() => {
      projectMarkers[project.id].openPopup();
    }, 450);

    setActiveListItem(project.id);
  }

  function setActiveListItem(projectId) {
    clearActiveListItems();
    const activeItem = directoryList.querySelector(`[data-id="${projectId}"]`);
    if (activeItem) {
      activeItem.classList.add("active");
      // Scroll sidebar item into view smoothly within the sidebar list container
      activeItem.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  function clearActiveListItems() {
    const activeItems = directoryList.querySelectorAll(".directory-item.active");
    activeItems.forEach(item => item.classList.remove("active"));
  }

  // Live text search event listener
  searchInput.addEventListener("input", (e) => {
    renderDirectoryList(e.target.value);
  });

  // Initial directory load
  renderDirectoryList();
});

// ─── Project Details Modal Handlers ─────────────────────────
let portfolioDoc = null;

async function getPortfolioDoc() {
  if (portfolioDoc) return portfolioDoc;
  try {
    const response = await fetch('portfolio.html?v=2');
    const text = await response.text();
    const parser = new DOMParser();
    portfolioDoc = parser.parseFromString(text, 'text/html');
    return portfolioDoc;
  } catch (err) {
    console.error('Error fetching portfolio details:', err);
    return null;
  }
}

window.openProjectModalFromId = async function (projectId) {
  const doc = await getPortfolioDoc();
  if (!doc) return;
  const cardElement = doc.getElementById(projectId);
  if (!cardElement) return;

  const modal = document.getElementById('project-modal');
  const img = cardElement.getAttribute('data-img');
  const category = cardElement.getAttribute('data-category');
  
  const title = cardElement.querySelector('.project-title').textContent.trim();
  const desc = cardElement.querySelector('.project-description').textContent.trim();
  
  const statusBadge = cardElement.querySelector('.status-badge');
  const statusText = statusBadge.textContent.trim();
  const isCompleted = statusBadge.classList.contains('completed');
  
  const details = cardElement.querySelectorAll('.detail-val');
  const client = details[0] ? details[0].textContent.trim() : 'JDI';
  const location = details[1] ? details[1].textContent.trim() : 'Moçambique';
  
  const catLabel = cardElement.querySelector('.category-label').textContent.trim();

  // Populate Modal Fields (Hero Image & Gallery Section)
  const galleryAttr = cardElement.getAttribute('data-gallery');
  const gallerySection = document.getElementById('modal-gallery-section');
  const gallerySlider = document.getElementById('modal-gallery-slider');
  const galleryDots = document.getElementById('modal-gallery-dots');
  
  let images = [];
  if (galleryAttr) {
    images = galleryAttr.split(',').map(s => s.trim());
  } else {
    images = [img];
  }
  
  // Main Hero Image
  const mainImg = document.getElementById('modal-img');
  mainImg.src = images[0];
  mainImg.alt = title;
  mainImg.classList.add('clickable-image');
  mainImg.onclick = () => window.openLightbox(mainImg.src, mainImg.alt);
  
  // Populate inner gallery carousel for the REST of the images
  const otherImages = images.slice(1);
  if (otherImages.length > 0) {
    gallerySection.style.display = 'block';
    gallerySlider.innerHTML = '';
    galleryDots.innerHTML = '';
    gallerySlider.scrollLeft = 0;
    
    otherImages.forEach((imgSrc, idx) => {
      const newImg = document.createElement('img');
      newImg.src = imgSrc;
      newImg.alt = `${title} - Galeria ${idx + 1}`;
      newImg.loading = 'lazy';
      newImg.classList.add('clickable-image');
      newImg.onclick = () => window.openLightbox(newImg.src, newImg.alt);
      gallerySlider.appendChild(newImg);
      
      if (otherImages.length > 1) {
        const dot = document.createElement('span');
        dot.className = 'modal-gallery-dot' + (idx === 0 ? ' active' : '');
        dot.addEventListener('click', () => {
          gallerySlider.scrollTo({
            left: idx * gallerySlider.clientWidth,
            behavior: 'smooth'
          });
        });
        galleryDots.appendChild(dot);
      }
    });
    
    if (otherImages.length > 1) {
      const handleScroll = () => {
        const width = gallerySlider.clientWidth;
        const activeIndex = Math.round(gallerySlider.scrollLeft / width);
        const dots = galleryDots.querySelectorAll('.modal-gallery-dot');
        dots.forEach((dot, idx) => {
          if (idx === activeIndex) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      };
      gallerySlider.removeEventListener('scroll', gallerySlider._scrollHandler);
      gallerySlider._scrollHandler = handleScroll;
      gallerySlider.addEventListener('scroll', handleScroll);
    }
  } else {
    gallerySection.style.display = 'none';
    gallerySlider.innerHTML = '';
    galleryDots.innerHTML = '';
  }
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-desc').textContent = desc;
  document.getElementById('modal-client').textContent = client;
  document.getElementById('modal-location').textContent = location;
  document.getElementById('modal-category').textContent = catLabel;
  
  // Set CTA link to portfolio page
  const portfolioCta = document.getElementById('modal-portfolio-cta');
  if (portfolioCta) {
    portfolioCta.href = `portfolio.html#${projectId}`;
  }
  
  // Configure Status Badge
  const modalStatus = document.getElementById('modal-status');
  modalStatus.textContent = statusText;
  modalStatus.className = 'status-badge ' + (isCompleted ? 'completed' : 'running');

      // Generate dynamic insights
      const insightsList = document.getElementById('modal-insights-list');
      insightsList.innerHTML = '';
      
      let insights = [];
      if (cardElement.id === 'project-9') {
        insights = [
          "Projeto executado pela dedicada equipa técnica multidisciplinar da JDI (retratados na galeria).",
          "Fomento ao desenvolvimento socioeconómico local com contratação de mão de obra e técnicos de Cabo Delgado.",
          "Edificação moderna e segura desenvolvida sob supervisão de engenharia internacional da UNOPS.",
          "Infraestrutura planeada para capacitação técnica, fomento a novos negócios e suporte a empreendedores."
        ];
      } else if (category === 'educacao') {
    insights = [
      "Construção executada sob as normas de segurança internacional da UNOPS.",
      "Salas de aula com isolamento térmico, ventilação cruzada e acessibilidade para pessoas com deficiência.",
      "Criação de postos de trabalho diretos para mão de obra local durante a edificação.",
      "Sistemas de captação de águas pluviais integrados para irrigação escolar."
    ];
  } else if (category === 'habitacao') {
    insights = [
      "Fundações reforçadas projetadas contra intempéries e assentamento estrutural.",
      "Design modular expansível (T0 evolutiva) permitindo ampliações estruturais seguras.",
      "Acabamentos de alta durabilidade com gesso e isolamento contra umidade.",
      "Integração de sistemas hidrossanitários ecológicos individuais."
    ];
  } else if (category === 'hidraulica') {
    insights = [
      "Perfuração profunda certificada comercial de água potável (furos de água).",
      "Bombas solares submersas de alta eficiência para abastecimento sustentável 100% off-grid.",
      "Monitoramento químico e bacteriológico rigoroso da qualidade da água.",
      "Estrutura com reservatório metálico elevado e torneiras de abastecimento público."
    ];
  } else if (category === 'desporto') {
    insights = [
      "Relva sintética padrão FIFA com excelente drenagem de águas pluviais.",
      "Iluminação potente em LED projetada para atividades noturnas e competições.",
      "Vedação perimetral de alta segurança em malha eletrosoldada.",
      "Equipamentos desportivos (balizas, tabelas de basquetebol) de classe industrial."
    ];
  } else {
    insights = [
      "Reabilitação estrutural com concreto armado e revestimentos cerâmicos robustos.",
      "Otimização do fluxo de circulação pública e conformidade com normas estatais.",
      "Uso de insumos e matérias-primas nacionais, apoiando o comércio regional.",
      "Sistemas elétricos e hidráulicos completamente renovados sob normas de eficiência energética."
    ];
  }

  insights.forEach(text => {
    const li = document.createElement('li');
    li.textContent = text;
    insightsList.appendChild(li);
  });

  // Show Modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Lock scroll
};

window.closeProjectModal = function () {
  const modal = document.getElementById('project-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Unlock scroll
  }
};

// Keydown controls for modals and lightbox (Escape, Left, Right Arrow Keys)
window.addEventListener('keydown', (e) => {
  const lightbox = document.getElementById('image-lightbox');
  const isLightboxActive = lightbox && lightbox.classList.contains('active');

  if (e.key === 'Escape') {
    if (isLightboxActive) {
      window.closeLightbox();
    } else {
      window.closeProjectModal();
    }
  } else if (isLightboxActive) {
    if (e.key === 'ArrowRight' || e.key === 'Right') {
      window.lightboxNext();
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
      window.lightboxPrev();
    }
  }
});

// Lightbox handlers & Arrow Navigation
window.openLightbox = function (imgSrc, altText, allImages = []) {
  const lightbox = document.getElementById('image-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  if (!lightbox || !lightboxImg) return;

  // Dynamically find all images in the active modal context if not provided
  let images = allImages;
  if (!images || images.length === 0) {
    const activeModal = document.querySelector('.project-modal.active, .article-modal.active');
    if (activeModal) {
      const foundImages = Array.from(activeModal.querySelectorAll('.clickable-image, .album-item img, .album-carousel-slider img, .modal-hero img, .modal-gallery-slider img'));
      const urls = foundImages.map(img => img.src || img.getAttribute('src'));
      images = [...new Set(urls)].filter(Boolean);
    }

    // Fallback: If the modal contains 1 or fewer images, collect all project card images on the page
    if (images.length <= 1) {
      const cards = Array.from(document.querySelectorAll('.project-card, .blog-card, .featured-card'));
      const urls = cards.map(card => {
        const img = card.querySelector('img');
        return img ? img.src || img.getAttribute('src') : card.getAttribute('data-img') || card.getAttribute('data-hero');
      });
      images = [...new Set(urls)].filter(Boolean);
    }
  }

  window.lightboxImages = images;
  window.currentLightboxIndex = images.indexOf(imgSrc);
  if (window.currentLightboxIndex === -1) {
    window.lightboxImages = [imgSrc];
    window.currentLightboxIndex = 0;
  }

  lightboxImg.src = imgSrc;
  lightboxImg.alt = altText || "Imagem Ampliada";
  
  updateLightboxArrows();
  lightbox.classList.add('active');
};

window.closeLightbox = function () {
  const lightbox = document.getElementById('image-lightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
  }
};

window.lightboxNext = function () {
  if (!window.lightboxImages || window.lightboxImages.length <= 1) return;
  window.currentLightboxIndex = (window.currentLightboxIndex + 1) % window.lightboxImages.length;
  const nextSrc = window.lightboxImages[window.currentLightboxIndex];
  const lightboxImg = document.getElementById('lightbox-img');
  if (lightboxImg) {
    lightboxImg.src = nextSrc;
    lightboxImg.alt = "Imagem Ampliada " + (window.currentLightboxIndex + 1);
    updateLightboxArrows();
  }
};

window.lightboxPrev = function () {
  if (!window.lightboxImages || window.lightboxImages.length <= 1) return;
  window.currentLightboxIndex = (window.currentLightboxIndex - 1 + window.lightboxImages.length) % window.lightboxImages.length;
  const prevSrc = window.lightboxImages[window.currentLightboxIndex];
  const lightboxImg = document.getElementById('lightbox-img');
  if (lightboxImg) {
    lightboxImg.src = prevSrc;
    lightboxImg.alt = "Imagem Ampliada " + (window.currentLightboxIndex + 1);
    updateLightboxArrows();
  }
};

function updateLightboxArrows() {
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');
  const hasMultiple = window.lightboxImages && window.lightboxImages.length > 1;

  if (prevBtn && nextBtn) {
    prevBtn.style.display = hasMultiple ? 'flex' : 'none';
    nextBtn.style.display = hasMultiple ? 'flex' : 'none';
  }
}

// ─── Contact Form Asynchronous Submit Handler ──────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "A enviar...";

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      try {
        const response = await fetch("https://formsubmit.co/ajax/info@jdimoz.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();
        
        if (response.ok && result.success === "true") {
          if (window.JDIAnalytics) {
            window.JDIAnalytics.trackLead('Contactos', {
              nome: data.name,
              email: data.email,
              telefone: data.phone || '',
              mensagem: data.message
            });
          }
          alert("Mensagem enviada com sucesso! A nossa equipa entrará em contacto em breve.");
          contactForm.reset();
        } else {
          alert("Ocorreu um erro ao enviar a mensagem. Por favor, tente contactar-nos diretamente via e-mail.");
        }
      } catch (error) {
        console.error("Error submitting contact form:", error);
        alert("Ocorreu um erro de ligação. Por favor, tente novamente.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  }
});