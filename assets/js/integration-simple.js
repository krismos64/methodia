/**
 * METHODIA - Intégration simple des animations de titres
 * Inclusion facile dans votre site existant
 */

// Configuration simple pour activation immédiate
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎬 METHODIA Animations - Démarrage...');
    
    // Vérifier si le fichier d'animation principal est chargé
    if (typeof TitleAnimator === 'undefined') {
        console.warn('⚠️ TitleAnimator non trouvé - Chargement du script...');
        
        // Charger le script d'animation de manière dynamique
        const script = document.createElement('script');
        script.src = '/assets/js/title-animations.js';
        script.onload = function() {
            console.log('✅ Script d\'animations chargé avec succès');
        };
        script.onerror = function() {
            console.error('❌ Erreur lors du chargement du script d\'animations');
        };
        document.head.appendChild(script);
    } else {
        console.log('✅ TitleAnimator déjà chargé');
    }
    
    // Fallback : Animation simple CSS pure si JS échoue
    setTimeout(() => {
        const titles = document.querySelectorAll('.section-title');
        titles.forEach((title, index) => {
            if (!title.classList.contains('animated') && !title.getAttribute('data-animation')) {
                // Animation CSS simple en fallback
                title.style.animation = `fadeInUp 0.8s ease forwards ${index * 0.2}s`;
                title.style.opacity = '0';
            }
        });
    }, 1000);
});

// CSS d'urgence intégré pour le fallback
const fallbackCSS = `
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`;

// Injecter le CSS de fallback
const style = document.createElement('style');
style.textContent = fallbackCSS;
document.head.appendChild(style);