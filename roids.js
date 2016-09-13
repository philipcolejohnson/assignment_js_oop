"use-strict";

ASTEROID_COUNT = 10;
BOARD_WIDTH = 500;
BOARD_HEIGHT = 400;
MAX_SPEED = 10;
MAX_SIZE = 4;
TIC_INTERVAL = 25;
MISSILE_SPEED = 10;
SHOT_DURATION = 35;

var APP = APP || {};

APP.game = {
  init: function () {
    APP.game.ship = new APP.Spaceship();
    APP.game.asteroids = [];
    APP.game.shots = [];
    for (var i = 0; i < ASTEROID_COUNT; i++) {
      APP.game.asteroids.push( new APP.Asteroid() );
    }
  }

};

APP.SpaceObject = function(x,y,velX, velY){
  this.x = x || Math.floor( Math.random() * BOARD_WIDTH ) + 1;
  this.y = y || Math.floor( Math.random() * BOARD_HEIGHT ) + 1;
  this.velX = velX || (Math.floor( Math.random() * MAX_SPEED ) + 1 ) * (Math.round(Math.random()) * 2 - 1) / MAX_SPEED;
  this.velY = velY || (Math.floor( Math.random() * MAX_SPEED ) + 1 ) * (Math.round(Math.random()) * 2 - 1) / MAX_SPEED;

};

APP.SpaceObject.prototype.tic = function() {
  this.x += this.velX;
  this.y += this.velY;

  if (this.x > BOARD_WIDTH) {
    this.x -= BOARD_WIDTH;
  } else if (this.x < 0) {
    this.x += BOARD_WIDTH;
  }

  if (this.y > BOARD_HEIGHT) {
    this.y -= BOARD_HEIGHT;
  } else if (this.y < 0) {
    this.y += BOARD_HEIGHT;
  }
};

APP.Missile = function(x, y, dir){
  APP.SpaceObject.call(this, x, y);
  this.direction = dir;
  this.distance = 0;
  this.x = x;
  this.y = y;
  this.fire = function(direction) {
    var rads = direction * Math.PI / 180;
    this.velX += Math.sin(rads) * -MISSILE_SPEED;
    this.velY += Math.cos(rads) * -MISSILE_SPEED;
  };
  this.fire(dir);
};

APP.Missile.prototype = Object.create(APP.SpaceObject.prototype);
APP.Missile.prototype.constructor = APP.Missile;

APP.Missile.prototype.tic = function() {
  this.distance += 1;
  return APP.SpaceObject.prototype.tic.call(this);
};

APP.Asteroid = function(size,x,y,velX, velY) {
  this.size = size || Math.floor( Math.random() * MAX_SIZE ) + 1;
  this.color = this.getRandomColor();
  APP.SpaceObject.call(this,x,y,velX, velY);
};

APP.Asteroid.prototype = Object.create(APP.SpaceObject.prototype);
APP.Asteroid.prototype.constructor = APP.Asteroid;

APP.Asteroid.prototype.getRandomColor = function () {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

APP.Spaceship = function(x, y) {
  APP.SpaceObject.call(this, x, y);
  this.direction = 85;
  this.x = x || BOARD_WIDTH/2;
  this.y = y || BOARD_HEIGHT/2;
  this.velX = 0;
  this.velY = 0;
};
// Object.setPrototypeOf(APP.Spaceship, APP.SpaceObject.prototype);
APP.Spaceship.prototype = Object.create(APP.SpaceObject.prototype);
APP.Spaceship.prototype.constructor = APP.Spaceship;


//[x,y] -> boost -> translates into velX adn velY

APP.Spaceship.prototype.setDirection = function(direction){
  this.direction += direction;
  this.direction %= 360;
};

APP.Spaceship.prototype.rotate = function(x, y, angle) {
  var cx = this.x,
      cy = this.y;
  var radians = (Math.PI / 180) * angle,
      cos = Math.cos(radians),
      sin = Math.sin(radians),
      nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
      ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
  return [nx, ny];
};

APP.Spaceship.prototype.thrust = function() {
  var rads = this.direction * Math.PI / 180;
  this.velX += Math.sin(rads) * -1.3;
  this.velY += Math.cos(rads) * -1.3;
};

APP.Spaceship.prototype.tic = function() {
  this.velX *= 0.99;
  this.velY *= 0.99;
  return APP.SpaceObject.prototype.tic.call(this);
};

APP.Spaceship.prototype.shoot = function(){
  var x = this.x;
  var y = this.y;
  var dir = this.direction;
  APP.game.shots.push(new APP.Missile(x, y, dir));
};

APP.view = {
  init: function() {
    APP.view.keyPresser = $(document).keydown(APP.controller.keyHandler);
  },

  roidBody: function(asteroid){
    var canvas = document.getElementById('board');
    var context = canvas.getContext("2d");

    context.beginPath();
    context.arc(asteroid.x, asteroid.y, asteroid.size * 10, 0, 2 * Math.PI, false);
    context.lineWidth = 2;
    context.strokeStyle = asteroid.color;
    context.stroke();
    context.closePath();
  },

  render: function() {
    var canvas = document.getElementById('board');
    canvas.width = canvas.width;

    APP.view.shipBody(APP.game.ship);

    for(var i = 0; i < APP.game.asteroids.length; i++) {
      APP.view.roidBody(APP.game.asteroids[i]);
    }

    for(i = 0; i < APP.game.shots.length; i++) {
      APP.view.shotBody(APP.game.shots[i]);
    }
  },

  shipBody: function(spaceship) {
    var canvas = document.getElementById('board');
    var context = canvas.getContext("2d");

    var x = spaceship.x;
    var y = spaceship.y;
    var backa = spaceship.rotate(x + 10, y + 25, spaceship.direction);
    var backb = spaceship.rotate(x - 10, y + 25, spaceship.direction);
    // the triangle
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(backa[0], backa[1]);
    context.lineTo(backb[0], backb[1]);
    context.closePath();


    // the outline
    context.lineWidth = 1;
    context.strokeStyle = '#666666';
    context.stroke();

    // the fill color
    context.fillStyle = "#FFCC00";
    context.fill();
  },

  shotBody: function(missile){
    var canvas = document.getElementById('board');
    var context = canvas.getContext("2d");

    context.beginPath();
    context.arc(missile.x, missile.y, 3, 0, 2 * Math.PI, false);
    context.fillStyle = 'red';
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = "red";
    context.stroke();
    context.closePath();
  }
};

APP.controller = {
  init: function() {
    APP.game.init();
    APP.view.init();
    APP.game.loop = setInterval(APP.controller.tic, TIC_INTERVAL);
  },

  tic: function() {
    APP.view.render();
    APP.game.ship.tic();
    for(var i = 0; i < APP.game.asteroids.length; i++) {
      APP.game.asteroids[i].tic();
    }
    for(var j = 0; j < APP.game.shots.length; j++) {
      APP.game.shots[j].tic();
      if ( APP.game.shots[j].distance > SHOT_DURATION) {
        APP.game.shots.splice(j, 1);
      }
    }
  },

  keyHandler: function(e) {
    var key = e.which;
    console.log(key);

    switch(key) {
      case 37:
        APP.game.ship.direction += 50;
        break;
      case 39:
        APP.game.ship.direction -= 50;
        break;
      case 38:
        APP.game.ship.thrust();
        break;
      case 32:
        APP.game.ship.shoot();
        break;
    }
  }
};

$(document).ready(function() {
  APP.controller.init();
});
