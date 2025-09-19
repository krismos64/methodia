// METHODEA - Script principal
console.log('🚀 Script METHODEA chargé !');
let currentQuestion = 0;
let selectedAnswer = null;
let userAnswers = [];

// Navigation mobile
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    }
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileMenu) {
        mobileMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    }
}

// Modales
function openModal() {
    const modal = document.getElementById('consultationModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('consultationModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Popup CTA - FONCTION CORRIGÉE
function closePopup() {
    const popup = document.getElementById('popupCTA');
    if (popup) {
        popup.classList.remove('active');
        popup.style.display = 'none';
        localStorage.setItem('popupClosed', 'true');
        console.log('✅ Popup fermée');
    }
}

function showPopup() {
    // Attendre que le DOM soit vraiment prêt
    const initPopup = () => {
        const popup = document.getElementById('popupCTA');
        const popupClosed = localStorage.getItem('popupClosed');

        console.log('🔍 Vérification popup:', {
            popup: !!popup,
            popupClosed,
            popupElement: popup,
            currentTime: new Date().toLocaleTimeString()
        });

        if (!popup) {
            console.error('❌ Popup #popupCTA not found in DOM!');
            // Retry dans 2 secondes au cas où le DOM ne serait pas prêt
            setTimeout(initPopup, 2000);
            return;
        }

        if (popupClosed === 'true') {
            console.log('ℹ️ Popup déjà fermée par l\'utilisateur');

            // En mode développement (localhost), reset automatique
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log('🛠 Mode développement détecté - Reset automatique du popup');
                localStorage.removeItem('popupClosed');
                // Continue l'exécution
            } else {
                return;
            }
        }

        console.log('⏰ Popup programmée dans 5 secondes (test rapide)...');

        // Réduire le délai pour test (5 secondes au lieu de 15)
        setTimeout(() => {
            try {
                popup.style.display = 'block';
                popup.classList.add('active');
                console.log('📢 Popup affichée avec succès!');

                // Log des styles appliqués
                const computedStyle = window.getComputedStyle(popup);
                console.log('🎨 Styles popup:', {
                    display: computedStyle.display,
                    position: computedStyle.position,
                    zIndex: computedStyle.zIndex,
                    visibility: computedStyle.visibility
                });
            } catch (error) {
                console.error('❌ Erreur lors de l\'affichage du popup:', error);
            }
        }, 5000); // 5 secondes pour test
    };

    // Exécuter immédiatement ou attendre que le DOM soit prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPopup);
    } else {
        initPopup();
    }
}

// Fonction de test pour forcer l'affichage du popup
function forceShowPopup() {
    const popup = document.getElementById('popupCTA');
    console.log('🔧 Test forcé du popup...');

    if (!popup) {
        console.error('❌ Élément popup non trouvé!');
        // Lister tous les éléments avec popup dans leur ID/classe
        const allElements = document.querySelectorAll('*[id*="popup"], *[class*="popup"]');
        console.log('🔍 Éléments avec "popup":', allElements);
        return false;
    }

    // Reset complet du popup
    popup.style.cssText = '';
    popup.className = 'popup-cta';

    // Forcer l'affichage
    popup.style.display = 'block !important';
    popup.style.position = 'fixed';
    popup.style.bottom = '100px';
    popup.style.right = '30px';
    popup.style.zIndex = '9999';
    popup.style.backgroundColor = 'white';
    popup.style.border = '2px solid #1976D2';
    popup.style.borderRadius = '15px';
    popup.style.padding = '20px';
    popup.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
    popup.classList.add('active');

    console.log('✨ Popup forcée à s\'afficher avec styles inline!');
    return true;
}

// Fonction pour réinitialiser le popup
function resetPopup() {
    localStorage.removeItem('popupClosed');
    console.log('🔄 Popup reset - elle apparaîtra à nouveau');
}

