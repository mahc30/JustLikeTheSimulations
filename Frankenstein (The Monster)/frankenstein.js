var canvas_width = document.getElementById("painS").offsetWidth;
var canvas_height = document.getElementById("painS").offsetHeight + 100;

//pain_Simulator
var painSimulatorSketch = function (p) {
    p.width = canvas_width;
    p.height = canvas_height;
    console.log("width:" + p.width + "height:" + p.height);
    p.figures = [];
    p.clickOn = false;
    p.lineclickOn = false;
    p.quadclickOn = false;
    p.triangleclickOn = false;
    p.placeholder;
    p.mouseposition;
    p.cont = 0;
    
    p.setup = function () {
        p.canvas = p.createCanvas(canvas_width, canvas_height);
        console.log("width:" + canvas_width + "height:" + canvas_height);
        p.canvas.parent('painS');
        p.mouseposition = [10, 10, 300, 300, 200, 200, 100, 100];
    }

    p.draw = function () {
        p.background(0);
        p.fill(255);
        p.stroke(255);
        p.point(p.mouseposition[0], p.mouseposition[1]);
        p.point(p.mouseposition[2], p.mouseposition[3]);
        p.point(p.mouseposition[4], p.mouseposition[5]);

        for (let i = 0; i < p.figures.length; i++) {
            p.figures[i].show();
        }

        /*
        Gotta check for what kind of figure is being created
        so i can create a different p.placeholder and then push
        it into the array that draws everything
        */

        if (p.clickOn) {
            p.placeholder.x = p.mouseX;
            p.placeholder.y = p.mouseY;
            p.placeholder.show();
        }

        if (p.lineclickOn) {
            p.placeholder.x1 = p.mouseX;
            p.placeholder.y1 = p.mouseY;
            p.placeholder.x2 = p.width / 2;
            p.placeholder.y2 = p.height / 2;
            p.placeholder.show();
        }

        if (p.quadclickOn) {
            p.placeholder.x1 = p.mouseposition[0];
            p.placeholder.y1 = p.mouseposition[1];
            p.placeholder.x2 = p.mouseposition[2];
            p.placeholder.y2 = p.mouseposition[3];
            p.placeholder.x3 = p.mouseposition[4];
            p.placeholder.y3 = p.mouseposition[5];
            p.placeholder.x4 = p.mouseX;
            p.placeholder.y4 = p.mouseY;
            p.placeholder.show();

        }

        if (p.triangleclickOn) {
            p.placeholder.x1 = p.mouseposition[0];
            p.placeholder.y1 = p.mouseposition[1];
            p.placeholder.x2 = p.mouseposition[2];
            p.placeholder.y2 = p.mouseposition[3];
            p.placeholder.x3 = p.mouseposition[4];
            p.placeholder.y3 = p.mouseposition[5];
            p.placeholder.show();
        }

        if ((p.clickOn || p.lineclickOn || p.quadclickOn || p.triangleclickOn) && p.mouseIsPressed) {
            p.figures.push(p.placeholder);
            p.clickOn = false;
            p.lineclickOn = false;
            p.quadclickOn = false;
            p.triangleclickOn = false;
            p.placeholder = null;
            p.cont = 0;
        }
    }

    //Getting buttons Input

    $("#Create_Square_Btn").click(function (e) {
        e.preventDefault();
        p.placeholder = new square(p, p.mouseX, p.mouseY, 30, 200);
        p.clickOn = true;
    });

    $("#Create_Circle_Btn").click(function (e) {
        e.preventDefault();
        p.placeholder = new circle(p, p.mouseX, p.mouseY, 30, 200);
        p.clickOn = true;
    });

    $("#Create_Line_Btn").click(function (e) {
        e.preventDefault();
        p.placeholder = new pline(p, p.width / 2, p.height / 2, p.mouseX, p.mouseY);
        p.lineclickOn = true;
    });

    $("#Create_Quad_Btn").click(function (e) {
        e.preventDefault();
        p.placeholder = new fquad(p, p.mouseposition[0], p.mouseposition[1], p.mouseposition[2], p.mouseposition[3], p.mouseposition[4], p.mouseposition[5], p.mouseX, p.mouseY);
        p.quadclickOn = true;
    });

    $("#Create_Triangle_Btn").click(function (e) {
        e.preventDefault();
        p.placeholder = new ptriangle(p, p.mouseposition[0], p.mouseposition[1], p.mouseposition[2], p.mouseposition[3], p.mouseposition[4], p.mouseposition[5]);
        p.triangleclickOn = true;
    });

    $("#Delete_Last_Figure").click(function (e) {
        e.preventDefault();
        p.figures.pop();
    });
    //Whenever mouse is pressed, position is saved, it's a bit buggy but
    //the 3 dots make it easier

    p.mousePressed = function () {
        p.mouseposition[p.cont] = p.mouseX;
        p.cont += 1;
        p.mouseposition[p.cont] = p.mouseY;
        p.cont += 1;
        if (p.cont >= 9) {
            p.cont = 0;
        }
    }

}
//Bouncin'Ball
var bouncinBallSketch = function (p) {
    p.direction;
    //p.line_vertical_obs1;
    p.ball;
    p.canvas;

    p.setup = function() {
        p.canvas = p.createCanvas(canvas_width, canvas_height);
        p.canvas.parent('bouncinS');
        p.ball = new ball(p, 31, 200, 60, 3, 0, 0.1);
        //p.line_vertical_obs1 = new line_obstacle(p, 200, 200, 200, 300);
    }

    p.draw = function() {
        p.background(0);

        /*
        Render Square Obstacle
        */

       // p.line_vertical_obs1.update();
       // p.line_vertical_obs1.show();

        /*
        Render Ball
        */

        p.ball.update();
        p.ball.show();


        /*First check for collisions with canvas*/

        //Check for conditions to bounce left or right for canvas
        if (p.ball.x_pos >= canvas_width - (p.ball.diameter / 2) || (p.ball.x_pos <= (p.ball.diameter / 2))) {
            p.ball.collision(true);
        }

        //Check conditions to bounce when it touches the floor
        if (p.ball.y_pos >= canvas_height- (p.ball.diameter / 2)) {
            p.ball.collision(false);
        }

        /*Check for collisions with other objects
        if (p.line_vertical_obs1.check_Collision(p.ball)) {
            p.ball.collision(true);
        }*/
    }

    /*
    Un contador que necesito por fuera
    a lo mejor lo puedo utilizar luego
                 si no
        ver cómo se puede optimizar
    */

    p.count = 0;
    p.mouseClicked = function() {

        //Save actual v_x on Click
        if (p.count === 0) {
            p.count++;
            p.direction = p.ball.v_x;
        }

        /* 
          Checks the position of the mouse
             when it is pressed, then:
         if it is in the p.ball when pressed
              stops it horizontally
       else it is out of the p.ball when pressed
          continues in the same p.direction
        */

        if (p.mouseX < p.ball.x_pos + (p.ball.diameter / 2) && p.mouseX > p.ball.x_pos - (p.ball.diameter / 2) && p.mouseY < p.ball.y_pos + (p.ball.diameter / 2) && p.mouseY > p.ball.y_pos - (p.ball.diameter / 2)) {
            console.log("click");
            p.ball.pressed_In_ball = true;
            p.ball.v_x = 0;
            p.ball.v_y = 0;
        }
        else {
            console.log("Nope");
            p.ball.pressed_In_ball = false;
            p.ball.v_x = p.direction;
            p.ball.v_y += p.ball.a;
            p.count = 0;
        }
    }
}
//Cube Waves by Bees and Bombs
var cubeWavesSketch = function (p) {
    p.angle = 0;
    p.w = 48;
    p.maxD;
    p.ma;
    p.labelText = "Z Position of light:";
    p.z = 0;
    p.r = 0;
    p.g = 0;
    p.b = 100;
    p.canvas;

    /*Get Z position of light value
    from zlight*/
    $("#zlight").on('input change', function () {
        p.z = document.getElementById("zlight").value;
        document.getElementById("label").innerText = p.labelText + p.z;
    });

    //Get R value from slider
    $("#R").on('input change', function () {
        p.r = document.getElementById("R").value;
        //document.getElementById("label").innerText = p.labelText + p.r;
    });
    //Get G value from slider
    $("#G").on('input change', function () {
        p.g = document.getElementById("G").value;
        //document.getElementById("label").innerText = p.labelText + p.g;
    });
    //Get B value from slider
    $("#B").on('input change', function () {
        p.b = document.getElementById("B").value;
        //document.getElementById("label").innerText = p.labelText + p.b;
    });


    p.setup = function () {
        p.canvas = p.createCanvas(canvas_width, canvas_height, p.WEBGL);
        p.canvas.parent('beess');
        p.ma = p.atan(1 / p.sqrt(2));
        p.maxD = p.dist(0, 0, 200, 200);
    }


    p.draw = function () {
        p.background(0);
        //translatcanvas_width / 2canvas_height / 2); //Mueve todo estas cantidades
        p.rectMode(p.CENTER); //Changes position of rectangles to center
        //fill(255); //White Fill to objects
        p.ortho(-400, 400, 400, -400, 0, 1000);

        p.rotateX(p.angle * 0.2);
        p.rotateY(p.angle * 0.1);
        //rotateY(PI/8);

        p.offset = 0;
        p.specularMaterial(250);

        p.locX = p.mouseX - canvas_height / 2;
        p.locY = (-1) * (p.mouseY - canvas_width / 2);

        p.ambientLight(p.r, p.g, p.b);
        p.pointLight(0, 0, p.angle * -10, p.locX, p.locY, p.z);

        for (p.z = 0; p.z < canvas_height; p.z += p.w) {
            for (var x = 0; x < canvas_width; x += p.w) {
                p.push();
                p.p = p.dist(x, p.z, canvas_width / 2, canvas_height / 2);
                p.offset = p.map(p.p, 0, p.maxD, -p.PI, p.PI);
                p.a = p.angle + p.offset;
                p.h = p.map(p.sin(p.a), -1, 1, 100, 400);
                p.translate(x - canvas_width / 2, 0, p.z - canvas_height / 2);
                p.box(p.w - 2, p.h, p.w - 2);

                //rect(x canvas_width / 2 + p.w / 2, 0, p.w - 2, h);
                p.pop();
            }

        }

        p.angle -= 0.05;
    }
}

let paint_Simulator = new p5(painSimulatorSketch, document.getElementById('p5sketch'));
let bouncin_Ball = new p5(bouncinBallSketch, document.getElementById('p5sketch2'));
let cube_Waves = new p5(cubeWavesSketch, document.getElementById('p5sketch3'));