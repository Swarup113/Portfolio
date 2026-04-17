// ── Theme helpers ──
function accentStyle() {
    return document.body.classList.contains('dark-theme') ? 'color:#b4b4bc' : 'color:#475569';
}
function dimStyle() {
    return document.body.classList.contains('dark-theme') ? 'color:#b4b4bc' : 'color:#475569';
}
function citeBadgeStyle() {
    return document.body.classList.contains('dark-theme')
        ? 'background:rgba(255,255,255,0.06);color:#fafafa;'
        : 'background:#f1f5f9;color:#0f172a;';
}

// ── Loading Screen ──
(function initLoadingScreen() {
    var screen = document.getElementById('loading-screen');
    if (!screen) return;
    setTimeout(function() {
        screen.classList.add('fade-out');
        setTimeout(function() { screen.style.display = 'none'; }, 500);
    }, 1200);
})();

// ── Theme + Logo switching ──
function updateLogo(theme) {
    var lightLogo = 'https://i.postimg.cc/m2846ych/light.png';
    var darkLogo  = 'https://i.postimg.cc/nVj5b8dc/dark.png'; 
    var logoUrl = theme === 'dark' ? darkLogo : lightLogo;
    var logoImgPC = document.getElementById('nav-logo-img');
    var logoImgMobile = document.getElementById('nav-logo-img-mobile');
    if (logoImgPC) logoImgPC.src = logoUrl;
    if (logoImgMobile) logoImgMobile.src = logoUrl;
}

function updateProfileImage(theme) {
    var img = document.getElementById('profile-image');
    if (!img) return;
    img.src = theme === 'dark'
        ? 'https://i.postimg.cc/8Phb2BhH/dark.png'
        : 'https://i.postimg.cc/wvcPT8NX/light.png';
}

(function initTheme() {
    var btn = document.getElementById('theme-toggle');
    var saved = localStorage.getItem('theme') || 'dark';
    applyTheme(saved);
    updateProfileImage(saved);
    updateLogo(saved);
    if (btn) btn.addEventListener('click', function() {
        var next = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem('theme', next);
        updateProfileImage(next);
        updateLogo(next);
        // Re-render sections that depend on theme-based inline styles
        renderExperience();
        renderResearch();
        renderHighlights();
        renderProjects();
        renderEducation();
        renderAwards();
        renderCerts();
        renderTools(toolState.tab);
    });
    function applyTheme(t) { document.body.classList.toggle('dark-theme', t === 'dark'); }
})();

// ── Floating Nav ──
(function initNav() {
    var nav = document.getElementById('floating-nav');
    var menuBtn = document.getElementById('mobile-menu-btn');
    var navMenu = document.getElementById('nav-menu');
    var lastY = 0, ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                var y = window.scrollY;
                if (y > lastY && y > 80) {
                    nav && nav.classList.add('hidden');
                    navMenu && navMenu.classList.remove('active');
                    menuBtn && menuBtn.classList.remove('active');
                } else { nav && nav.classList.remove('hidden'); }
                lastY = y;
                var gtt = document.getElementById('go-to-top');
                if (gtt) gtt.classList.toggle('visible', y > 300);
                ticking = false;
            });
            ticking = true;
        }
    });
    if (menuBtn) menuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        var isOpen = menuBtn.classList.toggle('active');
        navMenu && navMenu.classList.toggle('active', isOpen);
        menuBtn.setAttribute('aria-expanded', isOpen);
    });
    document.addEventListener('click', function(e) {
        if (navMenu && menuBtn && !navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            navMenu.classList.remove('active');
            menuBtn.classList.remove('active');
            menuBtn.setAttribute('aria-expanded', 'false');
        }
    });
    document.querySelectorAll('.nav-item').forEach(function(a) {
        a.addEventListener('click', function(e) {
            e.preventDefault();
            var id = a.getAttribute('href').replace('#', '');
            var target = document.getElementById(id);
            if (target) {
                var offset = window.innerWidth <= 900 ? 52 : 0;
                var top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
            navMenu && navMenu.classList.remove('active');
            menuBtn && menuBtn.classList.remove('active');
            menuBtn && menuBtn.setAttribute('aria-expanded', 'false');
        });
    });
})();

document.getElementById('go-to-top') && document.getElementById('go-to-top').addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

var yearEl = document.getElementById('current-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Email injection ──
(function injectEmail() {
    var email = 'dewanjee.swarup' + '@' + 'gmail.com';
    var mailto = 'mailto:' + email + '?subject=Hello%20Swarup';
    var ids = { 'hero-email-text': email, 'contact-email-text': email };
    Object.keys(ids).forEach(function(id) { var el = document.getElementById(id); if (el) el.textContent = ids[id]; });
    ['hero-email-link','contact-me-btn','contact-email-link','footer-email-btn'].forEach(function(id) {
        var el = document.getElementById(id); if (el) el.href = mailto;
    });
})();

// ── Typed Text ──
(function initTyped() {
    var el = document.getElementById('typed-text');
    if (!el) return;
    var words = ['Researcher','Data Analyst','Data Scientist','Web Developer','UI/UX Designer'];
    var wi = 0, ci = 0, deleting = false;
    function tick() {
        var word = words[wi];
        el.textContent = deleting ? word.slice(0, --ci) : word.slice(0, ++ci);
        if (!deleting && ci === word.length) { deleting = true; setTimeout(tick, 2000); return; }
        if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
        setTimeout(tick, deleting ? 40 : 80);
    }
    tick();
})();

// ── About Expand ──
(function initAbout() {
    var btn = document.getElementById('expand-research');
    var content = document.getElementById('research-content');
    if (!btn || !content) return;
    btn.addEventListener('click', function() {
        btn.classList.toggle('active');
        content.classList.toggle('expanded');
    });
})();

// ── Mobile helper ──
function isMobile() { return window.innerWidth <= 768; }

// ── Swipe gesture helper ──
function addSwipe(el, onPrev, onNext) {
    if (!el) return;
    var startX = 0, startY = 0;
    el.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: true });
    el.addEventListener('touchend', function(e) {
        var dx = e.changedTouches[0].clientX - startX;
        var dy = e.changedTouches[0].clientY - startY;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
            if (dx < 0) onNext(); else onPrev();
        }
    }, { passive: true });
}

// ── Generic Tab Switching ──
document.querySelectorAll('.tabs').forEach(function(tabGroup) {
    tabGroup.querySelectorAll('.tab-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var tabId = btn.dataset.tab;
            tabGroup.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            var section = btn.closest('section') || document;
            var target = section.querySelector('#' + tabId);
            if (target) {
                section.querySelectorAll('.tab-content').forEach(function(c) { c.classList.remove('active'); });
                target.classList.add('active');
                return;
            }
            if (['languages','frameworks','software'].includes(tabId)) {
                toolState.tab = tabId; toolState.index = 0; renderTools(); return;
            }
            if (tabId === 'highlights') {
                document.getElementById('research-highlights-container').style.display = 'block';
                document.getElementById('research-pubs-container').style.display = 'none';
                currentHighlightState.index = 0; renderHighlights(); return;
            }
            if (tabId === 'journal' || tabId === 'conference') {
                document.getElementById('research-highlights-container').style.display = 'none';
                document.getElementById('research-pubs-container').style.display = 'block';
                currentResearchState.tab = tabId;
                currentResearchState.index = 0;
                currentResearchState.filter = 'default';
                renderResearchFilters(); renderResearch(); updateResearchBtns(); return;
            }
            if (['courses','presentations','simulations'].includes(tabId)) {
                currentCertState.tab = tabId; currentCertState.index = 0;
                renderCerts(); updateCertBtns(); return;
            }
        });
    });
});

