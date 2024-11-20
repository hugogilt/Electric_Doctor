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
                // Mostrar el panel de administración
                echo "Bienvenido al panel de administración";
                // O incluir el contenido del panel
                // include 'admin_panel_content.php'; // por ejemplo
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
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel Admin</title>
</head>
<body>
    Eso es el panel de admin
</body>
</html>
