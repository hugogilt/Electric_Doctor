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
                        <h2>Admin Panel</h2>
                        <div id="options">
                        <section class="option" id="citas">
                        <div id="titulo-citas">
                            <h2 id="h2-citas">Calendario</h2>
                        </div>
                        <img width="50%" src="/images/panel-admin/calendar.png" alt="Abrir Calendario">
                        </section>

                        <section class="option" id="usuarios">
                        <div id="titulo-citas">
                            <h2 id="h2-citas">Usuarios</h2>
                        </div>
                        <img width="50%" src="/images/panel-admin/user_interface.png" alt="Abrir Calendario">
                        </section>

                        <section class="option" id="facturas">
                        <div id="titulo-citas">
                            <h2 id="h2-citas">Facturas</h2>
                        </div>
                        <img width="50%" src="/images/panel-admin/factura.png" alt="Abrir Calendario">
                        </section>

                        <section class="option" id="listado-citas">
                        <div id="titulo-citas">
                            <h2 id="h2-citas">Listado</h2>
                        </div>
                        <img width="50%" src="/images/panel-admin/listado.png" alt="Abrir Calendario">
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
                                        <textarea id="problema" name="problema" placeholder="¿Qué le ocurre a tu vehículo?" rows="5" required></textarea>
                                    </div>
                                    <!-- Botón para modificar la fecha -->
                                    <div id="contenedor-fecha-button">
                                        <button id="modificar-fecha-button" type="button">Fecha:</button>
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
                              />

                              <!-- Filtro independiente para el estado -->
                              <label for="filtro-estado">Estado:</label>
                              <select id="filtro-estado">
                                <option value="">Cualquiera</option>
                                <option value="pendiente">Pendiente</option>
                                <option value="completada">Completada</option>
                              </select>

                              <!-- Filtro por mes -->
                              <label for="filtro-mes">Mes:</label>
                              <select id="filtro-mes">
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

                            </div>
                            <div id="resultado-citas">
                                <p id="contador-citas">Mostrando 0 resultados</p>
                                <!-- Botón de recargar -->
                                <img width="30px" alt="Recargar" src="../images/panel-admin/recargar.png" id="recargar-citas"></img>
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


                        <!-- Modal de completar cita -->
                        <div id="modal-completar-cita" class="modal-completar-cita-overlay">
                            <div class="modal-completar-cita-container">
                                <h2 class="modal-completar-cita-header">Añadir Observaciones</h2>
                                <textarea id="modal-completar-cita-textarea" placeholder="Añadir observaciones..."></textarea>
                                <div class="modal-completar-cita-actions">
                                    <button id="modal-completar-cita-guardar">Guardar</button>
                                    <button id="modal-completar-cita-cerrar">Cerrar</button>
                                </div>
                            </div>
                        </div>

                        <!-- Modal Usuarios -->
<div id="modal-obtener-clientes-y-usuarios" class="modal-obtener-clientes-y-usuarios">
  <div id="modal-clientes-y-usuarios-content" class="modal-clientes-y-usuarios-content">
    <!-- Botón de cierre -->
    <span id="cerrar-modal-usuarios" class="cerrar-modal-usuarios">×</span>

    <!-- Menú de filtros -->
    <div id="modal-clientes-y-usuarios-filtros" class="modal-clientes-y-usuarios-filtros">
      <label for="filtro-tipo">Filtrar por:</label>
      <select id="filtro-tipo" class="filtro-tipo" onchange="actualizarFiltro()">
        <option value="Nombre">Nombre Completo</option>
        <option value="Telefono">Teléfono</option>
        <option value="Correo_Electronico">Correo Electrónico</option>
        <option value="Verificado">Verificado</option>
      </select>
      <input
        type="text"
        id="filtro-usuarios-valor"
        class="filtro-usuarios-valor"
        placeholder="Escribe para filtrar..."
        oninput="filtrarDatos()"
      />
    </div>
    <!-- Contenedor de Usuarios y Clientes -->
    <div class="modal-clientes-y-usuarios-grid">
      <!-- Sección Usuarios -->
      <div class="modal-clientes-y-usuarios-seccion usuarios">
        <h2>Usuarios</h2>
        <p id="usuarios-resultados" class="resultados-texto"></p>
        <div id="usuarios-container" class="usuarios-container">
          <!-- Aquí se cargarán los usuarios -->
        </div>
      </div>
      <!-- Línea divisoria -->
      <div class="modal-clientes-y-usuarios-divider"></div>
      <!-- Sección Clientes -->
      <div class="modal-clientes-y-usuarios-seccion clientes">
        <h2>Clientes</h2>
        <p id="clientes-resultados" class="resultados-texto"></p>
        <div id="clientes-container" class="clientes-container">
          <!-- Aquí se cargarán los clientes -->
        </div>
      </div>
    </div>
  </div>
</div>



<!-- MODAL MODIFICAR USUARIOS -->
<div id="modal-modificar-usuario" class="modal-modificar-usuario" style="display: none;">
  <div id="modal-modificar-usuario-content" class="modal-modificar-usuario-content">
    <h3>Modificar Usuario</h3>
    <form id="form-modificar-usuario" class="form-modificar-usuario">
      <label for="modificar-nombre">Nombre:</label>
      <input type="text" id="modificar-nombre" class="modificar-nombre" />

      <label for="modificar-apellidos">Apellidos:</label>
      <input type="text" id="modificar-apellidos" class="modificar-apellidos" />

      <label for="modificar-telefono">Teléfono:</label>
      <input type="text" id="modificar-telefono" class="modificar-telefono" />

      <label for="modificar-correo">Correo Electrónico:</label>
      <input type="text" id="modificar-correo" class="modificar-correo" />

      <div class="modal-modificar-usuario-footer">
        <button type="button" id="boton-modificar-usuario-aceptar" class="boton-modificar-usuario-aceptar">
          Aceptar
        </button>
        <button type="button" id="boton-modificar-usuario-cerrar" class="boton-modificar-usuario-cerrar">
          Cancelar
        </button>
      </div>
    </form>
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

