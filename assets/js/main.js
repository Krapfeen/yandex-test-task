(function() {
    const section = document.getElementById('participants-section');
    if (!section) return;

    const rowCards = section.querySelector('.row.justify-between');
    if (!rowCards) return;

    const cards = Array.from(rowCards.querySelectorAll('.card'));
    if (cards.length === 0) return;

    const carouselWrapper = document.createElement('div');
    carouselWrapper.className = 'participants-carousel';
    const track = document.createElement('div');
    track.className = 'carousel-track';

    cards.forEach(card => {
        track.appendChild(card);
    });
    carouselWrapper.appendChild(track);

    rowCards.parentNode.insertBefore(carouselWrapper, rowCards);
    rowCards.remove();

    const prevBtn = section.querySelector('.participants-prev');
    const nextBtn = section.querySelector('.participants-next');
    const counterSpan = section.querySelector('.participants-counter');

    let currentIndex = 0;
    let cardsPerView = 3;
    let totalCards = cards.length;
    let autoInterval = null;
    const autoDelay = 4000;

    function getCardsPerView() {
        return window.innerWidth >= 768 ? 3 : 1;
    }

    function updateCarousel() {
        cardsPerView = getCardsPerView();
        const cardWidth = 100 / cardsPerView;
        cards.forEach(card => {
            card.style.flex = `0 0 ${cardWidth}%`;
            card.style.maxWidth = `${cardWidth}%`;
        });
        const shift = - (currentIndex * (100 / cardsPerView));
        track.style.transform = `translateX(${shift}%)`;

        const totalPages = Math.ceil(totalCards / cardsPerView);
        const currentPage = Math.floor(currentIndex / cardsPerView) + 1;
        counterSpan.textContent = `${currentPage} / ${totalPages}`;
    }

    function nextSlide() {
        const cardsPerViewNow = getCardsPerView();
        const maxStartIndex = totalCards - cardsPerViewNow;
        if (currentIndex + cardsPerViewNow >= totalCards) {
            currentIndex = 0;
        } else {
            currentIndex = Math.min(currentIndex + cardsPerViewNow, maxStartIndex);
        }
        updateCarousel();
        resetAutoTimer();
    }

    function prevSlide() {
        const cardsPerViewNow = getCardsPerView();
        if (currentIndex - cardsPerViewNow < 0) {
            currentIndex = totalCards - cardsPerViewNow;
            if (currentIndex < 0) currentIndex = 0;
        } else {
            currentIndex = currentIndex - cardsPerViewNow;
        }
        updateCarousel();
        resetAutoTimer();
    }

    function resetAutoTimer() {
        if (autoInterval) {
            clearInterval(autoInterval);
            autoInterval = null;
        }
        startAutoTimer();
    }

    function startAutoTimer() {
        if (autoInterval) clearInterval(autoInterval);
        autoInterval = setInterval(() => {
            nextSlide();
        }, autoDelay);
    }

    function stopAutoTimer() {
        if (autoInterval) {
            clearInterval(autoInterval);
            autoInterval = null;
        }
    }

    function bindHoverStop() {
        const carousel = document.querySelector('.participants-carousel');
        if (!carousel) return;
        carousel.addEventListener('mouseenter', stopAutoTimer);
        carousel.addEventListener('mouseleave', startAutoTimer);
    }

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newCardsPerView = getCardsPerView();
            const maxIndex = totalCards - newCardsPerView;
            if (currentIndex > maxIndex) {
                currentIndex = maxIndex >= 0 ? maxIndex : 0;
            }
            updateCarousel();
        }, 150);
    });

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    updateCarousel();
    startAutoTimer();
    bindHoverStop();
})();
