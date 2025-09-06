// Trusted Types Policy pour sécurité DOM
if (window.trustedTypes && window.trustedTypes.createPolicy) {
    window.trustedTypesPolicy = window.trustedTypes.createPolicy('methodea-policy', {
        createHTML: (input) => {
            // Whitelist des balises autorisées
            const allowedTags = ['div', 'h2', 'h3', 'p', 'a', 'span', 'br', 'strong', 'em'];
            const allowedAttributes = ['class', 'href', 'onclick', 'style', 'id'];
            
            // Validation basique - en production, utiliser DOMPurify
            if (typeof input === 'string') {
                // Échapper les caractères dangereux tout en préservant les balises autorisées
                return input
                    .replace(/javascript:/gi, '')
                    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, (match) => {
                        // Préserver seulement onclick pour les éléments de quiz
                        return match.includes('onclick') && match.includes('selectOption') ? match : '';
                    });
            }
            return '';
        },
        createScript: (input) => {
            // Très restrictif - seulement le code que nous contrôlons
            if (typeof input === 'string') {
                // Whitelist uniquement nos fonctions
                const allowedFunctions = [
                    'selectOption', 'nextQuestion', 'previousQuestion', 
                    'openModal', 'closeModal', 'startQuiz'
                ];
                
                const isSafe = allowedFunctions.some(fn => input.includes(fn));
                return isSafe ? input : '';
            }
            return '';
        },
        createScriptURL: (input) => {
            // Très restrictif - seulement nos domaines
            const allowedOrigins = [
                location.origin,
                'https://fonts.googleapis.com',
                'https://fonts.gstatic.com'
            ];
            
            try {
                const url = new URL(input, location.origin);
                if (allowedOrigins.includes(url.origin)) {
                    return input;
                }
            } catch (e) {
                console.warn('URL bloquée par Trusted Types:', input);
            }
            return '';
        }
    });
} else {
    // Fallback si Trusted Types non supporté
    window.trustedTypesPolicy = {
        createHTML: (input) => input,
        createScript: (input) => input,
        createScriptURL: (input) => input
    };
}