    const carouselInner = document.getElementById("carousel-inner");
    const slides = carouselInner.children;
    let currentIndex = 0;

    function showNextSlide() {
      currentIndex = (currentIndex + 1) % slides.length;
      carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    setInterval(showNextSlide, 4000);