console.log("Aleluya");

document.addEventListener("DOMContentLoaded", () => {
  const botonPDF = document.getElementById("pdf");
  botonPDF.addEventListener("click", () => {
      const urlPDF = "tools/CV_CesarGutierrez_es.pdf";
      window.open(urlPDF, "_blank");
  });
});

document.querySelectorAll('.mas-info').forEach(icon => {
  icon.addEventListener('click', () => {
    const parent = icon.parentElement.parentElement.parentElement;
    const detalles = parent.querySelector('.info-inicial');
    const activities = parent.querySelector('.info-adicional');

    detalles.classList.toggle('hidden');
    activities.classList.toggle('hidden');
    activities.classList.toggle('visible');

    parent.style.backgroundColor = activities.classList.contains('visible') ? 'white' : '#f0f0f0';
    console.log(parent);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const headerNav = document.getElementById("header-nav");

  menuToggle.addEventListener("click", () => {
      headerNav.classList.toggle("active");
  });
});