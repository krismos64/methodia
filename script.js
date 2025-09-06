/**
 * METHODEA - Script JavaScript principal
 * Gestion des interactions et animations du site
 */

/* ========================================
   Variables globales
   ======================================== */
let currentQuestion = 0;
let selectedAnswer = null;
let userAnswers = [];

/* ========================================
   Gestion du menu mobile
   ======================================== */
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

/* ========================================
   Gestion de la modal de consultation
   ======================================== */
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

/* ========================================
   Gestion du popup CTA
   ======================================== */
function closePopup() {
    const popup = document.getElementById('popupCTA');
    if (popup) {
        popup.classList.remove('active');
        localStorage.setItem('popupClosed', 'true');
    }
}

function showPopup() {
    const popup = document.getElementById('popupCTA');
    const popupClosed = localStorage.getItem('popupClosed');
    
    if (popup && popupClosed !== 'true') {
        setTimeout(() => {
            popup.classList.add('active');
        }, 15000); // Afficher après 15 secondes
    }
}

/* ========================================
   Quiz interactif
   ======================================== */
const quizData = [
    {
        question: "Qu'est-ce qu'une hypothèse de recherche ?",
        options: [
            "Une question de recherche",
            "Une affirmation provisoire testable",
            "Une conclusion définitive",
            "Un résumé de la recherche"
        ],
        correct: 1
    },
    {
        question: "Quelle est la différence entre recherche qualitative et quantitative ?",
        options: [
            "Il n'y a pas de différence",
            "La qualitative utilise des chiffres, la quantitative des mots",
            "La qualitative explore en profondeur, la quantitative mesure",
            "La quantitative est plus scientifique"
        ],
        correct: 2
    },
    {
        question: "Qu'est-ce qu'une revue de littérature ?",
        options: [
            "Un magazine scientifique",
            "Une analyse critique des travaux existants",
            "Un résumé de votre recherche",
            "Une bibliographie"
        ],
        correct: 1
    },
    {
        question: "Qu'est-ce que l'échantillonnage en recherche ?",
        options: [
            "La collecte de données",
            "La sélection d'un sous-groupe représentatif",
            "L'analyse statistique",
            "La rédaction du mémoire"
        ],
        correct: 1
    },
    {
        question: "Comment éviter le plagiat ?",
        options: [
            "Paraphraser sans citer",
            "Utiliser l'IA pour réécrire",
            "Citer toutes les sources utilisées",
            "Copier moins de 10% du texte"
        ],
        correct: 2
    }
];

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
                ${question.options.map((option, index) => `
                    <div class="quiz-option" onclick="selectedAnswer = ${index}; selectOption(this, ${currentQuestion}, ${index})">
                        ${option}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    const questionContainer = container.querySelector('.quiz-question-container');
    if (questionContainer) {
        questionContainer.innerHTML = questionHTML;
    }
    
    // Gérer l'affichage des boutons
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
    // Retirer la sélection précédente
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Ajouter la sélection actuelle
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
            <p style="font-size: 1.3rem; color: #475569; margin-bottom: 1rem;">
                Vous avez répondu correctement à ${score} questions sur ${quizData.length}
            </p>
            ${percentage < 50 ? 
                `<p style="color: #f97316; margin-bottom: 2rem;">Vous avez besoin d'un accompagnement complet. Notre formation METHODEA est faite pour vous !</p>` :
                percentage < 80 ?
                `<p style="color: #14b8a6; margin-bottom: 2rem;">Bon niveau ! Notre formation vous aidera à maîtriser les subtilités de la recherche académique.</p>` :
                `<p style="color: #10b981; margin-bottom: 2rem;">Excellent ! Vous avez de solides bases. Notre formation Excellence vous permettra d'atteindre l'expertise.</p>`
            }
            <a href="#" class="btn-primary" onclick="openModal()" style="margin: 0 auto;">Obtenir mon programme personnalisé</a>
        </div>
    `;
}

/* ========================================
   Animation de défilement et navigation
   ======================================== */
function initSmoothScroll() {
    // Navigation smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('onclick')) return;
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                closeMobileMenu();
            }
        });
    });
}

/* ========================================
   Animation de la navbar au scroll
   ======================================== */
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

/* ========================================
   Animation des statistiques
   ======================================== */
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start) + '+';
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
                    const value = parseInt(stat.textContent);
                    if (!isNaN(value)) {
                        animateValue(stat, 0, value, 2000);
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

/* ========================================
   Gestion du formulaire de contact
   ======================================== */
function initContactForm() {
    const form = document.querySelector('.modal-content form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupération des données du formulaire
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Ici, vous pouvez ajouter l'envoi des données à votre backend
            console.log('Formulaire soumis:', data);
            
            // Message de confirmation
            alert('Merci pour votre demande ! Un enseignant-chercheur vous contactera dans les 24h.');
            
            // Fermer la modal
            closeModal();
            
            // Réinitialiser le formulaire
            form.reset();
        });
    }
}

/* ========================================
   Fermeture de la modal au clic extérieur
   ======================================== */
function initModalOutsideClick() {
    window.onclick = function(event) {
        const modal = document.getElementById('consultationModal');
        if (event.target == modal) {
            closeModal();
        }
    };
}

/* ========================================
   Animation d'apparition des éléments
   ======================================== */
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

/* ========================================
   Système de Lazy Loading moderne
   ======================================== */
function initializeLazyLoading() {
    // Configuration du lazy loading pour les images
    const lazyImageConfig = {
        root: null,
        rootMargin: '50px 0px', // Charger 50px avant que l'élément soit visible
        threshold: 0.01
    };
    
    // Configuration pour les images de fond et contenu lourd
    const lazyContentConfig = {
        root: null,
        rootMargin: '100px 0px',
        threshold: 0.1
    };

    // Lazy loading pour les images <img>
    const lazyImages = document.querySelectorAll('img[data-lazy-src]');
    if (lazyImages.length > 0 && 'IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Créer une image temporaire pour précharger
                    const tempImg = new Image();
                    tempImg.onload = () => {
                        // Une fois l'image chargée, l'afficher avec animation
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
            // Ajouter classe pour animation CSS
            img.classList.add('lazy-loading');
            lazyImageObserver.observe(img);
        });
    }

    // Lazy loading pour les images de fond CSS
    const lazyBgElements = document.querySelectorAll('[data-lazy-bg]');
    if (lazyBgElements.length > 0 && 'IntersectionObserver' in window) {
        const lazyBgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // Créer une image temporaire pour précharger
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

    // Lazy loading pour les iframes (vidéos YouTube, cartes)
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

    // Fallback pour navigateurs anciens (sans Intersection Observer)
    if (!('IntersectionObserver' in window)) {
        console.warn('IntersectionObserver non supporté - Fallback lazy loading');
        
        // Charger toutes les images immédiatement pour compatibilité
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

    console.log('✅ Lazy Loading initialisé - Images:', lazyImages.length, 'Backgrounds:', lazyBgElements.length, 'Iframes:', lazyIframes.length);
}

// Fonction utilitaire pour précharger des images critiques
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
    
    console.log('✅ Images critiques préchargées:', criticalImages.length);
}

/* ========================================
   Initialisation au chargement de la page
   ======================================== */
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser toutes les fonctionnalités
    initSmoothScroll();
    initNavbarScroll();
    initStatsAnimation();
    initContactForm();
    initModalOutsideClick();
    initScrollAnimations();
    
    // Afficher le popup après un délai
    showPopup();
    
    // Initialiser le quiz si présent
    const quizContainer = document.querySelector('.quiz-container');
    if (quizContainer && quizContainer.querySelector('.quiz-question-container')) {
        startQuiz();
    }
    
    // Gérer les clics sur WhatsApp
    const whatsappButton = document.querySelector('.whatsapp-fab');
    if (whatsappButton) {
        whatsappButton.addEventListener('click', function(e) {
            e.preventDefault();
            const phoneNumber = '33612345678'; // Remplacer par le vrai numéro
            const message = encodeURIComponent('Bonjour, je souhaite des informations sur la formation METHODEA');
            window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
        });
    }
    
    // Initialiser le lazy loading
    initializeLazyLoading();
    
    console.log('METHODEA - Site chargé avec succès');
});