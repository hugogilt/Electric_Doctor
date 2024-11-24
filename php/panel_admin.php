<?php
session_start();
require '../config/conexion.php';

try {
    // Asegurarse de que la variable de sesión esté configurada
    if (isset($_SESSION['correo'])) {
        $correo = $_SESSION['correo'];

        // Consulta preparada para obtener solo el rol del usuario
        $sql = "SELECT Rol FROM Usuarios WHERE Correo_Electronico = :correo";
        $stmt = $conexion->prepare($sql);
        $stmt->bindParam(':correo', $correo, PDO::PARAM_STR);
        $stmt->execute();

        // Obtener solo el campo 'Rol'
        $userData = $stmt->fetch(PDO::FETCH_ASSOC);

        // Verificar si se encontraron resultados
        if ($userData) {
            // Verificar si el rol es 'admin'
            if ($userData['Rol'] === 'admin') {
                ?>
                    <!DOCTYPE html>
                    <html lang="en">

                    <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Electric Doctor</title>
                    <link href="https://fonts.googleapis.com/css2?family=Anton&display=swap" rel="stylesheet">
                    <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;700&display=swap" rel="stylesheet">
                    <link href="https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap" rel="stylesheet">
                    <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@700&display=swap" rel="stylesheet">
                    <link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css" />
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
                    <link rel="icon" href="/images/logo.ico" type="image/x-icon">
                    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>

                    <link rel="stylesheet" href="/css/panel-admin.css">
                    </head>

                    <body>
                    <header>
                        <div id="title">
                        <img src="/images/logo.png" alt="Logo">
                        <h1>Electric Doctor</h1>
                        </div>
                        <button id="hamburger" aria-label="Toggle navigation">&#9776;</button>
                        <nav>
                        <a href="./servicios.html">Servicios</a>
                        <a href="#">Contáctanos</a>
                        <a href="#">Nosotros</a>
                        <a href="https://maps.app.goo.gl/h5aN8X4GmK59tT3H9">Dónde&nbsp;estamos</a>
                        <a href="#">Nuestras&nbsp;instalaciones</a>
                        </nav>
                        <span id="user-text"><img id="user" src="/images/user.png" alt="User"></span>
                        <!-- Menú desplegable -->
                        <div id="user-menu" class="user-menu">
                        <ul>
                            <li>Perfil</li>
                            <li>Citas</li>
                            <li>Facturas</li>
                            <li id="logout">Cerrar Sesión</li>
                        </ul>
                        </div>



                    </header>
                    <main>
                        <div id="options">
                        <section class="option" id="citas">
                        <div id="titulo-citas">
                            <h2 id="h2-citas">Calendario Citas</h2>
                        </div>
                        <img width="50%" src="/images/panel-admin/calendar.png" alt="Abrir Calendario">
                        </section>

                        <section class="option" id="facturas">
                        <div id="titulo-citas">
                            <h2 id="h2-citas">Facturas</h2>
                        </div>
                        <img width="50%" src="/images/panel-admin/factura.png" alt="Abrir Calendario">
                        </section>

                        <section class="option" id="listado-citas">
                        <div id="titulo-citas">
                            <h2 id="h2-citas">Listado Citas</h2>
                        </div>
                        <img width="50%" src="/images/panel-admin/listado.png" alt="Abrir Calendario">
                        </section>

                        <section class="option" id="citas">
                        <div id="titulo-citas">
                            <h2 id="h2-citas">Calendario Citas</h2>
                        </div>
                        <img width="100px" src="/images/panel-admin/calendar.png" alt="Abrir Calendario">
                        </section>

                        </div>

                        <!-- CALENDAR MODAL -->
                        <div id="calendarModal" class="modal">
                        <div class="modal-content">
                            <div class="calendar">
                            <span id="closeCalendarModal" class="close">&times;</span>
                            <div class="header">
                                <button id="prevMonth" type="button">←</button>
                                <div id="monthYear">
                                <h3 id="year"></h3>
                                <h2 id="month"></h2>
                                </div>
                                <button id="nextMonth" type="button">→</button>
                            </div>
                            <div class="days">
                                <div class="day">Lun</div>
                                <div class="day">Mar</div>
                                <div class="day">Mié</div>
                                <div class="day">Jue</div>
                                <div class="day">Vie</div>
                                <div class="day">Sáb</div>
                                <div class="day">Dom</div>
                            </div>
                            <div id="dates" class="dates"></div>
                            <div id="timeSlots" class="time-slots"></div>
                            </div>
                        </div>
                        </div>

                        <!-- Modal formulario -->
                        <div id="modal-formulario" class="modal">
                            <div class="modal-formulario-content">
                                <span class="close" id="cerrar-modal-formulario">&times;</span>
                                <h2>Electric Doctor</h2>
                                <form id="pedir-cita-form">
                                <div class="elementos-pedir-cita">
                                    <input type="text" id="nombre" name="nombre" placeholder="Nombre" required>
                                </div>
                                <div class="elementos-pedir-cita">
                                    <input type="text" id="apellidos" name="apellidos" placeholder="Apellidos" required>
                                </div>
                                <div class="elementos-pedir-cita">
                                    <input type="tel" id="telefono" name="telefono" pattern="[0-9]{9}" placeholder="Teléfono (9 dígitos)"
                                    title="El número debe tener 9 dígitos" required>
                                </div>
                                <div class="elementos-pedir-cita">
                                    <input type="email" id="correo" name="correo" placeholder="Correo Electrónico" required>
                                </div>
                                <div class="elementos-pedir-cita">
                                    <input type="text" id="marca" name="marca" placeholder="Marca y Modelo del Vehículo" required>
                                </div>
                                <div class="elementos-pedir-cita">
                                    <input type="number" id="anio" name="anio" placeholder="Año de Matriculación" min="1900" max="2024" required>
                                </div>
                                <div id="contenedor-problema" class="grupo-formulario">
                                    <textarea id="problema" name="problema" placeholder="¿Qué le ocurre a tu vehículo?" rows="5"
                                    required></textarea>
                                </div>
                                </form>
                            </div>
                        </div>

                        <!-- MODAL CITAS -->
                        <div id="modal-citas" class="modal-citas" onclick="closeModalOnOutsideClick(event)">
                          <div class="modal-citas-content">
                            <span class="modal-citas-close" onclick="closeModal()">&times;</span>
                            <div id="modal-citas-filter">
                              <label for="filtro-atributo">Filtrar por:</label>
                              <select id="filtro-atributo" onchange="filtrarCitas()">
                                <option value="">Seleccionar</option>
                                <option value="NombreCompleto">Nombre completo</option>
                                <option value="Telefono">Teléfono</option>
                                <option value="Correo_Electronico">Correo Electrónico</option>
                                <option value="Modelo_Vehiculo">Modelo del Vehículo</option>
                                <option value="Ano_Matriculacion">Año de Matriculación</option>
                              </select>

                              <input
                                type="text"
                                id="filtro-valor"
                                placeholder="Escribe el valor..."
                                oninput="filtrarCitas()"
                              />

                              <!-- Filtro independiente para el estado -->
                              <label for="filtro-estado">Estado:</label>
                              <select id="filtro-estado" onchange="filtrarCitas()">
                                <option value="">Cualquiera</option>
                                <option value="pendiente">Pendiente</option>
                                <option value="completada">Completada</option>
                              </select>

                              <!-- Filtro por mes -->
                              <label for="filtro-mes">Mes:</label>
                              <select id="filtro-mes" onchange="filtrarCitas()">
                                <option value="">Cualquiera</option>
                                <option value="01">Enero</option>
                                <option value="02">Febrero</option>
                                <option value="03">Marzo</option>
                                <option value="04">Abril</option>
                                <option value="05">Mayo</option>
                                <option value="06">Junio</option>
                                <option value="07">Julio</option>
                                <option value="08">Agosto</option>
                                <option value="09">Septiembre</option>
                                <option value="10">Octubre</option>
                                <option value="11">Noviembre</option>
                                <option value="12">Diciembre</option>
                              </select>

                              <!-- Botón de recargar -->
                              <button id="recargar-citas" class="modal-citas-boton">Recargar</button>
                              <!-- <div id="resultado-citas">
                                <p id="contador-citas">Mostrando 0 resultados</p>
                              </div> -->
                            </div>
                            <div id="modal-citas-body">
                              <!-- Los cajones dinámicos se generarán aquí -->
                            </div>
                          </div>
                        </div>



                        <!-- Modal de confirmación de cancelar cita -->
                        <div id="modal-cancelar-cita" class="modal-cancelar-cita">
                          <div class="modal-cancelar-cita-content">
                            <p>¿Está seguro de que desea cancelar la cita?</p>
                            <button id="confirmar-cancelar-cita" class="confirmar-cancelar-cita">Sí, cancelar cita</button>
                            <button id="cancelar-cancelar-cita" class="cancelar-cancelar-cita">No, mantener cita</button>
                          </div>
                        </div>

                    </main>
                    <script src="../js/panel-admin.js"></script>
                    </body>

                    </html>
                    <?php
            } else {
                // Si el rol no es admin, redirigir a otra página o mostrar un mensaje
                header("Location: ../index.html"); // Redirigir a una página de acceso denegado
                exit;
            }
        } else {
            // Usuario no encontrado
            header("Location: ../index.html"); // Redirigir al login
            exit;
        }
    } else {
        // Si no hay sesión iniciada
        header("Location: ../index.html"); // Redirigir al login
        exit;
    }
} catch (PDOException $e) {
    // Manejar el error si la consulta falla
    echo "Error al obtener los datos: " . $e->getMessage();
}

