<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Incluir el archivo de configuración de PHPMailer
include './configurar_phpmailer.php';

// Función para enviar un correo
function enviarCorreo($destinatario, $asunto, $cuerpo) {
    // Configurar PHPMailer
    $mail = configurarPHPMailer();
    if (!$mail) {
        echo "Error al configurar PHPMailer.";
        return;
    }

    try {
        // Añadir destinatario
        $mail->addAddress($destinatario); // Dirección de correo a la que se enviará el correo
        $mail->Subject = $asunto; // Asunto del correo
        $mail->Body    = $cuerpo; // Cuerpo del mensaje (puede ser HTML o texto)

        // Enviar el correo
        if ($mail->send()) {
            echo 'Correo enviado correctamente.';
        } else {
            echo 'Error al enviar el correo: ' . $mail->ErrorInfo;
        }
    } catch (Exception $e) {
        echo "Error al enviar el correo: {$mail->ErrorInfo}";
    }
}

// Ejemplo de uso de la función enviarCorreo
$destinatario = 'hugogiltejero@gmail.com'; // Dirección de correo a la que enviar el correo
$asunto = 'Verificación de cuenta'; // Asunto del correo
$cuerpo = 'Este es un correo de verificación. Haz clic en el enlace para verificar tu cuenta.'; // Cuerpo del correo (puede ser HTML o texto)

enviarCorreo($destinatario, $asunto, $cuerpo);
