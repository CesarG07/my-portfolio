class CourseCard extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: "open" });

        const title = this.getAttribute("title");
        const entity = this.getAttribute("entity");
        const logo = this.getAttribute("logo");
        const description = this.getAttribute("description");
        const hours = this.getAttribute("hours");
        const skills = this.getAttribute("skills");

        shadow.innerHTML = `
            <div class="course-card">
                <div class="section" data-section="${title}">
                    <h3 class="section__name">${title}</h3>
                    <div class="section__icon">+</div>
                </div>
                <div class="section__info" id="${title}-info">
                    <div class="info-header">
                        <img src="${logo}" alt="Logo Entidad" class="info-logo">
                        <h4 class="info-title">${entity}</h4>
                    </div>
                    <p class="info-description">${description}</p>
                    <div class="info-details">
                        <div class="info-detail">
                            <span>📅</span>
                            <p>Tiempo invertido: ${hours}</p>
                        </div>
                        <div class="info-detail">
                            <span>🛠️</span>
                            <p>Skills: ${skills}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        fetch("components/wc-courses.css")
            .then(response => response.text())
            .then(css => {
                const style = document.createElement("style");
                style.textContent = css;
                shadow.appendChild(style);
            })
            .catch(error => console.error("Error al cargar los estilos:", error));

        const section = shadow.querySelector(".section");
        const info = shadow.getElementById(`${title}-info`);

        section.addEventListener("click", () => {
            info.classList.toggle("show");
            section.classList.toggle("active");
        });
    }
}

customElements.define("course-card", CourseCard);
