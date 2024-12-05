<?php
session_start();

// Incluir archivo de conexión a la base de datos
include_once('../config/conexion.php');

try {
    // Preparar la consulta para obtener los clientes
    $stmt = $conexion->prepare("SELECT Nombre, Apellidos, Correo_Electronico, Telefono, Verificado FROM Clientes");
    $stmt->execute();

    // Obtener los resultados
    $clientes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Devolver los resultados en formato JSON
    echo json_encode(['status' => 'success', 'data' => $clientes]);
} catch (PDOException $e) {
    // Manejo de errores en caso de que algo falle
    echo json_encode(['status' => 'error', 'message' => 'Error al obtener clientes: ' . $e->getMessage()]);
}
