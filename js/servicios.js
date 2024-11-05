// Selecciona el div por su id
const divInformacionServicio = document.getElementById('informacion-servicio');

// Selecciona el elemento por su id
const botonReparacionMotos = document.getElementById('reparacion-motos');
const botonReparacionBaterias = document.getElementById('reparacion-baterias');
const botonReparacionPatinetes = document.getElementById('reparacion-patinetes');
const botonEnvios = document.getElementById('envios');
const botonPreITVs = document.getElementById('pre-itvs');
const botonNeumaticos = document.getElementById('neumaticos');
const botonPuestasAPunto = document.getElementById('puestas-a-punto');
const botonRevisiones = document.getElementById('revisiones');


if (title) {
    title.addEventListener('click', function () {
      // Redirigir a otra URL
      window.location.href = './index.html';
    });
  }



if (botonReparacionMotos) {
    botonReparacionMotos.addEventListener('click', function () {
        while (divInformacionServicio.firstChild) {
            divInformacionServicio.removeChild(divInformacionServicio.firstChild);
        }
        // Crea el elemento h3
        const h3 = document.createElement('h3');
        h3.textContent = 'REPARACIÓN DE MOTOS';

        // Crea el elemento p
        const pCorto = document.createElement('p');
        pCorto.textContent = 'Ofrecemos servicios de reparación para motos eléctricas, asegurando un rendimiento óptimo y una conducción segura.';

        // Crea el elemento img
        const img = document.createElement('img');
        img.src = './images/moto.png';
        img.alt = 'Moto';

        const pLargo = document.createElement('p');
        pLargo.textContent = 'En nuestro taller, realizamos diagnósticos precisos y reparaciones expertas en motos eléctricas. Nuestro equipo calificado utiliza tecnología avanzada y piezas de calidad, garantizando un servicio confiable. Elegirnos significa contar con atención personalizada y un compromiso con la satisfacción del cliente, asegurando que tu moto vuelva a la carretera en perfectas condiciones.';

        // Añade los elementos al divInformacionServicio
        divInformacionServicio.appendChild(h3);
        divInformacionServicio.appendChild(pCorto);
        divInformacionServicio.appendChild(img);
        divInformacionServicio.appendChild(pLargo);
    });
}

if (botonReparacionBaterias) {
    botonReparacionBaterias.addEventListener('click', function () {
        while (divInformacionServicio.firstChild) {
            divInformacionServicio.removeChild(divInformacionServicio.firstChild);
        }
        // Crea el elemento h3
        const h3 = document.createElement('h3');
        h3.textContent = 'REPARACIÓN DE BATERÍAS';

        // Crea el elemento p
        const pCorto = document.createElement('p');
        pCorto.textContent = 'Ofrecemos servicios de reparación y mantenimiento de baterías para motos eléctricas, maximizando su rendimiento y duración.';

        // Crea el elemento img
        const img = document.createElement('img');
        img.src = './images/bateria.png';
        img.alt = 'Bateria';

        const pLargo = document.createElement('p');
        pLargo.textContent = 'En nuestro taller, realizamos diagnósticos detallados y reparaciones de baterías de motos eléctricas. Utilizamos tecnología avanzada para garantizar que tu batería funcione de manera eficiente. Elegirnos significa confiar en un equipo experto que se preocupa por la seguridad y la satisfacción del cliente, asegurando que tu moto eléctrica tenga la autonomía necesaria para tus recorridos.';

        // Añade los elementos al divInformacionServicio
        divInformacionServicio.appendChild(h3);
        divInformacionServicio.appendChild(pCorto);
        divInformacionServicio.appendChild(img);
        divInformacionServicio.appendChild(pLargo);
    });
}

if (botonReparacionPatinetes) {
    botonReparacionPatinetes.addEventListener('click', function () {
        while (divInformacionServicio.firstChild) {
            divInformacionServicio.removeChild(divInformacionServicio.firstChild);
        }

        // Crea el elemento h3
        const h3 = document.createElement('h3');
        h3.textContent = 'REPARACIÓN DE PATINETES';

        // Crea el elemento p
        const pCorto = document.createElement('p');
        pCorto.textContent = 'Ofrecemos servicios de reparación para patinetes eléctricos, garantizando un funcionamiento seguro y eficiente.';

        // Crea el elemento img
        const img = document.createElement('img');
        img.src = './images/patinete.png';
        img.alt = 'Reparación de Patinetes';

        const pLargo = document.createElement('p');
        pLargo.textContent = 'Nuestro taller se especializa en la reparación y mantenimiento de patinetes eléctricos. Realizamos diagnósticos exhaustivos y reparaciones en componentes clave, asegurando que tu patinete esté siempre listo para rodar. Al elegirnos, obtienes un servicio rápido y de calidad, respaldado por un equipo comprometido con tu satisfacción y la seguridad en cada trayecto.';

        // Añade los elementos al divInformacionServicio
        divInformacionServicio.appendChild(h3);
        divInformacionServicio.appendChild(pCorto);
        divInformacionServicio.appendChild(img);
        divInformacionServicio.appendChild(pLargo);
    });
}

