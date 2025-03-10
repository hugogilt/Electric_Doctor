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
    // Consultar los días festivos desde la base de datos
    $sql = "SELECT fecha FROM Dias_Festivos";
    $stmt = $conexion->prepare($sql);
    $stmt->execute();
    
    // Comprobar si se encontraron días festivos
    if ($stmt->rowCount() > 0) {
        $festivos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Crear un array solo con las fechas
        $festivosFechas = array_map(function($item) {
            return $item['fecha'];
        }, $festivos);

        // Devolver los días festivos en la respuesta
        $response['success'] = true;
        $response['festivos'] = $festivosFechas;
    } else {
        $response['success'] = false;
        $response['message'] = 'No se encontraron días festivos.';
    }
} catch (PDOException $e) {
    $response['success'] = false;
    $response['message'] = 'Error en la base de datos: ' . $e->getMessage();
}

// Limpiar cualquier salida previa
ob_clean();

// Enviar la respuesta como JSON
echo json_encode($response);
?>
