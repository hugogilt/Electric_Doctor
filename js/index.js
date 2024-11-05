//Detalles servicios
const originalContainers = document.querySelectorAll("#cards-containers .rows");
const cardsContainer = document.getElementById("cards-containers");

// Objeto que mapea los IDs de los botones a sus respectivas URLs
const buttonUrls = {
    "detalles-reparacion-motos": './servicios.html?servicios=reparacion-motos',
    "detalles-reparacion-baterias": './servicios.html?servicios=reparacion-baterias',
    "detalles-reparacion-patinetes": './servicios.html?servicios=reparacion-patinetes',
    "detalles-envios": './servicios.html?servicios=envios',
    "detalles-pre-itvs": './servicios.html?servicios=pre-itvs',
    "detalles-neumaticos": './servicios.html?servicios=neumaticos',
    "detalles-puestas-a-punto": './servicios.html?servicios=puestas-a-punto',
    "detalles-revisiones": './servicios.html?servicios=revisiones',
};
// Función para asignar event listeners a los botones
function assignEventListeners() {
    Object.entries(buttonUrls).forEach(([buttonId, url]) => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', function () {
                window.location.href = url;
            });
        }
    });
}

// Llamar a la función para asignar event listeners al cargar la página
assignEventListeners();

function createSlidingCards() {
    // Crear un div para la card deslizable
    const slidingCard = document.createElement("div");
    slidingCard.className = "sliding-card";
    slidingCard.style.display = "flex"; // Hacerlo flexible para el desplazamiento

    // Recorrer cada contenedor y agregar las cards a la card deslizable
    originalContainers.forEach(container => {
        const cards = container.querySelectorAll(".card");
        cards.forEach(card => {
            // Clonar la card para añadirla al slidingCard
            const clonedCard = card.cloneNode(true);
            slidingCard.appendChild(clonedCard);

            // Asignar el event listener del botón de la tarjeta original al botón de la tarjeta clonada
            const originalButton = card.querySelector("button");
            const buttonId = originalButton.id;
            const url = buttonUrls[buttonId];
            if (url) {
                clonedCard.querySelector("button").addEventListener("click", function () {
                    window.location.href = url;
                });
            }
        });
    });

    // Agregar la card deslizable al contenedor principal
    cardsContainer.appendChild(slidingCard);

    // Aplicar estilos de deslizamiento
    slidingCard.style.overflowX = "auto"; // Permitir el desplazamiento horizontal
    slidingCard.style.scrollSnapType = "x mandatory"; // Para el efecto de 'snap'

    // Estilo de cada card
    slidingCard.querySelectorAll(".card").forEach(card => {
        card.style.scrollSnapAlign = "start"; // Alineación al deslizar
        card.style.minWidth = "300px"; // Ajustar el ancho mínimo de cada card
        card.style.margin = "0 10px"; // Margen entre cards
    });

    // Ocultar las filas originales
    originalContainers.forEach(container => {
        container.style.display = "none";
    });
}

function resetCards() {
    // Eliminar la card deslizable
    const slidingCard = document.querySelector(".sliding-card");
    if (slidingCard) {
        slidingCard.remove();
    }

    // Restaurar las filas originales
    originalContainers.forEach(container => {
        container.style.removeProperty('display'); // Mostrar las filas originales
        cardsContainer.appendChild(container); // Reagregar al contenedor
    });
    
    // Re-asignar event listeners a los botones originales
    assignEventListeners();
}

function handleResize() {
    if (window.innerWidth <= 750) {
        // Crear cards deslizable si el ancho es menor o igual a 750px
        if (!document.querySelector(".sliding-card")) {
            createSlidingCards();
        }
    } else {
        // Restaurar la estructura original si el ancho es mayor a 750px
        resetCards();
    }
}

// Manejar el evento de redimensionamiento
window.addEventListener("resize", handleResize);

// Llamar a la función al cargar la página
handleResize();