<?php
// Datos de conexión a la base de datos
$servidor = "localhost"; // Por ejemplo, "localhost" si está en el mismo servidor
$usuario = "root";
$contrasena = "";
$basedatos = "games";

// Crear conexión
$conn = new mysqli($servidor, $usuario, $contrasena, $basedatos);

// Verificar conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Verifica que la solicitud sea POST y que se haya enviado el puntaje
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["puntaje"])) {
    // Prepara la sentencia SQL para insertar el puntaje en la tabla puntajes
    $stmt = $conn->prepare("INSERT INTO puntajes (puntaje, player) VALUES (?, ?)");
    $stmt->bind_param("is", $puntaje, $player); // "i" indica que $puntaje es un entero
    
    // Obtiene el puntaje enviado
    $puntaje = $_POST["puntaje"];
    $player = $_POST["player"];
    
    // Ejecuta la sentencia SQL
    if ($stmt->execute()) {
        echo "Puntaje guardado correctamente en la base de datos.";
    } else {
        echo "Error al guardar el puntaje en la base de datos: " . $stmt->error;
    }
    
    // Cierra la conexión y la sentencia
    $stmt->close();
    $conn->close();
} else {
    // Si no se envió el puntaje, envía un mensaje de error al cliente
    http_response_code(400);
    echo "Error: No se recibió el puntaje.";
}
?>