if (botonEnvios) {
    botonEnvios.addEventListener('click', function () {
        while (divInformacionServicio.firstChild) {
            divInformacionServicio.removeChild(divInformacionServicio.firstChild);
        }

        // Crea el elemento h3
        const h3 = document.createElement('h3');
        h3.textContent = 'ENVÍOS';

        // Crea el elemento p
        const pCorto = document.createElement('p');
        pCorto.textContent = 'Ofrecemos un servicio de envíos rápidos y seguros para motos eléctricas y patinetes.';

        // Crea el elemento img
        const img = document.createElement('img');
        img.src = './images/camion.png';
        img.alt = 'Envíos';

        const pLargo = document.createElement('p');
        pLargo.textContent = 'Nuestro taller proporciona un servicio de envíos eficiente y confiable para motos eléctricas y patinetes. Nos aseguramos de que tus vehículos lleguen en perfectas condiciones y a tiempo. Al elegir nuestro servicio de envíos, cuentas con un equipo dedicado que se preocupa por la seguridad de tu vehículo y la satisfacción del cliente, garantizando una experiencia sin complicaciones.';

        // Añade los elementos al divInformacionServicio
        divInformacionServicio.appendChild(h3);
        divInformacionServicio.appendChild(pCorto);
        divInformacionServicio.appendChild(img);
        divInformacionServicio.appendChild(pLargo);
    });
}

if (botonPreITVs) {
    botonPreITVs.addEventListener('click', function () {
        while (divInformacionServicio.firstChild) {
            divInformacionServicio.removeChild(divInformacionServicio.firstChild);
        }

        // Crea el elemento h3
        const h3 = document.createElement('h3');
        h3.textContent = 'PRE-ITVs';

        // Crea el elemento p
        const pCorto = document.createElement('p');
        pCorto.textContent = 'Realizamos revisiones pre-ITV para motos eléctricas y patinetes, asegurando que cumplan con todas las normativas.';

        // Crea el elemento img
        const img = document.createElement('img');
        img.src = './images/pre-itv.png';
        img.alt = 'Pre-ITVs';

        const pLargo = document.createElement('p');
        pLargo.textContent = 'En nuestro taller, ofrecemos servicios de revisión pre-ITV para motos eléctricas y patinetes, garantizando que estén en óptimas condiciones antes de la inspección. Nuestros técnicos revisan todos los aspectos necesarios para cumplir con las normativas de seguridad y emisiones. Al elegir nuestro servicio, te aseguras de que tu vehículo esté preparado para pasar la ITV sin inconvenientes, brindándote tranquilidad y confianza en la carretera.';

        // Añade los elementos al divInformacionServicio
        divInformacionServicio.appendChild(h3);
        divInformacionServicio.appendChild(pCorto);
        divInformacionServicio.appendChild(img);
        divInformacionServicio.appendChild(pLargo);
    });
}

if (botonNeumaticos) {
    botonNeumaticos.addEventListener('click', function () {
        while (divInformacionServicio.firstChild) {
            divInformacionServicio.removeChild(divInformacionServicio.firstChild);
        }

        // Crea el elemento h3
        const h3 = document.createElement('h3');
        h3.textContent = 'NEUMÁTICOS';

        // Crea el elemento p
        const pCorto = document.createElement('p');
        pCorto.textContent = 'Ofrecemos un servicio integral de venta y cambio de neumáticos para motos eléctricas y patinetes.';

        // Crea el elemento img
        const img = document.createElement('img');
        img.src = './images/neumatico.png';
        img.alt = 'Neumáticos';

        const pLargo = document.createElement('p');
        pLargo.textContent = 'En nuestro taller, proporcionamos servicios de venta y cambio de neumáticos para motos eléctricas y patinetes. Garantizamos que nuestros neumáticos sean de alta calidad y adecuados para tu vehículo. Nuestros expertos te asesoran sobre las mejores opciones y se encargan de la instalación para asegurar tu seguridad y rendimiento. Al elegir nuestro servicio, disfrutas de una conducción más segura y eficiente en cada trayecto.';

        // Añade los elementos al divInformacionServicio
        divInformacionServicio.appendChild(h3);
        divInformacionServicio.appendChild(pCorto);
        divInformacionServicio.appendChild(img);
        divInformacionServicio.appendChild(pLargo);
    });
}

