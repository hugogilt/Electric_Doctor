<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Incluir el archivo de configuración de PHPMailer
include './configurar_phpmailer.php';
include '../../../config/conexion.php';


function generarToken($longitud = 32) {
    return bin2hex(random_bytes($longitud)); // Genera un token seguro
}

// Obtener el correo electrónico del formulario
if (isset($_POST['correo']) && isset($_POST['nonVerifiedType'])) {
    $emailUsuario = $_POST['correo']; // Valor de la variable 'correo'
    $nonVerifiedType = $_POST['nonVerifiedType']; // Valor de la variable 'nonVerifiedType'
    $token = generarToken(); // Generar el token
    echo $nonVerifiedType;
} else {
    echo "No se ha proporcionado un email.";
    exit;
}

$nombre = $_POST['nombre'];
$apellidos = $_POST['apellidos'];
$telefono = $_POST['telefono'];
$marca = $_POST['marca'];
$anio = $_POST['anio'];
$problema = $_POST['problema'];

// Conectar a la base de datos (usando PDO)
if ($nonVerifiedType == 'user') {
    try {
        // Preparar la consulta SQL para actualizar el token en la tabla de usuarios
        $sql = "UPDATE Usuarios SET token = :token WHERE correo_electronico = :email";
    
        // Preparar la declaración
        $stmt = $conexion->prepare($sql);
    
        // Vincular los parámetros con los valores
        $stmt->bindParam(':token', $token, PDO::PARAM_STR);
        $stmt->bindParam(':email', $emailUsuario, PDO::PARAM_STR);
    
        // Ejecutar la consulta
        $stmt->execute();
    
        // Si la actualización fue exitosa
        echo "Token insertado correctamente en la base de datos usuarios." . $nonVerifiedType;
    
    } catch (PDOException $e) {
        // Si hay un error en la actualización
        echo "Error al insertar el token: " . $e->getMessage();
        exit;
    }
} else if ($nonVerifiedType == 'client') {
    try {
        // Preparar la consulta SQL para actualizar el token en la tabla de usuarios
        $sql = "UPDATE Clientes SET token = :token WHERE correo_electronico = :email";
    
        // Preparar la declaración
        $stmt = $conexion->prepare($sql);
    
        // Vincular los parámetros con los valores
        $stmt->bindParam(':token', $token, PDO::PARAM_STR);
        $stmt->bindParam(':email', $emailUsuario, PDO::PARAM_STR);
    
        // Ejecutar la consulta
        $stmt->execute();
    
        // Si la actualización fue exitosa
        echo "Token insertado correctamente en la base de datos clientes.";
    
    } catch (PDOException $e) {
        // Si hay un error en la actualización
        echo "Error al insertar el token: " . $e->getMessage();
        exit;
    }
} else {
    echo 'subnormal';
}


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
        $mail->isHTML(true);
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

$destinatario = $emailUsuario;
$asunto = "Verifica tu cuenta";
$verification_link = "https://electric-doctor.infinityfreeapp.com/php/PHPMailer-master/src/verificar_correo.php?token=$token";
$cuerpo = "
<html>
<body style='font-family: Arial, sans-serif; background: linear-gradient(180deg, #FFEA00, #FF6C14); margin: 0; padding: 20px; text-align: center;'>
  <div style='background: linear-gradient(45deg, #3B014D, #A5005A); border-radius: 15px; padding: 20px; max-width: 400px; margin: auto; color: white; box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);'>
    <h1 style='color: #FFEA00; font-size: 2rem; margin-bottom: 15px;'>¡Verifica tu cuenta!</h1>
    <p style='color: #FFF; font-size: 1.1rem; margin-bottom: 20px;'>Haz clic en el botón de abajo para completar el proceso de verificación de tu cuenta.</p>
    <a href='$verification_link' target='_blank' style='display: inline-block; background-color: #FFEA00; color: #3B014D; text-decoration: none; padding: 15px 20px; border-radius: 10px; font-size: 1rem; font-weight: bold;'>Verificar mi cuenta</a>
    <p style='margin-top: 20px; font-size: 0.9rem; color: #FFC;'>Si no solicitaste este correo, ignóralo.</p>
  </div>
</body>
</html>

";

enviarCorreo($destinatario, $asunto, $cuerpo);
