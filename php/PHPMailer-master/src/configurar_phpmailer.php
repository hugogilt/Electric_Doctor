<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Incluir las clases de PHPMailer manualmente
require './Exception.php';
require './PHPMailer.php';
require './SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function configurarPHPMailer() {
    $mail = new PHPMailer(true);

    try {
        // Configuración del servidor SMTP
        $mail->isSMTP();
        $mail->Host = 'smtp.dondominio.com'; // Cambia por el servidor SMTP que utilices
        $mail->SMTPAuth = true;
        $mail->Username = 'noreply@electricdoctor.es'; // Tu usuario de correo
        $mail->Password = 'hGt.n0r€plY'; // Tu contraseña
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Tipo de encriptación
        $mail->Port = 587; // Puerto SMTP (587 para TLS, 465 para SSL)

        // Configuración general
        $mail->setFrom('noreply@electricdoctor.es', 'Electric Doctor');

        return $mail; // Devuelve el objeto PHPMailer configurado
        echo $mail;
    } catch (Exception $e) {
        echo "Error al configurar PHPMailer: {$mail->ErrorInfo}";
        return null;
    }
}
