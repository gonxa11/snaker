$(document).ready(function () {
    const canvas = $('#canvas')[0];
    const ctx = canvas.getContext('2d');

    const menu = $('.menu');
    const score = $('.score');
    const canvas2 = $('#snake-1')[0];
    const canvas3 = $('#snake-2')[0];

    const ctx2 = canvas2.getContext('2d');
    const ctx3 = canvas3.getContext('2d');

    canvas2.width = 190;
    canvas2.height = 80;
    canvas3.width = 190;
    canvas3.height = 80;
    canvas.width = 650;
    canvas.height = 380;

    let play = false;
    let scoreP = 0;

    class Apple {
        constructor(position, radio, color, context) {
            this.position = position;
            this.radio = radio;
            this.color = color;
            this.context = context;
        }

        draw() {
            this.context.save();
            this.context.beginPath();
            this.context.arc(this.position.x, this.position.y, this.radio, 0, 2 * Math.PI);
            this.context.fillStyle = this.color;
            this.context.shadowColor = this.color;
            this.context.shadowBlur = 10;
            this.context.fill();
            this.context.closePath();
            this.context.restore();
        }

        collision(snake) {
            let v1 = {
                x: this.position.x - snake.position.x,
                y: this.position.y - snake.position.y
            }
            let distance = Math.sqrt(
                (v1.x * v1.x) + (v1.y * v1.y)
            );
            if (distance < snake.radio + this.radio) {
                this.position = {
                    x: Math.floor(Math.random() * ((canvas.width - this.radio) - this.radio + 1)) + this.radio,
                    y: Math.floor(Math.random() * ((canvas.height - this.radio) - this.radio + 1)) + this.radio
                }
                snake.createBody();
                scoreP++;
                score.text(scoreP);
            }
        }
    }

    class SnakeBody {
        constructor(radio, color, context, path) {
            this.radio = radio;
            this.color = color;
            this.context = context;
            this.path = path;
            this.transparency = 1;
        }

        drawCircle(x, y, radio, color) {
            this.context.save();
            this.context.beginPath();
            this.context.arc(x, y, radio, 0, 2 * Math.PI);
            this.context.fillStyle = color;
            this.context.shadowColor = this.color;
            this.context.shadowBlur = 10;
            this.context.globalAlpha = this.transparency;
            this.context.fill();
            this.context.closePath();
            this.context.restore();
        }

        draw() {
            this.drawCircle(this.path.slice(-1)[0].x, this.path.slice(-1)[0].y, this.radio, this.color)
        }

    }

    class Snake {
        constructor(position, radio, color, velocity, length, pathLength, context) {
            this.position = position;
            this.radio = radio;
            this.color = color;
            this.velocity = velocity;
            this.context = context;
            this.rotation = 0;
            this.transparency = 1;
            this.body = [];
            this.isDeath = false;
            this.puntajeEnviado = false;
            this.length = length;
            this.pathLength = pathLength;
            this.keys = {
                A: false,
                D: false,
                enable: true
            }
            this.keyBoard();
        }

        initBody() {
            for (let i = 0; i < this.length; i++) {
                let path = [];
                for (let k = 0; k < this.pathLength; k++) {
                    path.push({
                        x: this.position.x,
                        y: this.position.y
                    })
                }
                this.body.push(new SnakeBody(this.radio, this.color, this.context, path));
            }
        }

        createBody() {
            let path = [];
            for (let k = 0; k < this.pathLength; k++) {
                path.push({
                    x: this.body.slice(-1)[0].path.slice(-1)[0].x,
                    y: this.body.slice(-1)[0].path.slice(-1)[0].y
                })
            }
            this.body.push(new SnakeBody(this.radio, this.color, this.context, path));

            if (this.pathLength < 8) {
                this.body.push(new SnakeBody(this.radio, this.color, this.context, [...path]));
                this.body.push(new SnakeBody(this.radio, this.color, this.context, [...path]));
                this.body.push(new SnakeBody(this.radio, this.color, this.context, [...path]));
            }
        }

        drawCircle(x, y, radio, color, shadowColor) {
            this.context.save();
            this.context.beginPath();
            this.context.arc(x, y, radio, 0, 2 * Math.PI);
            this.context.fillStyle = color;
            this.context.shadowColor = shadowColor;
            this.context.shadowBlur = 10;
            this.context.globalAlpha = this.transparency;
            this.context.fill();
            this.context.closePath();
            this.context.restore();
        }

        drawHead() {
            this.drawCircle(this.position.x, this.position.y, this.radio, this.color, this.color);

            this.drawCircle(this.position.x, this.position.y - 9, this.radio - 4, 'white', 'transparent')
            this.drawCircle(this.position.x + 1, this.position.y - 9, this.radio - 6, 'black', 'transparent')
            this.drawCircle(this.position.x + 3, this.position.y - 8, this.radio - 9, 'white', 'transparent')

            this.drawCircle(this.position.x, this.position.y + 9, this.radio - 4, 'white', 'transparent')
            this.drawCircle(this.position.x + 1, this.position.y + 9, this.radio - 6, 'black', 'transparent')
            this.drawCircle(this.position.x + 3, this.position.y + 8, this.radio - 9, 'white', 'transparent')
        }

        drawBody() {
            this.body[0].path.unshift({
                x: this.position.x,
                y: this.position.y
            })
            this.body[0].draw();

            for (let i = 1; i < this.body.length; i++) {
                this.body[i].path.unshift(this.body[i - 1].path.pop());
                this.body[i].draw();
            }
            this.body[this.body.length - 1].path.pop();
        }

        draw() {
            this.context.save();

            this.context.translate(this.position.x, this.position.y);
            this.context.rotate(this.rotation);
            this.context.translate(-this.position.x, -this.position.y);
            this.drawHead();
            this.context.restore();
        }

        update() {
            if (this.isDeath) {
                this.transparency -= 0.02;
                if (this.transparency <= 0) {
                    play = false;
                    menu.css('display', 'flex');
                }
            }

            this.draw();
            this.drawBody();
            if (this.keys.A && this.keys.enable) {
                this.rotation -= 0.04;
            }
            if (this.keys.D && this.keys.enable) {
                this.rotation += 0.04;
            }
            this.position.x += Math.cos(this.rotation) * this.velocity;
            this.position.y += Math.sin(this.rotation) * this.velocity;

            this.collision();
        }

        collision() {
            if (this.position.x - this.radio <= 0 || this.position.x + this.radio >= canvas.width || this.position.y - this.radio <= 0 || this.position.y + this.radio >= canvas.height) {
                this.death();
            }
        }

        death() {
            this.velocity = 0;
            this.keys.enable = false;
            this.isDeath = true;
            this.body.forEach((b) => {
                let lastItem = b.path[b.path.length - 1];
                for (let i = 0; i < b.path.length; i++) {
                    b.path[i] = lastItem;
                }
                b.transparency = this.transparency;
            })
            if (!this.puntajeEnviado) {
                const player = $('.player').val();
                this.sendScoreToPHP(scoreP, player);
                this.puntajeEnviado = true;
                $.ajax({
                    url: 'actualizar.php',
                    type: 'POST',
                    success: function (response) {
                        $('.table').html(response);
                    },
                    error: function (error) {
                        console.log('Error al cargar el formulario:', error);
                    }
                });
            }
        }

        sendScoreToPHP(score, player) {
            $.ajax({
                type: 'POST',
                url: 'puntaje.php',
                data: { puntaje: score, player: player },
                success: function (response) {
                    console.log('Puntaje enviado correctamente.');
                    console.log(response);
                },
                error: function (xhr, status, error) {
                    console.error('Error al enviar el puntaje:', error);
                }
            });
        }

        drawCharacter() {
            for (let i = 1; i <= this.length; i++) {
                this.drawCircle(
                    this.position.x - (this.pathLength * this.velocity * i),
                    this.position.y, this.radio, this.color, this.color
                );
            }
            this.drawHead();
        }

        keyBoard() {
            $(document).on('keydown', (e) => {
                if (e.key == 'a' || e.key == 'A') {
                    this.keys.A = true;
                }
                if (e.key == 'd' || e.key == 'D') {
                    this.keys.D = true;
                }
            })
            $(document).on('keyup', (e) => {
                if (e.key == 'a' || e.key == 'A') {
                    this.keys.A = false;
                }
                if (e.key == 'd' || e.key == 'D') {
                    this.keys.D = false;
                }
            })
        }
    }

    const snake = new Snake({ x: 200, y: 200 }, 11, '#feba39', 1.5, 3, 12, ctx);
    snake.initBody();
    const snakeP1 = new Snake({ x: 165, y: 40 }, 11, '#feba39', 1.5, 8, 12, ctx2);
    snakeP1.initBody();
    snakeP1.drawCharacter();
    const snakeP2 = new Snake({ x: 165, y: 40 }, 11, '#88fc03', 1.5, 24, 4, ctx3);
    snakeP2.initBody();
    snakeP2.drawCharacter();
    const apple = new Apple({ x: 300, y: 300 }, 8, 'red', ctx)

    $(canvas2).on('click', () => {
        init(3, 12, '#feba39')
    })
    $(canvas3).on('click', () => {
        init(8, 4, '#88fc03')
    })

    function init(length, pathLength, color) {
        snake.body.length = 0;
        snake.color = color;
        snake.length = length;
        snake.pathLength = pathLength;
        snake.position = { x: 200, y: 200 };
        snake.isDeath = false;
        snake.velocity = 1.5;
        snake.transparency = 1;
        snake.initBody();
        snake.keys.enable = true;
        snake.puntajeEnviado = false;
        play = true;
        menu.css('display', 'none');
        scoreP = 0;
        score.text(scoreP);
        $.ajax({
            url: 'actualizar.php',
            type: 'POST',
            success: function (response) {
                $('.table').html(response);
            },
            error: function (error) {
                console.log('Error al cargar el formulario:', error);
            }
        });
    }

    function background() {
        ctx.fillStyle = '#1b1c30'
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < canvas.height; i += 80) {
            for (let j = 0; j < canvas.width; j += 80) {
                ctx.fillStyle = '#23253c';
                ctx.fillRect(j + 10, i + 10, 70, 70);
            }
        }
    }

    function update() {
        background();
        if (play) {
            snake.update();
            apple.draw();
            apple.collision(snake);
        }
        requestAnimationFrame(update);
    }

    update();
});