// Chargement dynamique de la modale commune
document.addEventListener('DOMContentLoaded', function() {
    // Éviter de charger la modale plusieurs fois
    if (document.getElementById('consultationModal')) {
        return;
    }

    // Déterminer le chemin vers le fichier modal selon la page
    const isSubPage = window.location.pathname.includes('/pages/');
    const modalPath = isSubPage ? '../includes/modal.html' : './includes/modal.html';

    // Charger la modale
    fetch(modalPath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(html => {
            // Injecter la modale dans le body
            document.body.insertAdjacentHTML('beforeend', html);

            // Initialiser les événements de la modale après injection
            initModalEvents();
        })
        .catch(error => {
            console.error('Erreur lors du chargement de la modale:', error);
        });
});

function initModalEvents() {
    const modal = document.getElementById('consultationModal');
    const modalClose = document.querySelector('.modal-close');

    // Fermer la modale avec le bouton X
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Fermer la modale en cliquant en dehors
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Fermer la modale avec Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Fonctions pour ouvrir et fermer la modale (compatibles avec toutes les pages)
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

// Rendre les fonctions globalement accessibles
window.openModal = openModal;
window.closeModal = closeModal;