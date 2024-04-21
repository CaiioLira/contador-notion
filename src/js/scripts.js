// Variáveis
let checkinCount = parseInt(localStorage.getItem('checkinCount')) || 0;
let lastCheckinTimestamp = localStorage.getItem('lastCheckinTimestamp') ? parseInt(localStorage.getItem('lastCheckinTimestamp')) : null;
let nextCheckinAllowedTimestamp = localStorage.getItem('nextCheckinAllowedTimestamp') ? parseInt(localStorage.getItem('nextCheckinAllowedTimestamp')) : Date.now();

// Elementos do DOM
const checkinButton = document.getElementById('checkin-btn');
const countDisplay = document.getElementById('count-display');
const countdownDisplay = document.getElementById('countdown-display'); // Elemento para a contagem regressiva
const resetButton = document.getElementById('reset-btn'); // Botão de reset
// Elementos do DOM para o modal
const modal = document.getElementById('notification-modal');
const closeModal = document.getElementsByClassName('close-btn')[0];

// Função para verificar se a data atual é diferente da data do último check-in
function isDifferentDay(lastTimestamp) {
    const lastDate = new Date(lastTimestamp);
    const nowDate = new Date();
    
    return lastDate.getDate() !== nowDate.getDate() ||
           lastDate.getMonth() !== nowDate.getMonth() ||
           lastDate.getFullYear() !== nowDate.getFullYear();
}

// Função para exibir o modal
function showModal(message) {
    document.getElementById('modal-message').textContent = message;
    modal.style.display = 'block';
  }
    // Quando o usuário clica no <span> (x), feche o modal
closeModal.onclick = function() {
    modal.style.display = 'none';
  }
    // Quando o usuário clica em qualquer lugar fora do modal, feche-o
window.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  }

// Função para atualizar o contador
function updateCheckinCount() {
    const now = Date.now();
    
    // Verificar se já foi feito o check-in hoje e se passaram 24h
    if (lastCheckinTimestamp === null || (isDifferentDay(lastCheckinTimestamp) && now >= nextCheckinAllowedTimestamp)) {
        // Check-in válido
        checkinCount++;
        lastCheckinTimestamp = now;
        nextCheckinAllowedTimestamp = now + 24 * 60 * 60 * 1000; // Próximo check-in permitido em 24h
        localStorage.setItem('checkinCount', checkinCount.toString());
        localStorage.setItem('lastCheckinTimestamp', lastCheckinTimestamp.toString());
        localStorage.setItem('nextCheckinAllowedTimestamp', nextCheckinAllowedTimestamp.toString());
    } else {
        showModal('Aguarde até que o tempo de 24h para o próximo check-in seja atingido.')
      
    }
  
    // Atualizar a exibição do contador
    countDisplay.textContent = `Total de check-ins consecutivos: ${checkinCount}`;
    updateCountdownDisplay(); // Atualizar a contagem regressiva
}

// Função para formatar e exibir a contagem regressiva
function updateCountdownDisplay() {
    const now = Date.now();
    if (now < nextCheckinAllowedTimestamp) {
        const countdown = (nextCheckinAllowedTimestamp - now) / 1000;
        const hours = Math.floor(countdown / 3600);
        const minutes = Math.floor((countdown % 3600) / 60);
        const seconds = Math.floor(countdown % 60);
        countdownDisplay.textContent = `Próximo check-in em ${hours}h ${minutes}m ${seconds}s`;
    } else {
        countdownDisplay.textContent = 'Você já pode fazer um check-in!';
    }
}

// Função para atualizar a contagem regressiva a cada segundo
function startCountdown() {
    setInterval(() => {
        updateCountdownDisplay();
    }, 1000);
}

// Evento de clique no botão de reset
resetButton.addEventListener('click', () => {
    checkinCount = 0;
    lastCheckinTimestamp = null;
    nextCheckinAllowedTimestamp = Date.now(); // Permite um novo check-in imediatamente
    localStorage.setItem('checkinCount', checkinCount.toString());
    localStorage.setItem('lastCheckinTimestamp', '');
    localStorage.setItem('nextCheckinAllowedTimestamp', nextCheckinAllowedTimestamp.toString());
    countDisplay.textContent = `Total de check-ins consecutivos: ${checkinCount}`;
    updateCountdownDisplay(); // Atualizar a contagem regressiva
});

// Atualizar a exibição do contador ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    countDisplay.textContent = `Total de check-ins consecutivos: ${checkinCount}`;
    updateCountdownDisplay(); // Atualizar a contagem regressiva
});

// Iniciar a contagem regressiva
updateCountdownDisplay();

// Evento de clique no botão de check-in
checkinButton.addEventListener('click', () => {
    updateCheckinCount(); // Chama a função para atualizar o contador de check-in
});

startCountdown();