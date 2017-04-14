function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

$(document).ready(function () {
    let inAction = true;
    let score = 0;
    let highScore = 0;
    let background;

    let hero = {
        state: 'resting' //'walking', 'falling'
    }

    let column = {
        minWidth: 20,
        maxWidth: 250,
        height: 291,
        minDistance: $('.column').offset().left + $('.column').width() - 475 + 20,
        maxDistance: $('.column').offset().left + $('.column').width() - 475 + 500,
        state: 'drawing', //'resting',
        currentWidth: 0,
        currentDistance: 0,
        drawColumn: function () {
            this.currentDistance = random(this.minDistance, this.maxDistance);
            this.currentWidth = random(this.minWidth, this.maxWidth);

            ctx.beginPath();
            ctx.rect(this.currentDistance, canvas.height - this.height,
                this.currentWidth, this.height);
            ctx.fillStyle = 'black';
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.rect(this.currentDistance + this.currentWidth / 2 - 7, canvas.height - this.height,
                14, 14);
            ctx.fillStyle = 'red';
            ctx.fill();
            ctx.closePath();

            this.state = 'resting';
        },
        moveColumn: function () {
            this.currentDistance = this.currentDistance - 15;
            ctx.clearRect(0, canvas.height - this.height - stick.width, this.currentWidth + this.maxDistance, this.height);
            ctx.beginPath();
            ctx.rect(this.currentDistance, canvas.height - this.height, this.currentWidth, this.height);
            ctx.fillStyle = 'black';
            ctx.fill();
            ctx.closePath();
            $('.hero-body').css('left', $('.hero-body').css('left').slice(0, -2) - 15);

            /* ctx.clearRect(0 + this.currentWidth, stick.startPoint.y - 5, canvas.width, 5);
             ctx.beginPath();
             ctx.strokeStyle = 'black';
             ctx.lineWidth = stick.width;
             ctx.moveTo(this.currentDistance - stick.length, stick.startPoint.y);
             ctx.lineTo(stick.length + leftColumn.distance + leftColumn.width - this.currentDistance, stick.startPoint.y);
             ctx.stroke();
             ctx.closePath();*/

        }
    }

    let leftColumn = {
        width: 175,
        height: $('.column').height(),
        distance: $('.column').offset().left - 472,
        currentDistance: $('.column').offset().left - 472,
        isDrawn: false,
        drawLeftColumn: function () {
            ctx.beginPath();
            ctx.rect(this.distance, canvas.height - this.height, this.width, this.height);
            ctx.fillStyle = 'black';
            ctx.fill();
            ctx.closePath();

            this.isDrawn = true;
        },
        moveLeftColumn: function () {
            ctx.clearRect(0, canvas.height - this.height, this.width + this.distance, this.height);
            ctx.beginPath();
            ctx.rect(this.currentDistance, canvas.height - this.height, this.width, this.height);
            ctx.fillStyle = 'black';
            ctx.fill();
            ctx.closePath();
            this.currentDistance = this.currentDistance - 15;
        }
    }

    let stick = {
        length: 0,
        startPoint: {
            x: leftColumn.distance + leftColumn.width,
            y: $('.column').offset().top
        },
        endPoint: {
            x: leftColumn.distance + leftColumn.width,
            y: $('.column').offset().top
        },
        color: 'black',
        width: 5,
        state: 'resting', //'drawing', 'falling'
        angle: 270,
        fallingSpeed: 1.98
    }

    function lineToAngle(ctx, x1, y1, length, angle) {
        angle *= Math.PI / 180;

        let x2 = x1 + length * Math.cos(angle);
        let y2 = y1 + length * Math.sin(angle);

        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        return {
            x: x2,
            y: y2
        };
    }

    function setCanvas() {
        canvas = $('#canvas')[0];
        canvas.width = $(window).width();
        canvas.height = $(window).height();
        ctx = canvas.getContext('2d');

        setTimeout(function () {
            leftColumn.drawLeftColumn();
            leftColumn.isDrawn = false;
            $('.column').css('display', 'none');
        }, 500);
    }

    function setDefault() {
        stick.length = 0;
        //stick.startPoint.x = leftColumn.distance + leftColumn.width;
    }

    function draw() {
        // ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (inAction) {
            leftColumn.isDrawn = false;
            if (column.state === 'drawing') {
                column.drawColumn(), 2000;
            }
        } else {
            setDefault();

            if (leftColumn.currentDistance > -200) {
                leftColumn.moveLeftColumn();
            }
            //  alert($('.hero-body').css('left').slice(0, -2));
            //  alert(0 - (($('.column').width() - column.currentWidth) / 2));
          //  if ($('.hero-body').css('left').slice(0, -2) >= (0 - (($('.column').width() - column.currentWidth) / 2))) {
            //    $('.hero-body').css('left', $('.hero-body').css('left').slice(0, -2) - 15);

          //  }

            if (column.currentDistance >= leftColumn.distance) {
                column.moveColumn();
                
            } else {
                leftColumn.width = column.currentWidth;
                //alert((($('.column').width() - leftColumn.width) / 2));
                $('.hero-body').css('left', (-($('.column').width() - leftColumn.width) / 2));
                if (leftColumn.isDrawn === false) {
                    leftColumn.drawLeftColumn();
                    stick.startPoint.x = leftColumn.distance + leftColumn.width;
                    stick.endPoint.x = stick.startPoint.x;
                    inAction = true;
                    // alert('ololo');
                }

                column.state = 'drawing';

            }

        }
        if (stick.state === 'drawing') {
            ctx.beginPath();
            ctx.strokeStyle = stick.color;
            ctx.lineWidth = stick.width;
            ctx.moveTo(stick.startPoint.x, stick.startPoint.y);
            ctx.lineTo(stick.endPoint.x, stick.endPoint.y - stick.length);
            stick.length += 5;
            ctx.stroke();
        }
        if (stick.state === 'falling') {
            if (stick.angle <= 360) {
                ctx.beginPath();
                ctx.clearRect(0, 0, canvas.width, canvas.height - column.height);
                lineToAngle(ctx, stick.startPoint.x, stick.startPoint.y, stick.length, stick.angle);
                ctx.stroke();
                stick.angle += stick.fallingSpeed;
                stick.fallingSpeed++;

            } else {
                stick.state = 'resting';
                stick.fallingSpeed = 1.98;
                stick.angle = 270;
            }
        }
    }

    function startGame() {
        setCanvas();

        repaint = setInterval(draw, 10);
    }

    function endGame() {
        $('.scoreNumber').html(score);
        $('.currentScore').css('display', 'none');
        $('.gameOver').css('display', 'inline-block');
        setTimeout(clearInterval(repaint), 300);
    }

    $('#canvas').on('mousedown', function () {
        inAction = true;
        stick.state = 'drawing';
    });

    $('#canvas').on('mouseup', function () {
        stick.state = 'falling';

        if ((stick.length >= column.currentDistance - stick.startPoint.x) &&
            (stick.length <= column.currentDistance + column.currentWidth - stick.startPoint.x)) {
            score++;
            if ((stick.length >= column.currentDistance + (column.currentWidth / 2 - 7) - stick.startPoint.x) &&
                (stick.length <= column.currentDistance + (column.currentWidth / 2 + 7) - stick.startPoint.x)) {
                score++;
            }
            $('.scoreNumber').html(score);

            let start = Date.now();
            let timer = setInterval(function () {
                let timePassed = Date.now() - start;
                if ($('.hero-body').css('left').slice(0, -2) >= ($('.column').width() / 2) + column.currentDistance - stick.startPoint.x + (column.currentWidth / 2)) {
                    clearInterval(timer);
                    inAction = false;
                    return;
                }
                moveHero(timePassed);
            }, 10);

            function moveHero(timePassed) {
                $('.hero-body').css('left', timePassed);
            }

        } else {
            let start = Date.now();
            let timer = setInterval(function () {
                let timePassed = Date.now() - start;
                if ($('.hero-body').css('left').slice(0, -2) >= ($('.column').width() / 2) + stick.length) {
                    clearInterval(timer);
                    $('.hero-body').css('animation', 'fall 0.2s ease-in forwards');
                    return;
                }
                moveHeroLeft(timePassed);
            }, 10);

            function moveHeroLeft(timePassed) {
                $('.hero-body').css('left', timePassed);
            }
            setTimeout(endGame, 500);
        }
    });

    $('.button-start').click(function () {
        $('.homepage').css('display', 'none');
        $('.currentScore').css('display', 'inline-block');
        $('.hero').css('animation', 'move-column 0.5s ease-in-out forwards');
        startGame();
    });

});