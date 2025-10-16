/* ===== Icons ===== */
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();

  /* ===== Sidebar toggle ===== */
  const sidebar = document.getElementById('sidebar');
  const hamburger = document.getElementById('hamburger');
  const closeBtn = document.querySelector('[data-close-sidebar]');
  const navLinks = document.querySelectorAll('.sidebar .nav-link');

  const openSidebar = () => {
    sidebar.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
  };
  const closeSidebar = () => {
    sidebar.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  };
  hamburger.addEventListener('click', openSidebar);
  closeBtn.addEventListener('click', closeSidebar);
  sidebar.addEventListener('click', (e) => {
    if (e.target === sidebar) closeSidebar();
  });
  navLinks.forEach(a => a.addEventListener('click', closeSidebar));

  /* ===== Smooth scroll ===== */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        e.preventDefault();
        document.querySelector(id).scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  /* ===== Dark / Light mode ===== */
  const modeToggle = document.getElementById('modeToggle');
  const stored = localStorage.getItem('theme');
  if (stored) document.body.className = stored;
  modeToggle.addEventListener('click', () => {
    const next = document.body.classList.contains('dark') ? 'light' : 'dark';
    document.body.className = next;
    localStorage.setItem('theme', next);
    modeToggle.setAttribute('aria-pressed', next === 'dark');
  });
  // ===== Set Default Theme to Light =====
document.addEventListener('DOMContentLoaded', () => {
  // ลบ dark mode ตอนเปิดเว็บ
  document.body.classList.remove('dark');


});

