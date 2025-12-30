class WCSlider extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.currentIndex = 0;
        this.slides = [];
        this.isManualScroll = false;
    }

    connectedCallback() {
        this.render();
        this.setupSlider();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; width: 100%; }
                .slider-container { position: relative; width: 100%; overflow: hidden; border-radius: 12px; }
                .slides-wrapper { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scroll-behavior: smooth; scrollbar-width: none; -ms-overflow-style: none; gap: 20px; padding: 10px 0; }
                .slides-wrapper::-webkit-scrollbar { display: none; }
                ::slotted(*) { flex: 0 0 100%; scroll-snap-align: center; transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s ease, filter 0.6s ease; opacity: 0.4; transform: scale(0.9) translateY(10px); filter: blur(2px); }
                ::slotted(.active) { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
                .nav-arrow { position: absolute; top: 50%; transform: translateY(-50%); width: 40px; height: 40px; background: rgba(0, 31, 77, 0.5); color: #7FFFD4; border: 1px solid rgba(127, 255, 212, 0.2); border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); backdrop-filter: blur(8px); opacity: 0; box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
                .slider-container:hover .nav-arrow { opacity: 1; }
                .nav-arrow:hover { background: #7FFFD4; color: #001f4d; transform: translateY(-50%) scale(1.1); }
                .nav-arrow.prev { left: 10px; }
                .nav-arrow.next { right: 10px; }
                .nav-arrow svg { width: 24px; height: 24px; }
                .dots-container { display: flex; justify-content: center; gap: 8px; margin-top: 15px; }
                .dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(127, 255, 212, 0.3); cursor: pointer; transition: all 0.3s ease; border: none; padding: 0; }
                .dot.active { background: #7FFFD4; transform: scale(1.3); box-shadow: 0 0 10px rgba(127, 255, 212, 0.5); }
                @media (max-width: 640px) { .nav-arrow { display: none; } ::slotted(*) { flex: 0 0 85%; } }
            </style>
            <div class="slider-container">
                <button class="nav-arrow prev" aria-label="Anterior">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                
                <div class="slides-wrapper">
                    <slot id="slot"></slot>
                </div>

                <button class="nav-arrow next" aria-label="Siguiente">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
            </div>
            <div class="dots-container"></div>
        `;
    }

    setupSlider() {
        const wrapper = this.shadowRoot.querySelector(".slides-wrapper");
        const slot = this.shadowRoot.getElementById("slot");
        const nextBtn = this.shadowRoot.querySelector(".next");
        const prevBtn = this.shadowRoot.querySelector(".prev");
        const dotsContainer = this.shadowRoot.querySelector(".dots-container");

        const updateSlides = () => {
            this.slides = slot.assignedElements().filter(el => el.tagName !== "STYLE");
            this.createDots(dotsContainer);
            this.updateActiveState();

            // Re-observe new slides
            this.slides.forEach(slide => observer.observe(slide));
        };

        const observerOptions = {
            root: wrapper,
            threshold: 0.4,
            rootMargin: "0px"
        };

        const observer = new IntersectionObserver((entries) => {
            if (this.isManualScroll) return;
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = this.slides.indexOf(entry.target);
                    if (index !== -1) {
                        this.currentIndex = index;
                        this.updateActiveState();
                    }
                }
            });
        }, observerOptions);

        slot.addEventListener("slotchange", updateSlides);

        // Navigation
        nextBtn.addEventListener("click", (e) => {
            e.preventDefault();
            this.scroll(1);
        });
        prevBtn.addEventListener("click", (e) => {
            e.preventDefault();
            this.scroll(-1);
        });

        // Loop to ensure initial state and handling late arrivals
        const init = () => {
            this.slides = slot.assignedElements().filter(el => el.tagName !== "STYLE");
            if (this.slides.length > 0) {
                this.slides.forEach(slide => observer.observe(slide));
                this.createDots(dotsContainer);

                // Force initial state
                this.currentIndex = 0;
                this.updateActiveState();

                const reset = () => {
                    this.scrollToIndex(0);
                };
                reset();
                setTimeout(reset, 100);
            } else {
                setTimeout(init, 100);
            }
        };
        init();
    }

    createDots(container) {
        container.innerHTML = "";
        this.slides.forEach((_, index) => {
            const dot = document.createElement("button");
            dot.classList.add("dot");
            if (index === this.currentIndex) dot.classList.add("active");
            dot.setAttribute("aria-label", `Ir al slide ${index + 1}`);
            dot.addEventListener("click", (e) => {
                e.preventDefault();
                this.scrollToIndex(index);
            });
            container.appendChild(dot);
        });
    }

    scrollToIndex(index) {
        if (this.slides[index]) {
            this.isManualScroll = true;
            this.currentIndex = index; // Pre-emptively update
            this.updateActiveState();

            this.slides[index].scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center"
            });

            // Unlock after transition
            setTimeout(() => { this.isManualScroll = false; }, 700);
        }
    }

    scroll(direction) {
        const next = Math.max(0, Math.min(this.slides.length - 1, this.currentIndex + direction));
        this.scrollToIndex(next);
    }

    updateActiveState() {
        const dots = this.shadowRoot.querySelectorAll(".dot");
        const slides = this.slides;

        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === this.currentIndex);
        });

        slides.forEach((slide, i) => {
            slide.classList.toggle("active", i === this.currentIndex);
        });
    }
}

customElements.define("wc-slider", WCSlider);
