<?php
session_start();

// Incluir archivo de conexión a la base de datos
include_once('../config/conexion.php');

// Leer los datos JSON del cuerpo de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

// Verificar si se ha recibido el id_cita en los datos JSON
if (!isset($data['id_cita'])) {
    echo json_encode(['status' => 'error', 'message' => 'ID de cita no proporcionado.']);
    exit;
}

// Obtener los datos de la solicitud
$id_cita = $data['id_cita'];
$observaciones = isset($data['observaciones']) ? trim($data['observaciones']) : '';

try {
    // Comprobar el estado actual de la cita
    $stmt = $conexion->prepare("SELECT Estado FROM Citas WHERE ID_Cita = :id_cita");
    $stmt->bindParam(':id_cita', $id_cita, PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $cita = $stmt->fetch(PDO::FETCH_ASSOC);
        $estado_actual = $cita['Estado'];

        // Determinar el nuevo estado
        $nuevo_estado = ($estado_actual == 'Pendiente') ? 'Completada' : 'Pendiente';

        // Preparar la consulta de actualización
        $update_query = "UPDATE Citas SET Estado = :nuevo_estado";
        if ($nuevo_estado == 'Completada' && !empty($observaciones)) {
            $update_query .= ", Observaciones = :observaciones";
        }
        $update_query .= " WHERE ID_Cita = :id_cita";

        $update_stmt = $conexion->prepare($update_query);
        $update_stmt->bindParam(':nuevo_estado', $nuevo_estado, PDO::PARAM_STR);
        $update_stmt->bindParam(':id_cita', $id_cita, PDO::PARAM_INT);

        // Si hay observaciones y el estado cambia a 'Completada', vincularlas
        if ($nuevo_estado == 'Completada' && !empty($observaciones)) {
            $update_stmt->bindParam(':observaciones', $observaciones, PDO::PARAM_STR);
        }

        // Ejecutar la consulta de actualización
        $update_stmt->execute();

        // Devolver respuesta exitosa
        echo json_encode(['status' => 'success', 'message' => 'Estado de la cita actualizado a ' . $nuevo_estado]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Cita no encontrada.']);
    }
} catch (PDOException $e) {
    // Manejo de errores en caso de que algo falle
    echo json_encode(['status' => 'error', 'message' => 'Error al actualizar el estado: ' . $e->getMessage()]);
}
?>
