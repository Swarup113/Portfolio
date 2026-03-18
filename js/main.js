// =============================================
//  PORTFOLIO MAIN.JS — v4
// =============================================

// Theme-aware color helpers
// accentStyle()  → dates, locations, labels (blue in light | green in dark)
// dimStyle()     → body descriptions, summaries (body color in light | gray in dark)
function accentStyle() {
    return document.body.classList.contains('dark-theme')
        ? 'color:#6ee7b7'          /* medium green */
        : 'color:var(--light-text)'; /* blue */
}
function dimStyle() {
    return document.body.classList.contains('dark-theme')
        ? 'color:#9ca3af'           /* cool gray */
        : 'color:var(--light-text-body)'; /* normal body */
}
function titleStyle() {
    return document.body.classList.contains('dark-theme')
        ? 'color:var(--dark-text-bright)' /* brightest */
        : 'color:var(--light-text-body)';
}

// ── Loading Screen ────────────────────────────
(function initLoadingScreen() {
    const screen = document.getElementById('loading-screen');
    if (!screen) return;
    setTimeout(() => {
        screen.classList.add('fade-out');
        setTimeout(() => screen.style.display = 'none', 500);
    }, 1200);
})();

// ── Theme ─────────────────────────────────────
(function initTheme() {
    const btn = document.getElementById('theme-toggle');
    const saved = localStorage.getItem('theme') || 'dark';
    applyTheme(saved);
    updateProfileImage(saved);
    if (btn) btn.addEventListener('click', () => {
        const next = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem('theme', next);
        updateProfileImage(next);
        // Re-render dynamic sections to apply correct accent colours
        renderExperience();
        renderResearch();
        renderProjects();
        renderEducation();
        renderAwards();
    });
    function applyTheme(t) {
        document.body.classList.toggle('dark-theme', t === 'dark');
    }
})();

function updateProfileImage(theme) {
    const img = document.getElementById('profile-image');
    if (!img) return;
    img.src = theme === 'dark'
        ? 'https://i.postimg.cc/mgRjs8JQ/dark.jpg'
        : 'https://i.postimg.cc/43QSJ1V4/light.jpg';
}

// ── Floating Nav ─────────────────────────────
(function initNav() {
    const nav = document.getElementById('floating-nav');
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    let lastY = 0, ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const y = window.scrollY;
                if (y > lastY && y > 80) {
                    nav?.classList.add('hidden');
                    navMenu?.classList.remove('active');
                    menuBtn?.classList.remove('active');
                } else {
                    nav?.classList.remove('hidden');
                }
                lastY = y;
                document.getElementById('go-to-top')?.classList.toggle('visible', y > 300);
                ticking = false;
            });
            ticking = true;
        }
    });

    // Hamburger toggle
    menuBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = menuBtn.classList.toggle('active');
        navMenu?.classList.toggle('active', isOpen);
        // Animate icon
        menuBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (navMenu && menuBtn && !navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            navMenu.classList.remove('active');
            menuBtn.classList.remove('active');
            menuBtn.setAttribute('aria-expanded', 'false');
        }
    });

    // Close on nav item click + smooth scroll
    document.querySelectorAll('.nav-item').forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const id = a.getAttribute('href').replace('#', '');
            const target = document.getElementById(id);
            if (target) {
                // Offset for mobile top bar height
                const isMobile = window.innerWidth <= 900;
                const offset = isMobile ? 52 : 0;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
            navMenu?.classList.remove('active');
            menuBtn?.classList.remove('active');
            menuBtn?.setAttribute('aria-expanded', 'false');
        });
    });
})();

