<?php
session_start();

header('Content-Type: application/json'); // Indicamos que la respuesta será JSON

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
    if (!isset($_POST['correo']) || !isset($_POST['nonVerifiedType'])) {
        throw new Exception('Datos incompletos. No se proporcionó correo o tipo de verificación.');
    }

    $emailUsuario = $_POST['correo'];
    $nonVerifiedType = $_POST['nonVerifiedType'];
    $token = generarToken();

    // Actualizar el token en la base de datos
    if ($nonVerifiedType === 'user') {
        $sql = "UPDATE Usuarios SET token = :token WHERE correo_electronico = :email";
    } elseif ($nonVerifiedType === 'client') {
        $sql = "UPDATE Clientes SET token = :token WHERE correo_electronico = :email";
    } else {
        throw new Exception('Tipo de verificación inválido.');
    }

    $stmt = $conexion->prepare($sql);
    $stmt->bindParam(':token', $token, PDO::PARAM_STR);
    $stmt->bindParam(':email', $emailUsuario, PDO::PARAM_STR);
    $stmt->execute();

    $mailConfigurator = require 'configurar_phpmailer.php';
    $mail = $mailConfigurator();
    

    // Preparar el correo
    $destinatario = $emailUsuario;
    $asunto = "Completa la verificación de tu cuenta";
    $verification_link = "https://electric-doctor.infinityfreeapp.com/php/PHPMailer-master/src/verificar_correo.php?token=$token";
      $cuerpo = "
      <html>
      <body style='font-family: Arial, sans-serif; background-color: #FFEA00; background: linear-gradient(180deg, #FFEA00, #FF6C14); margin: 0; padding: 20px; text-align: center;'>
        <div style='background-color: #3B014D; background: linear-gradient(45deg, #3B014D, #A5005A); border-radius: 15px; padding: 20px; max-width: 400px; margin: auto; color: white; box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);'>
          <h1 style='color: #FFEA00; font-size: 2rem; margin-bottom: 15px;'>¡Verifica tu cuenta!</h1>
          <p style='color: #FFF; font-size: 1.1rem; margin-bottom: 20px;'>Haz click en el botón de abajo para completar el proceso de verificación de tu cuenta.</p>
          <a href='$verification_link' target='_blank' style='display: inline-block; background-color: #FFEA00; color: #3B014D; text-decoration: none; padding: 15px 20px; border-radius: 10px; font-size: 1rem; font-weight: bold;'>Verificar mi cuenta</a>
          <p style='margin-top: 20px; font-size: 0.9rem; color: #FFC;'>Si no solicitaste este correo, ignóralo.</p>
        </div>
      </body>
      </html>";
      
      


    $mail->addAddress($destinatario);
    $mail->Subject = $asunto;
    $mail->isHTML(true);
    $mail->Body = $cuerpo;

    // Enviar el correo
    if ($mail->send()) {
        $response['status'] = 'success';
        $response['message'] = 'Correo enviado correctamente.';
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
