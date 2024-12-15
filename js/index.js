//Detalles servicios
const originalContainers = document.querySelectorAll("#cards-containers .rows");
const contenidoServicios = document.getElementById("contenido-servicios");




//SLIDER
function crearSliderServicios(containerId) {
  contenidoServicios.style.position = 'relative'
  // Crear el contenedor principal del swiper
  const swiperContainer = document.createElement('div');
  swiperContainer.className = 'swiper-container';
  swiperContainer.id = 'swiper-container';


  // Crear el contenedor de las slides
  const swiperWrapper = document.createElement('div');
  swiperWrapper.className = 'swiper-wrapper';

  // Definir los servicios y sus detalles
  const servicios = [
    {
      id: 'reparacion-motos',
      imgSrc: 'images/moto-dark-grey.png',
      alt: 'Moto',
      title: 'Reparación de Motos',
      buttonId: 'detalles-reparacion-motos'
    },
    {
      id: 'reparacion-baterias',
      imgSrc: 'images/bateria-dark-grey.png',
      alt: 'Bateria',
      title: 'Reparación de Baterías',
      buttonId: 'detalles-reparacion-baterias'
    },
    {
      id: 'reparacion-patinetes',
      imgSrc: 'images/patinete-dark-grey.png',
      alt: 'Patinete',
      title: 'Reparación de Patinetes',
      buttonId: 'detalles-reparacion-patinetes'
    },
    {
      id: 'envios',
      imgSrc: 'images/camion-dark-grey.png',
      alt: 'Camion',
      title: 'Envío de Motos a toda la península',
      buttonId: 'detalles-envios'
    },
    {
      id: 'pre-itvs',
      imgSrc: 'images/pre-itv-dark-grey.png',
      alt: 'pre-itv',
      title: 'Pre-ITVS',
      buttonId: 'detalles-pre-itvs'
    },
    {
      id: 'neumaticos',
      imgSrc: 'images/neumatico-dark-grey.png',
      alt: 'neumatico',
      title: 'Neumáticos',
      buttonId: 'detalles-neumaticos'
    },
    {
      id: 'puestas-a-punto',
      imgSrc: 'images/puesta-a-punto-dark-grey.png',
      alt: 'Puesta a Punto',
      title: 'Puestas a Punto',
      buttonId: 'detalles-puestas-a-punto'
    },
    {
      id: 'revisiones',
      imgSrc: 'images/revision-dark-grey.png',
      alt: 'Revision',
      title: 'Revisiones',
      buttonId: 'detalles-revisiones'
    }
  ];


  // Crear las cards y añadirlas al swiperWrapper
  servicios.forEach(servicio => {
    const card = document.createElement('div');
    card.className = 'card swiper-slide'; // Agregar la clase swiper-slide a cada card
    card.id = servicio.id;

    const img = document.createElement('img');
    img.src = servicio.imgSrc;
    img.alt = servicio.alt;

    const title = document.createElement('h3');
    title.textContent = servicio.title;

    const button = document.createElement('button');
    button.id = servicio.buttonId;
    button.textContent = 'Detalles';

    // Estructurar la tarjeta
    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(button);
    swiperWrapper.appendChild(card); // Añadir la card directamente al swiperWrapper
  });

  // Añadir la wrapper al contenedor principal
  swiperContainer.appendChild(swiperWrapper);

  // Crear y añadir la paginación
  const pagination = document.createElement('div');
  pagination.className = 'swiper-pagination';
  swiperContainer.appendChild(pagination);


  // Insertar el slider en el contenedor deseado
  containerId.appendChild(swiperContainer);

  // Inicializar Swiper
  const swiper = new Swiper('.swiper-container', {
    loop: true, // Activa el modo de bucle infinito
    slidesPerView: 1.2, // Solo una carta visible a la vez
    centeredSlides: true, // Centra el slide activo
    spaceBetween: 10, // Espacio entre cartas en px
    pagination: {
      el: '.swiper-pagination',
      clickable: true, // Permite hacer clic en los puntos de paginación
    },
    grabCursor: true, // Cambia el cursor a una mano cuando se pasa sobre el carrusel
    touchEventsTarget: 'container', // Habilita el gesto de arrastre en el contenedor
    touchRatio: 1, // Ajusta la sensibilidad del deslizamiento
    // Habilitar el desplazamiento táctil
    simulateTouch: true, // Asegura que el deslizamiento táctil funcione
    noSwiping: false, // Permite el deslizamiento en todo el contenedor
  });
}