// ── SKILLS ──
(function initSkills() {
    var ICONS = [
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"></path><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"></path></svg>',
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>',
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>',
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>',
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>',
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>'
    ];

    function buildSkillCard(s, i) {
        return '<div class="skill-card" style="flex-direction:column;gap:0.4rem">' +
            '<div class="skill-header" style="display:flex;align-items:center;gap:0.5rem">' +
            '<div class="skill-icon" style="display:flex;align-items:center;flex-shrink:0">' + ICONS[i % ICONS.length] + '</div>' +
            '<h3 style="margin:0;font-size:0.95rem;font-weight:600">' + s.title + '</h3></div>' +
            '<p style="font-size:0.8rem;margin:0">' + s.desc + '</p></div>';
    }

    ['technical','personal'].forEach(function(type) {
        var grid = document.querySelector('#' + type + ' .skills-grid');
        if (!grid || !portfolioData.skills) return;
        var all = portfolioData.skills[type] || [];

        if (isMobile()) {
            var visible = all.slice(0, 3);
            var hidden  = all.slice(3);
            grid.innerHTML = visible.map(buildSkillCard).join('');

            if (hidden.length > 0) {
                var expandBtn = document.createElement('button');
                expandBtn.className = 'expand-btn skill-expand-btn';
                expandBtn.style.cssText = 'margin:0.75rem auto 0;';
                expandBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="6 9 12 15 18 9"></polyline></svg>';
                var expanded = false;
                expandBtn.addEventListener('click', function() {
                    expanded = !expanded;
                    if (expanded) {
                        grid.innerHTML = all.map(buildSkillCard).join('');
                        grid.parentNode.insertBefore(expandBtn, grid.nextSibling);
                        expandBtn.classList.add('active');
                    } else {
                        grid.innerHTML = visible.map(buildSkillCard).join('');
                        grid.parentNode.insertBefore(expandBtn, grid.nextSibling);
                        expandBtn.classList.remove('active');
                    }
                });
                grid.parentNode.insertBefore(expandBtn, grid.nextSibling);
            }
        } else {
            grid.innerHTML = all.map(buildSkillCard).join('');
        }
    });
})();

// ── Experience ──
var expState = { index: 0 };
var MOB_EXP_PAGE = 2;

function renderExperience() {
    var container = document.querySelector('#experience .timeline');
    if (!container) return;

    var ac = accentStyle();
    var isDark = document.body.classList.contains('dark-theme');
    var all = portfolioData.experience || [];

    function highlight(text) {
        return text
            .replace(/99\.31%/g, "<strong class='highlight-text'>99.31%</strong>")
            .replace(/5 peer-reviewed papers|5 papers/g, "<strong class='highlight-text'>5 papers</strong>")
            .replace(/IEEE/g, "<strong class='highlight-text'>IEEE</strong>")
            .replace(/\b(Q1|Q2|Q3)\b/g, "<strong class='highlight-text'>$1</strong>")
            .replace(/\b(clinical|GPS|EEG|vocal|textual)\b/g, "<strong class='highlight-text'>$1</strong>");
    }

    function itemHtml(exp, i) {
        return `
        <div class="timeline-item">
            <div class="timeline-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
            </div>
            <div class="timeline-content">
                <div class="exp-header">
                    <div class="exp-logo">
                        ${
                            exp.companyLogo
                                ? `<img src="${exp.companyLogo}" alt="${exp.company}">`
                                : `<div class="logo-placeholder-white">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2">
                                        <path d="M9 3h6v2H9z"></path>
                                        <path d="M12 5v14"></path>
                                        <path d="M5 9h14"></path>
                                        <path d="M5 15h14"></path>
                                    </svg>
                                   </div>`
                        }
                    </div>
                    <div>
                        <h3 class="card-title" style="margin-bottom:0.1rem">${exp.title}</h3>
                        <p class="card-subtitle">${exp.company}</p>
                    </div>
                </div>
                <p style="font-size:0.8rem;${ac};display:flex;align-items:center;gap:0.35rem;margin-bottom:0.2rem">
                    ${exp.date}
                </p>
                <p style="font-size:0.8rem;${ac};display:flex;align-items:center;gap:0.35rem;margin-bottom:0.6rem">
                    ${exp.location}
                </p>
                ${
                    exp.description
                        ? `<div style="display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:0.6rem">
                               ${(exp.tags || ['Predictive Modeling','5 Publications','ML/DL','Healthcare AI'])
                                   .map(t => `<span class="tag">${t}</span>`).join('')}
                           </div>`
                        : ''
                }
                ${
                    exp.description
                        ? `<ul style="list-style:none;padding:0;margin:0.3rem 0 0.75rem 0;font-size:0.75rem;line-height:1.45;" class="exp-desc">
                               ${exp.description.slice(0, 4).map(item => `
                                   <li style="display:flex;gap:0.4rem;align-items:flex-start;margin-bottom:0.4rem">
                                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${isDark ? '#b4b4bc' : '#475569'}" stroke-width="2" style="flex-shrink:0;margin-top:2px">
                                           <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                           <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                       </svg>
                                       <span>${highlight(item)}</span>
                                   </li>
                               `).join('')}
                           </ul>`
                        : ''
                }
                <div class="exp-actions">
                    ${
                        exp.offerLetterLink
                            ? `<a href="${exp.offerLetterLink}" target="_blank"
                                  class="btn btn-secondary"
                                  style="font-size:0.78rem;padding:0.35rem 0.9rem;display:flex;align-items:center;gap:0.35rem">
                                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                       <path d="M17 3l4 4-7 7H10v-4l7-7z"/>
                                       <path d="M4 20h16"/>
                                   </svg>
                                   Offer Letter
                               </a>`
                            : ''
                    }
                    ${
                        exp.scholarLink
                            ? `<a href="${exp.scholarLink}" target="_blank"
                                  class="btn btn-primary"
                                  style="font-size:0.78rem;padding:0.35rem 0.9rem;display:flex;align-items:center;gap:0.35rem">
                                   <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" class="icon-fill-current">
                                       <path d="M12 24L0 9l12-9 12 9-12 15z"/>
                                   </svg>
                                   Google Scholar
                               </a>`
                            : ''
                    }
                    ${
                        exp.mediumLink
                            ? `<a href="${exp.mediumLink}" target="_blank"
                                  class="btn btn-primary medium-btn"
                                  style="font-size:0.78rem;padding:0.35rem 0.9rem;display:flex;align-items:center;gap:0.35rem">
                                   <svg width="14" height="14" viewBox="0 0 1043.63 592.71" class="medium-icon" xmlns="http://www.w3.org/2000/svg">
                                       <path d="M588.67 296.36c0 163.67-131.78 296.35-294.33 296.35S0 460.03 0 296.36 131.78 0 294.34 0s294.33 132.69 294.33 296.36M911.56 296.36c0 154.06-65.89 279-147.17 279s-147.17-124.94-147.17-279 65.88-279 147.17-279 147.17 124.9 147.17 279M1043.63 296.36c0 138-23.17 249.94-51.76 249.94s-51.75-111.9-51.75-249.94 23.17-249.94 51.75-249.94 51.76 111.9 51.76 249.94"/>
                                   </svg>
                                   Medium
                               </a>`
                            : ''
                    }
                    ${
                        (exp.projects && exp.projects.length > 0)
                            ? `<button class="btn btn-primary"
                                       style="font-size:0.78rem;padding:0.35rem 0.9rem;display:flex;align-items:center;gap:0.35rem"
                                       onclick="openExpModal(${i})">
                                   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                                       <line x1="5" y1="12" x2="19" y2="12"></line>
                                       <polyline points="12 5 19 12 12 19"></polyline>
                                   </svg>
                                   View Details
                               </button>`
                            : ''
                    }
                </div>
            </div>
        </div>`;
    }

    if (isMobile()) {
        var page = MOB_EXP_PAGE;
        var slice = all.slice(expState.index, expState.index + page);
        var atStart = expState.index === 0;
        var atEnd   = expState.index + page >= all.length;

        // Pass real indices so openExpModal gets the correct global index
        var cardsHtml = slice.map(function(exp, localIdx) {
            return itemHtml(exp, expState.index + localIdx);
        }).join('');

        var prevDisabled = atStart ? 'disabled' : '';
        var nextDisabled = atEnd   ? 'disabled' : '';

        container.innerHTML = `
            <div class="mob-bottom-wrap">
                <div class="mob-cards-area" id="exp-inner">
                    ${cardsHtml}
                </div>
                <div class="mob-bottom-btns">
                    <button class="mob-nav-btn mob-prev-btn" ${prevDisabled} aria-label="Previous">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                    <span class="exp-page-indicator" style="font-size:0.78rem;opacity:0.55;">
                        ${expState.index + 1}–${Math.min(expState.index + page, all.length)} / ${all.length}
                    </span>
                    <button class="mob-nav-btn mob-next-btn" ${nextDisabled} aria-label="Next">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </div>
            </div>`;

        var prevBtn = container.querySelector('.mob-prev-btn');
        var nextBtn = container.querySelector('.mob-next-btn');
        if (prevBtn) prevBtn.addEventListener('click', function() {
            expState.index = Math.max(0, expState.index - page);
            renderExperience();
        });
        if (nextBtn) nextBtn.addEventListener('click', function() {
            if (expState.index + page < all.length) expState.index += page;
            renderExperience();
        });
        addSwipe(
            container.querySelector('#exp-inner'),
            function() { expState.index = Math.max(0, expState.index - page); renderExperience(); },
            function() { if (expState.index + page < all.length) { expState.index += page; renderExperience(); } }
        );

    } else {
        // Desktop: render all, unchanged
        container.innerHTML = all.map(function(exp, i) {
            return itemHtml(exp, i);
        }).join('');
    }
}
(function() { renderExperience(); })();

