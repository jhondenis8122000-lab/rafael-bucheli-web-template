// ============================================
// CHATBOT - VERSIÓN COMPLETA CON WEB3FORMS
// (paleta #1F2365, sin emojis duplicados, tamaño reducido)
// ============================================

// Configuración global
window.CHATBOT_CONFIG = {
    whatsappNumber: '593995549605',
    institutionName: 'Institución Educativa Rafael Bucheli',
    logoPath: '',
    baseUrl: '',
    version: '1.0.0',
    web3formsKey: '814d1db1-ce19-48fb-b395-910b5a947ae1'
};

// Detectar rutas base automáticamente
(function detectBasePaths() {
    const scripts = document.getElementsByTagName('script');
    let currentScript = null;
    for (let script of scripts) {
        if (script.src.includes('CHATBOT.js')) {
            currentScript = script;
            break;
        }
    }
    if (currentScript) {
        const scriptPath = currentScript.src;
        const pathParts = scriptPath.split('/');
        pathParts.pop();
        window.CHATBOT_CONFIG.baseUrl = pathParts.join('/') + '/';
        window.CHATBOT_CONFIG.logoPath = window.CHATBOT_CONFIG.baseUrl + 'logo-institucion.png';
    } else {
        window.CHATBOT_CONFIG.baseUrl = 'theme/CHATBOT/';
        window.CHATBOT_CONFIG.logoPath = 'theme/CHATBOT/logo-institucion.png';
    }
    console.log('✅ Chatbot configurado con ruta:', window.CHATBOT_CONFIG.baseUrl);
})();

// Variables globales
let mainFloatingBtn, floatingMenu, mainTooltip, chatbotFloatingBtn, formFloatingBtn;
let whatsappBtn, chatbotWindow, messages, leadForm, inputArea, userInput;
let nameInput, typingIndicator, statusText, formWindow, overlay;
let isMenuOpen = false;
let userName = "";
let tooltipTimeout;
let isChatMinimized = false;
let unreadMessages = 0;
let chatHistory = [];
let isInitialized = false;

// Inicialización
window.initChatbot = function(config = {}) {
    if (isInitialized) {
        console.log('⚠️ Chatbot ya inicializado');
        return;
    }
    const settings = { ...window.CHATBOT_CONFIG, ...config };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => initializeDOM(settings));
    } else {
        initializeDOM(settings);
    }
};

function initializeDOM(settings) {
    assignDOMElements();
    if (!mainFloatingBtn) {
        createChatbotElements(settings);
        assignDOMElements();
    }
    setupChatbot();
}

function assignDOMElements() {
    mainFloatingBtn = document.getElementById("main-floating-btn");
    floatingMenu = document.getElementById("floating-menu");
    mainTooltip = document.querySelector(".main-tooltip");
    chatbotFloatingBtn = document.getElementById("chatbot-floating-btn");
    formFloatingBtn = document.getElementById("form-floating-btn");
    whatsappBtn = document.querySelector(".whatsapp-btn");
    chatbotWindow = document.getElementById("chatbot-window");
    messages = document.getElementById("chatbot-messages");
    leadForm = document.getElementById("lead-form");
    inputArea = document.getElementById("chatbot-input-area");
    userInput = document.getElementById("user-input");
    nameInput = document.getElementById("user-name");
    typingIndicator = document.getElementById("typing-indicator");
    statusText = document.getElementById("status-text");
    formWindow = document.getElementById("form-window");
    overlay = document.getElementById("chatbot-overlay");
}

function createChatbotElements(settings) {
    if (document.getElementById('main-floating-btn')) return;
    const chatbotHTML = `
        <div id="chatbot-overlay" class="chatbot-overlay"></div>
        <div id="main-floating-btn" class="main-floating-btn pulse">
            <i class="fas fa-plus"></i>
            <span class="main-tooltip">¡Haz clic para ver opciones!</span>
        </div>
        <div id="floating-menu" class="floating-menu">
            <a href="https://wa.me/${settings.whatsappNumber}" target="_blank" class="floating-btn secondary-btn whatsapp-btn">
                <i class="fab fa-whatsapp"></i>
                <span class="btn-tooltip">WhatsApp Directo</span>
            </a>
            <div id="form-floating-btn" class="floating-btn secondary-btn form-btn">
                <i class="fas fa-file-alt"></i>
                <span class="btn-tooltip">Enviar Formulario</span>
            </div>
            <div id="chatbot-floating-btn" class="floating-btn secondary-btn chatbot-btn">
                <i class="fas fa-comment"></i>
                <span class="btn-tooltip">Asistente Virtual</span>
            </div>
        </div>
        <div id="chatbot-window" class="chat-window">
            <div id="chatbot-header" class="window-header">
                <div class="header-info">
                    <img src="${settings.logoPath}" alt="Logo" class="header-logo" onerror="this.src='https://via.placeholder.com/40?text=Logo'">
                    <div class="header-text">
                        <b>Asistente ${settings.institutionName}</b>
                        <div class="status-container">
                            <span class="status-dot online" id="status-dot"></span>
                            <small id="status-text">En línea</small>
                        </div>
                    </div>
                </div>
                <div class="window-controls">
                    <button class="window-btn minimize-btn" id="minimize-chat-btn"><i class="fas fa-window-minimize"></i></button>
                    <button class="window-btn close-btn" id="close-chat-btn"><i class="fas fa-times"></i></button>
                </div>
            </div>
            <div id="lead-form">
                <div class="welcome-icon">🤖</div>
                <h3>¡Bienvenido!</h3>
                <p>Para brindarte una atención personalizada, por favor dinos tu nombre:</p>
                <input type="text" id="user-name" class="interactive-input" placeholder="Escribe tu nombre completo..." autocomplete="off">
                <button id="start-btn" class="submit-btn"><i class="fas fa-comments"></i> Empezar conversación</button>
                <p class="privacy-note"><i class="fas fa-shield-alt"></i> Tu información es confidencial</p>
            </div>
            <div id="chatbot-messages" style="display:none;"></div>
            <div id="typing-indicator" class="typing" style="display:none;"><span></span><span></span><span></span></div>
            <div id="chatbot-input-area" style="display:none;">
                <input type="text" id="user-input" placeholder="Escribe tu duda aquí...">
                <button id="send-btn"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
        <div id="form-window" class="form-window">
            <div class="window-header form-header">
                <div class="header-title"><i class="fas fa-file-alt"></i> <b>Formulario de Contacto</b></div>
                <div class="window-controls">
                    <button class="window-btn close-btn" id="close-form-btn"><i class="fas fa-times"></i></button>
                </div>
            </div>
            <form id="floating-form">
                <input type="hidden" name="access_key" value="${settings.web3formsKey}">
                <input type="hidden" name="_subject" value="Nuevo Mensaje de Contacto - Rafael Bucheli">
                <div class="form-content">
                    <p class="form-instruction"><i class="fas fa-info-circle"></i> Completa tus datos y te responderemos por correo en menos de 24 horas.</p>
                    <div id="floatingFormMessage" style="display: none; margin-bottom: 15px; padding: 10px; border-radius: 8px; text-align: center;"></div>
                    <div class="input-with-icon"><i class="fas fa-user"></i><input type="text" name="Nombre" class="interactive-input" placeholder="Nombre completo" required></div>
                    <div class="input-with-icon"><i class="fas fa-envelope"></i><input type="email" name="Correo" class="interactive-input" placeholder="Correo electrónico" required></div>
                    <div class="input-with-icon"><i class="fas fa-phone"></i><input type="tel" name="Telefono" class="interactive-input" placeholder="Teléfono / WhatsApp" required></div>
                    <div class="input-with-icon"><i class="fas fa-edit"></i><textarea name="Mensaje" class="interactive-input textarea-input" placeholder="¿En qué podemos ayudarte?" required></textarea></div>
                    <div class="h-captcha" data-captcha="true"></div>
                    <div class="form-buttons">
                        <button type="submit" class="submit-btn" id="floatingSubmitBtn"><i class="fas fa-paper-plane"></i> Enviar Formulario</button>
                        <button type="button" id="cancel-form-btn" class="cancel-btn"><i class="fas fa-times"></i></button>
                    </div>
                    <p class="privacy-note"><i class="fas fa-lock"></i> Tus datos están protegidos</p>
                </div>
            </form>
        </div>
    `;
    const container = document.createElement('div');
    container.id = 'chatbot-container';
    container.innerHTML = chatbotHTML;
    document.body.appendChild(container);
    loadWeb3FormsCaptcha();
}

