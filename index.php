<?php
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
$sql = "SELECT * FROM puntajes order by puntaje desc limit 6";

$result = $conn->query($sql);

$conn->close();
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Snake</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="shortcut icon" href="serpiente.png" type="image/x-icon">
    <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
</head>

<body>
    <div class="container">
        <canvas id="canvas"></canvas>
        <span class="score">0</span>
        <div class="menu">
            <h2>SNAKE</h2>
            <input class="player" type="text" placeholder="Player">
            <div class="characters">
                <canvas id="snake-1"></canvas>
                <canvas id="snake-2"></canvas>
            </div>
            <p>Selecciona un personaje</p>
        </div>
    </div>
    <div class="puntuacion">
        <h2>Maxima puctaucion</h2>
        <?php if ($result->num_rows > 0) : ?>
            <table class='table'>
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Puntuacion</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    <?php while ($row = $result->fetch_assoc()) : ?>
                        <tr scope='row'>
                            <td><?php echo $row["player"]; ?></td>
                            <td><?php echo $row["puntaje"]; ?></td>
                            <td><?php echo $row["fecha"]; ?></td>
                        </tr>
                    <?php endwhile; ?>
                </tbody>
            </table>
        <?php else : ?>
            <table class='table'>
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Puntuacion</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    <tr scope='row'>
                        <td colspan='3' class='no-data'>Sin Puntución</td>
                    </tr>
                </tbody>
            </table>
        <?php endif; ?>
    </div>
    <script src="script.js"></script>
</body>

</html>