// ── SVG constants ──
var ARROW_RIGHT_SVG = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
var ARROW_LEFT_SVG  = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>';
var ARROW_NEXT_SVG  = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>';
var CIRCLE_DOT_SVG  = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="5"></circle></svg>';
var CITE_SVG        = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>';
var GITHUB_SVG      = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>';
var LIVE_SVG        = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>';
var DOI_SVG         = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>';

// ── Mobile carousel builders ──
function buildMobileCarousel(gridClass, cardsHtml, atStart, atEnd, gridId) {
    return '<div class="mob-carousel-wrap">' +
        '<button class="mob-nav-btn mob-prev-btn"' + (atStart ? ' disabled' : '') + '>' + ARROW_LEFT_SVG + '</button>' +
        '<div class="' + gridClass + '" id="' + gridId + '">' + cardsHtml + '</div>' +
        '<button class="mob-nav-btn mob-next-btn"' + (atEnd ? ' disabled' : '') + '>' + ARROW_NEXT_SVG + '</button>' +
        '</div>';
}
function buildBottomCarousel(cardsHtml, atStart, atEnd, innerClass, gridId) {
    return '<div class="mob-bottom-wrap">' +
        '<div class="mob-cards-area ' + (innerClass || '') + '" id="' + gridId + '">' + cardsHtml + '</div>' +
        '<div class="mob-bottom-btns">' +
        '<button class="mob-nav-btn mob-prev-btn"' + (atStart ? ' disabled' : '') + '>' + ARROW_LEFT_SVG + '</button>' +
        '<button class="mob-nav-btn mob-next-btn"' + (atEnd ? ' disabled' : '') + '>' + ARROW_NEXT_SVG + '</button>' +
        '</div></div>';
}

// ── Projects ──
var projState = { filter: 'all', index: 0 };
var PROJ_PAGE_ALL    = 3;
var PROJ_PAGE_FILTER = 3;
function projPageSize() { return PROJ_PAGE_ALL; }

(function initProjects() {
    var fc = document.querySelector('#projects .project-filters');
    if (fc) {
        var FILTERS = [{key:'all',label:'All'},{key:'ml',label:'AI / ML'},{key:'data-system',label:'Data System'},{key:'web',label:'Web Apps'},{key:'game',label:'Games'},{key:'app',label:'Mobile App'},{key:'iot',label:'IoT & Hardware'}];
        fc.innerHTML = FILTERS.map(function(f) {
            return '<button class="filter-btn ' + (f.key==='all'?'active':'') + '" data-filter="' + f.key + '">' + f.label + '</button>';
        }).join('');
        fc.querySelectorAll('.filter-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                fc.querySelectorAll('.filter-btn').forEach(function(b){ b.classList.remove('active'); });
                btn.classList.add('active');
                projState = { filter: btn.dataset.filter, index: 0 };
                renderProjects();
            });
        });
    }
    var pp = document.getElementById('projects-prev');
    var pn = document.getElementById('projects-next');
    if (pp) pp.addEventListener('click', function(){ projState.index = Math.max(0, projState.index - PROJ_PAGE_ALL); renderProjects(); });
    if (pn) pn.addEventListener('click', function(){
        var all = filteredProjects();
        if (projState.index + PROJ_PAGE_ALL < all.length) projState.index += PROJ_PAGE_ALL;
        renderProjects();
    });
    renderProjects();
})();

function filteredProjects() {
    return projState.filter === 'all' ? portfolioData.projects
        : portfolioData.projects.filter(function(p){ return p.category === projState.filter; });
}

function renderProjects() {
    var container = document.getElementById('projects-carousel');
    if (!container) return;
    var ac = accentStyle();
    var all = filteredProjects();
    var page = projPageSize();
    var slice = all.slice(projState.index, projState.index + page);

    function cardHtml(p) {
        return '<div class="project-card">' +
            '<div class="card-image"><img src="' + p.image + '" alt="' + p.title + '" loading="lazy"></div>' +
            '<div class="card-content">' +
            '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.4rem">' +
            '<h3 class="card-title" style="margin:0">' + p.title + '</h3>' +
            '<span style="font-size:0.7rem;' + ac + ';white-space:nowrap;margin-left:0.4rem;flex-shrink:0">' + p.date + '</span></div>' +
            '<p class="card-description">' + p.description + '</p>' +
            '<div class="card-tags">' + p.skills.map(function(s){ return '<span class="tag">' + s + '</span>'; }).join('') + '</div>' +
            '<div class="card-actions">' +
            '<a href="' + p.github + '" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.8rem">' + GITHUB_SVG + ' GitHub</a>' +
            (p.live ? '<a href="' + p.live + '" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="font-size:0.75rem;padding:0.3rem 0.8rem">' + LIVE_SVG + ' Live</a>' : '') +
            '</div></div></div>';
    }

    var isFew = !isMobile() && slice.length < 3;
    var cardsHtml = slice.length === 0
        ? '<div style="grid-column:1/-1;text-align:center;padding:2rem;opacity:0.6">No projects in this category.</div>'
        : slice.map(cardHtml).join('');

    if (isMobile()) {
        var atStart = projState.index === 0;
        var atEnd   = projState.index + page >= all.length;
        container.className = 'projects-carousel';
        container.innerHTML = buildBottomCarousel(cardsHtml, atStart, atEnd, 'projects-carousel-inner', 'proj-inner');
        var prevBtn = container.querySelector('.mob-prev-btn');
        var nextBtn = container.querySelector('.mob-next-btn');
        if (prevBtn) prevBtn.addEventListener('click', function(){ projState.index = Math.max(0, projState.index - page); renderProjects(); });
        if (nextBtn) nextBtn.addEventListener('click', function(){ if (projState.index + page < all.length) projState.index += page; renderProjects(); });
        addSwipe(container.querySelector('#proj-inner'), function(){ projState.index = Math.max(0, projState.index - page); renderProjects(); }, function(){ if (projState.index + page < all.length) projState.index += page; renderProjects(); });
        var dp = document.getElementById('projects-prev'); var dn = document.getElementById('projects-next');
        if (dp) dp.style.display = 'none'; if (dn) dn.style.display = 'none';
    } else {
        if (isFew) container.classList.add('centered-few'); else container.classList.remove('centered-few');
        container.innerHTML = cardsHtml;
        var dp = document.getElementById('projects-prev'); var dn = document.getElementById('projects-next');
        if (dp) { dp.style.display = ''; dp.disabled = projState.index === 0; }
        if (dn) { dn.style.display = ''; dn.disabled = projState.index + page >= all.length; }
    }
}

