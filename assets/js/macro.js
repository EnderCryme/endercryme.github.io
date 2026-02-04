const LINKS = {
    CPE_Lyon: '<a href="https://www.cpe.fr/detail/psm-presentation-de-la-formation/" target="_blank">CPE Lyon</a>',
    CEA_Leti: '<a href="https://www.leti-cea.fr/cea-tech/leti" target="_blank">CEA-Leti</a>'
};

function parseMacros(text) {
    return text.replace(/\\(\w+)/g, (match, key) => LINKS[key] || match);
}

// Applique les macros à tous les éléments avec la classe "macro"
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.macro').forEach(el => {
        el.innerHTML = parseMacros(el.innerHTML);
    });
});