// ── Go to Top ────────────────────────────────
document.getElementById('go-to-top')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Footer Year ──────────────────────────────
const yearEl = document.getElementById('current-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Typed Text ───────────────────────────────
(function initTyped() {
    const el = document.getElementById('typed-text');
    if (!el) return;
    const words = ['Researcher', 'Data Analyst', 'Data Scientist', 'Web Developer', 'UI/UX Designer'];
    let wi = 0, ci = 0, deleting = false;
    function tick() {
        const word = words[wi];
        el.textContent = deleting ? word.slice(0, --ci) : word.slice(0, ++ci);
        if (!deleting && ci === word.length) { deleting = true; setTimeout(tick, 2000); return; }
        if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
        setTimeout(tick, deleting ? 40 : 80);
    }
    tick();
})();

// ── About Expand ─────────────────────────────
(function initAbout() {
    const btn = document.getElementById('expand-research');
    const content = document.getElementById('research-content');
    if (!btn || !content) return;
    btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        content.classList.toggle('expanded');
    });
})();

// ── Generic Tab Switching ─────────────────────
document.querySelectorAll('.tabs').forEach(tabGroup => {
    tabGroup.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const section = btn.closest('section') || document;
            const target = section.querySelector(`#${tabId}`);
            if (target) { section.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active')); target.classList.add('active'); return; }
            if (['languages','frameworks','software'].includes(tabId)) { renderTools(tabId); return; }
            if (tabId === 'journal' || tabId === 'conference') { currentResearchState.tab = tabId; currentResearchState.index = 0; renderResearch(); updateResearchBtns(); return; }
            if (['courses','presentations','simulations'].includes(tabId)) { currentCertState.tab = tabId; currentCertState.index = 0; renderCerts(); updateCertBtns(); return; }
        });
    });
});

// ── SKILLS — icon + name inline ───────────────
(function initSkills() {
    const ICONS = [
        `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"></path><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"></path></svg>`,
        `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`,
        `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>`,
        `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>`,
        `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
        `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>`,
    ];
    ['technical','personal'].forEach(type => {
        const grid = document.querySelector(`#${type} .skills-grid`);
        if (!grid || !portfolioData.skills) return;
        grid.innerHTML = (portfolioData.skills[type] || []).map((s, i) => `
            <div class="skill-card" style="flex-direction:column;gap:0.4rem">
                <div class="skill-header" style="display:flex;align-items:center;gap:0.5rem">
                    <div class="skill-icon" style="display:flex;align-items:center;flex-shrink:0">${ICONS[i % ICONS.length]}</div>
                    <h3 style="margin:0;font-size:0.95rem;font-weight:600">${s.title}</h3>
                </div>
                <p style="font-size:0.8rem;margin:0">${s.desc}</p>
            </div>`).join('');
    });
})();

// ── Experience Timeline ──────────────────────
function renderExperience() {
    const container = document.querySelector('#experience .timeline');
    if (!container) return;
    const ac = accentStyle();
    container.innerHTML = portfolioData.experience.map((exp, i) => `
        <div class="timeline-item">
            <div class="timeline-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            </div>
            <div class="timeline-content" style="display:flex;align-items:flex-start;gap:1.25rem;flex-wrap:wrap">
                <div style="flex-shrink:0;width:3.5rem;height:3.5rem;border-radius:9999px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.2)">
                    <img src="${exp.companyLogo}" alt="${exp.company}" style="width:100%;height:100%;object-fit:cover">
                </div>
                <div style="flex:1;min-width:200px">
                    <h3 class="card-title" style="margin-bottom:0.2rem">${exp.title}</h3>
                    <p class="card-subtitle">${exp.company}</p>
                    <p style="font-size:0.8rem;${ac};display:flex;align-items:center;gap:0.35rem;margin-bottom:0.2rem">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        ${exp.date}
                    </p>
                    <p style="font-size:0.8rem;${ac};display:flex;align-items:center;gap:0.35rem;margin-bottom:1rem">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        ${exp.location}
                    </p>
                    <div style="display:flex;justify-content:flex-end;gap:0.6rem;flex-wrap:wrap">
                        <a href="${exp.offerLetterLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="font-size:0.78rem;padding:0.35rem 0.9rem">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                            Offer Letter
                        </a>
                        <button class="btn btn-secondary" style="font-size:0.78rem;padding:0.35rem 0.9rem" onclick="openExpModal(${i})">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        </div>`).join('');
}
(function initExperience() { renderExperience(); })();

