<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

if (isset($_GET['token'])) {
    $token = $_GET['token'];
    try {
        // Incluir la configuración de conexión
        include '../../../config/conexion.php';

            //Coge todos os datos del usuario con este token
            $sqlUser = "SELECT * FROM Usuarios WHERE Token = :token LIMIT 1";
            $queryUser = $conexion->prepare($sqlUser);

            // Vincular el parámetro :token
            $queryUser->bindParam(':token', $token);
            
            // Ejecutar la consulta
            $queryUser->execute();

            $usuario = $queryUser->fetch();


            //Coge todos os datos del cliente con este token
            $sqlClient = "SELECT * FROM Clientes WHERE Token = :token LIMIT 1";
            $queryClient = $conexion->prepare($sqlClient);

            // Vincular el parámetro :token
            $queryClient->bindParam(':token', $token);
            
            // Ejecutar la consulta
            $queryClient->execute();

            $cliente = $queryClient->fetch();


        if ($usuario) {
            // Preparar la consulta para actualizar el estado de verificación
            $update = $conexion->prepare("UPDATE Usuarios SET Verificado = 1, Token = NULL WHERE ID_Usuario = :id");
            
            // Vincular el parámetro :id
            $update->bindParam(':id', $usuario['ID_Usuario']);
            
            // Ejecutar la actualización
            $update->execute();
        } else if ($cliente) {
            // Preparar la consulta para actualizar el estado de verificación
            $update = $conexion->prepare("UPDATE Clientes SET Verificado = 1, Token = NULL WHERE ID_Cliente = :id");
            
            // Vincular el parámetro :id
            $update->bindParam(':id', $cliente['ID_Cliente']);
            
            // Ejecutar la actualización
            $update->execute();
        }


        if ($usuario || $cliente) {
            ?>
            <!DOCTYPE html>
                <html lang="es">
                <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Correo Verificado</title>
                <style>
                    * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    }

                    body {
                    font-family: Arial, sans-serif;
                    background: linear-gradient(180deg, #FFEA00, #FF6C14);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    color: #3B014D;
                    }

                    .container {
                    text-align: center;
                    background: linear-gradient(45deg, #3B014D, #A5005A);
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
                    color: white;
                    max-width: 400px;
                    width: 90%;
                    }

                    .container h1 {
                    font-size: 2.5rem;
                    color: #FFEA00;
                    margin-bottom: 20px;
                    }

                    .container p {
                    font-size: 1.2rem;
                    margin-bottom: 25px;
                    line-height: 1.5;
                    }

                    .btn {
                    display: inline-block;
                    background-color: #FFEA00;
                    color: #3B014D;
                    text-decoration: none;
                    padding: 15px 20px;
                    font-size: 1rem;
                    font-weight: bold;
                    border-radius: 10px;
                    transition: background-color 0.3s ease, transform 0.2s ease;
                    }

                    .btn:hover {
                    background-color: #FF6C14;
                    transform: scale(1.05);
                    }

                    .btn:active {
                    transform: scale(0.98);
                    }
                </style>
                </head>
                <body>
                <div class="container">
                    <h1>¡Correo Verificado!</h1>
                    <p>Tu dirección de correo electrónico ha sido verificada correctamente.<br>Gracias por confirmar tu cuenta.</p>
                    <a href="https://electric-doctor.infinityfreeapp.com" class="btn">Volver a la web</a>
                </div>
                </body>
                </html>
                <?php
        } else {
            ?>
            <!DOCTYPE html>
                <html lang="es">
                <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Correo Verificado</title>
                <style>
                    * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    }

                    body {
                    font-family: Arial, sans-serif;
                    background: linear-gradient(180deg, #FFEA00, #FF6C14);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    color: #3B014D;
                    }

                    .container {
                    text-align: center;
                    background: linear-gradient(45deg, #3B014D, #A5005A);
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
                    color: white;
                    max-width: 400px;
                    width: 90%;
                    }

                    .container h1 {
                    font-size: 2.5rem;
                    color: #FFEA00;
                    margin-bottom: 20px;
                    }

                    .container p {
                    font-size: 1.2rem;
                    margin-bottom: 25px;
                    line-height: 1.5;
                    }

                    .btn {
                    display: inline-block;
                    background-color: #FFEA00;
                    color: #3B014D;
                    text-decoration: none;
                    padding: 15px 20px;
                    font-size: 1rem;
                    font-weight: bold;
                    border-radius: 10px;
                    transition: background-color 0.3s ease, transform 0.2s ease;
                    }

                    .btn:hover {
                    background-color: #FF6C14;
                    transform: scale(1.05);
                    }

                    .btn:active {
                    transform: scale(0.98);
                    }
                </style>
                </head>
                <body>
                <div class="container">
                    <h1>¡Algo ha salido mal!</h1>
                    <p>Este enlace de verificación no es válido o ha expirado<br>Por favor, inténtalo de nuevo</p>
                    <a href="https://electric-doctor.infinityfreeapp.com" class="btn">Volver a la web</a>
                </div>
                </body>
                </html>
                <?php
        }

    } catch (PDOException $e) {
        // Si hay un error en la consulta o la conexión
        echo "Error: " . $e->getMessage();
    }
} else {
    ?>
    <!DOCTYPE html>
        <html lang="es">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Correo Verificado</title>
        <style>
            * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            }

            body {
            font-family: Arial, sans-serif;
            background: linear-gradient(180deg, #FFEA00, #FF6C14);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            color: #3B014D;
            }

            .container {
            text-align: center;
            background: linear-gradient(45deg, #3B014D, #A5005A);
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
            color: white;
            max-width: 400px;
            width: 90%;
            }

            .container h1 {
            font-size: 2.5rem;
            color: #FFEA00;
            margin-bottom: 20px;
            }

            .container p {
            font-size: 1.2rem;
            margin-bottom: 25px;
            line-height: 1.5;
            }

            .btn {
            display: inline-block;
            background-color: #FFEA00;
            color: #3B014D;
            text-decoration: none;
            padding: 15px 20px;
            font-size: 1rem;
            font-weight: bold;
            border-radius: 10px;
            transition: background-color 0.3s ease, transform 0.2s ease;
            }

            .btn:hover {
            background-color: #FF6C14;
            transform: scale(1.05);
            }

            .btn:active {
            transform: scale(0.98);
            }
        </style>
        </head>
        <body>
        <div class="container">
            <h1>¡Algo ha salido mal!</h1>
            <p>Este enlace de verificación no es válido o ha expirado<br>Por favor, inténtalo de nuevo</p>
            <a href="https://electric-doctor.infinityfreeapp.com" class="btn">Volver a la web</a>
        </div>
        </body>
        </html>
        <?php
}
?>