// ===== Toggle Button (optional) =====
const toggleBtn = document.getElementById('themeToggle');
if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const theme = document.body.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', theme); // จำโหมดไว้
  });
}

  /* ===== On-scroll appear ===== */
  const appearEls = document.querySelectorAll('.appear');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('show');
        io.unobserve(entry.target);
      }
    });
  }, {threshold: .15});
  appearEls.forEach(el => io.observe(el));

  /* ===== Skill bars animate on view ===== */
  const tracks = document.querySelectorAll('.track');
  const ioBars = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const pct = entry.target.dataset.progress || 0;
        const fill = entry.target.querySelector('.fill');
        requestAnimationFrame(() => { fill.style.width = pct + '%'; });
        ioBars.unobserve(entry.target);
      }
    });
  }, {threshold: .4});
  tracks.forEach(t => ioBars.observe(t));

  /* ===== Footer year ===== */
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();





  /* ===== Modal + Carousel ===== */
  const qs = (s, r=document)=>r.querySelector(s);
  const qsa = (s, r=document)=>Array.from(r.querySelectorAll(s));

  // open
  qsa('[data-modal-open]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = btn.getAttribute('data-modal-open');
      const modal = qs(id);
      if (!modal) return;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden','false');
      // focus trap (simple)
      setTimeout(()=>qs('[data-modal-close]', modal)?.focus(), 10);
    });
  });
  // close
  qsa('[data-modal-close]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const modal = btn.closest('.modal');
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden','true');
    });
  });
  // click on backdrop to close
  qsa('.modal').forEach(m=>{
    m.addEventListener('click', (e)=>{ if (e.target === m){ m.classList.remove('open'); m.setAttribute('aria-hidden','true'); }});
  });
  // ESC to close
  document.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape'){
      qsa('.modal.open').forEach(m=>{ m.classList.remove('open'); m.setAttribute('aria-hidden','true'); });
    }
  });

  // simple carousel
  qsa('[data-carousel]').forEach(car=>{
    const track = qs('[data-carousel-track]', car);
    const items = qsa('.c-item', track);
    let idx = 0;
    const update = ()=>{ track.style.transform = `translateX(-${idx*100}%)`; };
    qs('[data-carousel-prev]', car)?.addEventListener('click', ()=>{ idx = (idx-1+items.length)%items.length; update(); });
    qs('[data-carousel-next]', car)?.addEventListener('click', ()=>{ idx = (idx+1)%items.length; update(); });
  });
});
// ===== One-slide view + swipe for artfull carousels =====
(function () {
  const carousels = document.querySelectorAll('.artfull-carousel[data-carousel]');
  if (!carousels.length) return;

  carousels.forEach(initArtCarousel);

  function initArtCarousel(carousel) {
    const track = carousel.querySelector('[data-carousel-track]');
    const slides = Array.from(track.querySelectorAll('.c-item'));
    const prevBtn = carousel.querySelector('[data-carousel-prev]');
    const nextBtn = carousel.querySelector('[data-carousel-next]');

    let index = 0;
    let isDragging = false, startX = 0, currentX = 0, deltaX = 0;

    // ขนาดสไลด์เป็น 100% แล้วใน CSS: ค่า transform พนันด้วย index
    function go(i) {
      index = Math.max(0, Math.min(i, slides.length - 1));
      track.style.transform = `translateX(${-index * 100}%)`;
    }
    function next(){ go(index + 1); }
    function prev(){ go(index - 1); }

    // ปุ่ม
    prevBtn && prevBtn.addEventListener('click', prev);
    nextBtn && nextBtn.addEventListener('click', next);

    // ===== Swipe (touch & mouse drag) =====
    const threshold = 50; // px ที่ต้องลากถึงจะเปลี่ยนสไลด์

    const onStart = (x) => {
      isDragging = true;
      startX = x;
      deltaX = 0;
      track.style.transition = 'none';           // ลากไหลลื่น
    };
    const onMove = (x) => {
      if (!isDragging) return;
      currentX = x;
      deltaX = currentX - startX;
      const base = -index * carousel.clientWidth;
      track.style.transform = `translateX(${base + deltaX}px)`;
    };
    const onEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      track.style.transition = 'transform .35s ease';
      if (Math.abs(deltaX) > threshold) {
        deltaX < 0 ? next() : prev();
      } else {
        go(index); // snap กลับ
      }
    };

    // Touch
    track.addEventListener('touchstart', e => onStart(e.touches[0].clientX), {passive:true});
    track.addEventListener('touchmove',  e => onMove(e.touches[0].clientX),  {passive:true});
    track.addEventListener('touchend',   onEnd);
    track.addEventListener('touchcancel',onEnd);

    // Mouse (รองรับ drag บนเดสก์ท็อป)
    track.addEventListener('mousedown', e => onStart(e.clientX));
    window.addEventListener('mousemove', e => onMove(e.clientX));
    window.addEventListener('mouseup',   onEnd);

    // ปรับเมื่อขนาดหน้าต่างเปลี่ยน
    window.addEventListener('resize', () => go(index));

    // เริ่มต้น
    go(0);
  }
})();
/* ========= MEDIA HELPERS ========= */
function pauseAllIn(container){
  container.querySelectorAll('video,audio').forEach(m=>{
    try{ m.pause(); m.currentTime = 0; }catch{}
  });
  container.querySelectorAll('iframe.c-item').forEach(ifr=>{
    // เก็บ src เดิมไว้ครั้งแรก
    if(!ifr.dataset.src && ifr.src) ifr.dataset.src = ifr.src;
    // ถ้ากำลังเล่น ให้หยุดโดยการถอด src
    ifr.src = '';
  });
}
function playOnlyCurrent(slide){
  if(!slide) return;
  // หยุดพี่น้องทั้งหมดก่อน
  const wrap = slide.closest('.modal') || document;
  pauseAllIn(wrap);

  // video/audio: เล่นเมื่อเปิด
  if(slide.tagName === 'VIDEO' || slide.tagName === 'AUDIO'){
    // autoplay จะทำงานได้เมื่อผู้ใช้ interaction มาแล้ว (เปิดโมดัล/กดปุ่ม)
    slide.play().catch(()=>{});
  }
  // iframe (YouTube/Vimeo): ใส่ src จาก data-src พร้อม autoplay=1&mute=1
  if(slide.tagName === 'IFRAME'){
    const base = slide.dataset.src || '';
    if(!base) return;
    try{
      const u = new URL(base, location.href);
      u.searchParams.set('autoplay','1');
      u.searchParams.set('mute','1'); // กันบล็อก autoplay
      slide.src = u.toString();
    }catch{
      slide.src = base + (base.includes('?')?'&':'?') + 'autoplay=1&mute=1';
    }
  }
}

