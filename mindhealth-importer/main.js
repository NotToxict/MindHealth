import { db } from './firebase-config.js'; 
import { getDisorders, getStatistics } from './firestore-service.js';
import { populateDisorderSelector, updateDisorderInfo } from './ui-disorders.js';
import { initDashboard } from './ui-dashboard.js';
import { initMexicoMap } from './ui-map.js';

const App = {
    init() {
        console.log("MindHealth App inicializada.");
        this.setupEventListeners();
        this.setupIntersectionObservers();
        this.loadData();
    },

    setupEventListeners() {
        this.setupMobileMenu();
        this.setupThemeToggle(); 
        this.setupBackToTopButton();
    },
    
    setupMobileMenu() {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuIcon = document.getElementById('mobile-menu-icon');

        if (mobileMenuButton && mobileMenu && mobileMenuIcon) {
            mobileMenuButton.addEventListener('click', () => {
                const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
                mobileMenu.classList.toggle('open');
                mobileMenuIcon.classList.toggle('fa-bars');
                mobileMenuIcon.classList.toggle('fa-times');
                mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
            });
            mobileMenu.addEventListener('click', (e) => {
                if (e.target.matches('.mobile-nav-link')) {
                    mobileMenu.classList.remove('open');
                    mobileMenuIcon.classList.add('fa-bars');
                    mobileMenuIcon.classList.remove('fa-times');
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                }
            });
        }
    },

    setupThemeToggle() {
        const themeToggles = [document.getElementById('theme-toggle'), document.getElementById('theme-toggle-mobile')];
        const html = document.documentElement;
        
        const applyTheme = (isDark) => {
            html.classList.toggle('dark', isDark);
            themeToggles.forEach(toggle => {
                if(toggle) {
                    const sunIcon = toggle.querySelector('.fa-sun');
                    const moonIcon = toggle.querySelector('.fa-moon');
                    if (sunIcon) sunIcon.classList.toggle('hidden', isDark);
                    if (moonIcon) moonIcon.classList.toggle('hidden', !isDark);
                }
            });
        };

        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark);

        themeToggles.forEach(toggle => {
            if(toggle) {
                toggle.addEventListener('click', () => {
                    applyTheme(!html.classList.contains('dark'));
                });
            }
        });
    },

    setupBackToTopButton() {
        const backToTopButton = document.getElementById('back-to-top');
        if (backToTopButton) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 400) {
                    backToTopButton.classList.add('show');
                } else {
                    backToTopButton.classList.remove('show');
                }
            });
            backToTopButton.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    },

    setupIntersectionObservers() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section');
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    const activeLinkSelector = `.nav-link[href="#${id}"]`;
                    navLinks.forEach(link => link.classList.remove('active'));
                    document.querySelector(activeLinkSelector)?.classList.add('active');
                }
            });
        }, { rootMargin: '-40% 0px -60% 0px' });
        sections.forEach(section => navObserver.observe(section));

        const revealElements = document.querySelectorAll('.reveal');
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        revealElements.forEach(el => revealObserver.observe(el));
    },

    async loadData() {
        try {
            console.log("Intentando cargar estadísticas..."); // DEBUG: Inicio de carga de datos
            const stats = await getStatistics(db); // Se asume que esto obtiene los datos de Firebase/Firestore
            if (stats) {
                console.log("Estadísticas cargadas exitosamente:", stats); // DEBUG: Muestra los datos cargados
                initDashboard(stats);
                initMexicoMap(stats);
                this.showContent('dashboard');
            } else {
                console.error("ERROR: getStatistics no retornó datos."); // DEBUG: Error si no hay datos de getStatistics
                this.showError('dashboard', 'No se encontraron las estadísticas.');
            }
        } catch (error) {
            console.error("ERROR CRÍTICO: Error al cargar estadísticas:", error); // DEBUG: Error si hay fallo en la carga
            this.showError('dashboard', `No se pudieron cargar los datos del dashboard. Error: ${error.message || error}`);
        }

        try {
            console.log("Intentando cargar trastornos...");
            const disorders = await getDisorders(db);
            if (disorders && disorders.length > 0) {
                console.log("Trastornos cargados exitosamente:", disorders);
                populateDisorderSelector(disorders);
                const disorderSelectElement = document.getElementById('disorder-select');
                if (disorderSelectElement) {
                    updateDisorderInfo(disorders.find(d => d.id === disorderSelectElement.value) || disorders[0]);
                    disorderSelectElement.addEventListener('change', (e) => {
                        const selectedDisorder = disorders.find(d => d.id === e.target.value);
                        updateDisorderInfo(selectedDisorder);
                    });
                }
                this.showContent('disorder-info');
            } else {
                console.warn("ADVERTENCIA: No se encontraron trastornos.");
                this.showError('disorder-info', 'No se encontraron trastornos.');
            }
        } catch (error) {
            console.error("ERROR CRÍTICO: Error al cargar trastornos:", error);
            this.showError('disorder-info', `No se pudieron cargar los datos de trastornos. Error: ${error.message || error}`);
        }
    },

    showContent(sectionId) {
        const wrapper = document.getElementById(`${sectionId}-wrapper`);
        if (wrapper) {
            setTimeout(() => wrapper.classList.remove('is-loading'), 500);
        } else {
            console.warn(`ADVERTENCIA: Wrapper con ID ${sectionId}-wrapper no encontrado.`);
        }
    },
    showError(sectionId, message) {
        const loader = document.getElementById(`${sectionId}-loader`);
        if (loader) {
            loader.innerHTML = `<p class="text-red-500 font-semibold text-center">${message}</p>`;
            loader.classList.remove('hidden');
            loader.style.display = 'flex'; // Asegura que el loader se muestre
        } else {
            console.error(`ERROR: Loader para la sección ${sectionId} no encontrado. Mensaje: ${message}`);
        }
        const payload = document.getElementById(`${sectionId}-content`);
        if(payload) payload.classList.add('hidden'); // Oculta el contenido si hay error
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});