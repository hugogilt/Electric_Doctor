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
                        <img width="100%" src="/images/panel-admin/calendar.png" alt="Abrir Calendario">
                        </section>

                        <section class="option" id="citas">
                        <div id="titulo-citas">
                            <h2 id="h2-citas">Calendario Citas</h2>
                        </div>
                        <img width="100px" src="/images/panel-admin/calendar.png" alt="Abrir Calendario">
                        </section>

                        <section class="option" id="citas">
                        <div id="titulo-citas">
                            <h2 id="h2-citas">Calendario Citas</h2>
                        </div>
                        <img width="100px" src="/images/panel-admin/calendar.png" alt="Abrir Calendario">
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

