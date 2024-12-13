<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Incluir el archivo de conexión a la base de datos
include '../config/conexion.php';

// Establecer el encabezado de respuesta como JSON
header('Content-Type: application/json');

// Inicializar respuesta
$response = array();

// Comprobar si se recibió el dato Fecha_Hora
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $fechaHora = $input['Fecha_Hora'] ?? null;

    if ($fechaHora) {
        try {
            // Buscar los datos de la cita
            $sqlCita = "SELECT Modelo_Vehiculo, Ano_Matriculacion, Motivo, Estado, ID_Usuario, ID_Cliente 
                        FROM Citas 
                        WHERE Fecha_Hora = :fechaHora";
            $stmtCita = $conexion->prepare($sqlCita);
            $stmtCita->bindParam(':fechaHora', $fechaHora);
            $stmtCita->execute();
            $cita = $stmtCita->fetch(PDO::FETCH_ASSOC);

            if ($cita) {
                $response['Modelo_Vehiculo'] = $cita['Modelo_Vehiculo'];
                $response['Ano_Matriculacion'] = $cita['Ano_Matriculacion'];
                $response['Motivo'] = $cita['Motivo'];
                $response['Estado'] = $cita['Estado'];

                // Si ID_Usuario no es nulo, buscar en la tabla Usuarios
                if ($cita['ID_Usuario']) {
                    $sqlUsuario = "SELECT ID_Usuario, Nombre, Apellidos, Telefono, Correo_Electronico 
                                   FROM Usuarios 
                                   WHERE ID_Usuario = :idUsuario";
                    $stmtUsuario = $conexion->prepare($sqlUsuario);
                    $stmtUsuario->bindParam(':idUsuario', $cita['ID_Usuario']);
                    $stmtUsuario->execute();
                    $usuario = $stmtUsuario->fetch(PDO::FETCH_ASSOC);

                    if ($usuario) {
                        $response['Nombre'] = $usuario['Nombre'];
                        $response['Apellidos'] = $usuario['Apellidos'];
                        $response['Telefono'] = $usuario['Telefono'];
                        $response['Correo_Electronico'] = $usuario['Correo_Electronico'];
                        $response['ID'] = $usuario['ID_Usuario'];
                    }
                } 
                // Si ID_Cliente no es nulo, buscar en la tabla Clientes
                elseif ($cita['ID_Cliente']) {
                    $sqlCliente = "SELECT ID_Cliente, Nombre, Apellidos, Telefono, Correo_Electronico 
                                   FROM Clientes 
                                   WHERE ID_Cliente = :idCliente";
                    $stmtCliente = $conexion->prepare($sqlCliente);
                    $stmtCliente->bindParam(':idCliente', $cita['ID_Cliente']);
                    $stmtCliente->execute();
                    $cliente = $stmtCliente->fetch(PDO::FETCH_ASSOC);

                    if ($cliente) {
                        $response['Nombre'] = $cliente['Nombre'];
                        $response['Apellidos'] = $cliente['Apellidos'];
                        $response['Telefono'] = $cliente['Telefono'];
                        $response['Correo_Electronico'] = $cliente['Correo_Electronico'];
                        $response['ID'] = $cliente['ID_Cliente'];
                    }
                }
            } else {
                $response['error'] = 'No se encontró una cita con la fecha y hora proporcionadas.';
            }
        } catch (PDOException $e) {
            $response['error'] = 'Error en la base de datos: ' . $e->getMessage();
        }
    } else {
        $response['error'] = 'El parámetro Fecha_Hora es obligatorio.';
    }
} else {
    $response['error'] = 'Método no permitido. Debe ser POST.';
}

// Enviar la respuesta como JSON
echo json_encode($response);
?>
