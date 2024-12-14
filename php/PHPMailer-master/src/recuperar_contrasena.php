<?php
session_start();

header('Content-Type: application/json'); // Respuesta en formato JSON

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Incluir los archivos de PHPMailer
require 'PHPMailer.php';
require 'SMTP.php';
require 'Exception.php';
require '../../../config/conexion.php';
require 'configurar_phpmailer.php';

function generarToken($longitud = 32) {
    return bin2hex(random_bytes($longitud)); // Generar un token aleatorio
}

$response = [
    'status' => 'error', // Por defecto
    'message' => '',
    'seconds_remaining' => 0,
];

try {
    // Validar tiempo mínimo entre envíos
    $tiempo_actual = time();
    $tiempo_minimo = 30; // 30 segundos de espera

    if (isset($_SESSION['last_action_time'])) {
        $tiempo_transcurrido = $tiempo_actual - $_SESSION['last_action_time'];
        if ($tiempo_transcurrido < $tiempo_minimo) {
            $response['status'] = 'timeout';
            $response['message'] = 'Debes esperar ' . ($tiempo_minimo - $tiempo_transcurrido) . ' segundos antes de enviar otro correo.';
            $response['seconds_remaining'] = $tiempo_minimo - $tiempo_transcurrido;
            echo json_encode($response);
            exit;
        }
    }

    // Actualizamos el tiempo de la última acción
    $_SESSION['last_action_time'] = $tiempo_actual;

    // Obtener datos del formulario
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['correo'])) {
        throw new Exception('El correo electrónico es obligatorio.');
    }

    $correo = $data['correo'];

    // Generar un token único
    $token = generarToken();

    // Buscar el correo en la base de datos
    $query = "SELECT ID_Usuario FROM Usuarios WHERE Correo_Electronico = ?";
    $stmt = $conexion->prepare($query);
    $stmt->execute([$correo]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$usuario) {
        throw new Exception('El correo no está registrado.');
    }

    // Guardar el token en la base de datos
    $query = "UPDATE Usuarios SET Token = ? WHERE Correo_Electronico = ?";
    $stmt = $conexion->prepare($query);
    $stmt->execute([$token, $correo]);

    // Configurar PHPMailer
    $mailConfigurator = require 'configurar_phpmailer.php';
    $mail = $mailConfigurator();

    // Preparar el correo
    $reset_link = "https://electric-doctor.infinityfreeapp.com/php/reset_password.php?token=$token";
    $mail->addAddress($correo);
    $mail->Subject = 'Recupera tu contraseña';
    $mail->isHTML(true);
    $mail->Body = "
    <html>
    <body style='font-family: Arial, sans-serif;'>
        <div style='max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;'>
            <h2 style='color: #333;'>Recupere su contraseña</h2>
            <p>Parece que ha olvidado su contraseña, para generar una nueva, haga clic en el botón a continuación:</p>
            <a href='$reset_link' target='_blank' style='display: inline-block; padding: 10px 15px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;'>Restablecer contraseña</a>
            <p>Si no ha solicitado este correo, ignórelo.</p>
        </div>
    </body>
    </html>
    ";

    // Enviar el correo
    if ($mail->send()) {
        $response['status'] = 'success';
        $response['message'] = 'Correo de recuperación enviado correctamente.';
    } else {
        throw new Exception('Error al enviar el correo: ' . $mail->ErrorInfo);
    }
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

// Responder con el JSON
echo json_encode($response);
?>