// Initialisation événements popup - VERSION FINALE CORRIGÉE
function initPopupEvents() {
    console.log('🔍 Recherche des éléments popup...');
    
    const popup = document.getElementById('popupCTA');
    
    if (!popup) {
        console.error('❌ Popup #popupCTA non trouvée !');
        return;
    }
    
    console.log('✅ Popup trouvée:', popup);
    
    // Utiliser la délégation d'événements pour gérer tous les clics sur la popup
    popup.addEventListener('click', function(e) {
        console.log('🖱️ Clic détecté sur popup, target:', e.target.className);
        
        // Si on clique sur la croix de fermeture
        if (e.target.classList.contains('popup-close') || 
            e.target.closest('.popup-close')) {
            console.log('🎯 Clic sur bouton fermeture !');
            e.preventDefault();
            e.stopPropagation();
            closePopup();
            return;
        }
        
        // Si on clique sur le bouton CTA
        if (e.target.classList.contains('popup-cta-button') || 
            e.target.closest('.popup-cta-button')) {
            console.log('🎯 Clic sur bouton CTA !');
            e.preventDefault();
            e.stopPropagation();
            closePopup();
            openModal();
            return;
        }
        
        // Si on clique sur le fond de la popup (pas sur son contenu)
        if (e.target === popup) {
            console.log('🎯 Clic à l\'extérieur du contenu');
            closePopup();
        }
    });
    
    // Ajouter support tactile spécifique pour mobile
    popup.addEventListener('touchstart', function(e) {
        if (e.target.classList.contains('popup-close') || 
            e.target.closest('.popup-close')) {
            console.log('👆 Touch sur bouton fermeture !');
            e.preventDefault();
            e.stopPropagation();
            closePopup();
        }
    }, { passive: false });
    
    console.log('✅ Event listeners configurés pour la popup');
    
    // Debug: Afficher la structure de la popup pour diagnostic
    console.log('🔍 Structure popup:', popup.innerHTML.substring(0, 200) + '...');
}

// Quiz data
const quizData = [
    {
        question: "Qu'est-ce qu'une hypothèse de recherche?",
        options: [
            "Une question de recherche",
            "Une affirmation provisoire testable",
            "Une conclusion définitive",
            "Un résumé de la recherche"
        ],
        correct: 1
    },
    {
        question: "Quelle est la différence entre recherche qualitative et quantitative?",
        options: [
            "Il n'y a pas de différence",
            "La qualitative utilise des chiffres, la quantitative des mots",
            "La qualitative explore en profondeur, la quantitative mesure",
            "La quantitative est plus scientifique"
        ],
        correct: 2
    },
    {
        question: "Qu'est-ce qu'une revue de littérature?",
        options: [
            "Un magazine scientifique",
            "Une analyse critique des travaux existants",
            "Un résumé de votre recherche",
            "Une bibliographie"
        ],
        correct: 1
    },
    {
        question: "Qu'est-ce que l'échantillonnage en recherche?",
        options: [
            "La collecte de données",
            "La sélection d'un sous-groupe représentatif",
            "L'analyse statistique",
            "La rédaction du mémoire"
        ],
        correct: 1
    },
    {
        question: "Comment éviter le plagiat?",
        options: [
            "Paraphraser sans citer",
            "Utiliser l'IA pour réécrire",
            "Citer toutes les sources utilisées",
            "Copier moins de 10% du texte"
        ],
        correct: 2
    }
];

// Quiz functions
function startQuiz() {
    currentQuestion = 0;
    userAnswers = [];
    selectedAnswer = null;
    showQuestion();
}

function showQuestion() {
    const container = document.querySelector('.quiz-container');
    if (!container) return;

    const question = quizData[currentQuestion];
    const progressBar = container.querySelector('.quiz-progress-bar');
    
    if (progressBar) {
        progressBar.style.width = `${((currentQuestion + 1) / quizData.length) * 100}%`;
    }

    const questionHTML = `
        <div class="quiz-question">
            <h3>Question ${currentQuestion + 1}/${quizData.length}</h3>
            <p>${question.question}</p>
            <div class="quiz-options">
                ${question.options.map((option, index) => 
                    `<div class="quiz-option" onclick="selectedAnswer=${index};selectOption(this,${currentQuestion},${index})">${option}</div>`
                ).join('')}
            </div>
        </div>`;

    const questionContainer = container.querySelector('#quizContent');
    if (questionContainer) {
        questionContainer.innerHTML = questionHTML;
    }

    const prevBtn = container.querySelector('.quiz-btn-prev');
    const nextBtn = container.querySelector('.quiz-btn-next');
    
    if (prevBtn) {
        prevBtn.style.display = currentQuestion > 0 ? 'block' : 'none';
    }
    if (nextBtn) {
        nextBtn.textContent = currentQuestion === quizData.length - 1 ? 'Voir les résultats' : 'Suivant';
    }
}