// ── Research Highlights ──
var currentHighlightState = { index: 0 };
var HIGHLIGHT_PAGE = 3;
var MOB_HIGHLIGHT_PAGE = 2;

function renderHighlights() {
    var container = document.getElementById('research-highlights-container');
    if (!container) return;
    var highlights = (portfolioData.research && portfolioData.research.highlights) || [];
    if (highlights.length === 0) {
        container.innerHTML = '<p style="text-align:center;opacity:0.6;padding:2rem">No highlights available yet.</p>';
        return;
    }
    var page = isMobile() ? MOB_HIGHLIGHT_PAGE : HIGHLIGHT_PAGE;
    var slice = highlights.slice(currentHighlightState.index, currentHighlightState.index + page);
    var atStart = currentHighlightState.index === 0;
    var atEnd   = currentHighlightState.index + page >= highlights.length;
    var isFew   = !isMobile() && slice.length < 3;
    var gridClass = 'research-carousel' + (isFew ? ' centered-few' : '');

    function cardHtml(h, absIdx) {
        return '<div class="research-card" style="cursor:pointer" onclick="openHighlightModal(' + absIdx + ')">' +
            '<div style="position:relative">' +
            '<div class="card-image" style="height:8rem"><img src="' + h.architecture + '" alt="' + (h.shortTitle||h.title) + '" loading="lazy" style="width:100%;height:100%;object-fit:cover;object-position:top center"></div>' +
            '<span class="highlight-badge">' + h.badge + '</span></div>' +
            '<div class="card-content">' +
            '<h3 class="card-title">' + h.title + '</h3>' +
            '<p class="card-description">' + h.contribution + '</p>' +
            '<div class="card-tags">' + h.skills.map(function(s){ return '<span class="tag">' + s + '</span>'; }).join('') + '</div>' +
            '<div class="card-actions">' +
            '<span class="inprogress-badge" style="margin-right:auto">' + CIRCLE_DOT_SVG + ' ' + h.status + '</span>' +
            '<button class="btn btn-primary" style="font-size:0.75rem;padding:0.3rem 0.8rem" onclick="event.stopPropagation();openHighlightModal(' + absIdx + ')">' +
            ARROW_RIGHT_SVG + ' View Details</button>' +
            '</div></div></div>';
    }

    var cardsHtml = slice.map(function(h, i) { return cardHtml(h, currentHighlightState.index + i); }).join('');

    if (isMobile()) {
        container.innerHTML = buildBottomCarousel(cardsHtml, atStart, atEnd, gridClass, 'hl-grid');
        var hlPrev = container.querySelector('.mob-prev-btn');
        var hlNext = container.querySelector('.mob-next-btn');
        if (hlPrev) hlPrev.addEventListener('click', function(){ currentHighlightState.index = Math.max(0, currentHighlightState.index - page); renderHighlights(); });
        if (hlNext) hlNext.addEventListener('click', function(){ if (currentHighlightState.index + page < highlights.length) currentHighlightState.index += page; renderHighlights(); });
        addSwipe(document.getElementById('hl-grid'),
            function(){ currentHighlightState.index = Math.max(0, currentHighlightState.index - page); renderHighlights(); },
            function(){ if (currentHighlightState.index + page < highlights.length) { currentHighlightState.index += page; renderHighlights(); } }
        );
    } else {
        container.innerHTML =
            '<div class="carousel-container">' +
            '<button class="carousel-btn" id="hl-prev"' + (atStart ? ' disabled' : '') + '>' + ARROW_LEFT_SVG + '</button>' +
            '<div class="' + gridClass + '" id="hl-grid">' + cardsHtml + '</div>' +
            '<button class="carousel-btn" id="hl-next"' + (atEnd ? ' disabled' : '') + '>' + ARROW_NEXT_SVG + '</button>' +
            '</div>';
        document.getElementById('hl-prev').addEventListener('click', function(){ currentHighlightState.index = Math.max(0, currentHighlightState.index - page); renderHighlights(); });
        document.getElementById('hl-next').addEventListener('click', function(){ if (currentHighlightState.index + page < highlights.length) currentHighlightState.index += page; renderHighlights(); });
    }
}

window.openHighlightModal = function(i) {
    var h = (portfolioData.research.highlights || [])[i];
    if (!h) return;
    document.getElementById('modal-body').innerHTML =
        '<h3 class="card-title" style="font-size:1.35rem;margin-bottom:1rem;padding-right:2rem">' + (h.shortTitle || h.title) + '</h3>' +
        '<div style="width:100%;border-radius:0.5rem;overflow:hidden;margin-bottom:1rem">' +
        '<img src="' + h.architecture + '" alt="Architecture" style="width:100%;height:auto;object-fit:contain"></div>' +
        '<h4 class="card-title" style="font-size:0.95rem;margin-bottom:0.4rem">Key Contribution</h4>' +
        '<p class="card-description" style="margin-bottom:1rem">' + h.contribution + '</p>' +
        '<div class="card-tags" style="margin-bottom:1rem">' + h.skills.map(function(s){ return '<span class="tag">' + s + '</span>'; }).join('') + '</div>' +
        '<div style="display:flex;justify-content:flex-end"><span class="inprogress-badge">' + CIRCLE_DOT_SVG + ' ' + h.status + '</span></div>';
    openModal();
};

// ── Research Publications ──
var currentResearchState = { tab: 'journal', index: 0, filter: 'default' };
var RESEARCH_PAGE = 3;
var MOB_RESEARCH_PAGE = 2;

function resPageSize() { return isMobile() ? MOB_RESEARCH_PAGE : RESEARCH_PAGE; }

function renderResearchFilters() {
    var row = document.getElementById('research-filter-row');
    if (!row) return;
    row.style.cssText = 'display:flex;flex-wrap:wrap;justify-content:center;gap:0.6rem;';
    var filters = [
        { key: 'default', label: 'All' },
        { key: 'latest',  label: 'Latest Publication' },
        { key: 'cited',   label: 'Most Cited' }
    ];
    row.innerHTML = filters.map(function(f) {
        return '<button class="filter-btn' + (currentResearchState.filter === f.key ? ' active' : '') + '" data-rfilter="' + f.key + '">' + f.label + '</button>';
    }).join('');
    row.querySelectorAll('.filter-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            row.querySelectorAll('.filter-btn').forEach(function(b){ b.classList.remove('active'); });
            btn.classList.add('active');
            currentResearchState.filter = btn.dataset.rfilter;
            currentResearchState.index = 0;
            renderResearch(); updateResearchBtns();
        });
    });
}

(function initResearch() {
    renderHighlights();
    var rp = document.getElementById('research-prev');
    var rn = document.getElementById('research-next');
    if (rp) rp.addEventListener('click', function(){ currentResearchState.index = Math.max(0, currentResearchState.index - RESEARCH_PAGE); renderResearch(); updateResearchBtns(); });
    if (rn) rn.addEventListener('click', function(){ var papers = getPapers(); if (currentResearchState.index + RESEARCH_PAGE < papers.length) currentResearchState.index += RESEARCH_PAGE; renderResearch(); updateResearchBtns(); });
})();

function getPapers() {
    var base = currentResearchState.tab === 'journal'
        ? (portfolioData.research.journal || [])
        : (portfolioData.research.conference || []);
    var sorted = base.slice();
    if (currentResearchState.filter === 'cited') sorted.sort(function(a,b){ return (b.citations||0)-(a.citations||0); });
    else if (currentResearchState.filter === 'latest') sorted.sort(function(a,b){ return (b.date||0)-(a.date||0); });
    return sorted;
}

