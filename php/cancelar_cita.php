<?php
session_start();
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Incluir el archivo de conexión a la base de datos
include '../config/conexion.php';

// Establecer el encabezado de respuesta como JSON
header('Content-Type: application/json');

// Inicializar respuesta
$response = array();

try {
    // Obtener el cuerpo de la solicitud y decodificar el JSON
    $inputData = json_decode(file_get_contents('php://input'), true);
    
    // Comprobar si se ha recibido el ID de la cita
    if (isset($inputData['id_cita']) && !empty($inputData['id_cita'])) {
        $idCita = $inputData['id_cita'];

        // Preparar la consulta para eliminar la cita
        $sqlEliminar = "DELETE FROM Citas WHERE ID_Cita = :idCita";
        $stmtEliminar = $conexion->prepare($sqlEliminar);
        $stmtEliminar->bindParam(':idCita', $idCita);

        // Ejecutar la eliminación
        $stmtEliminar->execute();

        // Comprobar si se ha eliminado alguna fila
        if ($stmtEliminar->rowCount() > 0) {
            $response['success'] = true;
            $response['message'] = 'Cita cancelada correctamente.';
        } else {
            $response['success'] = false;
            $response['message'] = 'No se encontró la cita o ya fue eliminada.';
        }
    } else {
        $response['success'] = false;
        $response['message'] = 'ID de cita no proporcionado.';
    }
} catch (PDOException $e) {
    $response['success'] = false;
    $response['message'] = 'Error en la base de datos: ' . $e->getMessage();
}

// Enviar la respuesta como JSON
echo json_encode($response);
?>