// ── Experience Modal ──────────────────────────
let expModalState = { expIdx: 0, projIdx: 0 };
window.openExpModal = function(expIdx) { expModalState = { expIdx, projIdx: 0 }; renderExpModal(); openModal(); };
function renderExpModal() {
    const exp = portfolioData.experience[expModalState.expIdx];
    const proj = exp.projects[expModalState.projIdx];
    document.getElementById('modal-body').innerHTML = `
        <h3 class="card-title" style="font-size:1.4rem;margin-bottom:1.25rem">Projects</h3>
        <div>
            <div style="width:100%;height:9rem;border-radius:0.5rem;overflow:hidden;margin-bottom:0.75rem">
                <img src="${proj.image}" alt="${proj.name}" style="width:100%;height:100%;object-fit:cover">
            </div>
            <h4 class="card-title" style="font-size:1rem;margin-bottom:0.35rem">${proj.name}</h4>
            <p class="card-description">${proj.description}</p>
            <div style="display:flex;justify-content:center;gap:0.75rem;margin-top:1.25rem">
                <button class="carousel-btn" ${expModalState.projIdx===0?'disabled':''} onclick="stepExpProj(-1)">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <button class="carousel-btn" ${expModalState.projIdx>=exp.projects.length-1?'disabled':''} onclick="stepExpProj(1)">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
            </div>
            <div style="display:flex;justify-content:center;gap:0.4rem;margin-top:0.75rem">
                ${exp.projects.map((_,idx) => `<div style="width:0.6rem;height:0.6rem;border-radius:50%;background:var(--emerald-400);opacity:${idx===expModalState.projIdx?1:0.25}"></div>`).join('')}
            </div>
        </div>`;
}
window.stepExpProj = function(dir) {
    const max = portfolioData.experience[expModalState.expIdx].projects.length - 1;
    expModalState.projIdx = Math.max(0, Math.min(max, expModalState.projIdx + dir));
    renderExpModal();
};

// ── Projects ──────────────────────────────────
let projState = { filter: 'all', index: 0 };
const PROJ_PAGE = 3;
const GITHUB_SVG = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>`;
const LIVE_SVG  = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`;

(function initProjects() {
    const filtersContainer = document.querySelector('.project-filters');
    if (filtersContainer) {
        const FILTERS = [
            { key: 'all', label: 'All' }, { key: 'ml', label: 'ML / DL' },
            { key: 'web', label: 'Web Dev' }, { key: 'game', label: 'Game' },
            { key: 'app', label: 'App' }, { key: 'iot', label: 'IoT' },
        ];
        filtersContainer.innerHTML = FILTERS.map(f =>
            `<button class="filter-btn ${f.key==='all'?'active':''}" data-filter="${f.key}">${f.label}</button>`
        ).join('');
        filtersContainer.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                filtersContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                projState = { filter: btn.dataset.filter, index: 0 };
                renderProjects();
            });
        });
    }
    document.getElementById('projects-prev')?.addEventListener('click', () => { projState.index = Math.max(0, projState.index - PROJ_PAGE); renderProjects(); });
    document.getElementById('projects-next')?.addEventListener('click', () => { if (projState.index + PROJ_PAGE < filteredProjects().length) projState.index += PROJ_PAGE; renderProjects(); });
    renderProjects();
})();

function filteredProjects() {
    return projState.filter === 'all' ? portfolioData.projects : portfolioData.projects.filter(p => p.category === projState.filter);
}

