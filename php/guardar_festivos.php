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
    
    // Comprobar si se ha recibido la fecha y la acción
    if (isset($inputData['fecha']) && isset($inputData['action']) && !empty($inputData['fecha'])) {
        $fecha = $inputData['fecha'];
        $action = $inputData['action'];

        if ($action === 'add') {
            $sql = "INSERT INTO Dias_Festivos (fecha) VALUES (:fecha) ON DUPLICATE KEY UPDATE fecha = fecha";
        } elseif ($action === 'remove') {
            $sql = "DELETE FROM Dias_Festivos WHERE fecha = :fecha";
        } else {
            $response['success'] = false;
            $response['message'] = 'Acción no válida.';
            echo json_encode($response);
            exit;
        }

        $stmt = $conexion->prepare($sql);
        $stmt->bindParam(':fecha', $fecha, PDO::PARAM_STR);
        $stmt->execute();

        if ($stmt->rowCount() > 0 || $action === 'add') {
            $response['success'] = true;
            $response['message'] = 'Operación realizada correctamente.';
        } else {
            $response['success'] = false;
            $response['message'] = 'No se realizaron cambios.';
        }
    } else {
        $response['success'] = false;
        $response['message'] = 'Datos inválidos.';
    }
} catch (PDOException $e) {
    $response['success'] = false;
    $response['message'] = 'Error en la base de datos: ' . $e->getMessage();
}

// Enviar la respuesta como JSON
echo json_encode($response);
?>
