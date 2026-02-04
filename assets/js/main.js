
// ========== VARIABLES GLOBALES ==========
let currentLang = 'fr';

// ========== CHARGEMENT DES PROJETS ==========
const projects = [
    { id: 'project-parking', file: 'assets/projects/project-parking.html' },
    { id: 'project-AI', file: 'assets/projects/project-AI.html' },
];
const LINKS = {
    CPE_Lyon: '<a href="https://www.cpe.fr/detail/psm-presentation-de-la-formation/" target="_blank">CPE Lyon</a>',
    CEA_Leti: '<a href="https://www.leti-cea.fr/cea-tech/leti" target="_blank">CEA-Leti</a>'
};

async function loadProjects() {
    console.log('Chargement des projets...');
    
    for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        const container = document.getElementById(project.id);

        if (container) {
            try {
                const response = await fetch(project.file);
                if (response.ok) {
                    const html = await response.text();
                    container.innerHTML = html;

                    // Attribution automatique gauche/droite
                    const timelineItem = container.querySelector('.timeline-item');
                    if (timelineItem) {
                        const side = (i % 2 === 0) ? 'left' : 'right';
                        timelineItem.classList.add(side);
                        console.log(`✅ Projet chargé: ${project.id} (${side})`);
                    }
                } else {
                    console.warn(`❌ Erreur HTTP ${response.status}: ${project.file}`);
                }
            } catch (error) {
                console.warn(`❌ Projet non trouvé: ${project.file}`, error);
            }
        } else {
            console.warn(`❌ Container non trouvé: ${project.id}`);
        }
    }

    // Réappliquer la langue après chargement
    setLanguage(currentLang);
    
    // Observer les nouveaux éléments
    initTimelineObserver();
    initCloseOnClickOutside();
}

// ========== GESTION DES LANGUES ==========
async function detectCountry() {
    try {
        const response = await fetch('https://ipapi.co/country_code/');
        const country = await response.text();
        const frenchCountries = ['FR', 'BE', 'CA', 'LU', 'MC'];
        if (frenchCountries.includes(country)) {
            return 'fr';
        }
    } catch (e) {
        if (navigator.language.toLowerCase().startsWith('fr')) {
            return 'fr';
        }
    }
    return 'en';
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    document.querySelectorAll('.lang-text').forEach(el => {
        el.style.display = el.dataset.lang === lang ? '' : 'none';
    });
}

// ========== OBSERVER TIMELINE ==========
function initTimelineObserver() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    timelineItems.forEach(item => {
        observer.observe(item);
    });
}

// ========== EXPANSION DES PROJETS ==========
function toggleProject(element) {
    const card = element.closest('.timeline-content');
    const item = card.closest('.timeline-item');
    const isExpanding = !item.classList.contains('expanded');

    // Fermer tous les autres
    document.querySelectorAll('.timeline-item.expanded').forEach(i => {
        i.classList.remove('expanded');
        i.querySelector('.timeline-content').classList.remove('expanded');
    });

    if (isExpanding) {
        item.classList.add('expanded');
        card.classList.add('expanded');
        document.body.classList.add('modal-open');
        setTimeout(() => { item.scrollTop = 0; }, 100);
    } else {
        document.body.classList.remove('modal-open');
    }
}

// Fermer avec Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.timeline-item.expanded').forEach(item => {
            item.classList.remove('expanded');
            item.querySelector('.timeline-content').classList.remove('expanded');
        });
        document.body.classList.remove('modal-open');
    }
});

// Fermer en cliquant en dehors
function initCloseOnClickOutside() {
    document.querySelectorAll('.timeline-item').forEach(item => {
        item.addEventListener('click', (e) => {
            // Si on clique sur le fond (l'item) et pas sur la carte
            if (e.target === item && item.classList.contains('expanded')) {
                closeProject(item);
            }
        });
    });

    // Boutons close
    document.querySelectorAll('.btn-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const item = btn.closest('.timeline-item');
            closeProject(item);
        });
    });
}

// ========== FONCTION FERMETURE ==========
function closeProject(item) {
    const card = item.querySelector('.timeline-content');
    item.classList.remove('expanded');
    card.classList.remove('expanded');
    document.body.classList.remove('modal-open');
}

// Modifie aussi le listener Escape pour utiliser closeProject
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.timeline-item.expanded').forEach(item => {
            closeProject(item);
        });
    }
});

// ========== SMOOTH SCROLL ==========
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========== INITIALISATION ==========
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM chargé');
    
    // 1. Détecter/charger la langue
    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
        currentLang = savedLang;
    } else {
        currentLang = await detectCountry();
    }
    
    // 2. Charger les projets (appliquera la langue après)
    await loadProjects();
    
    // 3. Init autres fonctionnalités
    initSmoothScroll();
    
    // 4. Boutons langue
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });
    
    console.log('OK - Initialisation terminée');
});

function parseMacros(text) {
    return text.replace(/\\(\w+)/g, (match, key) => LINKS[key] || match);
}

// Applique les macros à tous les éléments avec la classe "macro"
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.macro').forEach(el => {
        el.innerHTML = parseMacros(el.innerHTML);
    });
});