function selectOption(element, questionIndex, answerIndex) {
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    element.classList.add('selected');
    selectedAnswer = answerIndex;
}

function nextQuestion() {
    if (selectedAnswer === null) {
        alert('Veuillez sélectionner une réponse');
        return;
    }
    
    userAnswers[currentQuestion] = selectedAnswer;
    
    if (currentQuestion < quizData.length - 1) {
        currentQuestion++;
        selectedAnswer = null;
        showQuestion();
    } else {
        showResults();
    }
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        selectedAnswer = userAnswers[currentQuestion] || null;
        showQuestion();
    }
}

function showResults() {
    const container = document.querySelector('.quiz-container');
    if (!container) return;

    let score = 0;
    userAnswers.forEach((answer, index) => {
        if (answer === quizData[index].correct) {
            score++;
        }
    });

    const percentage = Math.round((score / quizData.length) * 100);

    container.innerHTML = `
        <div class="quiz-results">
            <h2 class="quiz-score">${percentage}%</h2>
            <p style="font-size:1.3rem;color:#475569;margin-bottom:1rem;">
                Vous avez répondu correctement à ${score} questions sur ${quizData.length}
            </p>
            ${percentage < 50 ? 
                `<p style="color:#f97316;margin-bottom:2rem;">Vous avez besoin d'un accompagnement complet. Notre formation METHODEA est faite pour vous!</p>` :
                percentage < 80 ? 
                `<p style="color:#14b8a6;margin-bottom:2rem;">Bon niveau! Notre formation vous aidera à maîtriser les subtilités de la recherche académique.</p>` :
                `<p style="color:#10b981;margin-bottom:2rem;">Excellent! Vous avez de solides bases. Notre formation Excellence vous permettra d'atteindre l'expertise.</p>`
            }
            <a href="#" class="btn-primary" onclick="openModal()" style="margin:0 auto;">
                Obtenir mon programme personnalisé
            </a>
        </div>`;
}

// Smooth scroll navigation
function initSmoothScroll() {
    console.log('🔗 Initialisation du smooth scroll');
    const anchors = document.querySelectorAll('a[href^="#"]');
    console.log(`🔗 ${anchors.length} liens trouvés avec href="#"`);
    
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Ignorer si le lien a déjà un handler onclick
            if (this.getAttribute('onclick')) return;
            
            const href = this.getAttribute('href');
            
            // Ignorer les liens "#" vides
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            console.log('Tentative de navigation vers:', href);
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                console.log('Section trouvée, scroll vers:', target);
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                closeMobileMenu();
            } else {
                console.log('Section non trouvée pour:', href);
                e.preventDefault(); // Empêcher le scroll vers le haut
            }
        });
    });
}

// Navigation scroll
function initNavbarScroll() {
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        if (nav) {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }
    });
}

// Animation des statistiques
function animateValue(element, start, end, duration, suffix = '+') {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = Math.floor(progress * (end - start) + start);

        // Gérer les différents suffixes
        if (suffix === '-%') {
            element.textContent = '-' + currentValue + '%';
        } else {
            element.textContent = currentValue + suffix;
        }

        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function initStatsAnimation() {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const originalText = stat.textContent;
                    const value = parseInt(originalText);

                    if (!isNaN(value)) {
                        // Déterminer le suffixe approprié
                        let suffix = '+';
                        const label = stat.nextElementSibling?.textContent?.toLowerCase() || '';

                        if (originalText.includes('%') || label.includes('réussite')) {
                            suffix = '%';
                        } else if (label.includes('temps')) {
                            suffix = '-%';
                        } else if (label.includes('humaine')) {
                            suffix = '%';
                        }

                        animateValue(stat, 0, value, 2000, suffix);
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stats-container').forEach(container => {
        statsObserver.observe(container);
    });
}

// Formulaire contact
function initContactForm() {
    const form = document.querySelector('.modal-content form');
    if (form) {
        form.addEventListener('submit', function(e) {
            // Ne pas empêcher la soumission - laisser Netlify prendre le relais
            // Le formulaire sera soumis normalement et redirigé vers /merci.html
            console.log('📧 Formulaire soumis vers Netlify Forms...');
            closeModal();
        });
    }
}

// Fermeture modal en cliquant à l'extérieur
function initModalOutsideClick() {
    // Fermeture en cliquant sur le bouton X
    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Fermeture en cliquant à l'extérieur
    window.onclick = function(event) {
        const modal = document.getElementById('consultationModal');
        if (event.target == modal) {
            closeModal();
        }
    }
}

// Animations au scroll
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.service-card, .roadmap-item, .testimonial-card, .formula-card');
    
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                animateOnScroll.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
        animateOnScroll.observe(element);
    });
}

// Lazy loading
function initializeLazyLoading() {
    const lazyImageConfig = {
        root: null,
        rootMargin: '50px 0px',
        threshold: 0.01
    };

    const lazyContentConfig = {
        root: null,
        rootMargin: '100px 0px',
        threshold: 0.1
    };

    // Lazy loading des images
    const lazyImages = document.querySelectorAll('img[data-lazy-src]');
    if (lazyImages.length > 0 && 'IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const tempImg = new Image();
                    tempImg.onload = () => {
                        img.src = img.dataset.lazySrc;
                        if (img.dataset.lazySrcset) {
                            img.srcset = img.dataset.lazySrcset;
                        }
                        img.classList.add('lazy-loaded');
                        img.removeAttribute('data-lazy-src');
                        img.removeAttribute('data-lazy-srcset');
                    };
                    tempImg.src = img.dataset.lazySrc;
                    observer.unobserve(img);
                }
            });
        }, lazyImageConfig);

        lazyImages.forEach(img => {
            img.classList.add('lazy-loading');
            lazyImageObserver.observe(img);
        });
    }

    // Lazy loading des backgrounds
    const lazyBgElements = document.querySelectorAll('[data-lazy-bg]');
    if (lazyBgElements.length > 0 && 'IntersectionObserver' in window) {
        const lazyBgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const tempImg = new Image();
                    tempImg.onload = () => {
                        element.style.backgroundImage = `url(${element.dataset.lazyBg})`;
                        element.classList.add('lazy-bg-loaded');
                        element.removeAttribute('data-lazy-bg');
                    };
                    tempImg.src = element.dataset.lazyBg;
                    observer.unobserve(element);
                }
            });
        }, lazyContentConfig);

        lazyBgElements.forEach(element => {
            element.classList.add('lazy-bg-loading');
            lazyBgObserver.observe(element);
        });
    }

    // Lazy loading des iframes
    const lazyIframes = document.querySelectorAll('iframe[data-lazy-src]');
    if (lazyIframes.length > 0 && 'IntersectionObserver' in window) {
        const lazyIframeObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const iframe = entry.target;
                    iframe.src = iframe.dataset.lazySrc;
                    iframe.classList.add('lazy-loaded');
                    iframe.removeAttribute('data-lazy-src');
                    observer.unobserve(iframe);
                }
            });
        }, lazyContentConfig);

        lazyIframes.forEach(iframe => {
            iframe.classList.add('lazy-loading');
            lazyIframeObserver.observe(iframe);
        });
    }

    // Fallback pour les navigateurs sans IntersectionObserver
    if (!('IntersectionObserver' in window)) {
        lazyImages.forEach(img => {
            if (img.dataset.lazySrc) {
                img.src = img.dataset.lazySrc;
                if (img.dataset.lazySrcset) {
                    img.srcset = img.dataset.lazySrcset;
                }
                img.classList.add('lazy-loaded');
            }
        });

        lazyBgElements.forEach(element => {
            if (element.dataset.lazyBg) {
                element.style.backgroundImage = `url(${element.dataset.lazyBg})`;
                element.classList.add('lazy-bg-loaded');
            }
        });

        lazyIframes.forEach(iframe => {
            if (iframe.dataset.lazySrc) {
                iframe.src = iframe.dataset.lazySrc;
                iframe.classList.add('lazy-loaded');
            }
        });
    }
}

// Preload des images critiques
function preloadCriticalImages() {
    const criticalImages = [
        '/assets/images/og-image.webp',
        '/assets/images/apple-touch-icon.webp'
    ];

    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        link.type = src.endsWith('.webp') ? 'image/webp' : 'image/png';
        document.head.appendChild(link);
    });
}

// Fonction d'initialisation du quiz
function initQuiz() {
    const quizContainer = document.querySelector('.quiz-container');
    if (!quizContainer) return;
    
    // Attacher les événements aux boutons
    const nextBtn = quizContainer.querySelector('.quiz-btn-next');
    const prevBtn = quizContainer.querySelector('.quiz-btn-prev');
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextQuestion);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', previousQuestion);
    }
    
    // Démarrer le quiz
    startQuiz();
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM chargé, initialisation des composants...');

    // Initialiser les fonctions principales
    initSmoothScroll();
    initNavbarScroll();
    initStatsAnimation();
    initContactForm();
    initModalOutsideClick();
    initScrollAnimations();
    initPopupEvents(); // AJOUTÉ - Correction popup
    initQuiz(); // Initialiser le quiz
    showPopup();

    // Raccourcis clavier pour tester le popup (dev uniquement)
    document.addEventListener('keydown', function(e) {
        // Ctrl + P = forcer affichage popup
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            const success = forceShowPopup();
            if (success) {
                alert('Popup affichée ! Vérifiez en bas à droite.');
            }
        }
        // Ctrl + Shift + R = reset popup
        if (e.ctrlKey && e.key === 'R' && e.shiftKey) {
            e.preventDefault();
            resetPopup();
            alert('Popup reset! Elle devrait réapparaître après 5 secondes.');
        }
    });

    // Test automatique après 3 secondes pour déboguer
    setTimeout(() => {
        console.log('🔍 Test automatique du popup...');
        const popup = document.getElementById('popupCTA');
        if (popup) {
            console.log('✅ Élément popup trouvé:', popup);
            console.log('🎨 Styles actuels:', window.getComputedStyle(popup).display);
        } else {
            console.error('❌ Élément popup NON trouvé après 3 secondes!');
        }
    }, 3000);

    // Initialiser le menu mobile
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            toggleMobileMenu();
        });
    }

    // Fermer le menu mobile quand on clique sur un lien
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });

    // Initialiser le bouton WhatsApp gauche
    const whatsappButtonLeft = document.querySelector('.whatsapp-button-left');
    if (whatsappButtonLeft) {
        whatsappButtonLeft.addEventListener('click', function(e) {
            e.preventDefault();
            const phoneNumber = '33680356022';
            const message = encodeURIComponent('Bonjour, je souhaite des informations sur la formation METHODEA');
            window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
        });
    }

    // Initialiser le lazy loading
    initializeLazyLoading();
});

// Floating Action Button functionality
function toggleFabMenu() {
    const fabMenu = document.querySelector('.fab-menu');
    const fabIcon = document.querySelector('.fab-icon');
    const fabClose = document.querySelector('.fab-close');
    
    if (fabMenu && fabIcon && fabClose) {
        const isHidden = fabMenu.classList.contains('hidden');
        
        if (isHidden) {
            // Ouvrir le menu
            fabMenu.classList.remove('hidden');
            fabIcon.classList.add('hidden');
            fabClose.classList.remove('hidden');
        } else {
            // Fermer le menu
            fabMenu.classList.add('hidden');
            fabIcon.classList.remove('hidden');
            fabClose.classList.add('hidden');
        }
    }
}

// Fermer le menu FAB si on clique ailleurs
document.addEventListener('click', function(event) {
    const fabContainer = document.querySelector('.fab-container');
    if (fabContainer && !fabContainer.contains(event.target)) {
        const fabMenu = document.querySelector('.fab-menu');
        const fabIcon = document.querySelector('.fab-icon');
        const fabClose = document.querySelector('.fab-close');
        
        if (fabMenu && !fabMenu.classList.contains('hidden')) {
            fabMenu.classList.add('hidden');
            fabIcon.classList.remove('hidden');
            fabClose.classList.add('hidden');
        }
    }
});