if (botonPuestasAPunto) {
    botonPuestasAPunto.addEventListener('click', function () {
        while (divInformacionServicio.firstChild) {
            divInformacionServicio.removeChild(divInformacionServicio.firstChild);
        }

        // Crea el elemento h3
        const h3 = document.createElement('h3');
        h3.textContent = 'PUESTAS A PUNTO';

        // Crea el elemento p
        const pCorto = document.createElement('p');
        pCorto.textContent = 'Realizamos puestas a punto completas para motos eléctricas y patinetes, asegurando un rendimiento óptimo.';

        // Crea el elemento img
        const img = document.createElement('img');
        img.src = './images/puesta-a-punto.png';
        img.alt = 'Puestas a Punto';

        const pLargo = document.createElement('p');
        pLargo.textContent = 'En nuestro taller, ofrecemos servicios de puesta a punto para motos eléctricas y patinetes, revisando todos los componentes esenciales. Desde la batería hasta el sistema de frenos, garantizamos que cada parte funcione de manera óptima. Al elegir nuestro servicio, te aseguras de que tu vehículo esté en perfectas condiciones, mejorando su rendimiento y prolongando su vida útil. La seguridad y satisfacción del cliente son nuestra prioridad.';

        // Añade los elementos al divInformacionServicio
        divInformacionServicio.appendChild(h3);
        divInformacionServicio.appendChild(pCorto);
        divInformacionServicio.appendChild(img);
        divInformacionServicio.appendChild(pLargo);
    });
}

if (botonRevisiones) {
    botonRevisiones.addEventListener('click', function () {
        while (divInformacionServicio.firstChild) {
            divInformacionServicio.removeChild(divInformacionServicio.firstChild);
        }

        // Crea el elemento h3
        const h3 = document.createElement('h3');
        h3.textContent = 'REVISIONES';

        // Crea el elemento p
        const pCorto = document.createElement('p');
        pCorto.textContent = 'Realizamos revisiones periódicas para motos eléctricas y patinetes, garantizando su correcto funcionamiento y seguridad.';

        // Crea el elemento img
        const img = document.createElement('img');
        img.src = './images/revision.png';
        img.alt = 'Revisiones';

        const pLargo = document.createElement('p');
        pLargo.textContent = 'En nuestro taller, ofrecemos servicios de revisión para motos eléctricas y patinetes, asegurando que todos los componentes estén en perfecto estado. Realizamos chequeos exhaustivos para detectar posibles fallos y mantener tu vehículo en óptimas condiciones. Al elegir nuestras revisiones, obtienes la tranquilidad de saber que tu moto o patinete está seguro y listo para la carretera, mejorando su rendimiento y prolongando su vida útil.';

        // Añade los elementos al divInformacionServicio
        divInformacionServicio.appendChild(h3);
        divInformacionServicio.appendChild(pCorto);
        divInformacionServicio.appendChild(img);
        divInformacionServicio.appendChild(pLargo);
    });
}


window.onload = function () {
    // Obtener los parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    const servicio = params.get('servicios');

    if (servicio) {
        // Esperar a que el contenido esté completamente cargado
        const contenedorServicios = document.querySelector('#puestas-a-punto');
        if (contenedorServicios) {
            contenedorServicios.scrollIntoView({ behavior: 'smooth' });
            // Mapea los ids de los botones a los propios botones
            const botones = {
                [botonReparacionMotos.id]: botonReparacionMotos,
                [botonReparacionBaterias.id]: botonReparacionBaterias,
                [botonReparacionPatinetes.id]: botonReparacionPatinetes,
                [botonEnvios.id]: botonEnvios,
                [botonPreITVs.id]: botonPreITVs,
                [botonNeumaticos.id]: botonNeumaticos,
                [botonPuestasAPunto.id]: botonPuestasAPunto,
                [botonRevisiones.id]: botonRevisiones,
            };

            // Si el servicio está en el objeto, realiza el clic
            if (botones[servicio]) {
                botones[servicio].click();
            }
        }
    }
};


