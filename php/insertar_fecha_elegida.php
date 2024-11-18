<?php
session_start();
require '../config/conexion.php';

$data = json_decode(file_get_contents('php://input'), true);
$fechaHora = $data['fechaHora'];

$response = array();

try {
    // Consulta para verificar si la fecha y hora ya existen
    $sqlCheck = "SELECT COUNT(*) FROM Citas WHERE Fecha_Hora = :fechaHora";
    $stmtCheck = $conexion->prepare($sqlCheck);
    $stmtCheck->bindParam(':fechaHora', $fechaHora);
    $stmtCheck->execute();
    $exists = $stmtCheck->fetchColumn();

    if ($exists > 0) {
        // Si la fecha y hora ya existen, retornamos un mensaje de error
        $response['success'] = false;
        $response['message'] = 'La hora seleccionada ya no se encuentra disponible';
    } else {
        // Insertar la nueva fecha y hora si no está ocupada
        $sqlInsert = "INSERT INTO Citas (Fecha_Hora) VALUES (:fechaHora)";
        $stmtInsert = $conexion->prepare($sqlInsert);
        $stmtInsert->bindParam(':fechaHora', $fechaHora);

        if ($stmtInsert->execute()) {
            $response['success'] = true;
            $response['message'] = 'Reserva guardada con éxito';
        } else {
            $response['success'] = false;
            $response['message'] = 'Error al guardar la reserva';
        }
    }
} catch (PDOException $e) {
    $response['success'] = false;
    $response['message'] = 'Error en la consulta: ' . $e->getMessage();
}

echo json_encode($response);
?>
