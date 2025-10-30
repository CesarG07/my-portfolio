class CronoItem extends HTMLElement{
    constructor(){
        super();
        const shadow = this.attachShadow({mode: "open"});

        const period = this.getAttribute("period");
        const subtitle = this.getAttribute("subtitle");
        const short = this.getAttribute("short");
        const episode = this.getAttribute("episode");
        const description = this.getAttribute("description");
        const data = this.getAttribute("data");

        shadow.innerHTML = `
            <div class="event" role="listitem" tabindex="0" data-year="2024">
                <div class="marker" aria-hidden="true"></div>
                <div class="content">
                    <div class="period">${period}</div>
                    <div class="title">${subtitle}</div>
                    <div class="short">${short}</div>
                </div>
                <div class="card" aria-hidden="true">
                    <h3>${episode}</h3>
                    <p>${description}</p>
                    <div class="meta">${data}</div>
                </div>
            </div>
        `;

        fetch(new URL("wc-crono.css", import.meta.url))
            .then(response => response.text())
            .then(css => {
                const style = document.createElement("style");
                style.textContent = css;
                shadow.appendChild(style);
            })
            .catch(error => console.error("Error al cargar los estilos:", error));
    }
}

customElements.define("crono-item", CronoItem);

class CronoElement extends HTMLElement{
    constructor(){
        super();
        const shadow = this.attachShadow({mode: "open"});

        const title = this.getAttribute("title");
        const legend = this.getAttribute("legend");

        console.log(title);
        console.log(legend);

        shadow.innerHTML = `
            <div class="timeline-wrap">
                <div class="hero">
                    <h1>${title}</h1>
                    <p class="legend">${legend}</p>
                </div>

                <div class="timeline" id="timeline">
                    <div class="axis" aria-hidden="true"></div>
                    <div class="events" role="list">
                        <crono-item
                            period="2013-2017"
                            subtitle="Etapa escolar secundaria"
                            short="Premios nacionales en competencias de matemáticas"
                            episode="Etapa escolar"
                            description="Obtuve medallas nacionales en competencias de matemáticas como ONEM."
                            data="Trujillo | Lima">
                        </crono-item>
                        <crono-item
                            period="2019-2024"
                            subtitle="Etapa universitaria"
                            short="Obtención de Beca 18"
                            episode="Etapa universitaria"
                            description="Inicio de carrera en Ingeniería Electrónica en la PUCP."
                            data="Lima">
                        </crono-item>
                        <crono-item
                            period="2024-2025"
                            subtitle="Prácticas profesionales"
                            short="Prácticas profesionales"
                            episode="Prácticas profesionales"
                            description="He realizado prácticas profesionales en área técnica de Telecomunicaciones, en el campo de la automatización y monitorización de procesos industriales, y en desarrollo de software."
                            data="Lima">
                        </crono-item>
                    </div>
                </div>
            </div>
        `;

        fetch(new URL("wc-crono.css", import.meta.url))
            .then(response => response.text())
            .then(css => {
                const style = document.createElement("style");
                style.textContent = css;
                shadow.appendChild(style);
            })
            .catch(error => console.error("Error al cargar los estilos:", error));
    }
}

customElements.define("crono-element", CronoElement);
