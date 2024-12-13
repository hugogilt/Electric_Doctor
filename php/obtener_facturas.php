<?php
// Incluir el archivo de conexión
require '../config/conexion.php';

// Habilitar la visualización de errores
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start(); // Iniciar la sesión para acceder a las variables de sesión

try {
    // Verificar el rol del usuario en la sesión
    if (!isset($_SESSION['rol'])) {
        echo json_encode(['error' => 'Acceso no autorizado.']);
        exit;
    }

    $rol = $_SESSION['rol'];
    $id_usuario = isset($_SESSION['id_usuario']) ? $_SESSION['id_usuario'] : null;

    // Consulta base para obtener las facturas
    $query = "
        SELECT 
            f.ID_Factura, 
            f.ID_Usuario, 
            f.ID_Cliente, 
            f.Monto_Total, 
            f.Fecha_Emision,
            u.Nombre AS Nombre_Usuario,
            u.Apellidos AS Apellidos_Usuario,
            u.Telefono AS Telefono_Usuario,
            u.Correo_Electronico AS Correo_Usuario,
            c.Nombre AS Nombre_Cliente,
            c.Apellidos AS Apellidos_Cliente,
            c.Telefono AS Telefono_Cliente,
            c.Correo_Electronico AS Correo_Cliente
        FROM Facturas f
        LEFT JOIN Usuarios u ON f.ID_Usuario = u.ID_Usuario
        LEFT JOIN Clientes c ON f.ID_Cliente = c.ID_Cliente
    ";

    // Modificar la consulta según el rol
    if ($rol === 'admin') {
        // Mostrar todas las facturas
    } elseif ($rol === 'cliente') {
        if ($id_usuario === null) {
            echo json_encode(['facturas' => []]); // No devolver nada si no hay ID de usuario
            exit;
        }
        $query .= "WHERE f.ID_Usuario = :id_usuario";
    } else {
        echo json_encode(['error' => 'Rol no reconocido.']);
        exit;
    }

    // Preparar y ejecutar la consulta
    $stmt = $conexion->prepare($query);

    if ($rol === 'cliente') {
        $stmt->bindParam(':id_usuario', $id_usuario, PDO::PARAM_INT);
    }

    $stmt->execute();

    // Obtener todos los resultados
    $facturas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Crear un array para almacenar las facturas procesadas
    $resultados = [];

    foreach ($facturas as $factura) {
        // Determinar si es usuario o cliente y usar los datos correspondientes
        $nombre = $factura['ID_Usuario'] ? $factura['Nombre_Usuario'] : $factura['Nombre_Cliente'];
        $apellidos = $factura['ID_Usuario'] ? $factura['Apellidos_Usuario'] : $factura['Apellidos_Cliente'];
        $telefono = $factura['ID_Usuario'] ? $factura['Telefono_Usuario'] : $factura['Telefono_Cliente'];
        $correo = $factura['ID_Usuario'] ? $factura['Correo_Usuario'] : $factura['Correo_Cliente'];

        // Agregar la factura procesada al array de resultados
        $resultados[] = [
            'ID_Factura' => $factura['ID_Factura'],
            'Nombre' => $nombre,
            'Apellidos' => $apellidos,
            'Telefono' => $telefono,
            'Correo_Electronico' => $correo,
            'Monto_Total' => $factura['Monto_Total'],
            'Fecha_Emision' => $factura['Fecha_Emision']
        ];
    }

    // Devolver los resultados como JSON
    echo json_encode(['facturas' => $resultados]);

} catch (Exception $e) {
    // Si ocurre algún error, devolver un mensaje de error
    echo json_encode(['error' => 'Error al obtener las facturas: ' . $e->getMessage()]);
}
?>
