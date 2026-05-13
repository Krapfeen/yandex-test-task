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

    cards.forEach(card => track.appendChild(card));
    carouselWrapper.appendChild(track);
    rowCards.parentNode.insertBefore(carouselWrapper, rowCards);
    rowCards.remove();

    const prevBtn = section.querySelector('.participants-prev');
    const nextBtn = section.querySelector('.participants-next');
    const counterSpan = section.querySelector('.participants-counter');

    let currentIndex = 0;
    let cardsPerView = 3;
    const totalCards = cards.length;
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
        const shift = -(currentIndex * (100 / cardsPerView));
        track.style.transform = `translateX(${shift}%)`;

        const totalPages = Math.ceil(totalCards / cardsPerView);
        const currentPage = Math.floor(currentIndex / cardsPerView) + 1;
        if (counterSpan) counterSpan.textContent = `${currentPage} / ${totalPages}`;
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
        if (autoInterval) clearInterval(autoInterval);
        autoInterval = setInterval(() => nextSlide(), autoDelay);
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
        carousel.addEventListener('mouseleave', resetAutoTimer);
    }

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newCardsPerView = getCardsPerView();
            const maxIndex = totalCards - newCardsPerView;
            if (currentIndex > maxIndex) currentIndex = maxIndex >= 0 ? maxIndex : 0;
            updateCarousel();
        }, 150);
    });

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    updateCarousel();
    resetAutoTimer();
    bindHoverStop();
})();

(function() {
    console.log('Stages slider script started');

    const section = document.getElementById('stages-section');
    if (!section) {
        console.warn('No #stages-section');
        return;
    }

    const gridParent = section.querySelector('.grid-parent');
    if (!gridParent) {
        console.warn('No .grid-parent');
        return;
    }

    const items = Array.from(gridParent.querySelectorAll('.grid-inner'));
    if (items.length === 0) {
        console.warn('No .grid-inner items');
        return;
    }
    console.log('Found items:', items.length);

    let sliderActive = false;
    let track = null;
    let prevBtn = null, nextBtn = null;
    let dotsContainer = null;
    let currentIndex = 0;

    function isMobile() {
        return window.innerWidth <= 768;
    }

    function initSlider() {
        if (sliderActive) return;
        console.log('Initializing slider...');

        track = document.createElement('div');
        track.className = 'stages-track';

        items.forEach(item => track.appendChild(item));
        gridParent.innerHTML = '';
        gridParent.appendChild(track);

        const controls = document.createElement('div');
        controls.className = 'stages-controls';

        prevBtn = document.createElement('button');
        prevBtn.className = 'stages-prev';
        prevBtn.innerHTML = '<img src="assets/images/btn-prev.svg" alt="Назад">';
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            slidePrev();
        });

        nextBtn = document.createElement('button');
        nextBtn.className = 'stages-next';
        nextBtn.innerHTML = '<img src="assets/images/btn-next.svg" alt="Вперёд">';
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            slideNext();
        });

        dotsContainer = document.createElement('div');
        dotsContainer.className = 'stages-dots';

        controls.appendChild(prevBtn);
        controls.appendChild(dotsContainer);
        controls.appendChild(nextBtn);

        gridParent.parentNode.insertBefore(controls, gridParent.nextSibling);

        gridParent.classList.add('stages-slider-active');

        updateDots();
        updateButtons();
        setTimeout(() => updatePosition(), 10);

        sliderActive = true;
        console.log('Slider initialized');
    }

    function destroySlider() {
        if (!sliderActive) return;
        console.log('Destroying slider...');

        const itemsFromTrack = Array.from(track.children);
        gridParent.innerHTML = '';
        itemsFromTrack.forEach(item => gridParent.appendChild(item));

        const controls = document.querySelector('.stages-controls');
        if (controls) controls.remove();

        gridParent.classList.remove('stages-slider-active');
        track = null;
        prevBtn = null;
        nextBtn = null;
        dotsContainer = null;
        sliderActive = false;
        currentIndex = 0;
    }

    function updateDots() {
        if (!dotsContainer) return;
        const totalPages = items.length;
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('button');
            dot.classList.add('stages-dot');
            if (i === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    function updatePosition() {
        if (!track || !items[0]) return;
        const itemWidth = items[0].offsetWidth;
        if (!itemWidth) return;
        const gap = 16;
        const shift = -currentIndex * (itemWidth + gap);
        track.style.transform = `translateX(${shift}px)`;
    }

    function updateButtons() {
        if (!prevBtn || !nextBtn) return;
        if (currentIndex === 0) {
            prevBtn.classList.add('disabled');
        } else {
            prevBtn.classList.remove('disabled');
        }
        if (currentIndex === items.length - 1) {
            nextBtn.classList.add('disabled');
        } else {
            nextBtn.classList.remove('disabled');
        }
    }

    function slidePrev() {
        if (currentIndex > 0) {
            currentIndex--;
            updatePosition();
            updateButtons();
            updateDots();
        }
    }

    function slideNext() {
        if (currentIndex < items.length - 1) {
            currentIndex++;
            updatePosition();
            updateButtons();
            updateDots();
        }
    }

    function goToSlide(index) {
        if (index >= 0 && index < items.length && index !== currentIndex) {
            currentIndex = index;
            updatePosition();
            updateButtons();
            updateDots();
        }
    }

    function handleResize() {
        if (isMobile() && !sliderActive) {
            initSlider();
        } else if (!isMobile() && sliderActive) {
            destroySlider();
        } else if (isMobile() && sliderActive) {
            updatePosition();
            updateDots();
            updateButtons();
        }
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleResize, 150);
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', handleResize);
    } else {
        handleResize();
    }
})();
