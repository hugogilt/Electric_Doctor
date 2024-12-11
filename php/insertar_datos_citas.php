<?php
session_start();
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require './PHPMailer-master/src/PHPMailer.php';
require './PHPMailer-master/src/SMTP.php';
require './PHPMailer-master/src/Exception.php';

include '../config/conexion.php';
include './PHPMailer-master/src/configurar_phpmailer.php';

$response = array();

header('Content-Type: application/json');

try {
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $data = json_decode(file_get_contents("php://input"));

        if (
            isset($data->nombre, $data->apellidos, $data->telefono, $data->correo, 
                $data->marca, $data->anio, $data->problema, $data->fechaHora)
        ) {
            $nombre = $data->nombre;
            $apellidos = $data->apellidos;
            $telefono = $data->telefono;
            $correo = $data->correo;
            $marca = $data->marca;
            $anio = $data->anio;
            $problema = $data->problema;
            $fechaHora = $data->fechaHora;
            $dataRespuesta = $data->dataRespuesta;

            $userData = null;
            if (isset($_SESSION['correo'])) {
                $correoSesion = $_SESSION['correo'];
                $stmt = $conexion->prepare("SELECT Rol FROM Usuarios WHERE Correo_Electronico = :correoSesion");
                $stmt->bindParam(':correoSesion', $correoSesion, PDO::PARAM_STR);
                $stmt->execute();
                $userData = $stmt->fetch(PDO::FETCH_ASSOC);
            }

            $stmt_check_cita = $conexion->prepare("SELECT COUNT(*) FROM Citas WHERE Fecha_Hora = :fecha_cita");
            $stmt_check_cita->bindParam(':fecha_cita', $fechaHora);
            $stmt_check_cita->execute();
            
            if ($stmt_check_cita->fetchColumn() > 0) {
                $response['status'] = 'error';
                $response['message'] = 'Ya existe una cita en esa fecha y hora.';
            } else {
                $isVerified = function ($id, $table, $role) use ($conexion, $userData) {
                    $stmt = $conexion->prepare("SELECT Verificado FROM $table WHERE ID_$role = :id");
                    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
                    $stmt->execute();
                    $verificado = $stmt->fetchColumn();
                    return $verificado == 1 || ($userData && $userData['Rol'] === 'admin');
                };

                $isPendingLimitReached = function ($id, $role) use ($conexion) {
                    $stmt = $conexion->prepare("SELECT COUNT(*) FROM Citas WHERE ID_$role = :id AND Estado = 'Pendiente'");
                    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
                    $stmt->execute();
                    $count = $stmt->fetchColumn();
                    return $count >= 2;
                };
                

                $insertCita = function ($id, $table, $role) use ($conexion, $marca, $anio, $problema, $fechaHora) {
                    $sql = "INSERT INTO Citas (ID_$role, Modelo_Vehiculo, Ano_Matriculacion, Motivo, Fecha_Hora) 
                            VALUES (:id, :marca, :anio, :problema, :fechaHora)";
                    $stmt = $conexion->prepare($sql);
                    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
                    $stmt->bindParam(':marca', $marca);
                    $stmt->bindParam(':anio', $anio);
                    $stmt->bindParam(':problema', $problema);
                    $stmt->bindParam(':fechaHora', $fechaHora);
                    $stmt->execute();
                };

                if ($dataRespuesta->status == 'exists') {
                    $id_usuario = $dataRespuesta->id_usuario;
                    if ($isVerified($id_usuario, 'Usuarios', 'Usuario')) {
                        if ($isPendingLimitReached($id_usuario, 'Usuario')) {
                            $response['status'] = 'limit-exceeded';
                            $response['message'] = 'No puede tener más de 3 citas pendientes a la vez.';
                        } else {
                            $insertCita($id_usuario, 'Usuarios', 'Usuario');
                            $response['status'] = 'success';
                            $response['message'] = 'Cita registrada exitosamente!';
                        }
                    } else {
                        $response['status'] = 'not-verified-user';
                        $response['message'] = 'Por favor, verifica tu correo electrónico antes de realizar la cita.';
                        $response['correo'] = $correo;
                    }
                } else {
                    $stmt_check_cliente = $conexion->prepare("SELECT ID_Cliente, Verificado FROM Clientes WHERE Correo_electronico = :correo");
                    $stmt_check_cliente->bindParam(':correo', $correo, PDO::PARAM_STR);
                    $stmt_check_cliente->execute();

                    if ($stmt_check_cliente->rowCount() > 0) {
                        $cliente = $stmt_check_cliente->fetch(PDO::FETCH_ASSOC);
                        $id_cliente = $cliente['ID_Cliente'];

                        if ($isVerified($id_cliente, 'Clientes', 'Cliente')) {
                            if ($isPendingLimitReached($id_cliente, 'Cliente')) {
                                $response['status'] = 'limit-exceeded';
                                $response['message'] = 'No puede tener más de 3 citas pendientes a la vez.';
                            } else {
                                $insertCita($id_cliente, 'Clientes', 'Cliente');
                                $response['status'] = 'success';
                                $response['message'] = 'Cita registrada exitosamente!';
                            }                            
                        } else {
                            $response['status'] = 'not-verified-client';
                            $response['correo'] = $correo;
                        }
                    } else {
                        $stmt_cliente = $conexion->prepare("INSERT INTO Clientes (Nombre, Apellidos, Telefono, Correo_electronico) 
                                                           VALUES (:nombre, :apellidos, :telefono, :correo)");
                        $stmt_cliente->bindParam(':nombre', $nombre);
                        $stmt_cliente->bindParam(':apellidos', $apellidos);
                        $stmt_cliente->bindParam(':telefono', $telefono);
                        $stmt_cliente->bindParam(':correo', $correo);
                        $stmt_cliente->execute();
                        $id_cliente = $conexion->lastInsertId();

                        $response['status'] = 'not-verified-client';
                        $response['correo'] = $correo;

                        if ($userData && $userData['Rol'] === 'admin') {
                            $insertCita($id_cliente, 'Clientes', 'Cliente');
                            $response['status'] = 'success';
                            $response['message'] = 'Cita registrada exitosamente!';                         
                        }
                    }
                }
            }
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Faltan datos en la solicitud.';
        }

        if ($response['status'] === 'success') {
            try {
                $mailConfigurator = require('./PHPMailer-master/src/configurar_phpmailer.php'); // Obtener configuración del correo
                $mail = $mailConfigurator();
                $mail->isHTML(true);
                $mail->addAddress($correo, $nombre);
                $mail->Subject = '¡Aquí está su cita!';
                $mail->Body = "       
                    <html>
                    <body style='font-family: Arial, sans-serif; background-color: #F3F3F3; padding: 20px;'>
                        <div style='max-width: 600px; margin: auto; background: #FFFFFF; border-radius: 8px; padding: 20px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);'>
                            <h2 style='color: #FF6C14;'>Detalles de tu cita</h2>
                            <p>Hola <b>{$nombre} {$apellidos}</b>,</p>
                            <p>Le confirmamos que su cita ha sido registrada con éxito. Aquí tiene los detalles:</p>
                            <ul>
                                <li><b>Teléfono:</b> {$telefono}</li>
                                <li><b>Correo:</b> {$correo}</li>
                                <li><b>Marca del vehículo:</b> {$marca}</li>
                                <li><b>Año de matriculación:</b> {$anio}</li>
                                <li><b>Motivo:</b> {$problema}</li>
                                <li><b>Fecha y hora:</b> {$fechaHora}</li>
                            </ul>
                            <p>Si tiene alguna consulta, no dude en contactarnos.</p>
                            <p>Gracias por su confianza,</p>
                            <p><b>Electric Doctor</b></p>
                        </div>
                    </body>
                    </html>
                ";
                $mail->send();
            } catch (Exception $e) {
                $response['email_error'] = 'No se pudo enviar el correo de confirmación.';
            }
        }
    }

    echo json_encode($response);

} catch (Throwable $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Se produjo un error en el servidor.',
        'details' => $e->getMessage(),
    ]);
}
?>