/* ========= MODAL OPEN/CLOSE ========= */
function openModalById(id) {
  const modal = document.querySelector(id);
  if (!modal) return;
  modal.classList.add('open');
  document.body.classList.add('modal-open'); // ✅ ปิด scroll
  const first = modal.querySelector('[data-carousel-track] .c-item');
  if (first) playOnly(first);
}

function closeModal(modal) {
  if (!modal) return;
  pauseAllIn(modal);
  modal.classList.remove('open');
  document.body.classList.remove('modal-open'); // ✅ เปิด scroll กลับ
}


// เปิดจากปุ่ม
document.querySelectorAll('[data-modal-open]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    openModalById(btn.getAttribute('data-modal-open'));
  });
});
// ปิดจากปุ่ม ✕
document.querySelectorAll('[data-modal-close]').forEach(btn=>{
  btn.addEventListener('click', ()=> closeModal(btn.closest('.modal')));
});
// ปิดเมื่อคลิกพื้นหลัง
window.addEventListener('click', e=>{
  if(e.target.classList && e.target.classList.contains('modal')){
    closeModal(e.target);
  }
});
// ปิดด้วย Esc
window.addEventListener('keydown', e=>{
  if(e.key === 'Escape'){
    document.querySelectorAll('.modal.open').forEach(closeModal);
  }
});

/* ========= CAROUSEL (ปุ่ม + ปัด) ========= */
document.querySelectorAll('.carousel[data-carousel]').forEach(carousel=>{
  const track   = carousel.querySelector('[data-carousel-track]');
  const slides  = Array.from(track.querySelectorAll('.c-item'));
  const prevBtn = carousel.querySelector('[data-carousel-prev]');
  const nextBtn = carousel.querySelector('[data-carousel-next]');

  let index=0, dragging=false, startX=0, deltaX=0;
  const total = slides.length, threshold = 50;

  // ปิดปุ่ม/ปัด ถ้ามีสไลด์เดียว
  const single = total <= 1;
  [prevBtn,nextBtn].forEach(b=>{
    if(!b) return;
    b.classList.toggle('disabled', single);
    b.setAttribute('aria-disabled', single);
  });

  function setIndex(i){
    index = (i + total) % total;
    track.style.transition = 'transform .45s cubic-bezier(.25,.8,.25,1)';
    track.style.transform  = `translateX(${-index*100}%)`;
    // เล่นเฉพาะสไลด์ที่เห็น (ตอนเปิดโมดัลอยู่)
    const modal = carousel.closest('.modal');
    if(modal && modal.classList.contains('open')){
      playOnlyCurrent(slides[index]);
    }
  }
  const next = ()=> setIndex(index+1);
  const prev = ()=> setIndex(index-1);

  prevBtn && prevBtn.addEventListener('click', prev);
  nextBtn && nextBtn.addEventListener('click', next);

  // Swipe / Drag
  const start = x => {
    if(single) return;
    dragging = true; startX = x; deltaX = 0;
    track.style.transition = 'none';
  };
  const move  = x => {
    if(!dragging) return;
    deltaX = x - startX;
    const base = -index * carousel.clientWidth;
    track.style.transform = `translateX(${base + deltaX}px)`;
  };
  const end   = () => {
    if(!dragging) return;
    dragging = false;
    track.style.transition = 'transform .45s cubic-bezier(.25,.8,.25,1)';
    if(Math.abs(deltaX) > threshold) (deltaX < 0 ? next : prev)();
    else setIndex(index);
  };

  track.addEventListener('touchstart', e=>start(e.touches[0].clientX), {passive:true});
  track.addEventListener('touchmove',  e=>move(e.touches[0].clientX), {passive:true});
  track.addEventListener('touchend',   end);
  track.addEventListener('mousedown',  e=>start(e.clientX));
  window.addEventListener('mousemove', e=>move(e.clientX));
  window.addEventListener('mouseup',   end);

  // เริ่มต้น: ปิดเสียง/ถอด src ทั้งหมดก่อน
  pauseAllIn(carousel);
  setIndex(0);

  // เมื่อโมดัลรอบๆ ถูกปิด ให้หยุดสื่อทั้งหมด กันเสียงหลง
  const modal = carousel.closest('.modal');
  if(modal){
    modal.addEventListener('transitionend', ()=>{
      if(!modal.classList.contains('open')) pauseAllIn(modal);
    });
  }
});

