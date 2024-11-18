<?php
session_start();
require '../config/conexion.php';

try {
    // Consulta para obtener todas las fechas y horas no disponibles
    $sql = "SELECT Fecha_Hora FROM Citas";
    $stmt = $conexion->prepare($sql);
    $stmt->execute();
    
    // Fetch all results in a single array
    $nonAvailableSlots = $stmt->fetchAll(PDO::FETCH_COLUMN);

    // Convert the PHP array to JSON
    echo json_encode($nonAvailableSlots);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Error al obtener las fechas: ' . $e->getMessage()]);
}
?>