function crearContenidoServicios(parent) {
  // Crear el contenedor de las tarjetas
  const cardsContainers = document.createElement('div');
  cardsContainers.id = 'cards-containers';

  // Crear el primer contenedor de servicios
  const containerServicios1 = document.createElement('div');
  containerServicios1.id = 'container-servicios-1';
  containerServicios1.className = 'rows';

  // Servicios del primer contenedor
  const servicios1 = [
    {
      id: 'reparacion-motos',
      imgSrc: 'images/moto-dark-grey.png',
      alt: 'Moto',
      title: 'Reparación de Motos',
      buttonId: 'detalles-reparacion-motos'
    },
    {
      id: 'reparacion-baterias',
      imgSrc: 'images/bateria-dark-grey.png',
      alt: 'Bateria',
      title: 'Reparación de Baterías',
      buttonId: 'detalles-reparacion-baterias'
    },
    {
      id: 'reparacion-patinetes',
      imgSrc: 'images/patinete-dark-grey.png',
      alt: 'Patinete',
      title: 'Reparación de Patinetes',
      buttonId: 'detalles-reparacion-patinetes'
    },
    {
      id: 'envios',
      imgSrc: 'images/camion-dark-grey.png',
      alt: 'Camion',
      title: 'Envío de Motos a toda la península',
      buttonId: 'detalles-envios'
    }
  ];

  // Crear y añadir las tarjetas al primer contenedor
  servicios1.forEach(servicio => {
    const card = document.createElement('div');
    card.id = servicio.id;
    card.className = 'card';

    const img = document.createElement('img');
    img.src = servicio.imgSrc;
    img.alt = servicio.alt;

    const title = document.createElement('h3');
    title.textContent = servicio.title;

    const button = document.createElement('button');
    button.id = servicio.buttonId;
    button.textContent = 'Detalles';

    // Estructurar la tarjeta
    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(button);
    containerServicios1.appendChild(card);
  });

  // Añadir el primer contenedor de servicios al contenedor de tarjetas
  cardsContainers.appendChild(containerServicios1);

  // Crear el segundo contenedor de servicios
  const containerServicios2 = document.createElement('div');
  containerServicios2.id = 'container-servicios-2';
  containerServicios2.className = 'rows';

  // Servicios del segundo contenedor
  const servicios2 = [
    {
      id: 'pre-itvs',
      imgSrc: 'images/pre-itv-dark-grey.png',
      alt: 'pre-itv',
      title: 'Pre-ITVS',
      buttonId: 'detalles-pre-itvs'
    },
    {
      id: 'neumaticos',
      imgSrc: 'images/neumatico-dark-grey.png',
      alt: 'neumatico',
      title: 'Neumáticos',
      buttonId: 'detalles-neumaticos'
    },
    {
      id: 'puestas-a-punto',
      imgSrc: 'images/puesta-a-punto-dark-grey.png',
      alt: 'Puesta a Punto',
      title: 'Puestas a Punto',
      buttonId: 'detalles-puestas-a-punto'
    },
    {
      id: 'revisiones',
      imgSrc: 'images/revision-dark-grey.png',
      alt: 'Revision',
      title: 'Revisiones',
      buttonId: 'detalles-revisiones'
    }
  ];

  // Crear y añadir las tarjetas al segundo contenedor
  servicios2.forEach(servicio => {
    const card = document.createElement('div');
    card.id = servicio.id;
    card.className = 'card';

    const img = document.createElement('img');
    img.src = servicio.imgSrc;
    img.alt = servicio.alt;

    const title = document.createElement('h3');
    title.textContent = servicio.title;

    const button = document.createElement('button');
    button.id = servicio.buttonId;
    button.textContent = 'Detalles';

    // Estructurar la tarjeta
    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(button);
    containerServicios2.appendChild(card);
  });

  // Añadir el segundo contenedor de servicios al contenedor de tarjetas
  cardsContainers.appendChild(containerServicios2);

  // Insertar el contenido en el padre especificado
  parent.appendChild(cardsContainers);

}

function handleResize() {
  let htmlWidth = parseFloat(window.getComputedStyle(document.documentElement).width);
  if (htmlWidth <= 750) {
    // Crear cards deslizable si el ancho es menor o igual a 750px
    if (!document.querySelector("#swiper-container")) {
      if (document.querySelector("#cards-containers")) {
        document.querySelector("#cards-containers").remove();
      }
      crearSliderServicios(contenidoServicios);
      addEventsOnServices();
    }
  } else {
    // Restaurar la estructura original si el ancho es mayor a 750px
    if (!document.querySelector('#cards-containers')) {
      if (document.querySelector('#swiper-container')) {
        document.querySelector('#swiper-container').remove();
      }
      crearContenidoServicios(contenidoServicios);
      addEventsOnServices();
    }
  }
}

// Manejar el evento de redimensionamiento
window.addEventListener("resize", handleResize);

// Llamar a la función al cargar la página
handleResize();

function addEventsOnServices() {
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
}