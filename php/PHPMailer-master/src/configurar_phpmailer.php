<?php
use PHPMailer\PHPMailer\PHPMailer;

return function (): PHPMailer {
    $mail = new PHPMailer(true);

    // Configuración del servidor SMTP
    $mail->isSMTP();
    $mail->Host = 'smtp.dondominio.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'noreply@electricdoctor.es';
    $mail->Password = 'hGt.n0r€plY';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;
    $mail->CharSet = 'UTF-8';

    // Configuración del remitente
    $mail->setFrom('noreply@electricdoctor.es', 'Electric Doctor');

    return $mail;
};
?>
