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
    function isMobileWidth() {
        return window.matchMedia('(max-width: 758px)').matches;
    }

    const section = document.getElementById('stages-section');
    if (!section) return;

    const gridParent = section.querySelector('.grid-parent');
    if (!gridParent) return;

    const originalItems = Array.from(gridParent.querySelectorAll('.grid-inner'));
    if (originalItems.length !== 7) return;

    const groups = [ [1, 2], [3], [4, 5], [6], [7] ];
    const totalSlides = groups.length;

    let sliderActive = false;
    let track = null;
    let prevBtn = null, nextBtn = null;
    let dotsContainer = null;
    let currentIndex = 0;

    function buildSlides() {
        const slides = [];
        for (let g of groups) {
            const slideDiv = document.createElement('div');
            slideDiv.className = 'stages-slide';
            for (let num of g) {
                const original = originalItems[num - 1];
                if (original) {
                    const clone = original.cloneNode(true);
                    slideDiv.appendChild(clone);
                }
            }
            slides.push(slideDiv);
        }
        return slides;
    }

    function initSlider() {
        if (sliderActive) return;
        console.log('[Stages] Init slider');

        const slides = buildSlides();
        track = document.createElement('div');
        track.className = 'stages-track';
        slides.forEach(slide => track.appendChild(slide));

        gridParent.innerHTML = '';
        gridParent.appendChild(track);
        gridParent.classList.add('stages-slider-active');

        const controls = document.createElement('div');
        controls.className = 'stages-controls';

        prevBtn = document.createElement('button');
        prevBtn.className = 'stages-prev';
        prevBtn.innerHTML = '<img src="assets/images/btn-prev.svg" alt="Назад">';
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        });

        nextBtn = document.createElement('button');
        nextBtn.className = 'stages-next';
        nextBtn.innerHTML = '<img src="assets/images/btn-next.svg" alt="Вперёд">';
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentIndex < totalSlides - 1) {
                currentIndex++;
                updateSlider();
            }
        });

        dotsContainer = document.createElement('div');
        dotsContainer.className = 'stages-dots';

        controls.appendChild(prevBtn);
        controls.appendChild(dotsContainer);
        controls.appendChild(nextBtn);
        gridParent.parentNode.insertBefore(controls, gridParent.nextSibling);

        currentIndex = 0;
        updateSlider();
        sliderActive = true;
    }

    function updateSlider() {
        if (!track) return;
        const slideWidth = track.children[0]?.offsetWidth;
        if (!slideWidth) return;
        const gap = 16;
        const shift = -currentIndex * (slideWidth + gap);
        track.style.transform = `translateX(${shift}px)`;

        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('button');
                dot.classList.add('stages-dot');
                if (i === currentIndex) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateSlider();
                });
                dotsContainer.appendChild(dot);
            }
        }

        if (prevBtn && nextBtn) {
            if (currentIndex === 0) prevBtn.classList.add('disabled');
            else prevBtn.classList.remove('disabled');
            if (currentIndex === totalSlides - 1) nextBtn.classList.add('disabled');
            else nextBtn.classList.remove('disabled');
        }
    }

    function destroySlider() {
        if (!sliderActive) return;
        console.log('[Stages] Destroy slider');

        gridParent.innerHTML = '';
        originalItems.forEach(item => gridParent.appendChild(item));
        gridParent.classList.remove('stages-slider-active');

        const controls = document.querySelector('.stages-controls');
        if (controls) controls.remove();

        track = null;
        prevBtn = nextBtn = dotsContainer = null;
        sliderActive = false;
        currentIndex = 0;
    }

    function handleResize() {
        if (isMobileWidth() && !sliderActive) {
            initSlider();
        } else if (!isMobileWidth() && sliderActive) {
            destroySlider();
        } else if (isMobileWidth() && sliderActive) {
            updateSlider();
        }
    }

    window.addEventListener('resize', () => {
        setTimeout(handleResize, 100);
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', handleResize);
    } else {
        handleResize();
    }
})();