function setupChatbot() {
    assignDOMElements();
    if (!mainFloatingBtn || !floatingMenu) {
        console.error('❌ No se encontraron los elementos del chatbot');
        return;
    }
    exposeGlobalFunctions();
    setupEventListeners();
    setupFloatingFormFetch();
    setTimeout(() => showMainTooltip(), 1000);
    updateConnectionStatus();
    setInterval(updateConnectionStatus, 30000);
    addDynamicStyles();
    isInitialized = true;
    console.log('✅ Chatbot inicializado correctamente');
}

function exposeGlobalFunctions() {
    window.toggleFloatingMenu = toggleFloatingMenu;
    window.closeChatWindow = closeAllWindows;
    window.closeForm = closeAllWindows;
    window.toggleMinimizeChat = toggleMinimizeChat;
    window.startChat = startChat;
    window.initMenu = initMenu;
    window.selectOption = selectOption;
    window.sendCustomMessage = sendCustomMessage;
    window.contactAdvisor = contactAdvisor;
    window.contactAdvisorDirect = contactAdvisorDirect;
    window.openGoogleMaps = openGoogleMaps;
    window.showMoreContactOptions = showMoreContactOptions;
    window.showCallOptions = showCallOptions;
    window.openContactForm = openContactForm;
    window.submitEmailForm = submitEmailForm;
    window.submitEmailForm2 = submitEmailForm2;
    window.showMoreOptions = showMoreOptions;
    window.openContactFormWithMessage = openContactFormWithMessage;
    window.redirectToWhatsAppWithMessage = redirectToWhatsAppWithMessage;
    window.cleanOptions = cleanOptions;
}

function setupEventListeners() {
    if (mainFloatingBtn) {
        mainFloatingBtn.addEventListener("click", () => {
            if (isWindowOpen()) {
                closeAllWindows();
                return;
            }
            toggleFloatingMenu();
        });
    }
    if (chatbotFloatingBtn) {
        chatbotFloatingBtn.addEventListener("click", () => openWindow(chatbotWindow));
    }
    if (formFloatingBtn) {
        formFloatingBtn.addEventListener("click", () => openWindow(formWindow));
    }
    if (whatsappBtn) whatsappBtn.addEventListener("click", toggleFloatingMenu);
    document.getElementById('close-chat-btn')?.addEventListener('click', closeAllWindows);
    document.getElementById('close-form-btn')?.addEventListener('click', closeAllWindows);
    document.getElementById('cancel-form-btn')?.addEventListener('click', closeAllWindows);
    document.getElementById('minimize-chat-btn')?.addEventListener('click', toggleMinimizeChat);
    if (overlay) overlay.addEventListener('click', closeAllWindows);
    document.getElementById('start-btn')?.addEventListener('click', startChat);
    if (nameInput) nameInput.addEventListener("keydown", (e) => { if (e.key === "Enter") startChat(); });
    document.getElementById('send-btn')?.addEventListener('click', sendCustomMessage);
    if (userInput) userInput.addEventListener("keydown", (e) => { if (e.key === "Enter") sendCustomMessage(); });
    setupTooltips();
}

function openWindow(win) {
    closeAllWindows();
    win.style.display = 'flex';
    overlay.classList.add('active');
    floatingMenu.classList.remove('active');
    mainFloatingBtn.classList.add('active');
    isMenuOpen = false;
    hideMainTooltip();
}

function closeAllWindows() {
    if (chatbotWindow) {
        chatbotWindow.style.display = 'none';
        if (isChatMinimized) {
            chatbotWindow.classList.remove('minimized');
            isChatMinimized = false;
            const btn = document.getElementById('minimize-chat-btn');
            if (btn) btn.innerHTML = '<i class="fas fa-window-minimize"></i>';
        }
    }
    if (formWindow) formWindow.style.display = 'none';
    if (overlay) overlay.classList.remove('active');
    mainFloatingBtn.classList.remove('active');
    showMainTooltip();
}

function isWindowOpen() {
    return (chatbotWindow && chatbotWindow.style.display === 'flex') || (formWindow && formWindow.style.display === 'flex');
}