function renderResearch() {
    var container = document.getElementById('research-carousel');
    if (!container) return;
    var papers = getPapers();
    var isJournal = currentResearchState.tab === 'journal';
    var ac = accentStyle();
    var page = resPageSize();
    var slice = papers.slice(currentResearchState.index, currentResearchState.index + page);
    var isFew = !isMobile() && slice.length < 3;

    function cardHtml(p) {
        var safeTitle = p.title.replace(/'/g, "\\'");
        return '<div class="research-card" style="cursor:pointer" onclick="openResearchModal(\'' + safeTitle + '\',\'' + currentResearchState.tab + '\')">' +
            '<div class="card-image" style="height:8rem"><img src="' + p.architecture + '" alt="' + p.shortTitle + '" loading="lazy" style="width:100%;height:100%;object-fit:cover;object-position:top center"></div>' +
            '<div class="card-content">' +
            '<h3 class="card-title">' + p.title + '</h3>' +
            '<p class="card-subtitle" style="font-size:0.78rem;line-height:1.4">' + (isJournal ? p.journal : p.conference) + '</p>' +
            (!isJournal && p.location ? '<p style="font-size:0.72rem;' + ac + ';margin-bottom:0.2rem">' + p.location + '</p>' : '') +
            (p.dateLabel ? '<p style="font-size:0.72rem;' + ac + ';margin-bottom:0.35rem">Published: ' + p.dateLabel + '</p>' : '') +
            '<p class="card-description">' + p.summary + '</p>' +
            '<div style="margin-bottom:0.6rem;display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap">' +
            '<span class="tag">' + p.status + '</span>' +
            (p.doi ? '<a href="' + p.doi + '" target="_blank" rel="noopener noreferrer" class="doi-btn" onclick="event.stopPropagation()">' + DOI_SVG + ' DOI</a>' : '') +
            (p.citations !== undefined ? '<span class="tag cite-badge">' + CITE_SVG + ' ' + p.citations + '</span>' : '') +
            '</div>' +
            '<div class="card-actions"><button class="btn btn-primary" style="font-size:0.75rem;padding:0.3rem 0.8rem" onclick="event.stopPropagation();openResearchModal(\'' + safeTitle + '\',\'' + currentResearchState.tab + '\')">' + ARROW_RIGHT_SVG + ' View Details</button></div>' +
            '</div></div>';
    }

    var cardsHtml = slice.map(cardHtml).join('');

    if (isMobile()) {
        var atStart = currentResearchState.index === 0;
        var atEnd   = currentResearchState.index + page >= papers.length;
        container.className = 'research-carousel';
        container.innerHTML = buildBottomCarousel(cardsHtml, atStart, atEnd, 'research-carousel-inner', 'res-inner');
        var prevBtn = container.querySelector('.mob-prev-btn');
        var nextBtn = container.querySelector('.mob-next-btn');
        if (prevBtn) prevBtn.addEventListener('click', function(){ currentResearchState.index = Math.max(0, currentResearchState.index - page); renderResearch(); updateResearchBtns(); });
        if (nextBtn) nextBtn.addEventListener('click', function(){ if (currentResearchState.index + page < papers.length) currentResearchState.index += page; renderResearch(); updateResearchBtns(); });
        addSwipe(container.querySelector('#res-inner'),
            function(){ currentResearchState.index = Math.max(0, currentResearchState.index - page); renderResearch(); updateResearchBtns(); },
            function(){ if (currentResearchState.index + page < papers.length) { currentResearchState.index += page; renderResearch(); updateResearchBtns(); } }
        );
        var dp = document.getElementById('research-prev'); var dn = document.getElementById('research-next');
        if (dp) dp.style.display = 'none'; if (dn) dn.style.display = 'none';
    } else {
        if (isFew) container.classList.add('centered-few'); else container.classList.remove('centered-few');
        container.innerHTML = cardsHtml;
        var dp = document.getElementById('research-prev'); var dn = document.getElementById('research-next');
        if (dp) { dp.style.display = ''; dp.disabled = currentResearchState.index === 0; }
        if (dn) { dn.style.display = ''; dn.disabled = currentResearchState.index + page >= papers.length; }
    }
}

function updateResearchBtns() {
    if (isMobile()) return;
    var papers = getPapers(); var page = RESEARCH_PAGE;
    var prev = document.getElementById('research-prev'); var next = document.getElementById('research-next');
    if (prev) prev.disabled = currentResearchState.index === 0;
    if (next) next.disabled = currentResearchState.index + page >= papers.length;
}

window.openResearchModal = function(title, tab) {
    var papers = tab === 'journal' ? portfolioData.research.journal : portfolioData.research.conference;
    var p = papers.find(function(paper) { return paper.title === title; });
    if (!p) return;
    var isJournal = tab === 'journal';
    var ac = accentStyle();
    document.getElementById('modal-body').innerHTML =
        '<h3 class="card-title" style="font-size:1.35rem;margin-bottom:1rem;padding-right:2rem">' + p.shortTitle + '</h3>' +
        '<div style="width:100%;border-radius:0.5rem;overflow:hidden;margin-bottom:1rem;background:#f1f5f9">' +
        '<img src="' + p.architecture + '" alt="Architecture" style="width:100%;height:auto;object-fit:contain"></div>' +
        '<p style="font-size:0.8rem;' + ac + ';margin-bottom:0.35rem">' + (isJournal ? p.journal : p.conference) + '</p>' +
        (p.dateLabel ? '<p style="font-size:0.8rem;' + ac + ';margin-bottom:1rem">Published: ' + p.dateLabel + '</p>' : '<br>') +
        '<h4 class="card-title" style="font-size:0.95rem;margin-bottom:0.4rem">Abstract</h4>' +
        '<p class="card-description" style="margin-bottom:1.25rem">' + p.abstract + '</p>' +
        '<div style="display:flex;justify-content:flex-end;align-items:center;gap:0.75rem;flex-wrap:wrap">' +
        (p.citations !== undefined ? '<span class="tag cite-badge" style="font-size:0.78rem;padding:0.3rem 0.7rem">' + CITE_SVG + ' Citations: ' + p.citations + '</span>' : '') +
        (p.doi ? '<a href="' + p.doi + '" target="_blank" rel="noopener noreferrer" class="doi-btn">' + DOI_SVG + ' View DOI</a>' : '') +
        (p.link && p.link !== '#' ? '<a href="' + p.link + '" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="font-size:0.875rem"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg> Read Paper</a>' : '<span class="tag" style="font-size:0.8rem;padding:0.4rem 0.8rem;opacity:0.8">Under Review</span>') +
        '</div>';
    openModal();
};

// ── Tools ──
var toolState = { tab: 'languages', index: 0 };
var MOB_TOOLS_PAGE = 4;

function renderTools(tab) {
    if (tab) toolState.tab = tab;
    var container = document.getElementById('tools-content');
    if (!container) return;
    var all = portfolioData.tools[toolState.tab] || [];

    function cardHtml(t) {
        return '<div class="tool-card"><img src="' + t.icon + '" alt="' + t.name + '" loading="lazy" onerror="this.style.opacity=\'0.3\'"><span>' + t.name + '</span></div>';
    }

    if (isMobile()) {
        var page = MOB_TOOLS_PAGE;
        var slice = all.slice(toolState.index, toolState.index + page);
        var atStart = toolState.index === 0;
        var atEnd   = toolState.index + page >= all.length;
        container.innerHTML =
            '<div class="mob-carousel-wrap">' +
            '<button class="mob-nav-btn mob-prev-btn"' + (atStart ? ' disabled' : '') + '>' + ARROW_LEFT_SVG + '</button>' +
            '<div class="tools-mob-grid" id="tools-inner">' + slice.map(cardHtml).join('') + '</div>' +
            '<button class="mob-nav-btn mob-next-btn"' + (atEnd ? ' disabled' : '') + '>' + ARROW_NEXT_SVG + '</button>' +
            '</div>';
        var prevBtn = container.querySelector('.mob-prev-btn');
        var nextBtn = container.querySelector('.mob-next-btn');
        if (prevBtn) prevBtn.addEventListener('click', function(){ toolState.index = Math.max(0, toolState.index - page); renderTools(); });
        if (nextBtn) nextBtn.addEventListener('click', function(){ if (toolState.index + page < all.length) toolState.index += page; renderTools(); });
        addSwipe(container.querySelector('#tools-inner'),
            function(){ toolState.index = Math.max(0, toolState.index - page); renderTools(); },
            function(){ if (toolState.index + page < all.length) { toolState.index += page; renderTools(); } }
        );
    } else {
        container.innerHTML = all.map(cardHtml).join('');
    }
}
(function() { renderTools('languages'); })();

// ── Education ──
var eduState = { index: 0 };
var MOB_EDU_PAGE = 2;

function renderEducation() {
    var container = document.getElementById('education-timeline');
    if (!container) return;
    var ac = accentStyle();
    var isDark = document.body.classList.contains('dark-theme');
    var all = portfolioData.education || [];

    function itemHtml(edu) {
        // Build courses HTML if course array exists
        var coursesHtml = '';
        if (edu.course && edu.course.length) {
            coursesHtml = '<div class="card-tags" style="margin:0.5rem 0 0.75rem 0; gap:0.4rem; display:flex; flex-wrap:wrap;">' +
                edu.course.map(function(c) {
                    return '<span class="tag" style="font-size:0.7rem; background:var(--light-card-hover, #f1f5f9);">' + c + '</span>';
                }).join('') +
                '</div>';
        }

        return '<div class="timeline-item">' +
            '<div class="timeline-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg></div>' +
            '<div class="timeline-content">' +
            '<div style="display:flex;align-items:center;gap:0.875rem;margin-bottom:0.6rem">' +
            '<img src="' + edu.image + '" alt="' + edu.school + '" style="width:2.75rem;height:2.75rem;object-fit:contain;border-radius:0.25rem;flex-shrink:0;background:white;padding:2px" loading="lazy">' +
            '<div><h3 class="card-title" style="margin:0;font-size:1rem">' + edu.school + '</h3>' +
            '<p class="card-subtitle" style="margin:0;font-size:0.8rem">' + edu.degree + '</p>' +
            '<p style="font-size:0.75rem;' + ac + '">' + edu.duration + '</p></div></div>' +
            coursesHtml +
            (edu.achievements ? '<ul style="list-style:none;padding:0;margin:0">' + edu.achievements.map(function(a) {
                return '<li style="display:flex;gap:0.4rem;font-size:0.8rem;margin-bottom:0.4rem;align-items:flex-start">' +
                    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="' + (isDark ? '#b4b4bc' : '#475569') + '" stroke-width="2" style="flex-shrink:0;margin-top:2px"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>' +
                    '<span class="card-description" style="margin:0">' + a + '</span></li>';
            }).join('') + '</ul>' : '') +
            '</div></div>';
    }

    if (isMobile()) {
        var page = MOB_EDU_PAGE;
        var slice = all.slice(eduState.index, eduState.index + page);
        var atStart = eduState.index === 0;
        var atEnd   = eduState.index + page >= all.length;
        container.innerHTML = buildBottomCarousel(slice.map(itemHtml).join(''), atStart, atEnd, '', 'edu-inner');
        var prevBtn = container.querySelector('.mob-prev-btn');
        var nextBtn = container.querySelector('.mob-next-btn');
        if (prevBtn) prevBtn.addEventListener('click', function(){ eduState.index = Math.max(0, eduState.index - page); renderEducation(); });
        if (nextBtn) nextBtn.addEventListener('click', function(){ if (eduState.index + page < all.length) eduState.index += page; renderEducation(); });
        addSwipe(container.querySelector('#edu-inner'),
            function(){ eduState.index = Math.max(0, eduState.index - page); renderEducation(); },
            function(){ if (eduState.index + page < all.length) { eduState.index += page; renderEducation(); } }
        );
    } else {
        container.innerHTML = all.map(itemHtml).join('');
    }
}
(function() { renderEducation(); })();

// ── Awards ──
var awardState = { index: 0 };
var MOB_AWARD_PAGE = 2;

function renderAwards() {
    var container = document.querySelector('.awards-grid');
    if (!container) return;
    var all = portfolioData.awards || [];
    var ICONS = [
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>',
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>',
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="6"></circle><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path></svg>',
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>'
    ];

    function cardHtml(a, i) {
        return '<div class="award-card"><div class="award-header">' + ICONS[i % ICONS.length] +
            '<div class="award-info"><h3>' + a.category + '</h3><p class="institution">' + a.institution + '</p>' +
            '<p class="date">' + a.date + '</p><p class="description">' + a.description + '</p></div></div></div>';
    }

    if (isMobile()) {
        var page = MOB_AWARD_PAGE;
        var slice = all.slice(awardState.index, awardState.index + page);
        var atStart = awardState.index === 0;
        var atEnd   = awardState.index + page >= all.length;
        container.innerHTML = buildBottomCarousel(
            slice.map(function(a, i) { return cardHtml(a, awardState.index + i); }).join(''),
            atStart, atEnd, '', 'award-inner'
        );
        var prevBtn = container.querySelector('.mob-prev-btn');
        var nextBtn = container.querySelector('.mob-next-btn');
        if (prevBtn) prevBtn.addEventListener('click', function(){ awardState.index = Math.max(0, awardState.index - page); renderAwards(); });
        if (nextBtn) nextBtn.addEventListener('click', function(){ if (awardState.index + page < all.length) awardState.index += page; renderAwards(); });
        addSwipe(container.querySelector('#award-inner'),
            function(){ awardState.index = Math.max(0, awardState.index - page); renderAwards(); },
            function(){ if (awardState.index + page < all.length) { awardState.index += page; renderAwards(); } }
        );
    } else {
        container.innerHTML = all.map(cardHtml).join('');
    }
}
(function() { renderAwards(); })();

// ── Certifications ──
var currentCertState = { tab: 'courses', index: 0 };
var CERT_PAGE = 3;
var MOB_CERT_PAGE = 2;

function certPageSize() { return isMobile() ? MOB_CERT_PAGE : CERT_PAGE; }

(function initCerts() {
    renderCerts(); updateCertBtns();
    var cp = document.getElementById('certifications-prev');
    var cn = document.getElementById('certifications-next');
    if (cp) cp.addEventListener('click', function(){ currentCertState.index = Math.max(0, currentCertState.index - CERT_PAGE); renderCerts(); updateCertBtns(); });
    if (cn) cn.addEventListener('click', function(){ var items = portfolioData.certifications[currentCertState.tab]||[]; if (currentCertState.index + CERT_PAGE < items.length) currentCertState.index += CERT_PAGE; renderCerts(); updateCertBtns(); });
})();

function renderCerts() {
    var container = document.getElementById('certifications-carousel');
    if (!container) return;
    var all = portfolioData.certifications[currentCertState.tab] || [];
    var page = certPageSize();
    var slice = all.slice(currentCertState.index, currentCertState.index + page);

    function cardHtml(c) {
        return '<div class="cert-card"><div class="card-image"><img src="' + c.image + '" alt="' + c.title + '" loading="lazy"></div>' +
            '<div class="card-content"><h3 class="card-title" style="font-size:0.9rem">' + c.title + '</h3>' +
            '<p class="card-subtitle">' + (c.issuer||c.conference||'') + '</p>' +
            '<div class="card-actions"><a href="' + c.link + '" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="font-size:0.75rem;padding:0.3rem 0.8rem">' +
            '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg> View</a>' +
            '</div></div></div>';
    }

    var isFew = !isMobile() && slice.length < 3;

    if (isMobile()) {
        var atStart = currentCertState.index === 0;
        var atEnd   = currentCertState.index + page >= all.length;
        container.className = 'certifications-carousel';
        container.innerHTML = buildBottomCarousel(slice.map(cardHtml).join(''), atStart, atEnd, 'certifications-carousel-inner', 'cert-inner');
        var prevBtn = container.querySelector('.mob-prev-btn');
        var nextBtn = container.querySelector('.mob-next-btn');
        if (prevBtn) prevBtn.addEventListener('click', function(){ currentCertState.index = Math.max(0, currentCertState.index - page); renderCerts(); updateCertBtns(); });
        if (nextBtn) nextBtn.addEventListener('click', function(){ if (currentCertState.index + page < all.length) currentCertState.index += page; renderCerts(); updateCertBtns(); });
        addSwipe(container.querySelector('#cert-inner'),
            function(){ currentCertState.index = Math.max(0, currentCertState.index - page); renderCerts(); updateCertBtns(); },
            function(){ if (currentCertState.index + page < all.length) { currentCertState.index += page; renderCerts(); updateCertBtns(); } }
        );
        var dp = document.getElementById('certifications-prev'); var dn = document.getElementById('certifications-next');
        if (dp) dp.style.display = 'none'; if (dn) dn.style.display = 'none';
    } else {
        if (isFew) container.classList.add('centered-few'); else container.classList.remove('centered-few');
        container.innerHTML = slice.map(cardHtml).join('');
        var dp = document.getElementById('certifications-prev'); var dn = document.getElementById('certifications-next');
        if (dp) { dp.style.display = ''; dp.disabled = currentCertState.index === 0; }
        if (dn) { dn.style.display = ''; dn.disabled = currentCertState.index + page >= all.length; }
    }
}

function updateCertBtns() {
    if (isMobile()) return;
    var all = portfolioData.certifications[currentCertState.tab] || [];
    var prev = document.getElementById('certifications-prev');
    var next = document.getElementById('certifications-next');
    if (prev) prev.disabled = currentCertState.index === 0;
    if (next) next.disabled = currentCertState.index + CERT_PAGE >= all.length;
}

// ── Modal ──
function openModal()  { document.getElementById('modal') && document.getElementById('modal').classList.add('active'); }
function closeModal() { document.getElementById('modal') && document.getElementById('modal').classList.remove('active'); }
document.getElementById('modal-close') && document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal') && document.getElementById('modal').addEventListener('click', function(e) { if (e.target === this) closeModal(); });
document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeModal(); });

