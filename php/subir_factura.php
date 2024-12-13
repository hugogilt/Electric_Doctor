<?php
// Habilitar la visualización de errores
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

// Incluir el archivo de conexión
require '../config/conexion.php';
$conexion->exec("SET time_zone = '+01:00'");  // Para la zona horaria CET (España)

session_start();

// Verificar que el usuario tiene rol de admin
if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'admin') {
    echo json_encode(['status' => 'error', 'message' => 'Acceso no autorizado.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $id_persona = isset($_POST['id_usuario']) ? $_POST['id_usuario'] : NULL;
        $correo = isset($_POST['correo']) ? $_POST['correo'] : '';
        $monto_total = isset($_POST['monto_total']) ? (float)$_POST['monto_total'] : 0; // Convertir a float
        $archivo = $_FILES['factura'];

        if ($monto_total <= 0) {
            echo json_encode(['status' => 'error', 'message' => 'El monto total debe ser mayor a 0.']);
            exit;
        }

        // Verificar si hay errores en el archivo
        if ($archivo['error'] !== UPLOAD_ERR_OK) {
            echo json_encode(['status' => 'error', 'message' => 'Error al subir el archivo.']);
            exit;
        }

        // Validar que sea un archivo PDF
        $tipo_archivo = mime_content_type($archivo['tmp_name']);
        if ($tipo_archivo !== 'application/pdf') {
            echo json_encode(['status' => 'error', 'message' => 'Solo se pueden subir archivos PDF.']);
            exit;
        }

        // Determinar si el ID pertenece a un usuario o cliente y verificar el correo
        $id_usuario = null;
        $id_cliente = null;

        $query_usuario = "SELECT ID_Usuario FROM Usuarios WHERE ID_Usuario = ? AND Correo_Electronico = ?";
        $stmt_usuario = $conexion->prepare($query_usuario);
        $stmt_usuario->execute([$id_persona, $correo]);
        $usuario = $stmt_usuario->fetch(PDO::FETCH_ASSOC);

        if ($usuario) {
            $id_usuario = $usuario['ID_Usuario'];
        } else {
            $query_cliente = "SELECT ID_Cliente FROM Clientes WHERE ID_Cliente = ? AND Correo_Electronico = ?";
            $stmt_cliente = $conexion->prepare($query_cliente);
            $stmt_cliente->execute([$id_persona, $correo]);
            $cliente = $stmt_cliente->fetch(PDO::FETCH_ASSOC);

            if ($cliente) {
                $id_cliente = $cliente['ID_Cliente'];
            } else {
                echo json_encode(['status' => 'error', 'message' => 'ID o correo electrónico no válido.']);
                exit;
            }
        }

        // Generar un nombre único para el archivo
        $nombre_archivo = uniqid('factura_', true) . '.pdf';

        // Mover el archivo a la carpeta de facturas
        $ruta_destino = '../facturas/' . $nombre_archivo;
        if (file_exists($ruta_destino)) {
            echo json_encode(['status' => 'error', 'message' => 'El archivo ya existe.']);
            exit;
        }

        if (!move_uploaded_file($archivo['tmp_name'], $ruta_destino)) {
            echo json_encode(['status' => 'error', 'message' => 'Error al mover el archivo.']);
            exit;
        }

        // Insertar la información en la base de datos usando PDO
        $query = null;
        if ($id_usuario) {
            $query = "INSERT INTO Facturas (ID_Usuario, Nombre_Archivo, Fecha_Emision, Monto_Total) VALUES (?, ?, NOW(), ?)";
            $stmt = $conexion->prepare($query);
            $stmt->execute([$id_usuario, $nombre_archivo, $monto_total]);
        } else {
            $query = "INSERT INTO Facturas (ID_Cliente, Nombre_Archivo, Fecha_Emision, Monto_Total) VALUES (?, ?, NOW(), ?)";
            $stmt = $conexion->prepare($query);
            $stmt->execute([$id_cliente, $nombre_archivo, $monto_total]);
        }

        echo json_encode(['status' => 'success', 'message' => 'Factura subida y registrada correctamente.']);
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => 'Error: ' . $e->getMessage()]);
    }
}

