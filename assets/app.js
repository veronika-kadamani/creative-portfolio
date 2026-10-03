(() => {
  'use strict';
  const config = window.PORTFOLIO_CONFIG;
  let page = document.body.dataset.page || 'home';
  let language;
  try { language = localStorage.getItem('vk-language'); } catch (_) {}
  let lang = language === 'ru' ? 'ru' : 'en';
  let filter = 'all';
  let returnFocus;
  const $ = (selector, root = document) => root.querySelector(selector);
  const t = key => window.COPY[lang][key] || key;
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl = value => {
    if (!value) return '';
    if (/^data:(?:image\/(?:jpeg|png|webp)|video\/mp4);base64,[A-Za-z0-9+/=]+$/.test(value)) return escape(value);
    try { const url = new URL(value, location.href); return ['http:', 'https:', 'file:'].includes(url.protocol) ? escape(value) : ''; } catch (_) { return ''; }
  };
  const localized = value => typeof value === 'object' ? (value[lang] || value.en || '') : value;
  const quoteButton = (label = 'quote', className = 'button') => `<button class="${className}" data-quote>${t(label)}</button>`;
  const eyebrow = label => `<p class="eyebrow">${t(label)}</p>`;
  const sectionHeader = (label, title, text = '') => `<div class="section-heading">${eyebrow(label)}<h2>${t(title)}</h2>${text ? `<p class="section-intro">${t(text)}</p>` : ''}</div>`;
  const categories = ['all','shorts','youtube','business','vlogs'];

  function header() {
    const nav = ['home','portfolio','services','results','about'].map(key => `<a ${page === key ? 'aria-current="page"' : ''} href="${key === 'home' ? 'index' : key}.html">${t(key)}</a>`).join('');
    return `<a class="skip" href="#main">${t('skip')}</a><header class="header"><a class="wordmark" href="index.html" aria-label="Veronika Kadamani">VERONIKA<span>KADAMANI</span></a><nav id="navigation" aria-label="${t('menu')}">${nav}<a href="#contact">${t('contact')}</a></nav><div class="header-actions"><div class="language" aria-label="Language"><button data-lang="en" aria-pressed="${lang === 'en'}">EN</button><span>|</span><button data-lang="ru" aria-pressed="${lang === 'ru'}">RU</button></div>${quoteButton('quote','button button-small')}<button class="menu-button" aria-label="${t('menu')}" aria-expanded="false" aria-controls="navigation"><span></span><span></span></button></div></header>`;
  }
  function footer() {
    return `<section class="contact-section" id="contact"><div>${eyebrow('contact')}<h2>${t('ctaA')}<br><em>${t('ctaB')}</em></h2><p>${t('ctaText')}</p>${quoteButton()}</div><div class="contact-links"><a href="https://t.me/girlsbenice" target="_blank" rel="noopener noreferrer"><span>Telegram</span>@girlsbenice</a><a href="mailto:contact.veronika.inbox@gmail.com"><span>${t('email')}</span>contact.veronika.inbox@gmail.com</a><a href="https://www.instagram.com/mrs.kadamani/" target="_blank" rel="noopener noreferrer"><span>Instagram</span>@mrs.kadamani</a><p class="location">${t('location')}<br>${t('filming')}<br>${t('worldwide')}</p></div></section><footer><a class="footer-wordmark" href="index.html">VERONIKA KADAMANI</a><p>${t('footerText')}</p><small>© ${new Date().getFullYear()} ${t('rights')}</small></footer>`;
  }
  function metrics() {
    return `<section class="metrics" aria-label="${t('results')}">${[['9+','years'],['1M+','audiences'],['10M+','views']].map(([n,label]) => `<div><strong>${n}</strong><span>${t(label)}</span></div>`).join('')}</section>`;
  }
  function clients() {
    return `<section class="clients">${eyebrow('clientsTitle')}<div class="client-list"><span>Maxim Rogovtsev</span><span>Nicole / Crazy Family</span><span>Katya Landysh</span><span>Travel Channel</span><small>${t('otherClients')}</small></div></section>`;
  }
  function portrait(kind) {
    const src = safeUrl(config.portraits[kind]);
    return src ? `<figure class="portrait"><img src="${src}" alt="Veronika Kadamani" loading="lazy" width="800" height="1000"></figure>` : '';
  }
  function hero() {
    const video = safeUrl(config.showreel);
    const visual = portrait('main') || (video ? `<div class="hero-video"><video muted loop playsinline controls preload="metadata" aria-label="Veronika Kadamani showreel"><source src="${video}" type="video/mp4"></video></div>` : '');
    return `<section class="hero ${visual ? 'has-visual' : ''}"><div class="hero-copy">${eyebrow('role')}<h1><span>${t('heroA')}</span><span>${t('heroB')}</span><span class="hero-last">${t('heroC')} <em>${t('heroD')}</em></span></h1><div class="hero-bottom"><p>${t('heroText')}</p><div class="buttons"><a class="button" href="portfolio.html">${t('work')}</a>${quoteButton('quote','button button-outline')}</div></div><p class="hero-location">${t('location')}</p></div>${visual}<div class="hero-index" aria-hidden="true">01 / VK</div></section>`;
  }
  function cards(projects) {
    return projects.map(project => {
      const poster = safeUrl(project.poster), video = safeUrl(project.preview || project.video);
      return `<button class="project-card" data-project="${escape(project.id)}"><div class="project-media">${poster ? `<img src="${poster}" alt="" loading="lazy" width="960" height="640">` : ''}${video ? `<video muted playsinline loop preload="none" ${poster ? `poster="${poster}"` : ''}><source data-src="${video}" type="video/mp4"></video>` : ''}<span class="play-mark" aria-hidden="true">▶</span></div><div class="project-caption"><h3>${escape(localized(project.title))}</h3><span>${t(project.category)}</span></div></button>`;
    }).join('');
  }
  function portfolioSection(full = false) {
    const projects = full ? config.projects : config.projects.filter(x => x.featured).slice(0, 6);
    return `<section class="work-section ${full ? 'full-work' : ''}" id="work">${full ? `<div class="page-heading">${eyebrow('portfolio')}<h1>${t('portfolioTitle')}</h1><p>${t('portfolioSub')}</p></div>` : sectionHeader('featured','featuredTitle','workIntro')} ${full ? `<div class="filters" aria-label="${t('portfolio')}">${categories.map(x => `<button data-filter="${x}" aria-pressed="${filter === x}">${t(x)}</button>`).join('')}<span class="project-count"></span></div>` : ''}${!full && config.showreel ? `<div class="work-reel"><p class="eyebrow">${t('showreelLabel')}</p><video class="showreel-player" controls muted loop playsinline preload="metadata" poster="${safeUrl(config.showreelPoster)}" aria-label="${t('showreelLabel')}"><source src="${safeUrl(config.showreel)}" type="video/mp4"></video></div>` : ''}<div class="project-grid">${cards(projects)}</div><p class="portfolio-empty" ${projects.length ? 'hidden' : ''}>${t('noProjects')}</p>${full ? '' : `<a class="text-link" href="portfolio.html">${t('fullPortfolio')}</a>`}</section>`;
  }
  function serviceRows(full = false) {
    const services = [['editing','editingText','editingItems'],['creation','creationText','filming'],['smm','smmText','worldwide']];
    return `<section class="services-section">${sectionHeader('serviceEyebrow','serviceTitle','serviceIntro')}<div class="service-list">${services.map(([title,text,note],i) => `<article class="service-row"><span class="row-number">0${i+1}</span><h3>${t(title)}</h3><div><p>${t(text)}</p><small>${t(note)}</small>${i === 0 && full ? `<small>${t('editingDetails')}</small>` : ''}</div>${quoteButton('quote','text-link')}</article>`).join('')}</div>${full ? '' : `<a class="text-link" href="services.html">${t('services')}</a>`}</section>`;
  }
  function smmWays() {
    return `<section class="smm-section">${sectionHeader('smm','smmWays')}<div class="strategy-grid">${[['audit','auditText'],['setup','setupText'],['management','managementText']].map(([title,text],i) => `<article><span class="row-number">0${i+1}</span><h3>${t(title)}</h3><p>${t(text)}</p>${quoteButton('quote','text-link')}</article>`).join('')}</div></section>`;
  }
  function results(full = false) {
    const cases = [
      {name:'case1',views:'10.1M',subscribers:'24,221',top:'4.5M',likes:'280K',comments:'4.5K',others:'3.5M · 329K+ · 268K+'},
      {name:'case2',views:'3.6M',subscribers:'1,574',top:'3.2M',likes:'161.9K',comments:'925',others:'123.9K+ · 37K+ · 21K+'}
    ];
    return `<section class="results-section">${sectionHeader('resultEyebrow','resultTitle','resultIntro')}<div class="case-grid">${cases.map((c,i) => `<article class="case"><div class="case-top"><span>${t(c.name)}</span><span>0${i+1}</span></div><strong class="case-stat">${c.views}</strong><p class="case-stat-label">${t('totalViews')}</p><div class="case-substats"><div><strong>${c.subscribers}</strong><span>${t('subscribers')}</span></div><div><strong>${c.top}</strong><span>${t('topShort')}</span></div></div>${full ? `<div class="case-details"><p>${c.likes} ${t('likes')} · ${c.comments} ${t('comments')}</p><p>${t('otherShorts')}: ${c.others}</p></div>` : ''}</article>`).join('')}</div>${full ? `<article class="tiktok-case"><div><h3>${t('tiktokTitle')}</h3><p>${t('tiktokText')}</p></div><div class="tiktok-values"><strong>533K+</strong><span>378K+ · 371K+ · 370K+ · 297K+ · 265K+ · 264K+</span></div><p>${t('account')}: 4,610 ${t('followers')} · 484.8K ${t('likes')}</p></article><article class="instagram-case"><h3>${t('instagramTitle')}</h3><p>${t('instagramText')}</p><div class="instagram-stats"><div><strong>27,644</strong><span>${t('storyViews')}</span></div><div><strong>83.2%</strong><span>${t('nonFollowers')}</span></div><div><strong>26,568</strong><span>${t('accountsReached')}</span></div></div><div class="evidence-grid">${config.instagramEvidence.map((x,i) => `<a class="evidence-card" href="${safeUrl(x)}" target="_blank" rel="noopener noreferrer"><img src="${safeUrl(x)}" alt="${t('analyticsProof')} ${i+1}" loading="lazy" width="946" height="2048"></a>`).join('')}</div></article><small class="evidence-note">${t('evidenceNote')}</small>` : `<a class="text-link" href="results.html">${t('results')}</a>`}</section>`;
  }
  function about(full = false) {
    const image = portrait('side');
    return `<section class="about-section ${image ? 'with-portrait' : ''}">${image}<div>${sectionHeader('aboutEyebrow','aboutTitle')}<p>${t('aboutText')}</p><p>${t('aboutText2')}</p><p class="location">${t('location')}</p>${full ? `<div class="credentials"><small>${t('tools')}</small><p>Adobe Premiere Pro · CapCut · Wondershare Filmora</p><small>${t('training')}</small><p>${t('trainingText')}</p></div>` : `<a class="text-link" href="about.html">${t('about')}</a>`}</div></section>`;
  }
  function website() {
    return `<section class="website-section"><div>${eyebrow('websites')}<h3>${t('websites')}</h3><p>${t('websitesText')}</p></div><article><span class="pet-wordmark">PET HOUSE</span><h4>${t('petType')}</h4><p>${t('petText')}</p><a class="text-link" href="https://pet-house-by.github.io/#booking-form" target="_blank" rel="noopener noreferrer">${t('visit')}</a></article></section>`;
  }
  function process() {
    return `<section class="process-section">${sectionHeader('process','process')}<div class="process-grid">${[1,2,3,4].map(i => `<article><span class="row-number">0${i}</span><h3>${t('step'+i)}</h3><p>${t('step'+i+'Text')}</p></article>`).join('')}</div></section>`;
  }
  function faq() {
    return `<section class="faq-section">${sectionHeader('faq','faq')}<div>${[1,2,3,4].map(i => `<details><summary>${t('faq'+i)}</summary><p>${t('faq'+i+'a')}</p></details>`).join('')}</div></section>`;
  }
  function form() {
    return `<dialog id="quote-dialog" aria-labelledby="quote-title"><button class="dialog-close" aria-label="${t('close')}" data-close>×</button>${eyebrow('quote')}<h2 id="quote-title">${t('formTitle')}</h2><form id="quote-form"><label>${t('need')}<select name="service">${['editing','creation','smm','websites'].map(x => `<option value="${x}">${t(x)}</option>`).join('')}</select></label><label id="type-label">${t('type')}<select name="type"></select></label><div class="form-two"><label>${t('name')}<input name="name" autocomplete="name" maxlength="100"></label><label>${t('budget')}<select name="budget">${['budgetUnset','budgetUnder','$100–300','$300–700','$700–1,500','$1,500+','unsure'].map(x => `<option value="${x === 'budgetUnset' ? '' : x}">${window.COPY[lang][x] || x}</option>`).join('')}</select></label></div><label>${t('details')}<textarea name="details" rows="4" required maxlength="6000" placeholder="${t('detailsHint')}"></textarea></label><div class="form-two"><label>${t('email')}<input name="email" type="email" autocomplete="email" maxlength="200"></label><label>${t('telegram')}<input name="telegram" placeholder="@username" maxlength="100"></label></div><p class="form-note">${t('contactHint')}</p>${config.formEndpoint ? '' : `<p class="form-note">${t('formFallback')}</p>`}<p id="form-status" role="status" aria-live="polite"></p><button class="button" type="submit">${t(config.formEndpoint ? 'send' : 'prepare')}</button><div id="draft-actions" hidden><a class="text-link" id="email-draft">${t('openEmail')}</a><button type="button" class="text-link" id="copy-request">${t('copyRequest')}</button></div></form></dialog><dialog id="video-dialog" aria-labelledby="video-title"><button class="dialog-close" aria-label="${t('close')}" data-close>×</button><h2 id="video-title"></h2><div id="video-content"></div><p id="video-description"></p></dialog>`;
  }

  function render() {
    document.documentElement.lang = lang;
    document.title = `Veronika Kadamani — ${page === 'home' ? t('role') : t(page)}`;
    const content = {
      home: () => hero()+metrics()+clients()+portfolioSection()+serviceRows()+`<section class="punch-section"><h2>${t('punchA')}<br><em>${t('punchB')}</em></h2><p>${t('punchText')}</p></section>`+results()+about()+faq(),
      portfolio: () => portfolioSection(true)+website(),
      services: () => `<div class="page-top">${eyebrow('services')}</div>`+serviceRows(true)+smmWays()+process()+website()+faq(),
      results: () => `<div class="page-top">${eyebrow('results')}</div>`+results(true),
      about: () => `<div class="page-top">${eyebrow('about')}</div>`+about(true)+clients()+process()
    };
    $('#app').innerHTML = header()+`<main id="main">${(content[page] || content.home)()}</main>`+footer()+form();
    bind();
    updateFilter();
  }
  function updateFilter() {
    if (page !== 'portfolio') return;
    const projects = config.projects.filter(x => filter === 'all' || x.category === filter || (x.categories || []).includes(filter));
    $('.project-grid').innerHTML = cards(projects);
    $('.portfolio-empty').hidden = !!projects.length;
    $('.portfolio-empty').textContent = t(config.projects.length ? 'noMatches' : 'noProjects');
    $('.project-count').textContent = `${projects.length} ${t('projectCount')}`;
    document.querySelectorAll('[data-filter]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.filter === filter)));
    bindProjects();
  }
  function openDialog(dialog, trigger) {
    returnFocus = trigger || document.activeElement;
    dialog.showModal();
    document.body.classList.add('modal-open');
  }
  function bind() {
    document.querySelectorAll('[data-lang]').forEach(el => el.addEventListener('click', () => {
      lang = el.dataset.lang;
      try { localStorage.setItem('vk-language', lang); } catch (_) {}
      render();
    }));
    $('.menu-button').addEventListener('click', event => {
      const button = event.currentTarget;
      const expanded = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded',String(expanded));
      $('.header').classList.toggle('menu-open',expanded);
    });
    $('#navigation').addEventListener('click', () => { $('.header').classList.remove('menu-open'); $('.menu-button').setAttribute('aria-expanded','false'); });
    document.onkeydown = closeMenu;
    document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => { filter = button.dataset.filter; updateFilter(); }));
    if (document.body.dataset.standalone) document.querySelectorAll('a[href$=".html"]').forEach(link => link.addEventListener('click',event => {
      event.preventDefault(); const target=link.getAttribute('href').replace('.html',''); page=target === 'index' ? 'home' : target;
      document.body.dataset.page=page; filter='all'; render(); window.scrollTo({top:0,behavior:'instant'});
    }));
    document.querySelectorAll('[data-quote]').forEach(button => button.addEventListener('click', () => openDialog($('#quote-dialog'), button)));
    document.querySelectorAll('dialog').forEach(dialog => {
      $('[data-close]',dialog).addEventListener('click', () => dialog.close());
      dialog.addEventListener('click',event => { if(event.target === dialog) { const r=dialog.getBoundingClientRect(); if(event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); }});
      dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); $('video',dialog)?.pause(); if(dialog.id === 'video-dialog') $('#video-content').replaceChildren(); returnFocus?.focus(); });
    });
    const service = $('[name=service]');
    service.addEventListener('change',updateTypes);
    updateTypes();
    $('#quote-form').addEventListener('submit',submitForm);
    bindProjects();
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const showreel = $('.hero-video video') || $('.showreel-player');
    if(showreel && !reduced) showreel.play().catch(() => {});
  }
  function closeMenu(event) { if(event.key === 'Escape') { $('.header').classList.remove('menu-open'); $('.menu-button').setAttribute('aria-expanded','false'); } }
  function updateTypes() {
    const value = $('[name=service]').value;
    const options = value === 'editing' ? ['shorts','youtube','vlogs','business','other'] : value === 'smm' ? ['audit','setup','management'] : [];
    $('#type-label').hidden = !options.length;
    $('[name=type]').innerHTML = options.map(x => `<option value="${x}">${t(x)}</option>`).join('');
    $('[name=type]').disabled = !options.length;
  }
  async function submitForm(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const status = $('#form-status');
    if (!data.details.trim()) { status.textContent = t('formDetailsError'); $('[name=details]').focus(); return; }
    if (!(data.email.trim() || data.telegram.trim())) { status.textContent = t('formContactError'); $('[name=email]').focus(); return; }
    const payload = {...data,service:t(data.service),type:data.type ? t(data.type) : '',language:lang};
    if(config.formEndpoint) {
      const button = $('[type=submit]',form); button.disabled = true; button.textContent = t('sending'); status.textContent='';
      try {
        const response = await fetch(config.formEndpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload)});
        if(!response.ok) throw new Error('Delivery failed');
        status.textContent = t('success'); form.reset(); updateTypes();
      } catch (_) { status.textContent = t('sendError'); }
      finally { button.disabled = false; button.textContent = t('send'); }
      return;
    }
    const body = `${t('name')}: ${data.name}\n${t('need')}: ${payload.service}\n${t('type')}: ${payload.type}\n${t('budget')}: ${data.budget}\n${t('email')}: ${data.email}\nTelegram: ${data.telegram}\n\n${data.details}`;
    const href = `mailto:contact.veronika.inbox@gmail.com?subject=${encodeURIComponent(t('requestSubject'))}&body=${encodeURIComponent(body)}`;
    const draft = $('#email-draft'); draft.href = href; $('#draft-actions').hidden = false;
    status.textContent = t('requestReady');
    $('#copy-request').onclick = async () => {
      try { await navigator.clipboard.writeText(body); $('#copy-request').textContent = t('copied'); }
      catch (_) { const textarea=$('[name=details]'); textarea.value=body; textarea.focus();textarea.select(); }
    };
    draft.click();
  }
  function bindProjects() {
    document.querySelectorAll('[data-project]').forEach(card => {
      card.addEventListener('click', () => {
        const project = config.projects.find(x => String(x.id) === card.dataset.project);
        if(!project) return;
        $('#video-title').textContent = localized(project.title);
        $('#video-description').textContent = localized(project.description || '');
        const video=safeUrl(project.video), url=safeUrl(project.url);
        const driveId = project.driveId && /^[a-zA-Z0-9_-]+$/.test(project.driveId) ? project.driveId : '';
        $('#video-content').innerHTML = video ? `<video controls playsinline preload="metadata" ${project.poster ? `poster="${safeUrl(project.poster)}"` : ''}><source src="${video}" type="video/mp4"></video>` : driveId ? `<iframe src="https://drive.google.com/file/d/${driveId}/preview" title="${escape(localized(project.title))}" allow="autoplay; fullscreen" allowfullscreen loading="lazy"></iframe><a class="text-link" href="${url}" target="_blank" rel="noopener noreferrer">${t('openOriginal')}</a>` : url ? `<a class="button" href="${url}" target="_blank" rel="noopener noreferrer">${t('watch')}</a>` : '';
        openDialog($('#video-dialog'),card);
      });
      const video = $('video',card);
      if(video && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const play = () => { const source=$('source',video); if(!source.src) { source.src=source.dataset.src;video.load(); } video.play().catch(()=>{}); };
        card.addEventListener('mouseenter',play);
        card.addEventListener('mouseleave',()=>video.pause());
        card.addEventListener('focus',play);
        card.addEventListener('blur',()=>video.pause());
        if(matchMedia('(hover: none)').matches) {
          const observer=new IntersectionObserver(entries=>entries.forEach(entry=> entry.isIntersecting ? play() : video.pause()),{threshold:0.75});observer.observe(card);
        }
      }
    });
  }
  render();
})();