// ── Contact Form ──
document.getElementById('contact-form') && document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var name = this.name.value, email = this.email.value, subject = this.subject.value, message = this.message.value;
    window.location.href = 'mailto:dewanjee.swarup@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);
    this.reset();
});

// ── Scroll Animations ──
(function initScrollAnimations() {
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
            if (e.isIntersecting) {
                e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)';
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.08 });
    document.querySelectorAll('.section').forEach(function(sec) {
        sec.style.opacity = '0'; sec.style.transform = 'translateY(18px)';
        sec.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(sec);
    });
    var hero = document.getElementById('home');
    if (hero) { hero.style.opacity = '1'; hero.style.transform = 'none'; hero.style.transition = 'none'; }
})();

// ── Active Nav Highlight ──
(function initActiveNav() {
    var navItems = document.querySelectorAll('.nav-item');
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
            if (e.isIntersecting) {
                navItems.forEach(function(n) { n.classList.remove('active-nav'); });
                var active = document.querySelector('.nav-item[href="#' + e.target.id + '"]');
                if (active) active.classList.add('active-nav');
            }
        });
    }, { rootMargin: '-35% 0px -55% 0px' });
    document.querySelectorAll('section[id]').forEach(function(s) { observer.observe(s); });
})();
// ── Writing / Medium Feed ──
var writingState = { index: 0, articles: [] };
var WRITING_PAGE = 3;
var MOB_WRITING_PAGE = 2;

