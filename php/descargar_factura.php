<?php
// Incluir el archivo de conexión
require '../config/conexion.php';

// Iniciar la sesión para verificar al usuario
session_start();

// Verificar si el usuario está autenticado
if (!isset($_SESSION['rol'])) {
    http_response_code(401); // No autorizado
    echo json_encode(['error' => 'Acceso no autorizado.']);
    exit;
}

// Habilitar la visualización de errores (opcional)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Verificar que se reciba el ID de la factura
if (!isset($_POST['id']) || empty($_POST['id'])) {
    http_response_code(400); // Solicitud incorrecta
    echo json_encode(['error' => 'ID de factura no especificado.']);
    exit;
}

$idFactura = $_POST['id'];
$rol = $_SESSION['rol'];
$id_usuario_sesion = isset($_SESSION['id_usuario']) ? $_SESSION['id_usuario'] : null;

try {
    // Construir la consulta dependiendo del rol
    $query = "SELECT Nombre_Archivo FROM Facturas WHERE ID_Factura = :id";

    if ($rol === 'cliente') {
        // Agregar una condición para verificar que la factura pertenece al usuario
        if ($id_usuario_sesion === null) {
            http_response_code(401); // No autorizado
            echo json_encode(['error' => 'Acceso no autorizado.']);
            exit;
        }
        $query .= " AND ID_Usuario = :id_usuario";
    }

    // Preparar y ejecutar la consulta
    $stmt = $conexion->prepare($query);
    $stmt->bindParam(':id', $idFactura, PDO::PARAM_INT);

    if ($rol === 'cliente') {
        $stmt->bindParam(':id_usuario', $id_usuario_sesion, PDO::PARAM_INT);
    }

    $stmt->execute();

    $factura = $stmt->fetch(PDO::FETCH_ASSOC);

    // Verificar si se encontró la factura
    if (!$factura) {
        http_response_code(404); // No encontrado
        echo json_encode(['error' => 'Factura no encontrada o acceso denegado.']);
        exit;
    }

    $nombreArchivo = $factura['Nombre_Archivo'];
    $rutaArchivo = '../facturas/' . $nombreArchivo; // Ruta completa del archivo

    // Verificar si el archivo existe
    if (!file_exists($rutaArchivo)) {
        http_response_code(404); // No encontrado
        echo json_encode(['error' => 'Archivo de factura no encontrado en el servidor.']);
        exit;
    }

    // Configurar headers para la descarga
    header('Content-Description: File Transfer');
    header('Content-Type: application/pdf');
    header('Content-Disposition: attachment; filename="' . basename($rutaArchivo) . '"');
    header('Content-Length: ' . filesize($rutaArchivo));
    readfile($rutaArchivo);
    exit;

} catch (Exception $e) {
    http_response_code(500); // Error interno del servidor
    echo json_encode(['error' => 'Error al descargar la factura: ' . $e->getMessage()]);
    exit;
}
?>
