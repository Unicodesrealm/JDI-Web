function openProjectModal(cardElement) {
      const modal = document.getElementById('project-modal');
      const img = cardElement.getAttribute('data-img');
      const category = cardElement.getAttribute('data-category');
      
      const title = cardElement.querySelector('.project-title') ? cardElement.querySelector('.project-title').textContent.trim() : '';
      const catLabel = cardElement.querySelector('.category-label') ? cardElement.querySelector('.category-label').textContent.trim() : '';
      
      if (window.JDIAnalytics) {
        window.JDIAnalytics.trackEvent('Project Click', {
          id: cardElement.id || title,
          category: category || catLabel
        });
      }
      const desc = cardElement.querySelector('.project-description') ? cardElement.querySelector('.project-description').textContent.trim() : '';
      
      // Get meta labels
      const statusBadge = cardElement.querySelector('.status-badge');
      const statusText = statusBadge ? statusBadge.textContent.trim() : '';
      const isCompleted = statusBadge ? statusBadge.classList.contains('completed') : false;
      
      // Details values
      const details = cardElement.querySelectorAll('.detail-val');
      const client = details[0] ? details[0].textContent.trim() : 'JDI';
      const location = details[1] ? details[1].textContent.trim() : 'Moçambique';

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
      
      // Configure Status Badge
      const modalStatus = document.getElementById('modal-status');
      modalStatus.textContent = statusText;
      modalStatus.className = 'status-badge ' + (isCompleted ? 'completed' : 'running');

      // Configure Related Blog Link dynamically
      const relatedBlogSec = document.getElementById('modal-related-blog');
      const blogLink = document.getElementById('modal-blog-link');
      const projectBlogPosts = {
        "project-18": { id: "lugar-de-mulher", title: "Lugar de Mulher é Onde Ela Quiser" },
        "project-13": { id: "sistemas-de-agua", title: "Sistemas Ecoeficientes de Água Potável" },
        "project-17": { id: "habitacao-sustentavel", title: "Desenho Ecoeficiente em Habitações Sociais" },
        "project-15": { id: "habitacao-sustentavel", title: "Desenho Ecoeficiente em Habitações Sociais" },
        "project-16": { id: "habitacao-sustentavel", title: "Desenho Ecoeficiente em Habitações Sociais" },
        "project-9": { id: "incubadora-namuapala", title: "Força Colectiva: O Trabalho de Equipa em Namuapala" }
      };

      if (relatedBlogSec && blogLink) {
        const blogPost = projectBlogPosts[cardElement.id];
        if (blogPost) {
          relatedBlogSec.style.display = 'block';
          blogLink.href = `blog.html?post=${blogPost.id}`;
          blogLink.innerHTML = `&rarr; ${blogPost.title}`;
        } else {
          relatedBlogSec.style.display = 'none';
        }
      }

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
    }

    function closeProjectModal() {
      const modal = document.getElementById('project-modal');
      modal.classList.remove('active');
      document.body.style.overflow = ''; // Unlock scroll
    }

    // Keydown controls for modals and lightbox (Escape, Left, Right Arrow Keys)
    window.addEventListener('keydown', (e) => {
      const lightbox = document.getElementById('image-lightbox');
      const isLightboxActive = lightbox && lightbox.classList.contains('active');

      if (e.key === 'Escape') {
        if (isLightboxActive) {
          window.closeLightbox();
        } else {
          closeProjectModal();
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

        // Fallback: If the modal contains 1 or fewer images, collect all project card images on the page
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

// ─── Interactive Projects Navigation Implementation ─────────────────────────
// Function to scroll and highlight target card
window.navigateToProject = (projectId) => {
  const card = document.getElementById(projectId);
  if (card) {
    // Smooth scroll to element
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Add visual flash highlight class
    card.classList.add('highlight-flash');
    setTimeout(() => {
      card.classList.remove('highlight-flash');
    }, 1600);
  }
};

window.addEventListener("DOMContentLoaded", () => {
  const hash = window.location.hash;
  if (hash) {
    const targetId = hash.substring(1);
    setTimeout(() => {
      window.navigateToProject(targetId);
      const card = document.getElementById(targetId);
      if (card && card.classList.contains('project-card')) {
        openProjectModal(card);
      }
    }, 400);
  }
});