// ========== FORMULARIO FLOTANTE CON FETCH ==========
function setupFloatingFormFetch() {
    const floatingForm = document.getElementById('floating-form');
    if (!floatingForm) return;
    
    floatingForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(floatingForm);
        const data = {};
        formData.forEach((value, key) => { data[key] = value; });
        
        if (!data.Nombre || !data.Correo) {
            showFloatingFormMessage('Por favor complete nombre y correo electrónico', 'error');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.Correo)) {
            showFloatingFormMessage('Por favor ingrese un correo electrónico válido', 'error');
            return;
        }
        if (!data['h-captcha-response']) {
            showFloatingFormMessage('Por favor complete la verificación de seguridad', 'error');
            return;
        }
        
        const submitBtn = document.getElementById('floatingSubmitBtn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            
            if (result.success) {
                showFloatingFormMessage('¡Mensaje enviado exitosamente! Te responderemos en menos de 24 horas.', 'success');
                floatingForm.reset();
                if (window.hcaptcha) window.hcaptcha.reset();
                setTimeout(() => {
                    closeAllWindows();
                }, 3000);
            } else {
                showFloatingFormMessage('Error al enviar: ' + (result.message || 'Intente más tarde'), 'error');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            showFloatingFormMessage('Error de conexión. Revise su internet e intente nuevamente.', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

function showFloatingFormMessage(msg, type) {
    const msgDiv = document.getElementById('floatingFormMessage');
    if (!msgDiv) return;
    const icon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle';
    msgDiv.style.display = 'block';
    msgDiv.textContent = '';
    const iconEl = document.createElement('i');
    iconEl.className = icon;
    iconEl.setAttribute('aria-hidden', 'true');
    msgDiv.appendChild(iconEl);
    msgDiv.appendChild(document.createTextNode(' ' + msg));
    msgDiv.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
    msgDiv.style.color = type === 'success' ? '#155724' : '#721c24';
    msgDiv.style.border = type === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6cb';
    
    setTimeout(() => {
        if (msgDiv) msgDiv.style.display = 'none';
    }, 5000);
}

function loadWeb3FormsCaptcha() {
    if (document.querySelector('script[src*="web3forms.com/client/script.js"]')) return;
    const script = document.createElement('script');
    script.src = 'https://web3forms.com/client/script.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
}

// ========== FUNCIONES DE CHAT ==========
function toggleFloatingMenu() {
    if (!floatingMenu || !mainFloatingBtn) return;
    if (isMenuOpen) {
        floatingMenu.classList.remove("active");
        mainFloatingBtn.classList.remove("active");
        isMenuOpen = false;
        if (!isWindowOpen()) showMainTooltip();
    } else {
        floatingMenu.classList.add("active");
        mainFloatingBtn.classList.add("active");
        isMenuOpen = true;
        hideMainTooltip();
        showButtonNotifications();
    }
}

function toggleMinimizeChat() {
    if (!chatbotWindow || !messages || !inputArea) return;
    if (isChatMinimized) {
        chatbotWindow.classList.remove('minimized');
        messages.style.display = '';
        inputArea.style.display = '';
        const minimizeBtnEl = document.getElementById('minimize-chat-btn');
        if (minimizeBtnEl) minimizeBtnEl.innerHTML = '<i class="fas fa-window-minimize"></i>';
        clearMessageBadge();
        setTimeout(() => {
            if (messages) messages.scrollTop = messages.scrollHeight;
        }, 50);
    } else {
        chatbotWindow.classList.add('minimized');
        const minimizeBtnEl = document.getElementById('minimize-chat-btn');
        if (minimizeBtnEl) minimizeBtnEl.innerHTML = '<i class="fas fa-window-restore"></i>';
    }
    isChatMinimized = !isChatMinimized;
}

function showTyping(callback) {
    if (!statusText || !typingIndicator || !messages) return;
    statusText.innerText = "escribiendo...";
    statusText.style.fontStyle = "italic";
    typingIndicator.style.display = "flex";
    messages.scrollTop = messages.scrollHeight;
    setTimeout(() => {
        typingIndicator.style.display = "none";
        statusText.innerText = "En línea";
        statusText.style.fontStyle = "normal";
        if (callback) callback();
    }, 1200);
}

function startChat() {
    if (!nameInput || !leadForm || !messages || !inputArea) return;
    if (nameInput.value.trim().length < 3) {
        nameInput.style.borderColor = "#ff4757";
        nameInput.classList.add('shake');
        setTimeout(() => nameInput.classList.remove('shake'), 500);
        return;
    }
    userName = nameInput.value.trim();
    leadForm.style.display = "none";
    messages.style.display = "flex";
    inputArea.style.display = "flex";
    initMenu();
}

function initMenu() {
    if (!messages) return;
    showTyping(() => {
        const menuHTML = `
            <div class="bot-message">
                ¡Hola <b>${userName}</b>! 👋<br>
                Soy el asistente virtual de la <b>U.E Rafael Bucheli</b>.
                ¿En qué puedo ayudarte hoy?
                <div style="font-size: 12px; color: #666; margin-top: 10px;">
                    <i class="fas fa-info-circle"></i> Selecciona una opción:
                </div>
            </div>
            <div class="options">
                <button style="animation-delay: 0.1s" onclick="window.selectOption('academica')">
                    <i class="fas fa-graduation-cap"></i> Oferta Académica
                </button>
                <button style="animation-delay: 0.2s" onclick="window.selectOption('admisiones')">
                    <i class="fas fa-file-invoice-dollar"></i> Admisiones y Costos
                </button>
                <button style="animation-delay: 0.3s" onclick="window.selectOption('h_atencion')">
                    <i class="fas fa-clock"></i> Horarios de Atención
                </button>
                <button style="animation-delay: 0.4s" onclick="window.selectOption('h_clases')">
                    <i class="fas fa-calendar-alt"></i> Horario de Clases
                </button>
                <button style="animation-delay: 0.5s" onclick="window.selectOption('ubicacion')">
                    <i class="fas fa-map-marker-alt"></i> Ubicación y Mapa
                </button>
                <button style="animation-delay: 0.6s" onclick="window.selectOption('asesor')">
                    <i class="fas fa-user-tie"></i> Hablar con Asesor
                </button>
            </div>
        `;
        messages.scrollTop = 0;
        messages.innerHTML = menuHTML;
        messages.scrollTop = 0;
        chatHistory.push({ type: 'bot', content: 'Menú principal' });
    });
}

function selectOption(option) {
    if (!messages) return;
    cleanOptions();
    let response = "", btnExtra = "";
    switch(option) {
        case 'academica':
            response = getAcademicOffer();
            btnExtra = getSectionButtons('academica');
            break;
        case 'admisiones':
            response = getAdmissionsInfo();
            btnExtra = getSectionButtons('admisiones');
            break;
        case 'h_atencion':
            response = getAttentionHours();
            btnExtra = getSectionButtons('h_atencion');
            break;
        case 'h_clases':
            response = getClassSchedule();
            btnExtra = getSectionButtons('h_clases');
            break;
        case 'ubicacion':
            response = getLocationInfo();
            btnExtra = getSectionButtons('ubicacion');
            break;
        case 'asesor':
            response = getAdvisorInfo();
            btnExtra = getAdvisorButtons();
            break;
    }
    showTyping(() => {
        messages.innerHTML += `<div class="bot-message">${response}</div>`;
        if(btnExtra) messages.innerHTML += btnExtra;
        messages.innerHTML += `<button class="back-btn" onclick="window.initMenu()"><i class="fas fa-arrow-left"></i> Volver al menú principal</button>`;
        messages.scrollTop = messages.scrollHeight;
        chatHistory.push({ type: 'bot', content: option });
    });
}

// ========== FUNCIONES DE CONTENIDO (COMPLETAS, ORIGINALES) ==========
function getAcademicOffer() {
    return `
        <div class="action-container">
            <div class="action-icon">🎓</div>
            <div class="action-title">Oferta Académica 2025-2026</div>
            <div class="action-description">
                Contamos con educación de calidad en todos los niveles, desde Inicial hasta Bachillerato.
            </div>
        </div>
        
        <b>📚 Niveles Educativos Disponibles:</b><br><br>
        
        <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 10px; padding: 12px; background: linear-gradient(135deg, #e3f2fd, #bbdefb); border-radius: 10px; border-left: 4px solid #2196f3;">
                <div style="background: #2196f3; color: white; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">1</div>
                <div>
                    <b style="color: #1976d2;">Educación Inicial</b><br>
                    <small>Desarrollo infantil integral (3-5 años)</small>
                </div>
            </div>
            
            <div style="display: flex; align-items: center; gap: 10px; padding: 12px; background: linear-gradient(135deg, #e8f5e9, #c8e6c9); border-radius: 10px; border-left: 4px solid #4CAF50;">
                <div style="background: #4CAF50; color: white; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">2</div>
                <div>
                    <b style="color: #388e3c;">Educación Básica</b><br>
                    <small>De 1ro a 7mo año (6-12 años)</small>
                </div>
            </div>
            
            <div style="display: flex; align-items: center; gap: 10px; padding: 12px; background: linear-gradient(135deg, #f3e5f5, #e1bee7); border-radius: 10px; border-left: 4px solid #9c27b0;">
                <div style="background: #9c27b0; color: white; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">3</div>
                <div>
                    <b style="color: #7b1fa2;">Bachillerato General Unificado</b><br>
                    <small>Preparación para la universidad (15-18 años)</small>
                </div>
            </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #fff8e1, #ffecb3); padding: 15px; border-radius: 10px; margin: 15px 0; border-left: 4px solid #ffc107;">
            <b><i class="fas fa-calendar-check" style="color: #ff9800;"></i> Periodo Lectivo 2025-2026:</b><br>
            • <b>Inscripciones:</b> Julio y agosto 2025<br>
            • <b>Inicio de clases:</b> Septiembre 2025<br>
            • <b>Fin de año lectivo:</b> Junio 2026
        </div>
    `;
}

function getAdmissionsInfo() {
    return `
        <div class="action-container">
            <div class="action-icon">💰</div>
            <div class="action-title">Admisiones 2025-2026</div>
            <div class="action-description">
                Información sobre cómo formar parte de nuestra institución educativa.
            </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #e3f2fd, #bbdefb); padding: 20px; border-radius: 15px; margin-bottom: 20px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 10px;">🏫</div>
            <b style="font-size: 18px; color: #1976d2;">¡Acércate a conocernos!</b><br>
            <p style="margin-top: 10px;">Te invitamos a visitar nuestras instalaciones y descubrir por qué somos la mejor opción para la educación de tus hijos.</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #fff8e1, #ffecb3); padding: 20px; border-radius: 15px; margin-bottom: 20px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 10px;">💚</div>
            <b style="font-size: 18px; color: #ff9800;">Educación de calidad a precios accesibles</b><br>
            <p style="margin-top: 10px;">En la Unidad Educativa Rafael Bucheli creemos que la educación de calidad debe estar al alcance de todos. Ofrecemos:</p>
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; margin-top: 15px;">
                <div style="background: white; padding: 10px; border-radius: 10px; width: 100px;">
                    <i class="fas fa-hand-holding-heart" style="color: #e91e63; font-size: 24px;"></i>
                    <div><small>Precios justos</small></div>
                </div>
                <div style="background: white; padding: 10px; border-radius: 10px; width: 100px;">
                    <i class="fas fa-star" style="color: #ffc107; font-size: 24px;"></i>
                    <div><small>Calidad garantizada</small></div>
                </div>
                <div style="background: white; padding: 10px; border-radius: 10px; width: 100px;">
                    <i class="fas fa-users" style="color: #4CAF50; font-size: 24px;"></i>
                    <div><small>Facilidades de pago</small></div>
                </div>
            </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #e8f5e9, #c8e6c9); padding: 20px; border-radius: 15px; margin: 20px 0;">
            <b><i class="fas fa-award" style="color: #4CAF50; font-size: 20px;"></i> Becas y Descuentos Disponibles:</b>
            <ul style="margin: 15px 0 5px 20px; line-height: 1.8;">
                <li><b>Becas por vulnerabilidad socioeconómica</b></li>
                <li><b>Becas deportivas y culturales</b></li>
                <li><b>Descuentos por hermanos</b></li>
                <li><b>Beca por excelencia académica</b></li>
            </ul>
            <div style="margin-top: 15px; padding: 10px; background: rgba(255,255,255,0.5); border-radius: 8px; font-style: italic;">
                <small><i class="fas fa-info-circle" style="color: #2e7d32;"></i> Los porcentajes y requisitos específicos de becas se entregan directamente en secretaría al momento de la solicitud, ya que cada caso es evaluado de manera personalizada.</small>
            </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #fce4ec, #f8bbd9); padding: 20px; border-radius: 15px; margin-top: 15px;">
            <b><i class="fas fa-calendar-check" style="color: #e91e63;"></i> Proceso de Admisión:</b>
            <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 15px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="background: #e91e63; color: white; width: 25px; height: 25px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px;">1</div>
                    <span>Visita la institución en horario de atención</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="background: #e91e63; color: white; width: 25px; height: 25px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px;">2</div>
                    <span>Solicita información personalizada en secretaría</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="background: #e91e63; color: white; width: 25px; height: 25px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px;">3</div>
                    <span>Conoce nuestras instalaciones y propuesta educativa</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="background: #e91e63; color: white; width: 25px; height: 25px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px;">4</div>
                    <span>Completa el proceso de inscripción con un asesor</span>
                </div>
            </div>
        </div>
    `;
}

function getAttentionHours() {
    return `
        <div class="action-container">
            <div class="action-icon">⏰</div>
            <div class="action-title">Horarios de Atención</div>
            <div class="action-description">
                Conoce nuestros horarios de atención al público y servicios.
            </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #e3f2fd, #bbdefb); padding: 15px; border-radius: 10px; margin-bottom: 15px;">
            <b><i class="fas fa-building" style="color: #2196f3;"></i> Atención General en Secretaría:</b><br>
            <div style="margin-left: 20px; margin-top: 8px;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                    <i class="far fa-calendar" style="color: #2196f3;"></i>
                    <b>Lunes a Viernes:</b>
                </div>
                <div style="margin-left: 30px; color: #1976d2; font-weight: bold;">
                    08:00 AM - 16:00 PM
                </div>
                <br>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-ban" style="color: #f44336;"></i>
                    <b>Cerrado:</b>
                </div>
                <div style="margin-left: 30px; color: #666;">
                    Sábados, Domingos y Feriados Nacionales
                </div>
            </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #fff8e1, #ffecb3); padding: 15px; border-radius: 10px;">
            <b><i class="fas fa-cash-register" style="color: #ff9800;"></i> Colecturía (Pagos):</b><br>
            <div style="display: flex; justify-content: space-between; margin-top: 15px; text-align: center;">
                <div>
                    <div style="background: linear-gradient(135deg, #ff9800, #f57c00); color: white; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; font-size: 20px;">
                        <i class="fas fa-sun"></i>
                    </div>
                    <small><b>Turno Mañana</b><br>08:00 - 12:00</small>
                </div>
                <div>
                    <div style="background: linear-gradient(135deg, #673ab7, #512da8); color: white; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; font-size: 20px;">
                        <i class="fas fa-moon"></i>
                    </div>
                    <small><b>Turno Tarde</b><br>14:00 - 16:00</small>
                </div>
            </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #fce4ec, #f8bbd9); padding: 12px; border-radius: 10px; margin-top: 15px;">
            <small><i class="fas fa-lightbulb" style="color: #e91e63;"></i> <b>Recomendación:</b><br>
            Para trámites extensos (inscripciones, becas), se sugiere acudir en la mañana para mayor disponibilidad.</small>
        </div>
    `;
}

function getClassSchedule() {
    return `
        <div class="action-container">
            <div class="action-icon">📚</div>
            <div class="action-title">Horario de Clases 2025-2026</div>
            <div class="action-description">
                Jornada académica y actividades estudiantiles.
            </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #e8f5e9, #c8e6c9); padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 15px;">
            <div style="font-size: 28px; color: #2e7d32; font-weight: bold; margin-bottom: 10px;">
                <i class="fas fa-clock"></i> 08:00 AM - 14:00 PM
            </div>
            <div style="margin-top: 10px; font-weight: bold; color: #1b5e20; font-size: 18px;">
                JORNADA MATUTINA ÚNICA
            </div>
            <div style="margin-top: 5px; color: #388e3c;">
                (Lunes a Viernes)
            </div>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 10px; margin: 15px 0;">
            <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: #f5f5f5; border-radius: 8px;">
                <div style="background: #ff9800; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-door-open"></i>
                </div>
                <div>
                    <b>Apertura de puertas:</b> 07:30 AM
                </div>
            </div>
            
            <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: #f5f5f5; border-radius: 8px;">
                <div style="background: #4CAF50; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-bell"></i>
                </div>
                <div>
                    <b>Ingreso máximo:</b> 08:00 AM
                </div>
            </div>
            
            <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: #f5f5f5; border-radius: 8px;">
                <div style="background: #2196f3; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-utensils"></i>
                </div>
                <div>
                    <b>Recreo:</b> 10:00 - 10:30 AM
                </div>
            </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #fff3e0, #ffe0b2); padding: 15px; border-radius: 10px; border-left: 4px solid #ff9800;">
            <b><i class="fas fa-exclamation-triangle" style="color: #ff9800;"></i> Normativas Importantes:</b><br>
            <ul style="margin: 10px 0 0 20px;">
                <li>Uniforme completo obligatorio</li>
                <li>Puntualidad estricta requerida</li>
                <li>Asistencia mínima del 80%</li>
                <li>Uso correcto del uniforme</li>
            </ul>
        </div>
    `;
}

function getLocationInfo() {
    return `
        <div class="action-container">
            <div class="action-icon">📍</div>
            <div class="action-title">Ubicación de la Institución</div>
            <div class="action-description">
                Encuéntranos en Chillogallo, Quito.
            </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #fff3e0, #ffe0b2); padding: 15px; border-radius: 10px; margin-bottom: 15px;">
            <div style="display: flex; align-items: flex-start; gap: 15px; margin-bottom: 15px;">
                <div style="background: linear-gradient(135deg, #ff9800, #f57c00); color: white; width: 45px; height: 45px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px;">
                    <i class="fas fa-map-pin"></i>
                </div>
                <div>
                    <b style="color: #e65100;">Dirección Exacta:</b><br>
                    <span style="font-size: 14px;">
                        Sector Chillogallo<br>
                        Av. Rumichaca Ñan y Morán Valverde<br>
                        Quito, Ecuador
                    </span>
                </div>
            </div>
            
            <div style="display: flex; align-items: flex-start; gap: 15px;">
                <div style="background: linear-gradient(135deg, #2196f3, #1976d2); color: white; width: 45px; height: 45px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px;">
                    <i class="fas fa-phone"></i>
                </div>
                <div>
                    <b style="color: #0d47a1;">Contacto Telefónico:</b><br>
                    <span style="font-size: 16px; font-weight: bold; color: #1565c0;">
                        (02) 123-4567
                    </span>
                </div>
            </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #e3f2fd, #bbdefb); padding: 15px; border-radius: 10px; margin-bottom: 15px;">
            <b><i class="fas fa-directions" style="color: #2196f3;"></i> ¿Cómo llegar?</b><br>
            <div style="margin-top: 10px;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <i class="fas fa-bus" style="color: #2196f3;"></i>
                    <span><b>Transporte público:</b> Rutas 15, 27, 33, 45</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <i class="fas fa-subway" style="color: #2196f3;"></i>
                    <span><b>Trolebús:</b> Estación Chillogallo Centro</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-car" style="color: #2196f3;"></i>
                    <span><b>En vehículo particular:</b> Avenida Mariscal Sucre</span>
                </div>
            </div>
        </div>
    `;
}

function getAdvisorInfo() {
    return `
        <div class="advisor-container">
            <div class="advisor-icon">👨‍🏫</div>
            <div class="advisor-title">Atención Personalizada con Asesor</div>
            <div class="advisor-description">
                Perfecto <b>${userName}</b>. Un asesor educativo especializado te atenderá personalmente para resolver todas tus dudas sobre inscripciones, becas, horarios y más.
            </div>
            
            <div style="background: linear-gradient(135deg, #e8f5e9, #c8e6c9); padding: 15px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #4CAF50;">
                <b><i class="fas fa-check-circle" style="color: #4CAF50;"></i> Ventajas de la asesoría personalizada:</b>
                <ul style="margin: 10px 0 0 20px;">
                    <li>Atención inmediata vía WhatsApp</li>
                    <li>Asesoría personalizada según tus necesidades</li>
                    <li>Resolución de dudas específicas en tiempo real</li>
                    <li>Proceso de inscripción guiado paso a paso</li>
                    <li>Información actualizada sobre becas y descuentos</li>
                    <li>Seguimiento continuo hasta tu inscripción</li>
                </ul>
            </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #fff3e0, #ffe0b2); padding: 15px; border-radius: 10px; margin: 15px 0; border-left: 4px solid #ff9800;">
            <b><i class="fas fa-clock" style="color: #ff9800;"></i> Tiempo de respuesta:</b><br>
            • WhatsApp: <b>Inmediato</b> (dentro del horario de atención)<br>
            • Correo electrónico: <b>24 horas hábiles</b><br>
            • Llamada programada: <b>En el horario acordado</b>
        </div>
    `;
}

// ========== BOTONES DE SECCIÓN (SIN EMOJIS DUPLICADOS) ==========
function getSectionButtons(section) {
    let sectionName = "";
    switch(section) {
        case 'academica':
            sectionName = "Oferta Académica";
            return `
                <button class="section-btn academic-section-btn" onclick="window.contactAdvisor('${sectionName}')">
                    <i class="fab fa-whatsapp"></i> Consultar sobre ${sectionName}
                </button>
                <button class="section-btn admission-section-btn" onclick="window.selectOption('admisiones')">
                    <i class="fas fa-file-invoice-dollar"></i> Ver información de admisión
                </button>
            `;
        case 'admisiones':
            sectionName = "Admisiones";
            return `
                <button class="section-btn admission-section-btn" onclick="window.contactAdvisor('${sectionName}')">
                    <i class="fab fa-whatsapp"></i> Consultar sobre ${sectionName}
                </button>
                <button class="section-btn academic-section-btn" onclick="window.selectOption('academica')">
                    <i class="fas fa-graduation-cap"></i> Ver oferta académica
                </button>
            `;
        case 'h_atencion':
            sectionName = "Horarios de Atención";
            return `
                <button class="section-btn schedule-section-btn" onclick="window.contactAdvisor('${sectionName}')">
                    <i class="fab fa-whatsapp"></i> Consultar ${sectionName}
                </button>
                <button class="section-btn location-section-btn" onclick="window.openGoogleMaps()">
                    <i class="fas fa-map-marked-alt"></i> Ver ubicación en mapa
                </button>
            `;
        case 'h_clases':
            sectionName = "Horario de Clases";
            return `
                <button class="section-btn schedule-section-btn" onclick="window.contactAdvisor('${sectionName}')">
                    <i class="fab fa-whatsapp"></i> Consultar sobre ${sectionName}
                </button>
                <button class="section-btn admission-section-btn" onclick="window.selectOption('admisiones')">
                    <i class="fas fa-file-signature"></i> Iniciar proceso de inscripción
                </button>
            `;
        case 'ubicacion':
            sectionName = "Ubicación";
            return `
                <button class="section-btn location-section-btn" onclick="window.openGoogleMaps()">
                    <i class="fas fa-map-marked-alt"></i> Abrir en Google Maps
                </button>
                <button class="section-btn schedule-section-btn" onclick="window.contactAdvisor('${sectionName}')">
                    <i class="fab fa-whatsapp"></i> Solicitar indicaciones detalladas
                </button>
            `;
        default:
            return '';
    }
}

function getAdvisorButtons() {
    return `
        <div class="advisor-buttons">
            <button class="advisor-primary-btn" onclick="window.contactAdvisorDirect()">
                <i class="fab fa-whatsapp"></i> Contactar con Asesor ahora
            </button>
            <button class="advisor-secondary-btn" onclick="window.showMoreContactOptions()">
                <i class="fas fa-ellipsis-h"></i> Más opciones de contacto
            </button>
        </div>
    `;
}

// ========== FUNCIONES DE CONTACTO (ORIGINALES) ==========
function contactAdvisor(topic) {
    if (!messages) return;
    const text = encodeURIComponent(`Hola, soy ${userName || 'un interesado'}. Necesito información sobre ${topic}. Me comunico desde el asistente virtual de la Institución Educativa Rafael Bucheli.`);
    const whatsappUrl = `https://wa.me/${window.CHATBOT_CONFIG.whatsappNumber}?text=${text}`;
    showTyping(() => {
        messages.innerHTML += `
            <div class="redirect-message">
                <i class="fas fa-external-link-alt" style="color: #ff9800;"></i>
                <b>¡Perfecto! Redireccionando a WhatsApp...</b><br>
                <small>Estás siendo conectado con un asesor especializado en <b>${topic}</b>.</small>
            </div>
            <div class="user-query">
                <i class="fas fa-user-circle"></i> <b>Consulta:</b> ${topic}
            </div>
        `;
        messages.scrollTop = messages.scrollHeight;
        const redirectMsg = document.createElement('div');
        redirectMsg.className = 'bot-message';
        redirectMsg.innerHTML = `<div style="display: flex; align-items: center; gap: 10px;"><i class="fas fa-spinner fa-spin" style="color: #2196f3;"></i><span>Preparando conexión con asesor educativo...</span></div>`;
        messages.appendChild(redirectMsg);
        setTimeout(() => {
            redirectMsg.innerHTML = `<div style="display: flex; align-items: center; gap: 10px;"><i class="fas fa-check-circle" style="color: #4CAF50;"></i><span><b>Conexión lista</b> - Redirigiendo a WhatsApp...</span></div>`;
            setTimeout(() => { window.open(whatsappUrl, '_blank'); }, 800);
        }, 1500);
        chatHistory.push({ type: 'action', content: `Redirigido a WhatsApp: ${topic}` });
    });
}

function contactAdvisorDirect() {
    if (!messages) return;
    const text = encodeURIComponent(`Hola, soy ${userName || 'un interesado'}. Me gustaría recibir asesoría personalizada sobre inscripciones, becas y procesos de admisión. Me comunico desde el asistente virtual de la Unidad Educativa Particular Rafael Bucheli.`);
    const whatsappUrl = `https://wa.me/${window.CHATBOT_CONFIG.whatsappNumber}?text=${text}`;
    showTyping(() => {
        messages.innerHTML += `
            <div class="redirect-message">
                <i class="fas fa-user-tie" style="color: #ff9800;"></i>
                <b>Conectando con asesor educativo...</b><br>
                <small>Serás atendido por un especialista en admisiones.</small>
            </div>
            <div style="background: linear-gradient(135deg, #e8f5e9, #c8e6c9); padding: 15px; border-radius: 10px; margin: 15px 0; border-left: 4px solid #4CAF50;">
                <b><i class="fas fa-info-circle" style="color: #4CAF50;"></i> Preparando tu consulta:</b><br>
                • Nombre: <b>${userName || 'Por confirmar'}</b><br>
                • Tipo de consulta: <b>Asesoría personalizada</b><br>
                • Canal: <b>WhatsApp Business</b>
            </div>
        `;
        messages.scrollTop = messages.scrollHeight;
        setTimeout(() => { window.open(whatsappUrl, '_blank'); }, 1200);
        chatHistory.push({ type: 'action', content: 'Contacto directo con asesor' });
    });
}

function openGoogleMaps() {
    if (!messages) return;
    const mapsUrl = 'https://maps.google.com/?q=Institución+Educativa+Rafael+Bucheli,+Av.+Rumichaca+Ñan+y+Morán+Valverde,+Chillogallo,+Quito,+Ecuador';
    showTyping(() => {
        messages.innerHTML += `
            <div class="redirect-message">
                <i class="fas fa-map-marked-alt" style="color: #ff9800;"></i>
                <b>Abriendo Google Maps...</b><br>
                <small>Mostrando ubicación exacta de la institución.</small>
            </div>
            <div style="background: linear-gradient(135deg, #e3f2fd, #bbdefb); padding: 15px; border-radius: 10px; margin: 15px 0; border-left: 4px solid #2196f3;">
                <b><i class="fas fa-location-arrow" style="color: #2196f3;"></i> Dirección para GPS:</b><br>
                <code style="background: white; padding: 5px 10px; border-radius: 5px; display: inline-block; margin-top: 5px; font-size: 12px;">
                    Av. Rumichaca Ñan y Morán Valverde, Chillogallo, Quito
                </code>
            </div>
        `;
        messages.scrollTop = messages.scrollHeight;
        setTimeout(() => { window.open(mapsUrl, '_blank'); }, 1000);
    });
}

function showMoreContactOptions() {
    if (!messages) return;
    cleanOptions();
    showTyping(() => {
        messages.innerHTML += `
            <div class="bot-message">
                <b>📞 Otras formas de contactarnos</b><br>
                Elige el método que prefieras para tu consulta personalizada:
            </div>
            <div class="options">
                <button style="animation-delay: 0.1s" onclick="window.contactAdvisorDirect()" class="whatsapp-option">
                    <i class="fab fa-whatsapp"></i> WhatsApp Inmediato
                    <small>Respuesta en minutos (recomendado)</small>
                </button>
                <button style="animation-delay: 0.2s" onclick="window.openContactForm()" class="form-option">
                    <i class="fas fa-envelope"></i> Correo Electrónico
                    <small>Respuesta en 24 horas hábiles</small>
                </button>
                <button style="animation-delay: 0.3s" onclick="window.showCallOptions()" class="call-option">
                    <i class="fas fa-phone"></i> Llamada Telefónica
                    <small>Horario: Lunes a Viernes 8:00-16:00</small>
                </button>
                <button style="animation-delay: 0.4s" onclick="window.initMenu()" class="back-option">
                    <i class="fas fa-arrow-left"></i> Volver al menú principal
                </button>
            </div>
        `;
        messages.scrollTop = messages.scrollHeight;
    });
}

function showCallOptions() {
    if (!messages) return;
    cleanOptions();
    showTyping(() => {
        messages.innerHTML += `
            <div class="bot-message">
                <b>📞 Contacto Telefónico</b><br>
                Para llamadas directas o programar una cita:
            </div>
            <div style="background: linear-gradient(135deg, #ffebee, #ffcdd2); padding: 15px; border-radius: 10px; margin: 15px 0; border-left: 4px solid #f44336;">
                <b><i class="fas fa-phone-alt" style="color: #f44336;"></i> Teléfono Principal:</b><br>
                <div style="font-size: 20px; font-weight: bold; color: #d32f2f; margin: 10px 0;">(02) 123-4567</div>
                <small><i class="fas fa-clock" style="color: #f44336;"></i> Horario: Lunes a Viernes 8:00-16:00</small>
            </div>
            <div style="background: linear-gradient(135deg, #fff3e0, #ffe0b2); padding: 15px; border-radius: 10px; margin: 15px 0; border-left: 4px solid #ff9800;">
                <b><i class="fas fa-calendar-check" style="color: #ff9800;"></i> Para programar una cita:</b><br>
                <small>1. Llama al número indicado<br>2. Solicita programar cita con asesor<br>3. Indica que vienes del asistente virtual<br>4. Recibirás confirmación vía WhatsApp</small>
            </div>
            <button class="whatsapp-btn-action" onclick="window.contactAdvisorDirect()" style="margin-top: 10px;"><i class="fab fa-whatsapp"></i> Prefiero contactar por WhatsApp</button>
            <button class="back-btn" onclick="window.showMoreContactOptions()"><i class="fas fa-arrow-left"></i> Ver otras opciones</button>
        `;
        messages.scrollTop = messages.scrollHeight;
    });
}

function openContactForm() {
    if (!messages) return;
    cleanOptions();
    showTyping(() => {
        messages.innerHTML += `
            <div class="contact-form-container">
                <b>📧 Formulario de Contacto</b><br>
                <small>Complete los datos y le responderemos por correo:</small>
                <input type="text" id="contact-name" class="interactive-input" placeholder="Tu nombre completo" value="${userName || ''}">
                <input type="email" id="contact-email" class="interactive-input" placeholder="Correo electrónico">
                <input type="tel" id="contact-phone" class="interactive-input" placeholder="Teléfono / WhatsApp">
                <textarea id="contact-message" class="interactive-input" placeholder="Mensaje o consulta específica..." style="height: 100px;"></textarea>
                <div style="display: flex; gap: 10px; margin-top: 15px;">
                    <button onclick="window.submitEmailForm()" style="flex: 1; padding: 12px; background: linear-gradient(135deg, var(--azul-institucional), var(--azul-complementario)); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600;">
                        <i class="fas fa-paper-plane"></i> Enviar por Correo
                    </button>
                    <button onclick="window.contactAdvisorDirect()" style="padding: 12px 20px; background: linear-gradient(135deg, var(--whatsapp), var(--whatsapp-dark)); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600;">
                        <i class="fab fa-whatsapp"></i> WhatsApp
                    </button>
                </div>
            </div>
            <button class="back-btn" onclick="window.showMoreContactOptions()"><i class="fas fa-arrow-left"></i> Volver a opciones</button>
        `;
        messages.scrollTop = messages.scrollHeight;
    });
}

function submitEmailForm() {
    if (!messages) return;
    const name = document.getElementById('contact-name')?.value;
    const email = document.getElementById('contact-email')?.value;
    const phone = document.getElementById('contact-phone')?.value;
    const message = document.getElementById('contact-message')?.value;
    if (!name || !email) { alert('Por favor ingrese su nombre y correo electrónico'); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { alert('Por favor ingrese un correo electrónico válido'); return; }

    const data = {
        access_key: window.CHATBOT_CONFIG.web3formsKey,
        name: name,
        email: email,
        phone: phone,
        message: message,
        subject: "Mensaje desde el Chatbot - Rafael Bucheli"
    };
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(resp => {
        if (resp.success) {
            showTyping(() => {
                messages.innerHTML += `<div class="bot-message success-message"><i class="fas fa-check-circle" style="color: #4CAF50;"></i> <b>¡Formulario enviado exitosamente!</b><br>Hemos recibido su consulta. Te contactaremos en:<br><b>📧 ${escapeHtml(email)}</b><br>en las próximas 24 horas hábiles.</div>`;
                messages.scrollTop = messages.scrollHeight;
            });
        } else {
            alert('Error al enviar: ' + (resp.message || 'Intente más tarde'));
        }
    })
    .catch(err => { alert('Error de conexión. Revise su internet.'); console.error(err); });
}

function submitEmailForm2() { submitEmailForm(); }

function showMoreOptions(query) {
    if (!messages) return;
    cleanOptions();
    showTyping(() => {
        messages.innerHTML += `
            <div class="bot-message">
                <b>📞 Otras formas de contactarnos</b><br>
                Elige el método que prefieras para tu consulta:
            </div>
            <div class="options">
                <button onclick="window.redirectToWhatsAppWithMessage('${query}')" class="whatsapp-option"><i class="fab fa-whatsapp"></i> WhatsApp Inmediato</button>
                <button onclick="window.openContactFormWithMessage('${query}')" class="form-option"><i class="fas fa-envelope"></i> Correo Electrónico</button>
                <button onclick="window.showCallOptions()" class="call-option"><i class="fas fa-phone"></i> Llamada Telefónica</button>
                <button onclick="window.initMenu()" class="back-option">Volver al menú principal</button>
            </div>
        `;
        messages.scrollTop = messages.scrollHeight;
    });
}

function openContactFormWithMessage(query) {
    if (!messages) return;
    const decodedQuery = decodeURIComponent(query);
    showTyping(() => {
        messages.innerHTML += `
            <div class="contact-form-container">
                <b>📧 Formulario de Contacto</b><br>
                <small>Completa tus datos y te responderemos por correo:</small>
                <input type="text" id="contact-name2" class="interactive-input" placeholder="Tu nombre completo" value="${userName || ''}">
                <input type="email" id="contact-email2" class="interactive-input" placeholder="Correo electrónico">
                <input type="tel" id="contact-phone2" class="interactive-input" placeholder="Teléfono / WhatsApp">
                <textarea id="contact-message2" class="interactive-input" placeholder="Mensaje o consulta específica..." style="height: 100px;">${decodedQuery}</textarea>
                <div style="display: flex; gap: 10px; margin-top: 15px;">
                    <button onclick="window.submitEmailForm2()" style="flex: 1; padding: 12px; background: linear-gradient(135deg, var(--azul-institucional), var(--azul-complementario)); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600;"><i class="fas fa-paper-plane"></i> Enviar por Correo</button>
                    <button onclick="window.redirectToWhatsAppWithMessage('${query}')" style="padding: 12px 20px; background: linear-gradient(135deg, var(--whatsapp), var(--whatsapp-dark)); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600;"><i class="fab fa-whatsapp"></i> WhatsApp</button>
                </div>
            </div>
            <button class="back-btn" onclick="window.showMoreOptions('${query}')"><i class="fas fa-arrow-left"></i> Ver otras opciones</button>
        `;
        messages.scrollTop = messages.scrollHeight;
    });
}

function redirectToWhatsAppWithMessage(query) {
    if (!messages) return;
    const decodedQuery = decodeURIComponent(query);
    const text = encodeURIComponent(`Hola, soy ${userName || 'un interesado'}. Mi consulta es: "${decodedQuery}". Me comunico desde el asistente virtual de la Institución Educativa Rafael Bucheli.`);
    const whatsappUrl = `https://wa.me/${window.CHATBOT_CONFIG.whatsappNumber}?text=${text}`;
    showTyping(() => {
        messages.innerHTML += `<div class="redirect-message"><i class="fas fa-external-link-alt"></i> Redireccionando a WhatsApp...</div>`;
        setTimeout(() => { window.open(whatsappUrl, '_blank'); }, 1200);
    });
}

function sendCustomMessage() {
    if (!messages || !userInput) return;
    const text = userInput.value.trim();
    if (!text) return;
    messages.innerHTML += `<div class="user-message">${escapeHtml(text)}</div>`;
    userInput.value = "";
    messages.scrollTop = messages.scrollHeight;
    chatHistory.push({ type: 'user', content: text });
    if (isChatMinimized) updateMessageBadge();
    showTyping(() => {
        const responseHTML = `
            <div class="bot-message">
                <b>✅ He recibido tu consulta:</b><br>
                "<i>${escapeHtml(text)}</i>"
            </div>
            <div class="advisor-container">
                <div class="advisor-icon">👨‍🏫</div>
                <div class="advisor-title">Conectando con especialista</div>
                <div class="advisor-description">Tu consulta será atendida por un asesor educativo especializado.</div>
                <div class="advisor-buttons">
                    <button class="advisor-primary-btn" onclick="window.redirectToWhatsAppWithMessage('${encodeURIComponent(text)}')"><i class="fab fa-whatsapp"></i> 💬 Continuar en WhatsApp</button>
                    <button class="advisor-secondary-btn" onclick="window.showMoreOptions('${encodeURIComponent(text)}')"><i class="fas fa-info-circle"></i> Más opciones de contacto</button>
                </div>
            </div>
            <button class="back-btn" onclick="window.initMenu()"><i class="fas fa-arrow-left"></i> Volver al menú principal</button>
        `;
        messages.innerHTML += responseHTML;
        messages.scrollTop = messages.scrollHeight;
        chatHistory.push({ type: 'bot', content: 'Redirección a asesor' });
    });
}

function cleanOptions() {
    document.querySelectorAll(".options, .action-btn, .back-btn, .map-btn, .whatsapp-btn-action, .section-btn, .advisor-buttons, .contact-form-container").forEach(e => e.remove());
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========== UTILIDADES ==========
function showMainTooltip() {
    if (!mainTooltip) return;
    clearTimeout(tooltipTimeout);
    mainTooltip.classList.add('active-tooltip');
    tooltipTimeout = setTimeout(() => mainTooltip.classList.remove('active-tooltip'), 4000);
}

function hideMainTooltip() { if (mainTooltip) mainTooltip.classList.remove('active-tooltip'); }

function updateMessageBadge() {
    if (!isChatMinimized && chatbotWindow && chatbotWindow.style.display === 'flex') return;
    unreadMessages++;
    let badge = document.querySelector('.new-message-badge');
    if (!badge) {
        badge = document.createElement('div');
        badge.className = 'new-message-badge';
        const chatBtn = document.querySelector('.chatbot-btn');
        if (chatBtn) chatBtn.appendChild(badge);
    }
    badge.textContent = unreadMessages > 9 ? '9+' : unreadMessages;
}

function clearMessageBadge() { unreadMessages = 0; document.querySelector('.new-message-badge')?.remove(); }

function updateConnectionStatus() {
    const dot = document.getElementById('status-dot');
    const text = document.getElementById('status-text');
    if (!dot || !text) return;
    text.innerText = "En línea";
    dot.className = "status-dot online";
}

function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .chatbot-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9998; display: none; backdrop-filter: blur(2px); }
        .chatbot-overlay.active { display: block; }
        .new-message-badge { position: absolute; top: -5px; right: -5px; background: #ff4757; color: white; border-radius: 50%; width: 20px; height: 20px; font-size: 10px; display: flex; align-items: center; justify-content: center; }
        .section-btn:hover { transform: translateY(-3px) scale(1.02) !important; filter: brightness(1.1) !important; }
        .floating-notification { position: absolute; left: -200px; top: 50%; transform: translateY(-50%); background: #1F2365; color: white; padding: 8px 14px; border-radius: 30px; font-size: 13px; white-space: nowrap; transition: all 0.3s; }
        @media (max-width: 768px) { .chat-window, .form-window { width: 95%; right: 2.5%; bottom: 84px; max-height: calc(100vh - 110px); } .floating-notification { left: -160px !important; font-size: 12px; min-width: 150px; } .btn-tooltip { left: -150px !important; font-size: 12px; } }
        @media (max-width: 480px) { .chat-window, .form-window { width: calc(100vw - 24px); right: 12px; left: 12px; min-height: 520px; } .main-floating-btn { width: 62px; height: 62px; bottom: 15px; right: 15px; } .floating-menu { bottom: 92px; right: 20px; } .secondary-btn { width: 54px; height: 54px; min-width: 54px; min-height: 54px; } }
    `;
    document.head.appendChild(style);
}

function showButtonNotifications() {
    const buttons = document.querySelectorAll('.secondary-btn');
    buttons.forEach((btn, index) => {
        let notificationText = '', notificationClass = '', icon = '';
        if (btn.classList.contains('whatsapp-btn')) { notificationText = 'Contacto directo'; notificationClass = 'whatsapp-notification'; icon = '📱'; }
        else if (btn.classList.contains('form-btn')) { notificationText = 'Llenar formulario'; notificationClass = 'form-notification'; icon = '📄'; }
        else if (btn.classList.contains('chatbot-btn')) { notificationText = 'Asistente virtual'; notificationClass = 'chatbot-notification'; icon = '🤖'; }
        if (notificationText) {
            setTimeout(() => {
                const existing = btn.querySelector('.floating-notification');
                if (existing) existing.remove();
                const notification = document.createElement('div');
                notification.className = `floating-notification ${notificationClass}`;
                notification.innerHTML = `${icon} ${notificationText}`;
                btn.appendChild(notification);
                setTimeout(() => {
                    notification.style.left = '-200px';
                    notification.style.top = '50%';
                    notification.style.transform = 'translateY(-50%)';
                }, 10);
                setTimeout(() => {
                    notification.style.opacity = '0';
                    notification.style.transform = 'translateY(-50%) translateX(-10px)';
                    setTimeout(() => notification.parentNode?.removeChild(notification), 500);
                }, 3000);
            }, index * 300);
        }
    });
}

function setupTooltips() {
    document.querySelectorAll('.secondary-btn').forEach(btn => {
        const tooltip = btn.querySelector('.btn-tooltip');
        if (tooltip) {
            tooltip.style.right = 'auto';
            tooltip.style.left = '-180px';
            tooltip.style.transform = 'translateX(-10px)';
        }
        btn.addEventListener('mouseenter', function() {
            const tt = this.querySelector('.btn-tooltip');
            if (tt) { tt.style.opacity = '1'; tt.style.visibility = 'visible'; tt.style.transform = 'translateX(0)'; }
        });
        btn.addEventListener('mouseleave', function() {
            const tt = this.querySelector('.btn-tooltip');
            if (tt) { tt.style.opacity = '0'; tt.style.visibility = 'hidden'; tt.style.transform = 'translateX(-10px)'; }
        });
    });
}

// Auto-inicialización
document.addEventListener('DOMContentLoaded', function() {
    const scriptTag = document.querySelector('script[src*="CHATBOT.js"]');
    if (scriptTag && scriptTag.hasAttribute('data-auto-init')) {
        window.initChatbot();
    }
});
console.log('✅ Chatbot completo cargado (paleta #1F2365, sin emojis duplicados)');
