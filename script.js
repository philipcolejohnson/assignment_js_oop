function Asteroid(x, y, velX, velY) {
  this.x = x || 0;
  this.y = y || 0;
  this.velX = velX || 0;
  this.velY = velY || 0;
}

Asteroid.prototype.tic = function() {
  this.x += this.velX;
  this.y += this.velY;
};

// var ast1 = new Asteroid(20, 25, 5, 10);
// var ast2 = new Asteroid(15, 20, 3, 6);

// console.log(ast1);
// console.log(ast2);

// ast1.tic();
// ast2.tic();

// console.log(ast1);
// console.log(ast2);

var asteroids = [];
for (var i = 0; i < 100000; i++) {
    var x = Math.random() * 50;
    var y = Math.random() * 50;
    var velX = Math.random() * 50;
    var velY = Math.random() * 50;
    asteroids.push(new Asteroid(x, y, velX, velY) );
}

var start = new Date();

for (var i = 0; i < asteroids.length; i++ ) {
  asteroids[i].tic();
}

var end = new Date();

console.log( end.getTime() - start.getTime() );


function Asteroider(x, y, velX, velY) {
  this.x = x || 0;
  this.y = y || 0;
  this.velX = velX || 0;
  this.velY = velY || 0;
  this.tic = function() {
    this.x += this.velX;
    this.y += this.velY;
  };
}

var asteroids = [];
for (var i = 0; i < 100000; i++) {
    var x = Math.random() * 50;
    var y = Math.random() * 50;
    var velX = Math.random() * 50;
    var velY = Math.random() * 50;
    asteroids.push(new Asteroider(x, y, velX, velY) );
}

var start = new Date();

for (var i = 0; i < asteroids.length; i++ ) {
  asteroids[i].tic();
}

var end = new Date();

console.log( end.getTime() - start.getTime() );
