document.addEventListener('DOMContentLoaded', () => {
  // --- 1. INICJALIZACJA ---
  if (typeof lucide !== 'undefined') lucide.createIcons();
  gsap.registerPlugin(ScrollTrigger);

  // --- 2. MENU MOBILNE (LOGIKA BEZPIECZEŃSTWA) ---
  const burger = document.getElementById('burger-menu');
  const mobileMenu = document.getElementById('mobile-menu');
  const header = document.querySelector('.header');
  const menuLinks = document.querySelectorAll('.mobile-menu__link');

  const toggleMenu = (open) => {
      if (open) {
          mobileMenu.classList.add('active');
          header.classList.add('menu-open');
          document.body.style.overflow = 'hidden'; // Blokada scrolla przy otwartym menu
      } else {
          mobileMenu.classList.remove('active');
          header.classList.remove('menu-open');
          document.body.style.overflow = '';
      }
  };

  if (burger) {
      burger.addEventListener('click', () => {
          const isActive = mobileMenu.classList.contains('active');
          toggleMenu(!isActive);
      });
  }

  // Kliknięcie w link: Zamknięcie menu i skok do sekcji
  menuLinks.forEach(link => {
      link.addEventListener('click', (e) => {
          const targetId = link.getAttribute('href').split('#')[1];
          const targetElement = document.getElementById(targetId);

          toggleMenu(false);

          if (targetElement) {
              e.preventDefault();
              // Natywny scroll z offsetem pod header (80px)
              const offset = 80;
              const bodyRect = document.body.getBoundingClientRect().top;
              const elementRect = targetElement.getBoundingClientRect().top;
              const elementPosition = elementRect - bodyRect;
              const offsetPosition = elementPosition - offset;

              window.scrollTo({
                  top: offsetPosition,
                  behavior: 'auto'
              });
          }
      });
  });

  // --- 3. TELEFON (TYLKO CYFRY I +) ---
  const phoneInput = document.getElementById('phone-input');
  if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
          // Obsługa polskiego numeru i formatu międzynarodowego
          e.target.value = e.target.value.replace(/[^0-9+]/g, '');
      });
  }

  // --- 4. ANIMACJE POJAWIANIA SIĘ (GSAP) ---
  const initScrollAnims = () => {
      // Czyszczenie starych triggerów
      ScrollTrigger.getAll().forEach(t => t.kill());

      // Karty i elementy technologiczne
      const items = document.querySelectorAll('.info-card, .income-card, .tech-item');
      items.forEach(item => {
          gsap.from(item, {
              scrollTrigger: {
                  trigger: item,
                  start: "top 92%",
                  toggleActions: "play none none none"
              },
              y: 40,
              opacity: 0,
              duration: 0.6,
              ease: "power2.out"
          });
      });

      // Hero animacja
      gsap.timeline()
          .from(".hero__title", { x: -50, opacity: 0, duration: 0.8 })
          .from(".hero__text", { y: 20, opacity: 0, duration: 0.5 }, "-=0.4")
          .from(".brutal-card", { scale: 0.9, opacity: 0, rotate: 5, duration: 0.6 }, "-=0.3");
  };

  // --- 5. CAPTCHA (WERYFIKACJA) ---
  const contactForm = document.getElementById('main-form');
  if (contactForm) {
      const n1 = Math.floor(Math.random() * 10);
      const n2 = Math.floor(Math.random() * 5);
      const label = document.getElementById('captcha-label');

      // Zaktualizowany tekst na polski
      if (label) label.innerText = `WERYFIKACJA: ${n1} + ${n2} = ?`;

      contactForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const val = document.getElementById('captcha-input').value;
          if (parseInt(val) === (n1 + n2)) {
              document.getElementById('form-success').style.display = 'block';
              document.getElementById('form-error').style.display = 'none';
              contactForm.reset();
              gsap.to(contactForm, { opacity: 0.5, pointerEvents: 'none' });
          } else {
              document.getElementById('form-error').style.display = 'block';
              // Animacja błędu (trzęsienie)
              gsap.to("#captcha-input", { x: 5, repeat: 5, yoyo: true, duration: 0.05 });
          }
      });
  }

  // --- 6. FINALNY REFRESH ---
  window.addEventListener('load', () => {
      initScrollAnims();
      ScrollTrigger.refresh();
  });
});