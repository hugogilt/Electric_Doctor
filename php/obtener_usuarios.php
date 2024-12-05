<?php
session_start();

// Incluir archivo de conexión a la base de datos
include_once('../config/conexion.php');

try {
    // Preparar la consulta para obtener los usuarios
    $stmt = $conexion->prepare("SELECT ID_Usuario, Nombre, Apellidos, Correo_Electronico, Telefono, Verificado FROM Usuarios");
    $stmt->execute();

    // Obtener los resultados
    $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Devolver los resultados en formato JSON
    echo json_encode(['status' => 'success', 'data' => $usuarios]);
} catch (PDOException $e) {
    // Manejo de errores en caso de que algo falle
    echo json_encode(['status' => 'error', 'message' => 'Error al obtener usuarios: ' . $e->getMessage()]);
}