/* ===== Scroll lock while modal is open ===== */
let __scrollY = 0;
function lockScroll() {
  // กัน jump: เก็บตำแหน่งแล้วตรึง body ไว้
  __scrollY = window.scrollY || window.pageYOffset || 0;
  document.body.style.top = `-${__scrollY}px`;
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
  document.body.classList.add('modal-open'); // เผื่อมีสไตล์เสริม
}
function unlockScroll() {
  document.body.classList.remove('modal-open');
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  window.scrollTo(0, __scrollY || 0);
}

/* ผูกกับฟังก์ชันเปิด/ปิด modal ที่มีอยู่แล้ว */
const __openModalById = openModalById;
openModalById = function(id) {
  lockScroll();
  __openModalById(id);
};
const __closeModal = closeModal;
closeModal = function(modal) {
  __closeModal(modal);
  // ปิดเสียง/วิดีโอทำอยู่แล้วใน closeModal เดิม
  unlockScroll();
};

/* ป้องกัน scroll พื้นหลังบน iOS */
document.addEventListener('touchmove', (e) => {
  const m = document.querySelector('.modal.open');
  if (!m) return;
  if (!m.contains(e.target)) e.preventDefault();
}, { passive: false });



/* ===== Contact form (EmailJS with detailed errors) ===== */
document.addEventListener('DOMContentLoaded', () => {
  const form   = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form) return;

  form.setAttribute('action', 'javascript:void(0)');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending…';
    status.textContent = '';

    const payload = {
      from_name:  form.name?.value.trim() || '',
      from_email: form.email?.value.trim() || '',
      subject:    form.subject?.value.trim() || '',
      message:    form.message?.value.trim() || '',
    };
    if (!payload.from_name || !payload.from_email || !payload.subject || !payload.message) {
      status.textContent = 'Please fill in all fields.'; status.style.color = '#ff6b6b';
      btn.disabled = false; btn.textContent = 'SUBMIT'; return;
    }

    try {
      const res = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        payload,
        { publicKey: EMAILJS_PUBLIC_KEY } // ⬅️ ใส่ public key ตรงนี้
      );
      console.log('[EmailJS OK]', res);
      status.textContent = 'Message sent. Thank you! ✨'; status.style.color = '#27d49f';
      form.reset();
    } catch (err) {
      console.error('[EmailJS ERROR raw]', err);
      const s = err?.status;
      const t = err?.text;
      const msg = t || err?.message || JSON.stringify(err);
      const hint =
        s === 401 ? 'Invalid Public Key (ตรวจ PUBLIC_KEY).'
      : s === 403 ? 'Origin not allowed (เพิ่มโดเมนใน EmailJS → Account → Security → Allowed Origins).'
      : s === 404 ? 'Service ID หรือ Template ID ไม่ถูกต้อง.'
      : s === 422 ? 'Template parameters ไม่ตรงชื่อ (from_name, from_email, subject, message).'
      : s === 429 ? 'Rate limit: ลองใหม่อีกสักพัก.'
      : s === 0   ? 'Network/CORS: ตรวจอินเทอร์เน็ตหรือบล็อกเกอร์.'
      : 'Check console for details.';
      status.innerHTML = `Send failed. <small>(status: ${s ?? 'n/a'} • ${msg || 'no message'})</small><br><small>${hint}</small>`;
      status.style.color = '#ff6b6b';
    } finally {
      btn.disabled = false;
      btn.textContent = 'SUBMIT';
    }
  });
});
