<?php
session_start();
require '../config/conexion.php';

$response = [];

try {
    // Asegurarse de que la variable de sesión esté configurada
    if (isset($_SESSION['correo'])) {
        $correo = $_SESSION['correo'];

        // Consulta preparada para evitar inyección SQL
        $sql = "SELECT Nombre, Apellidos, Telefono, Correo_Electronico, Rol
                FROM Usuarios 
                WHERE Correo_Electronico = :correo";
        $stmt = $conexion->prepare($sql);
        $stmt->bindParam(':correo', $correo, PDO::PARAM_STR);
        $stmt->execute();

        // Obtener los datos como un array asociativo
        $userData = $stmt->fetch(PDO::FETCH_ASSOC);
        // if ($userData['Rol'] = 'admin') {
            ini_set('session.cookie_lifetime', 0);
        // }
        // Verificar si se encontraron resultados
        if ($userData) {
            $response = $userData;
        } else {
            $response = ['error' => 'Usuario no encontrado'];
        }
    } else {
        $response = ['error' => 'Sesión no iniciada'];
    }
} catch (PDOException $e) {
    $response = ['error' => 'Error al obtener los datos: ' . $e->getMessage()];
}

// Convertir el array PHP a JSON y devolverlo
echo json_encode($response);
?>
