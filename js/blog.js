/* ─── JDI Blog Page Logic ─── */

document.addEventListener("DOMContentLoaded", () => {
  // Navigation Scroll Class Toggle
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.nav-bar');
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // Automatically open article if "post" query param or hash matches articlesDB
  const urlParams = new URLSearchParams(window.location.search);
  const postParam = urlParams.get('post') || window.location.hash.substring(1);
  if (postParam && articlesDB[postParam]) {
    setTimeout(() => {
      window.openArticleModal(postParam);
      // Smooth scroll to the article card
      const featuredCard = document.querySelector(`.featured-card[onclick*="${postParam}"]`);
      const blogCard = document.querySelector(`.blog-card[onclick*="${postParam}"]`);
      const targetCard = featuredCard || blogCard;
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 400);
  }
});

// Blog Database
const articlesDB = {
  "lugar-de-mulher": {
    title: "Lugar de Mulher é Onde Ela Quiser",
    tag: "Inclusão Social",
    heroImage: "Assets/Inclusividade-feminina-1.jpeg",
    content: [
      { type: "p", text: "Na JDI, valorizamos e incentivamos o engajamento feminino, reconhecendo o papel essencial das mulheres na construção civil. Com talento, determinação e profissionalismo, elas contribuem não apenas para a construção de infraestruturas, mas também para um futuro mais inclusivo e sustentável." },
      { type: "p", text: "A quebra de estereótipos tradicionais é um dos pilares da nossa cultura corporativa. O canteiro de obras, historicamente dominado pelo género masculino, está a passar por uma revolução silenciosa mas potente. Mulheres engenheiras, encarregadas de obra, operárias e gestoras de qualidade trazem um olhar de precisão, rigor técnico e planeamento minucioso que eleva os padrões de execução da JDI." },
      { type: "blockquote", text: "O empoderamento feminino nas obras não é apenas uma questão de equidade social, mas um vector de excelência operacional e inovação na engenharia moçambicana." },
      { type: "p", text: "O nosso compromisso vai além do discurso. Implementamos políticas activas de contratação equitativa e oferecemos formação técnica contínua em áreas como cálculo estrutural, conformidade de segurança e operações de maquinário pesado. A presença feminina no terreno traduz-se em canteiros mais organizados, maior cumprimento de normas de higiene e segurança, e uma forte coesão de equipa." },
      { type: "p", text: "Além do dia-a-dia operacional, promovemos regularmente eventos sociais corporativos, workshops de integração e encontros de team-building sobre liderança. Estes momentos de celebração e convívio integram as nossas colaboradoras, parceiros institucionais e as comunidades locais onde actuamos, gerando um forte ambiente de solidariedade, networking e alegria que ultrapassa os limites do canteiro de obras." },
      { type: "p", text: "Acreditamos que a igualdade de oportunidades cria valor partilhado. Ao integrar e incentivar o talento das mulheres em grandes projectos – desde complexos escolares a sistemas hidráulicos nacionais –, estamos a construir infraestruturas físicas robustas e, paralelamente, a moldar uma sociedade mais equilibrada, justa e preparada para os desafios de amanhã." }
    ],
    gallery: [
      "Assets/Inclusividade-feminina-1.jpeg",
      "Assets/Inclusividade-feminina-2.jpeg",
      "Assets/Inclusividade-feminina-3.jpeg",
      "Assets/Inclusividade-feminina-4.jpeg",
      "Assets/Inclusividade-feminina-5.jpeg",
      "Assets/Inclusividade-feminina-6.jpeg"
    ],
    portfolioProjects: [
      { id: "project-18", title: "Maternidade & Centro de Saúde da Machava Bedene" }
    ]
  },
  "sistemas-de-agua": {
    title: "Sistemas Ecoeficientes de Água Potável",
    tag: "Inovação",
    heroImage: "Assets/project-water-system.webp",
    content: [
      { type: "p", text: "A escassez de água potável in áreas rurais de Moçambique exige abordagens inovadoras e de baixo impacto ambiental. Na JDI, desenvolvemos soluções integradas baseadas em furos artesianos e sistemas de bombagem sustentáveis, desenhados para servir comunidades vulneráveis a longo prazo." },
      { type: "p", text: "Ao substituir as tradicionais bombas manuais de pistão por bombas submersas de alta eficiência alimentadas por energia fotovoltaica, asseguramos um fornecimento contínuo de água de forma 100% off-grid. Esta escolha elimina custos contínuos de combustível fóssil e reduz a zero a pegada carbónica operacional do sistema." },
      { type: "blockquote", text: "A energia solar não é apenas uma escolha ecológica; é a única garantia de viabilidade económica e operacional para redes de água comunitárias isoladas." },
      { type: "p", text: "Cada projecto é validado através de ensaios laboratoriais e monitorização de caudal rigorosos. Além disso, criamos comités locais de gestão de água nas comunidades beneficiadas, capacitando os moradores para a manutenção básica das infraestruturas e garantindo a sustentabilidade social e técnica das instalações." }
    ],
    gallery: [],
    portfolioProjects: [
      { id: "project-13", title: "Abastecimento de Água Comunitária (PCAA)" }
    ]
  },
  "habitacao-sustentavel": {
    title: "Desenho Ecoeficiente em Habitações Sociais",
    tag: "Habitação",
    heroImage: "Assets/24-habitacoes-sociais-mecufi.webp",
    content: [
      { type: "p", text: "A construção de habitações de interesse social de alta qualidade requer um equilíbrio complexo entre contenção orçamental, rapidez de execução e habitabilidade térmica. Em projectos como os de Mecufi e Pemba, a JDI adopta conceitos de arquitectura bioclimática passiva." },
      { type: "p", text: "Isso inclui a orientação solar optimizada dos blocos residenciais, a integração de ventilação cruzada natural e o uso de coberturas ventiladas que impedem a radiação térmica directa nos quartos. Estes detalhes arquitectónicos reduzem significativamente a temperatura interna sem a necessidade de ar condicionado." },
      { type: "blockquote", text: "A habititação digna é o primeiro passo para o desenvolvimento humano. Por isso, aliamos materiais sustentáveis a um desenho técnico altamente resiliente." },
      { type: "p", text: "Utilizamos betão estrutural de alta durabilidade e tintas ecológicas anti-humidade, minimizando a necessidade de reparações frequentes e reduzindo o custo de ciclo de vida das moradias para as famílias reassentadas." }
    ],
    gallery: [],
    portfolioProjects: [
      { id: "project-17", title: "24 Habitações Sociais (Mecufi)" },
      { id: "project-15", title: "24 Casas Sociais T0 (Monapo)" },
      { id: "project-16", title: "11 Habitações Sociais T0 (Chuiba)" }
    ]
  },
  "incubadora-namuapala": {
    title: "Força Colectiva: O Trabalho de Equipa em Namuapala",
    tag: "Equipa JDI",
    heroImage: "Assets/Namuapala-Team.jpeg",
    content: [
      { type: "p", text: "A engenharia e a construção civil não são feitas apenas de concreto e aço, mas sim do empenho coordenado de pessoas dedicadas. Na JDI, acreditamos que o sucesso de cada obra reside na força colectiva das nossas equipas. A construção da Incubadora de Negócios de Namuapala, em Cabo Delgado, é um exemplo brilhante desse compromisso." },
      { type: "p", text: "Este projecto de infraestrutura moderna, concebido para apoiar e capacitar empreendedores locais e impulsionar a economia regional, foi executado pela nossa equipa técnica multidisciplinar altamente qualificada. Em estreita coordenação com a UNOPS (dono da obra), os nossos engenheiros, mestres-de-obras e operários trabalharam em harmonia para implementar padrões internacionais de controlo de qualidade e segurança." },
      { type: "blockquote", text: "Trabalhar em equipa significa partilhar o mesmo focus técnico e a mesma responsabilidade humana pelo impacto social que entregamos a cada comunidade." },
      { type: "p", text: "A equipa JDI envolvida em Namuapala (retratada na nossa galeria) reuniu talento nacional experiente e mão de obra local cabo-delgadense, promovendo transferência de conhecimentos práticos e gerando rendimento directo para dezenas de famílias. Desde a terraplenagem inicial até aos acabamentos finais da estrutura física e das redes hidráulicas e eléctricas, o rigor de cada passo reflecte o profissionalismo e a harmonia que definem a nossa cultura corporativa." },
      { type: "p", text: "A JDI expressa o seu sincero orgulho por cada colaborador que vestiu a camisola neste projecto desafiador e inspirador. Ao consolidar a Incubadora de Namuapala, não só edificamos paredes e lajes robustas, mas também fortalecemos os laços de confiança mútua e provamos que a engenharia de precisão e a colaboração humana andam de mãos dadas para erguer o futuro de Moçambique." }
    ],
    gallery: [
      "Assets/Namuapala-Team.jpeg",
      "Assets/incubadora-negocios-namuapala.webp"
    ],
    portfolioProjects: [
      { id: "project-9", title: "Incubadora de Negócios Namuapala" }
    ]
  }
};

// Open Article Modal
window.openArticleModal = function (articleId) {
  const article = articlesDB[articleId];
  if (!article) return;

  if (window.JDIAnalytics) {
    window.JDIAnalytics.trackEvent('Article Read', {
      id: articleId,
      title: article.title
    });
  }

  const modal = document.getElementById('article-modal');
  if (articleId === 'lugar-de-mulher') {
    modal.classList.add('no-grayscale');
  } else {
    modal.classList.remove('no-grayscale');
  }
  const modalImg = document.getElementById('modal-art-img');
  const modalTag = document.getElementById('modal-art-tag');
  const modalTitle = document.getElementById('modal-art-title');
  const modalContent = document.getElementById('modal-art-content');

  // Populate basic metadata
  modalImg.src = article.heroImage;
  modalImg.alt = article.title;
  modalImg.classList.add('clickable-image');
  modalImg.onclick = () => window.openLightbox(modalImg.src, modalImg.alt);
  modalTag.textContent = article.tag;
  modalTitle.textContent = article.title;

  // Custom Tag Styles based on Category
  if (article.tag === "Inovação") {
    modalTag.style.color = "#10b981";
    modalTag.style.background = "rgba(16,185,129,0.08)";
    modalTag.style.borderColor = "rgba(16,185,129,0.2)";
  } else if (article.tag === "Habitação") {
    modalTag.style.color = "var(--jdi-blue)";
    modalTag.style.background = "rgba(27,95,144,0.08)";
    modalTag.style.borderColor = "rgba(27,95,144,0.2)";
  } else if (article.tag === "Equipa JDI") {
    modalTag.style.color = "var(--jdi-gold)";
    modalTag.style.background = "rgba(249,173,10,0.08)";
    modalTag.style.borderColor = "rgba(249,173,10,0.2)";
  } else {
    modalTag.style.color = "var(--jdi-cyan)";
    modalTag.style.background = "rgba(30,168,252,0.08)";
    modalTag.style.borderColor = "rgba(30,168,252,0.2)";
  }

  // Populate paragraphs
  modalContent.innerHTML = "";
  article.content.forEach(item => {
    if (item.type === "p") {
      const p = document.createElement('p');
      p.textContent = item.text;
      modalContent.appendChild(p);
    } else if (item.type === "blockquote") {
      const q = document.createElement('blockquote');
      q.textContent = item.text;
      modalContent.appendChild(q);
    }
  });

  // Populate related projects links
  const relatedProjSec = document.getElementById('modal-related-projects');
  const relatedLinksCont = document.getElementById('modal-related-links-container');
  if (relatedProjSec && relatedLinksCont) {
    if (article.portfolioProjects && article.portfolioProjects.length > 0) {
      relatedProjSec.style.display = "block";
      relatedLinksCont.innerHTML = "";
      article.portfolioProjects.forEach(proj => {
        const a = document.createElement('a');
        a.href = `portfolio.html#${proj.id}`;
        a.className = 'related-project-link';
        a.style.fontFamily = 'var(--body-font)';
        a.style.fontSize = '0.92rem';
        a.style.fontWeight = '600';
        a.style.color = 'var(--jdi-blue)';
        a.style.textDecoration = 'none';
        a.style.display = 'inline-flex';
        a.style.alignItems = 'center';
        a.style.gap = '6px';
        a.style.transition = 'color 0.3s';
        a.onmouseover = () => a.style.color = 'var(--jdi-cyan)';
        a.onmouseout = () => a.style.color = 'var(--jdi-blue)';
        a.innerHTML = `&rarr; ${proj.title}`;
        relatedLinksCont.appendChild(a);
      });
    } else {
      relatedProjSec.style.display = "none";
      relatedLinksCont.innerHTML = "";
    }
  }

  // Populate gallery if present
  const gallerySec = document.getElementById('modal-gallery-sec');
  const albumGrid = document.getElementById('modal-album-grid');
  const carouselSlider = document.getElementById('modal-carousel-slider');
  const carouselDots = document.getElementById('modal-carousel-dots');

  if (article.gallery && article.gallery.length > 0) {
    gallerySec.style.display = "block";
    albumGrid.innerHTML = "";
    carouselSlider.innerHTML = "";
    carouselDots.innerHTML = "";

    // Build iCloud album grid layout (for desktop)
    article.gallery.forEach((imgSrc, index) => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'album-item';
      
      // Dynamic grid spans for premium layout (alternating wide and normal)
      if (index === 0 || index === 3 || index === 4) {
        itemDiv.classList.add('span-2-col');
      }

      const img = document.createElement('img');
      img.src = imgSrc;
      img.alt = `${article.title} - Foto ${index + 1}`;
      img.loading = 'lazy';
      img.onclick = () => window.openLightbox(imgSrc, img.alt);
      itemDiv.appendChild(img);
      albumGrid.appendChild(itemDiv);

      // Build touch slider item (for mobile)
      const carouselImg = document.createElement('img');
      carouselImg.src = imgSrc;
      carouselImg.alt = `${article.title} - Foto ${index + 1}`;
      carouselImg.loading = 'lazy';
      carouselImg.onclick = () => window.openLightbox(imgSrc, carouselImg.alt);
      carouselSlider.appendChild(carouselImg);

      // Carousel navigation dots
      const dot = document.createElement('span');
      dot.className = 'carousel-dot' + (index === 0 ? ' active' : '');
      dot.addEventListener('click', () => {
        carouselSlider.scrollTo({
          left: index * carouselSlider.clientWidth,
          behavior: 'smooth'
        });
      });
      carouselDots.appendChild(dot);
    });

    // Dynamic Dot scrolling updates on swipe
    const handleScroll = () => {
      const width = carouselSlider.clientWidth;
      const activeIndex = Math.round(carouselSlider.scrollLeft / width);
      const dots = carouselDots.querySelectorAll('.carousel-dot');
      dots.forEach((dot, idx) => {
        if (idx === activeIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    };
    carouselSlider.removeEventListener('scroll', carouselSlider._scrollHandler);
    carouselSlider._scrollHandler = handleScroll;
    carouselSlider.addEventListener('scroll', handleScroll);

  } else {
    gallerySec.style.display = "none";
  }

  // Open Modal and lock background scroll
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

// Close Article Modal
window.closeArticleModal = function () {
  const modal = document.getElementById('article-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.classList.remove('no-grayscale');
    document.body.style.overflow = '';
  }
};

// Global Lightbox Handlers & Arrow Navigation
window.openLightbox = function (imgSrc, altText, allImages = []) {
  const lightbox = document.getElementById('image-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  if (!lightbox || !lightboxImg) return;

  // Normalize target imgSrc to absolute URL
  const absImgSrc = imgSrc ? new URL(imgSrc, window.location.href).href : "";

  // Dynamically find all images in the active modal context if not provided
  let images = allImages;
  if (!images || images.length === 0) {
    const activeModal = document.querySelector('.project-modal.active, .article-modal.active');
    if (activeModal) {
      const foundImages = Array.from(activeModal.querySelectorAll('.clickable-image, .album-item img, .album-carousel-slider img, .modal-hero img, .modal-gallery-slider img'));
      const urls = foundImages.map(img => {
        const src = img.src || img.getAttribute('src');
        return src ? new URL(src, window.location.href).href : null;
      });
      images = [...new Set(urls)].filter(Boolean);
    }

    // Fallback: If the modal contains 1 or fewer images, collect all article/project card images on the main page
    if (images.length <= 1) {
      const cards = Array.from(document.querySelectorAll('.project-card, .blog-card, .featured-card'));
      const urls = cards.map(card => {
        const img = card.querySelector('img');
        const src = img ? img.src || img.getAttribute('src') : card.getAttribute('data-img') || card.getAttribute('data-hero');
        return src ? new URL(src, window.location.href).href : null;
      });
      images = [...new Set(urls)].filter(Boolean);
    }
  }

  window.lightboxImages = images;
  window.currentLightboxIndex = images.indexOf(absImgSrc);
  if (window.currentLightboxIndex === -1) {
    window.lightboxImages = [absImgSrc];
    window.currentLightboxIndex = 0;
  }

  lightboxImg.src = absImgSrc;
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

// Keydown controls for modals and lightbox (Escape, Left, Right Arrow Keys)
window.addEventListener('keydown', (e) => {
  const lightbox = document.getElementById('image-lightbox');
  const isLightboxActive = lightbox && lightbox.classList.contains('active');

  if (e.key === 'Escape') {
    if (isLightboxActive) {
      window.closeLightbox();
    } else {
      window.closeArticleModal();
    }
  } else if (isLightboxActive) {
    if (e.key === 'ArrowRight' || e.key === 'Right') {
      window.lightboxNext();
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
      window.lightboxPrev();
    }
  }
});
