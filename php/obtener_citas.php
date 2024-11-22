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
    // Comprobar si existe la variable de sesión
    if (isset($_SESSION['id_usuario'])) {
        $idUsuario = $_SESSION['id_usuario'];

        // Comprobar el rol del usuario
        $sqlRol = "SELECT Rol FROM Usuarios WHERE ID_Usuario = :idUsuario";
        $stmtRol = $conexion->prepare($sqlRol);
        $stmtRol->bindParam(':idUsuario', $idUsuario);
        $stmtRol->execute();
        $usuario = $stmtRol->fetch(PDO::FETCH_ASSOC);

        if ($usuario) {
            $rol = $usuario['Rol'];
            $sqlCitas = "";

            if ($rol === 'cliente') {
                // Si es cliente, buscar las citas asociadas al ID del usuario
                $sqlCitas = "SELECT * FROM Citas WHERE ID_Usuario = :idUsuario";
            } elseif ($rol === 'admin') {
                // Si es admin, devolver todas las citas de la tabla
                $sqlCitas = "SELECT * FROM Citas";
            } else {
                $response['error'] = 'Rol no reconocido.';
                echo json_encode($response);
                exit;
            }

            $stmtCitas = $conexion->prepare($sqlCitas);

            if ($rol === 'cliente') {
                $stmtCitas->bindParam(':idUsuario', $idUsuario);
            }

            $stmtCitas->execute();
            $citas = $stmtCitas->fetchAll(PDO::FETCH_ASSOC);

            if ($citas) {
                $response['citas'] = [];

                foreach ($citas as $cita) {
                    $detalleCita = [
                        'ID_Cita' => $cita['ID_Cita'],
                        'Modelo_Vehiculo' => $cita['Modelo_Vehiculo'],
                        'Ano_Matriculacion' => $cita['Ano_Matriculacion'],
                        'Fecha_Hora' => $cita['Fecha_Hora'],
                        'Motivo' => $cita['Motivo'],
                        'Estado' => $cita['Estado']
                    ];

                    // Verificar si la cita tiene un ID_Usuario asociado
                    if (!is_null($cita['ID_Usuario'])) {
                        $sqlUsuario = "SELECT Nombre, Apellidos, Telefono, Correo_Electronico 
                                       FROM Usuarios 
                                       WHERE ID_Usuario = :idUsuario";
                        $stmtUsuario = $conexion->prepare($sqlUsuario);
                        $stmtUsuario->bindParam(':idUsuario', $cita['ID_Usuario']);
                        $stmtUsuario->execute();
                        $datosUsuario = $stmtUsuario->fetch(PDO::FETCH_ASSOC);

                        if ($datosUsuario) {
                            $detalleCita = array_merge($detalleCita, $datosUsuario);
                        }
                    }
                    // Verificar si la cita tiene un ID_Cliente asociado
                    elseif (!is_null($cita['ID_Cliente'])) {
                        $sqlCliente = "SELECT Nombre, Apellidos, Telefono, Correo_Electronico 
                                       FROM Clientes 
                                       WHERE ID_Cliente = :idCliente";
                        $stmtCliente = $conexion->prepare($sqlCliente);
                        $stmtCliente->bindParam(':idCliente', $cita['ID_Cliente']);
                        $stmtCliente->execute();
                        $datosCliente = $stmtCliente->fetch(PDO::FETCH_ASSOC);

                        if ($datosCliente) {
                            $detalleCita = array_merge($detalleCita, $datosCliente);
                        }
                    }

                    $response['citas'][] = $detalleCita;
                }
            } else {
                $response['error'] = 'No se encontraron citas.';
            }
        } else {
            $response['error'] = 'Usuario no encontrado.';
        }
    } else {
        $response['error'] = 'No se ha iniciado sesión.';
    }
} catch (PDOException $e) {
    $response['error'] = 'Error en la base de datos: ' . $e->getMessage();
}

// Enviar la respuesta como JSON
echo json_encode($response);
?>
