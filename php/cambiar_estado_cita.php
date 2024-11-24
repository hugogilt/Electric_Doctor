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

// Obtener la ID de la cita desde los datos JSON
$id_cita = $data['id_cita'];

// Comprobar el estado actual de la cita en la base de datos
try {
    // Preparar la consulta para obtener el estado actual de la cita
    $stmt = $conexion->prepare("SELECT Estado FROM Citas WHERE ID_Cita = :id_cita");
    $stmt->bindParam(':id_cita', $id_cita, PDO::PARAM_INT);
    $stmt->execute();

    // Verificar si se encuentra la cita
    if ($stmt->rowCount() > 0) {
        $cita = $stmt->fetch(PDO::FETCH_ASSOC);
        $estado_actual = $cita['Estado'];

        // Determinar el nuevo estado
        $nuevo_estado = ($estado_actual == 'Pendiente') ? 'Completada' : 'Pendiente';

        // Actualizar el estado de la cita
        $update_stmt = $conexion->prepare("UPDATE Citas SET Estado = :nuevo_estado WHERE ID_Cita = :id_cita");
        $update_stmt->bindParam(':nuevo_estado', $nuevo_estado, PDO::PARAM_STR);
        $update_stmt->bindParam(':id_cita', $id_cita, PDO::PARAM_INT);

        // Ejecutar la actualización
        $update_stmt->execute();

        // Devolver respuesta exitosa
        echo json_encode(['status' => 'success', 'message' => 'Estado de la cita actualizado a ' . $nuevo_estado]);
    } else {
        // Si no se encuentra la cita con ese ID
        echo json_encode(['status' => 'error', 'message' => 'Cita no encontrada.']);
    }
} catch (PDOException $e) {
    // Manejo de errores en caso de que algo falle
    echo json_encode(['status' => 'error', 'message' => 'Error al actualizar el estado: ' . $e->getMessage()]);
}
?>