function renderProjects() {
    const container = document.getElementById('projects-carousel');
    if (!container) return;
    const ac = accentStyle();
    const all = filteredProjects();
    const slice = all.slice(projState.index, projState.index + PROJ_PAGE);
    container.innerHTML = slice.length === 0
        ? `<div style="grid-column:1/-1;text-align:center;padding:2rem;opacity:0.6">No projects in this category.</div>`
        : slice.map(p => `
            <div class="project-card">
                <div class="card-image"><img src="${p.image}" alt="${p.title}" loading="lazy"></div>
                <div class="card-content">
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.4rem">
                        <h3 class="card-title" style="margin:0">${p.title}</h3>
                        <span style="font-size:0.7rem;${ac};white-space:nowrap;margin-left:0.4rem;flex-shrink:0">${p.date}</span>
                    </div>
                    <p class="card-description">${p.description}</p>
                    <div class="card-tags">${p.skills.map(s => `<span class="tag">${s}</span>`).join('')}</div>
                    <div class="card-actions">
                        <a href="${p.github}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.8rem">
                            ${GITHUB_SVG} GitHub
                        </a>
                        ${p.live ? `<a href="${p.live}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="font-size:0.75rem;padding:0.3rem 0.8rem">${LIVE_SVG} Live</a>` : ''}
                    </div>
                </div>
            </div>`).join('');
    const prev = document.getElementById('projects-prev');
    const next = document.getElementById('projects-next');
    if (prev) prev.disabled = projState.index === 0;
    if (next) next.disabled = projState.index + PROJ_PAGE >= filteredProjects().length;
}

// ── Research ──────────────────────────────────
let currentResearchState = { tab: 'journal', index: 0 };
const RESEARCH_PAGE = 3;
const DOI_SVG = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`;

(function initResearch() {
    renderResearch(); updateResearchBtns();
    document.getElementById('research-prev')?.addEventListener('click', () => { currentResearchState.index = Math.max(0, currentResearchState.index - RESEARCH_PAGE); renderResearch(); updateResearchBtns(); });
    document.getElementById('research-next')?.addEventListener('click', () => { const papers = getPapers(); if (currentResearchState.index + RESEARCH_PAGE < papers.length) currentResearchState.index += RESEARCH_PAGE; renderResearch(); updateResearchBtns(); });
})();

function getPapers() {
    return currentResearchState.tab === 'journal' ? portfolioData.research.journal : portfolioData.research.conference;
}

function renderResearch() {
    const container = document.getElementById('research-carousel');
    if (!container) return;
    const papers = getPapers();
    const isJournal = currentResearchState.tab === 'journal';
    const ac = accentStyle();
    const slice = papers.slice(currentResearchState.index, currentResearchState.index + RESEARCH_PAGE);
    container.innerHTML = slice.map(p => `
        <div class="research-card" style="cursor:pointer" onclick="openResearchModal(${papers.indexOf(p)}, '${currentResearchState.tab}')">
            <!-- Architecture thumbnail in card -->
            <div class="card-image" style="height:8rem;cursor:pointer">
                <img src="${p.architecture}" alt="Architecture of ${p.shortTitle}" loading="lazy"
                    style="width:100%;height:100%;object-fit:cover;object-position:top center">
            </div>
            <div class="card-content">
                <h3 class="card-title">${p.title}</h3>
                <p class="card-subtitle" style="font-size:0.78rem;line-height:1.4">${isJournal ? p.journal : p.conference}</p>
                ${!isJournal && p.location ? `<p style="font-size:0.72rem;${ac};margin-bottom:0.35rem">${p.location}</p>` : ''}
                <p class="card-description">${p.summary}</p>
                <div style="margin-bottom:0.6rem;display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap">
                    <span class="tag">${p.status}</span>
                    ${p.doi ? `<a href="${p.doi}" target="_blank" rel="noopener noreferrer" class="doi-btn" title="View DOI" onclick="event.stopPropagation()">${DOI_SVG} DOI</a>` : ''}
                </div>
                <div class="card-actions">
                    <button class="btn btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.8rem"
                        onclick="event.stopPropagation();openResearchModal(${papers.indexOf(p)}, '${currentResearchState.tab}')">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        View Details
                    </button>
                </div>
            </div>
        </div>`).join('');
}

function updateResearchBtns() {
    const papers = getPapers();
    const prev = document.getElementById('research-prev');
    const next = document.getElementById('research-next');
    if (prev) prev.disabled = currentResearchState.index === 0;
    if (next) next.disabled = currentResearchState.index + RESEARCH_PAGE >= papers.length;
}

window.openResearchModal = function(idx, tab) {
    const papers = tab === 'journal' ? portfolioData.research.journal : portfolioData.research.conference;
    const p = papers[idx];
    if (!p) return;
    const isJournal = tab === 'journal';
    const ac = accentStyle();
    document.getElementById('modal-body').innerHTML = `
        <h3 class="card-title" style="font-size:1.35rem;margin-bottom:1rem;padding-right:2rem">${p.shortTitle}</h3>
        <div style="width:100%;border-radius:0.5rem;overflow:hidden;margin-bottom:1rem;background:#f1f5f9">
            <img src="${p.architecture}" alt="Architecture" style="width:100%;height:auto;object-fit:contain">
        </div>
        <p style="font-size:0.8rem;${ac};margin-bottom:1rem">${isJournal ? p.journal : p.conference}</p>
        <h4 class="card-title" style="font-size:0.95rem;margin-bottom:0.4rem">Abstract</h4>
        <p class="card-description" style="margin-bottom:1.25rem">${p.abstract}</p>
        <div style="display:flex;justify-content:flex-end;align-items:center;gap:0.75rem;flex-wrap:wrap">
            ${p.doi ? `<a href="${p.doi}" target="_blank" rel="noopener noreferrer" class="doi-btn" title="View DOI on Publisher Site">${DOI_SVG} View DOI</a>` : ''}
            ${p.link && p.link !== '#' ? `
            <a href="${p.link}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="font-size:0.875rem">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                Read Paper
            </a>` : `<span class="tag" style="font-size:0.8rem;padding:0.4rem 0.8rem;opacity:0.8">Under Review</span>`}
        </div>`;
    openModal();
};

// ── Tools ─────────────────────────────────────
function renderTools(tab) {
    const container = document.getElementById('tools-content');
    if (!container) return;
    container.innerHTML = (portfolioData.tools[tab] || []).map(t => `
        <div class="tool-card">
            <img src="${t.icon}" alt="${t.name}" loading="lazy" onerror="this.style.opacity='0.3'">
            <span>${t.name}</span>
        </div>`).join('');
}
(function initTools() { renderTools('languages'); })();

// ── Education Timeline ─────────────────────────
function renderEducation() {
    const container = document.getElementById('education-timeline');
    if (!container) return;
    const ac = accentStyle();
    container.innerHTML = portfolioData.education.map(edu => `
        <div class="timeline-item">
            <div class="timeline-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                </svg>
            </div>
            <div class="timeline-content">
                <div style="display:flex;align-items:center;gap:0.875rem;margin-bottom:0.6rem">
                    <img src="${edu.image}" alt="${edu.school}"
                        style="width:2.75rem;height:2.75rem;object-fit:contain;border-radius:0.25rem;flex-shrink:0;background:white;padding:2px" loading="lazy">
                    <div>
                        <h3 class="card-title" style="margin:0;font-size:1rem">${edu.school}</h3>
                        <p class="card-subtitle" style="margin:0;font-size:0.8rem">${edu.degree}</p>
                        <p style="font-size:0.75rem;${ac}">${edu.duration}</p>
                    </div>
                </div>
                ${edu.achievements ? `<ul style="list-style:none;padding:0;margin:0">
                    ${edu.achievements.map(a => `
                    <li style="display:flex;gap:0.4rem;font-size:0.8rem;margin-bottom:0.4rem;align-items:flex-start">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${document.body.classList.contains('dark-theme') ? '#6ee7b7' : 'var(--light-text)'}" stroke-width="2" style="flex-shrink:0;margin-top:2px"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        <span class="card-description" style="margin:0">${a}</span>
                    </li>`).join('')}
                </ul>` : ''}
            </div>
        </div>`).join('');
}
(function initEducation() { renderEducation(); })();

// ── Awards ────────────────────────────────────
function renderAwards() {
    const container = document.querySelector('.awards-grid');
    if (!container) return;
    const ICONS = [
        `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>`,
        `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>`,
        `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="6"></circle><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path></svg>`,
        `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
    ];
    container.innerHTML = portfolioData.awards.map((a, i) => `
        <div class="award-card">
            <div class="award-header">
                ${ICONS[i % ICONS.length]}
                <div class="award-info">
                    <h3>${a.category}</h3>
                    <p class="institution">${a.institution}</p>
                    <p class="date">${a.date}</p>
                    <p class="description">${a.description}</p>
                </div>
            </div>
        </div>`).join('');
}
(function initAwards() { renderAwards(); })();

// ── Certifications ────────────────────────────
let currentCertState = { tab: 'courses', index: 0 };
const CERT_PAGE = 3;
(function initCerts() {
    renderCerts(); updateCertBtns();
    document.getElementById('certifications-prev')?.addEventListener('click', () => { currentCertState.index = Math.max(0, currentCertState.index - CERT_PAGE); renderCerts(); updateCertBtns(); });
    document.getElementById('certifications-next')?.addEventListener('click', () => { const items = portfolioData.certifications[currentCertState.tab]||[]; if (currentCertState.index + CERT_PAGE < items.length) currentCertState.index += CERT_PAGE; renderCerts(); updateCertBtns(); });
})();
function renderCerts() {
    const container = document.getElementById('certifications-carousel');
    if (!container) return;
    const items = (portfolioData.certifications[currentCertState.tab]||[]).slice(currentCertState.index, currentCertState.index + CERT_PAGE);
    container.innerHTML = items.map(c => `
        <div class="cert-card">
            <div class="card-image"><img src="${c.image}" alt="${c.title}" loading="lazy"></div>
            <div class="card-content">
                <h3 class="card-title" style="font-size:0.9rem">${c.title}</h3>
                <p class="card-subtitle">${c.issuer||c.conference||''}</p>
                <div class="card-actions">
                    <a href="${c.link}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.8rem">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        View
                    </a>
                </div>
            </div>
        </div>`).join('');
}
function updateCertBtns() {
    const items = portfolioData.certifications[currentCertState.tab]||[];
    const prev = document.getElementById('certifications-prev');
    const next = document.getElementById('certifications-next');
    if (prev) prev.disabled = currentCertState.index === 0;
    if (next) next.disabled = currentCertState.index + CERT_PAGE >= items.length;
}

// ── Modal ─────────────────────────────────────
function openModal()  { document.getElementById('modal')?.classList.add('active'); }
function closeModal() { document.getElementById('modal')?.classList.remove('active'); }
document.getElementById('modal-close')?.addEventListener('click', closeModal);
document.getElementById('modal')?.addEventListener('click', function(e) { if (e.target === this) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ── Contact Form ──────────────────────────────
document.getElementById('contact-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const { name, email, subject, message } = this;
    window.location.href = `mailto:dewanjee.swarup@gmail.com?subject=${encodeURIComponent(subject.value)}&body=${encodeURIComponent(`Name: ${name.value}\nEmail: ${email.value}\n\n${message.value}`)}`;
    this.reset();
});

// ── Scroll Animations ─────────────────────────
(function initScrollAnimations() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.style.opacity = '1';
                e.target.style.transform = 'translateY(0)';
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.08 });
    document.querySelectorAll('.section').forEach(sec => {
        sec.style.opacity = '0';
        sec.style.transform = 'translateY(18px)';
        sec.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(sec);
    });
    const hero = document.getElementById('home');
    if (hero) { hero.style.opacity = '1'; hero.style.transform = 'none'; hero.style.transition = 'none'; }
})();

// ── Active Nav Highlight ──────────────────────
(function initActiveNav() {
    const navItems = document.querySelectorAll('.nav-item');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                navItems.forEach(n => n.classList.remove('active-nav'));
                document.querySelector(`.nav-item[href="#${e.target.id}"]`)?.classList.add('active-nav');
            }
        });
    }, { rootMargin: '-35% 0px -55% 0px' });
    document.querySelectorAll('section[id]').forEach(s => observer.observe(s));
})();