// Tag inference from title/content
function inferWritingTags(item) {
    var text = ((item.title || '') + ' ' + (item.description || '') + ' ' + (item.tags || []).join(' ')).toLowerCase();
    var tags = [];
    if (/xai|explainable/.test(text))        tags.push('XAI');
    if (/medical|healthcare|clinical|diagnosis|disease/.test(text)) tags.push('Healthcare');
    if (/deep learn|neural|cnn|rnn|lstm|transformer/.test(text))    tags.push('Deep Learning');
    if (/machine learn|ml|random forest|svm|classifier/.test(text)) tags.push('ML');
    if (/nlp|language model|llm|gpt|bert/.test(text))               tags.push('NLP');
    if (/LLM/.test(text))               tags.push('LLM');
    if (/data scien|data analys|visualization/.test(text))          tags.push('Data Science');
    if (/python|tensorflow|pytorch|keras/.test(text))                tags.push('Python');
    if (tags.length === 0) tags.push('AI');
    return tags.slice(0, 4);
}

// Topic label badge from tags
function inferTopicBadge(tags) {
    if (tags.indexOf('XAI') !== -1)         return 'XAI';
    if (tags.indexOf('Healthcare') !== -1)   return 'Healthcare';
    if (tags.indexOf('Deep Learning') !== -1) return 'Deep Learning';
    if (tags.indexOf('NLP') !== -1)          return 'NLP';
    if (tags.indexOf('ML') !== -1)           return 'ML';
     if (tags.indexOf('ML') !== -1)           return 'ML';
    return 'AI';
}

// Hardcoded fallback article matching the requested URL
var MEDIUM_FALLBACK = [
    {
        title: 'Beyond the Black Box: Is Explainable AI Enough for Medical Diagnosis?',
        description: 'Exploring the promises and limitations of Explainable AI (XAI) in high-stakes clinical settings.',
        link: 'https://medium.com/@dewanjee.swarup/beyond-the-black-box-is-explainable-ai-enough-for-medical-diagnosis-d733c8c751af',
        pubDate: 'Apr 2025',
        tags: ['XAI', 'Healthcare', 'ML', 'Deep Learning'],
        publication: 'Towards AI'

    }
];

function writingPageSize() { return isMobile() ? MOB_WRITING_PAGE : WRITING_PAGE; }


function inferWritingTags(article) {
    var text = ((article.title || '') + ' ' + (article.description || '')).toLowerCase();
    var tags = [];

    if (text.includes('explainable') || text.includes('xai')) tags.push('XAI');
    if (text.includes('health') || text.includes('medical') || text.includes('clinical')) tags.push('Healthcare');
    if (text.includes('deep learning') || text.includes('neural')) tags.push('Deep Learning');
    if (text.includes('machine learning') || text.includes('ml')) tags.push('ML');
    if (text.includes('data')) tags.push('Data');
    if (text.includes('ai') || text.includes('artificial intelligence')) tags.push('AI');

    return tags.length ? tags.slice(0, 4) : ['AI'];
}


function inferTopicBadge(tags) {
    if (!tags || tags.length === 0) return 'AI';

    var t = tags.map(t => t.toLowerCase());

    if (t.includes('xai')) return 'XAI';
    if (t.includes('llm')) return 'LLM';
    if (t.includes('big-data')) return 'Big Data';
    if (t.includes('explainable-ai')) return 'XAI';
    if (t.includes('healthcare')) return 'Health';
    if (t.includes('deep-learning')) return 'DL';
    if (t.includes('machine-learning')) return 'ML';
    if (t.includes('data-analysis')) return 'Data Analysis';
    if (t.includes('ai')) return 'AI';
     if (t.includes('artificial-intelligence')) return 'AI';

    return tags[0];
}


