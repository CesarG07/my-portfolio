class ExperienciaCard extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: "open" });

        const logo = this.getAttribute("logo");
        const empresa = this.getAttribute("empresa");
        const ciudad = this.getAttribute("ciudad");
        const cargo = this.getAttribute("cargo");
        const fecha = this.getAttribute("fecha");
        const descripcion = this.getAttribute("descripcion");
        const proyectos = this.getAttribute("proyectos");
        const tecnologias = this.getAttribute("tecnologias");
        const certificate = this.getAttribute("certificate");

        shadow.innerHTML = `
            <div class="logo-container">
                <img src="${logo}" alt="Logo Empresa">
            </div>
            <div class="card-content">
                <h3>${empresa}</h3>
                <p>💼 ${cargo}</p>
                <p>🌍 ${ciudad}</p>
                <p>📆 ${fecha}</p>
                ${certificate && certificate !== "none" ? `<a href="${certificate}" target="_blank" class="certificate-link" title="Ver Certificado">📜</a>` : ""}
            </div>
            <div class="barra-lateral">	&#xBB</div>
            <div class="info-adicional hidden">
                <h4>Información Adicional</h4>
                <p>${descripcion}</p>
                <p>${proyectos}</p>
                <p>${tecnologias}</p>
            </div>
        `;

        fetch(new URL("wc-info.css", import.meta.url))
            .then(response => response.text())
            .then(css => {
                const style = document.createElement("style");
                style.textContent = css;
                shadow.appendChild(style);
            })
            .catch(error => console.error("Error al cargar los estilos:", error));

        const barraLateral = shadow.querySelector(".barra-lateral");
        const infoAdicional = shadow.querySelector(".info-adicional");

        barraLateral.addEventListener("click", () => {
            barraLateral.classList.toggle("hidden");
            infoAdicional.classList.toggle("hidden");
            infoAdicional.classList.toggle("visible");
        });
    }
}

customElements.define("experiencia-card", ExperienciaCard);
