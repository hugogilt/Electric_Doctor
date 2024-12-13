<?php
session_start();

// Verificar si el usuario está autenticado
if (!isset($_SESSION['rol']) || !isset($_SESSION['id_usuario'])) {
    echo json_encode(['status' => 'error', 'message' => 'No autorizado']);
    exit;
}

// Incluir archivo de conexión a la base de datos
include_once('../config/conexion.php');

try {
    // Comprobar si el usuario es administrador
    if ($_SESSION['rol'] === 'admin') {
        // Si es admin, obtener los datos del administrador actual
        $stmt = $conexion->prepare("SELECT ID_Usuario, Nombre, Apellidos, Correo_Electronico, Telefono, Verificado 
                                    FROM Usuarios 
                                    WHERE ID_Usuario = :id_usuario");
        $stmt->bindParam(':id_usuario', $_SESSION['id_usuario'], PDO::PARAM_INT);
        $stmt->execute();
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

        // Verificar si el usuario existe
        if ($usuario) {
            // Devolver los datos del administrador en formato de objeto
            echo json_encode(['status' => 'success', 'data' => $usuario]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Usuario no encontrado']);
        }
    } else {
        // Si no es admin, retornar error
        echo json_encode(['status' => 'error', 'message' => 'Acceso no autorizado. Solo los administradores pueden ver esta información']);
    }
} catch (PDOException $e) {
    // Manejo de errores en caso de fallo
    echo json_encode(['status' => 'error', 'message' => 'Error en la consulta: ' . $e->getMessage()]);
}
?>