function inferPublication(article) {
    // 1. Explicit field wins
    if (article.publication) return article.publication;

    // 2. Check article URL — Medium publication slugs appear before the post slug
    // e.g. https://towardsdatascience.com/... or https://medium.com/towards-data-engineering/...
    var url = article.link || '';
    if (/towardsdatascience\.com/.test(url))          return 'Towards Data Science';
    if (/towards-data-engineering/.test(url))          return 'Towards Data Engineering';
    if (/towards-ai/.test(url) || /towardsai\.net/.test(url)) return 'Towards AI';
    if (/medium\.com\/towards-data-science/.test(url)) return 'Towards Data Science';
    if (/medium\.com\/[^/@]/.test(url)) {
        // Extract the publication slug from medium.com/pub-name/article-slug
        var match = url.match(/medium\.com\/([^/@][^/]+)\//);
        if (match) {
            // Convert slug to title case: "towards-data-engineering" → "Towards Data Engineering"
            return match[1]
                .split('-')
                .map(function(w){ return w.charAt(0).toUpperCase() + w.slice(1); })
                .join(' ');
        }
    }

    // 3. Check tags for known publication names
    var tagText = (article.tags || []).join(' ').toLowerCase();
    if (/towards data engineering/.test(tagText)) return 'Towards Data Engineering';
    if (/towards data science/.test(tagText))     return 'Towards Data Science';
    if (/towards ai/.test(tagText))               return 'Towards AI';
    if (/towards explainable ai/.test(tagText))       return 'Towards Explainable Ai';
    if (/javascript in plain english/.test(tagText)) return 'JavaScript in Plain English';

    // 4. Check title/description text
    var bodyText = ((article.title || '') + ' ' + (article.description || '')).toLowerCase();
    if (/towards data engineering/.test(bodyText)) return 'Towards Data Engineering';
    if (/towards data science/.test(bodyText))     return 'Towards Data Science';

    // 5. Default
    return 'Medium';
}

function renderWriting() {
    var container = document.getElementById('writing-carousel');
    if (!container) return;

    var ac = accentStyle();
    var all = writingState.articles;

    if (all.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:3rem;opacity:0.6;width:100%">Loading articles...</div>';
        return;
    }

    var page = writingPageSize();
    var slice = all.slice(writingState.index, writingState.index + page);
    var isFew = !isMobile() && slice.length < 3;

    // Medium SVG icon (inline, same M-dot as experience button)
    var MEDIUM_ICON = '<svg width="13" height="13" viewBox="0 0 1043.63 592.71" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M588.67 296.36c0 163.67-131.78 296.35-294.33 296.35S0 460.03 0 296.36 131.78 0 294.34 0s294.33 132.69 294.33 296.36M911.56 296.36c0 154.06-65.89 279-147.17 279s-147.17-124.94-147.17-279 65.88-279 147.17-279 147.17 124.9 147.17 279M1043.63 296.36c0 138-23.17 249.94-51.76 249.94s-51.75-111.9-51.75-249.94 23.17-249.94 51.75-249.94 51.76 111.9 51.76 249.94"/></svg>';

    function cardHtml(a) {
        var tags = a.tags && a.tags.length ? a.tags : inferWritingTags(a);
        var badge = inferTopicBadge(tags);

        // Detect publication name — check tags or fallback to Medium
        var pubName = inferPublication(a);

        return '<div class="writing-card">' +
            '<div class="writing-card-content">' +
            '<div class="writing-card-header">' +
            '<span class="writing-pub-badge">' + MEDIUM_ICON + pubName + '</span>' +
            '<span class="writing-topic-badge">' + badge + '</span>' +
            '</div>' +
            '<h3 class="card-title writing-card-title">' + a.title + '</h3>' +
            '<p class="card-description writing-card-desc">' + (a.description || '') + '</p>' +
            '<div class="card-tags">' +
            tags.map(function(t){ return '<span class="tag">' + t + '</span>'; }).join('') +
            '</div>' +
            '<div class="writing-card-footer">' +
            (a.pubDate ? '<span style="font-size:0.75rem;' + ac + '">' + a.pubDate + '</span>' : '') +
            '<a href="' + a.link + '" target="_blank" rel="noopener noreferrer" class="btn btn-primary writing-read-btn">' +
            ARROW_RIGHT_SVG + ' View Details</a>' +
            '</div>' +
            '</div></div>';
    }

    var cardsHtml = slice.map(cardHtml).join('');

    if (isMobile()) {
        var atStart = writingState.index === 0;
        var atEnd   = writingState.index + page >= all.length;
        container.className = 'writing-carousel';
        container.innerHTML = buildBottomCarousel(
            cardsHtml, atStart, atEnd, 'writing-carousel-inner', 'writing-inner'
        );
        var prevBtn = container.querySelector('.mob-prev-btn');
        var nextBtn = container.querySelector('.mob-next-btn');
        if (prevBtn) prevBtn.addEventListener('click', function(){
            writingState.index = Math.max(0, writingState.index - page);
            renderWriting();
        });
        if (nextBtn) nextBtn.addEventListener('click', function(){
            if (writingState.index + page < all.length) writingState.index += page;
            renderWriting();
        });
        addSwipe(
            container.querySelector('#writing-inner'),
            function(){ writingState.index = Math.max(0, writingState.index - page); renderWriting(); },
            function(){ if (writingState.index + page < all.length) { writingState.index += page; renderWriting(); } }
        );
        var dp = document.getElementById('writing-prev');
        var dn = document.getElementById('writing-next');
        if (dp) dp.style.display = 'none';
        if (dn) dn.style.display = 'none';
    } else {
        if (isFew) container.classList.add('centered-few'); else container.classList.remove('centered-few');
        container.innerHTML = cardsHtml;
        var dp = document.getElementById('writing-prev');
        var dn = document.getElementById('writing-next');
        if (dp) { dp.style.display = ''; dp.disabled = writingState.index === 0; }
        if (dn) { dn.style.display = ''; dn.disabled = writingState.index + page >= all.length; }
    }
}

(function initWriting() {
    var wp = document.getElementById('writing-prev');
    var wn = document.getElementById('writing-next');

    if (wp) wp.addEventListener('click', function(){
        writingState.index = Math.max(0, writingState.index - WRITING_PAGE);
        renderWriting();
    });

    if (wn) wn.addEventListener('click', function(){
        if (writingState.index + WRITING_PAGE < writingState.articles.length) {
            writingState.index += WRITING_PAGE;
            renderWriting();
        }
    });

    writingState.articles = MEDIUM_FALLBACK.slice();
    renderWriting();

    var rssUrl = 'https://medium.com/feed/@dewanjee.swarup';

    var proxies = [
        'https://api.rss2json.com/v1/api.json?rss_url=',
        'https://api.allorigins.win/raw?url='
    ];

    function fetchMedium(i = 0) {
        if (i >= proxies.length) {
            console.error("All proxies failed");
            return;
        }

        var url = proxies[i] + encodeURIComponent(rssUrl) + '&_=' + Date.now();

        fetch(url)
            .then(r => r.json())
            .then(data => {

                var items = data.items || [];

                if (!items.length && data.contents) {
                    var parser = new DOMParser();
                    var xml = parser.parseFromString(data.contents, "text/xml");

                    items = Array.from(xml.querySelectorAll("item")).map(function (item) {
                        return {
                            title: item.querySelector("title")?.textContent,
                            link: item.querySelector("link")?.textContent,
                            pubDate: item.querySelector("pubDate")?.textContent,
                            description: item.querySelector("description")?.textContent,
                            categories: Array.from(item.querySelectorAll("category")).map(c => c.textContent)
                        };
                    });
                }

                if (!items.length) throw new Error("No items");

                var articles = items.map(function(item) {

                    var tmp = document.createElement('div');
                    tmp.innerHTML = item.description || '';

                    var plain = (tmp.textContent || '')
                        .replace(/\s+/g, ' ')
                        .trim()
                        .slice(0, 180);

                    if (plain.length === 180) plain += '…';

                    var pubDate = '';
                    if (item.pubDate) {
                        try {
                            pubDate = new Date(item.pubDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short'
                            });
                        } catch(e){}
                    }

                    var art = {
                        title: item.title,
                        link: item.link || item.url || '', 
                        description: plain,
                        pubDate: pubDate,
                        tags: (item.categories || []).slice(0, 4),
                        publication: null  
                    };

                    if (!art.tags || art.tags.length === 0) {
                        art.tags = inferWritingTags(art);
                    }

                    return art;
                });

                writingState.articles = articles;
                writingState.index = 0;
                renderWriting();
            })
            .catch(function(err) {
                console.error("Proxy failed:", err);
                fetchMedium(i + 1);
            });
    }

    fetchMedium();

})();


(function patchThemeForWriting() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;

    btn.addEventListener('click', function() {
        renderWriting();
    });
})();