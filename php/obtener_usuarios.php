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
    // Comprobar el rol del usuario
    if ($_SESSION['rol'] === 'admin') {
        // Si es admin, obtener los datos de todos los usuarios
        $stmt = $conexion->prepare("SELECT ID_Usuario, Nombre, Apellidos, Correo_Electronico, Telefono, Verificado FROM Usuarios");
        $stmt->execute();
        $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Devolver los datos de todos los usuarios
        echo json_encode(['status' => 'success', 'data' => $usuarios]);
    } elseif ($_SESSION['rol'] === 'cliente') {
        // Si es cliente, obtener solo los datos del usuario actual
        $stmt = $conexion->prepare("SELECT ID_Usuario, Nombre, Apellidos, Correo_Electronico, Telefono, Verificado 
                                    FROM Usuarios 
                                    WHERE ID_Usuario = :id_usuario");
        $stmt->bindParam(':id_usuario', $_SESSION['id_usuario'], PDO::PARAM_INT);
        $stmt->execute();
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

        // Verificar si el usuario existe
        if ($usuario) {
            echo json_encode(['status' => 'success', 'data' => $usuario]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Usuario no encontrado']);
        }
    } else {
        // Rol no válido
        echo json_encode(['status' => 'error', 'message' => 'Rol no autorizado']);
    }
} catch (PDOException $e) {
    // Manejo de errores en caso de fallo
    echo json_encode(['status' => 'error', 'message' => 'Error en la consulta: ' . $e->getMessage()]);
}
