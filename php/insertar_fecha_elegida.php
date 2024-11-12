<?php
session_start();
// Conexión a la base de datos
require '../config/conexion.php';

// Recibimos los datos enviados por POST
$data = json_decode(file_get_contents('php://input'), true);

// Obtenemos la fecha y hora
$fechaHora = $data['chosenDate'];

try {
    // Consulta para insertar la fecha y hora en la tabla Disponibilidad_Citas
    $query = "INSERT INTO Disponibilidad_Citas (Fecha_Hora) VALUES (:fechaHora)";

    // Preparamos la consulta
    $stmt = $conexion->prepare($query);

    // Vinculamos el parámetro
    $stmt->bindParam(':fechaHora', $fechaHora);

    // Ejecutamos la consulta
    if ($stmt->execute()) {
        // Si la inserción es exitosa, respondemos con un JSON de éxito
        echo json_encode(['success' => true, 'message' => 'Reserva guardada con éxito']);
    } else {
        // Si hubo un error, respondemos con un JSON de error
        echo json_encode(['success' => false, 'message' => 'Error al guardar la reserva']);
    }
} catch (PDOException $e) {
    // En caso de error en la consulta
    echo json_encode(['success' => false, 'message' => 'Error en la consulta: ' . $e->getMessage()]);
}
?>
