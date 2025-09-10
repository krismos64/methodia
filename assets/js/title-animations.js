/**
 * METHODIA - Animations de titres modernes
 * Système d'animation professionnel inspiré Apple/Google
 */

class TitleAnimator {
    constructor() {
        this.observerOptions = {
            root: null,
            rootMargin: '-10% 0px -10% 0px',
            threshold: 0.1
        };
        
        this.observer = null;
        this.animatedElements = new Set();
        
        this.init();
    }
    
    init() {
        // Attendre que le DOM soit prêt
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupAnimations());
        } else {
            this.setupAnimations();
        }
    }
    
    setupAnimations() {
        // Créer l'observer
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => this.handleIntersection(entry));
        }, this.observerOptions);
        
        // Setup des différents types de titres
        this.setupHeroTitle();
        this.setupSectionTitles();
        this.setupCascadeTitles();
        this.setupTypingTitles();
    }
    
    setupHeroTitle() {
        const heroTitle = document.querySelector('.hero-text h1');
        if (heroTitle) {
            heroTitle.classList.add('hero-title', 'title-animate-reveal');
            this.observer.observe(heroTitle);
        }
    }
    
    setupSectionTitles() {
        const sectionTitles = document.querySelectorAll('.section-title');
        const animations = [
            'title-animate-reveal',
            'title-animate-slide', 
            'title-animate-fade',
            'title-animate-glow'
        ];
        
        sectionTitles.forEach((title, index) => {
            // Assigner une animation différente à chaque section
            const animationType = animations[index % animations.length];
            title.setAttribute('data-animation', animationType);
            
            // Préparer l'animation sans la déclencher
            title.classList.add('animate-ready');
            
            this.observer.observe(title);
        });
    }
    
    setupCascadeTitles() {
        // Titres avec animation en cascade (mot par mot)
        const cascadeTitles = document.querySelectorAll('[data-title-cascade]');
        
        cascadeTitles.forEach(title => {
            this.splitTextIntoWords(title);
            title.classList.add('title-cascade');
            this.observer.observe(title);
        });
    }
    
    setupTypingTitles() {
        // Titres avec effet machine à écrire
        const typingTitles = document.querySelectorAll('[data-title-typing]');
        
        typingTitles.forEach(title => {
            title.classList.add('title-typing');
            this.observer.observe(title);
        });
    }
    
    splitTextIntoWords(element) {
        const text = element.textContent;
        const words = text.split(' ');
        
        element.innerHTML = words.map(word => 
            `<span class="word">${word}</span>`
        ).join(' ');
    }
    
    handleIntersection(entry) {
        if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
            this.animateElement(entry.target);
            this.animatedElements.add(entry.target);
        }
    }
    
    animateElement(element) {
        // Petit délai pour un effet plus naturel
        setTimeout(() => {
            if (element.classList.contains('hero-title')) {
                element.classList.add('animate');
            }
            
            if (element.classList.contains('title-cascade')) {
                element.classList.add('animate');
            }
            
            if (element.classList.contains('title-typing')) {
                element.classList.add('animate');
            }
            
            // Pour les animations CSS directes avec .section-title
            const animationType = element.getAttribute('data-animation');
            if (animationType && element.classList.contains('animate-ready')) {
                element.classList.add(animationType);
                element.classList.remove('animate-ready');
            }
            
            // Ajouter un effet de lueur subtile après l'animation
            this.addGlowEffect(element);
            
        }, Math.random() * 200); // Délai aléatoire pour un effet naturel
    }
    
    addGlowEffect(element) {
        setTimeout(() => {
            element.style.textShadow = '0 0 20px rgba(25, 118, 210, 0.3)';
            
            setTimeout(() => {
                element.style.textShadow = '';
            }, 2000);
        }, 1200);
    }
    
    // Méthode pour les animations manuelles
    animateTitle(selector, animationType = 'title-animate-reveal') {
        const element = document.querySelector(selector);
        if (element) {
            element.classList.add(animationType);
            this.animateElement(element);
        }
    }
    
    // Redéclencher toutes les animations (pour debug)
    resetAnimations() {
        this.animatedElements.clear();
        document.querySelectorAll('.section-title, .hero-title, .title-cascade, .title-typing').forEach(element => {
            element.classList.remove('animate');
            element.style.opacity = '0';
            element.style.transform = 'translateY(40px)';
        });
    }
}

// Initialisation automatique
const titleAnimator = new TitleAnimator();

// Exposer globalement pour usage manuel si besoin
window.TitleAnimator = titleAnimator;

// Animation de performance pour le hero au chargement
document.addEventListener('DOMContentLoaded', () => {
    // Animation immédiate du hero title si visible
    const heroTitle = document.querySelector('.hero-text h1');
    if (heroTitle && isElementInViewport(heroTitle)) {
        setTimeout(() => {
            titleAnimator.animateElement(heroTitle);
        }, 300);
    }
});

// Utilitaire pour vérifier si un élément est visible
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Performance monitoring
if (window.performance && window.performance.mark) {
    window.performance.mark('title-animations-loaded');
}