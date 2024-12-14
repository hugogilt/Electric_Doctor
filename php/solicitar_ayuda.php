<?php
session_start();

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Incluir los archivos de PHPMailer
require './PHPMailer-master/src/PHPMailer.php';
require './PHPMailer-master/src/SMTP.php';
require './PHPMailer-master/src/Exception.php';

// Incluir la configuración de PHPMailer
require './PHPMailer-master/src/configurar_phpmailer.php';

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

    // Actualizar el tiempo de la última acción
    $_SESSION['last_action_time'] = $tiempo_actual;

    // Obtener los datos del formulario
    $nombre = filter_var($_POST['nombre'], FILTER_SANITIZE_STRING);
    $emailUsuario = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $mensaje = filter_var($_POST['mensaje'], FILTER_SANITIZE_STRING);

    // Configurar el correo utilizando PHPMailer
    $mailConfigurator = require './PHPMailer-master/src/configurar_phpmailer.php';
    $mail = $mailConfigurator();

    // Configurar el correo
    $mail->addAddress('hugogiltejero@gmail.com', 'Electric Doctor'); // Dirección de destino
    $mail->Subject = 'Formulario de Contacto';
    $mail->isHTML(true);
    
    $cuerpo = "
    <html>
    <body style='font-family: Arial, sans-serif;'>
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> $nombre</p>
        <p><strong>Correo:</strong> $emailUsuario</p>
        <p><strong>Mensaje:</strong><br>$mensaje</p>
    </body>
    </html>";
    
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

// Responder con JSON
echo json_encode($response);
?>
