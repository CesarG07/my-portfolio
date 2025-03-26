class ProyectoCard extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: "open" });

        const titulo = this.getAttribute("titulo") || "Proyecto";
        const descripcion = this.querySelector('[slot="descripcion"]')?.innerHTML || "";
        const capturas = Array.from(this.querySelectorAll('[slot="capturas"] img')).map(img => img.outerHTML);
        const tecnologias = Array.from(this.querySelectorAll('[slot="tecnologias"] fieldset')).map(fieldset => fieldset.outerHTML);

        shadow.innerHTML = `
            <article class="proyecto-card">
                <header class="proyecto-header">
                    <h3>${titulo}</h3>
                </header>
                <nav class="proyecto-nav">
                    <ul>
                        <li data-target="descripcion" class="active">Descripción</li>
                        <li data-target="capturas">Imágenes</li>
                        <li data-target="tecnologias">Tecnologías</li>
                    </ul>
                </nav>
                <section class="proyecto-content">
                    <div class="descripcion active">
                        <slot name="descripcion"></slot>
                    </div>

                    <div class="capturas hidden">
                        ${capturas.join("")}
                    </div>

                    <div class="tecnologias hidden">
                        ${tecnologias.join("")}
                    </div>
                </section>
            </article>
        `;

        fetch(new URL("wc-projects.css", import.meta.url))
        .then(response => response.text())
        .then(css => {
            const style = document.createElement("style");
            style.textContent = css;
            shadow.appendChild(style);
        })
        .catch(error => console.error("Error al cargar los estilos:", error));

        const navItems = shadow.querySelectorAll(".proyecto-nav li");
        const contentSections = shadow.querySelectorAll(".proyecto-content > div");

        navItems.forEach(item => {
            item.addEventListener("click", () => {
                navItems.forEach(i => i.classList.remove("active"));
                contentSections.forEach(section => section.classList.remove("active"));

                const target = item.getAttribute("data-target");
                item.classList.add("active");
                shadow.querySelector(`.${target}`).classList.add("active");
            });
        });
    }
}

customElements.define("proyecto-card", ProyectoCard);
