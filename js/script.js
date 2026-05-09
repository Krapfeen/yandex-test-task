document.addEventListener('DOMContentLoaded', () => {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            if (!targetId) return;
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Данные участников (соответствуют макету и дополнены для 6 человек)
const participantsData = [
    { name: "Хосе Рауль Капабланка", role: "Чемпион мира по шахматам", photo: "assets/images/profile.png" },
    { name: "Эммануил Ласкер", role: "Чемпион мира по шахматам", photo: "assets/images/profile.png" },
    { name: "Александр Алехин", role: "Чемпион мира по шахматам", photo: "assets/images/profile.png" },
    { name: "Арон Нимцович", role: "Чемпион мира по шахматам", photo: "assets/images/profile.png" },
    { name: "Рихард Рети", role: "Чемпион мира по шахматам", photo: "assets/images/profile.png" },
    { name: "Остап Бендер", role: "Гроссмейстер", photo: "assets/images/profile.png" },
];

let extendedParticipants = [...participantsData, ...participantsData, ...participantsData];
let currentIndex = participantsData.length;
let autoInterval = null;
const track = document.getElementById('participantsTrack');
const prevBtn = document.querySelector('.participants-prev');
const nextBtn = document.querySelector('.participants-next');
const counterSpan = document.querySelector('.participants-counter');

function getVisibleCards() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 880) return 2;
    return 3;
}

function getCardWidth() {
    const card = document.querySelector('.participant-card');
    if (!card) return 0;
    const style = getComputedStyle(card);
    const marginRight = parseFloat(style.marginRight) || 0;
    return card.offsetWidth + marginRight;
}

function updateCounter() {
    if (!counterSpan) return;
    let rawIndex = currentIndex % participantsData.length;
    let current = rawIndex + 1;
    counterSpan.innerText = `${current} / ${participantsData.length}`;
}

function renderParticipants() {
    if (!track) return;
    track.innerHTML = '';
    extendedParticipants.forEach(p => {
        const card = document.createElement('div');
        card.className = 'participant-card';
        card.innerHTML = `
            <img class="participant-photo" src="${p.photo}" alt="${p.name}">
            <div class="participant-name">${p.name}</div>
            <div class="participant-role">${p.role}</div>
            <a href="#" class="participant-details">Подробнее</a>
        `;
        track.appendChild(card);
    });
    updateCarousel(false);
    updateCounter();
}

function updateCarousel(animate = true) {
    const step = getCardWidth();
    if (step === 0) return;
    const offset = currentIndex * step;
    track.style.transition = animate ? 'transform 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)' : 'none';
    track.style.transform = `translateX(-${offset}px)`;
    if (animate) {
        track.addEventListener('transitionend', checkInfiniteLoop, { once: true });
    } else {
        checkInfiniteLoop();
    }
}

function checkInfiniteLoop() {
    const visible = getVisibleCards();
    const maxIndex = extendedParticipants.length - visible;
    if (currentIndex <= 0) {
        currentIndex = participantsData.length;
        updateCarousel(false);
    } else if (currentIndex >= maxIndex - participantsData.length + 1) {
        currentIndex = participantsData.length;
        updateCarousel(false);
    }
    updateCounter();
}

function nextSlide() {
    const visible = getVisibleCards();
    const maxIndex = extendedParticipants.length - visible;
    if (currentIndex < maxIndex) {
        currentIndex++;
    } else {
        currentIndex = participantsData.length;
    }
    updateCarousel(true);
    resetAutoPlay();
}

function prevSlide() {
    if (currentIndex > 0) {
        currentIndex--;
    } else {
        currentIndex = extendedParticipants.length - getVisibleCards() - participantsData.length;
    }
    updateCarousel(true);
    resetAutoPlay();
}

function resetAutoPlay() {
    if (autoInterval) clearInterval(autoInterval);
    autoInterval = setInterval(() => {
        if (document.hasFocus()) nextSlide();
    }, 4000);
}

prevBtn?.addEventListener('click', prevSlide);
nextBtn?.addEventListener('click', nextSlide);
window.addEventListener('resize', () => {
    if (track) {
        setTimeout(() => updateCarousel(false), 150);
    }
});

renderParticipants();
resetAutoPlay();
