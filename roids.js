"use-strict";

ASTEROID_COUNT = 10;
BOARD_WIDTH = 500;
BOARD_HEIGHT = 400;
MAX_SPEED = 3;
MAX_SIZE = 4;
TIC_INTERVAL = 25;

var MY_APP = {
  asteroids: [],

  init: function () {
    MY_APP.spaceship = new MY_APP.SpaceObject(BOARD_WIDTH/2, BOARD_HEIGHT/2);
    for (var i = 0; i < ASTEROID_COUNT; i++) {
      MY_APP.asteroids.push( new MY_APP.SpaceObject() );
    }
  },

  getRandomColor: function () {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
};

MY_APP.SpaceObject = function(x,y,velX, velY, size){
  this.x = x || Math.floor( Math.random() * BOARD_WIDTH ) + 1;
  this.y = y || Math.floor( Math.random() * BOARD_HEIGHT ) + 1;
  this.velX = velX || (Math.floor( Math.random() * MAX_SPEED ) + 1 ) * (Math.round(Math.random()) * 2 - 1);
  this.velY = velY || (Math.floor( Math.random() * MAX_SPEED ) + 1 ) * (Math.round(Math.random()) * 2 - 1);
  this.size = size || Math.floor( Math.random() * MAX_SIZE ) + 1;
  this.color = MY_APP.getRandomColor();
};

MY_APP.SpaceObject.prototype.tic = function() {
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

// Object.create(MY_APP.SpaceObject(BOARD_WIDTH/2, BOARD_HEIGHT/2));
//[x,y] -> boost -> translates into velX adn velY
MY_APP.spaceship.direction = 0;
My_APP.spaceship.setDirection = function(direction){
  MY_APP.spaceship.direction += direction;
  MY_APP.spaceship.direction %= 360;
};

MY_APP.spaceship.rotate = function(x, y, angle) {
  var cx = this.x,
      cy = this.y;
  var radians = (Math.PI / 180) * angle,
      cos = Math.cos(radians),
      sin = Math.sin(radians),
      nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
      ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
  return [nx, ny];
};
// MY_APP.spaceship.boost = [];

MY_APP.view = {
  init: function() {

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

    for(var i = 0; i < MY_APP.asteroids.length; i++) {
      MY_APP.view.roidBody(MY_APP.asteroids[i]);
    }
  },

  shipBody: function(spaceship) {
    var canvas = document.getElementById('board');
    var context = canvas.getContext("2d");

    var x = spaceship.x;
    var y = spaceship.y;
    var backa = MY_APP.spaceship.rotate(x + 5, y + 10, MY_APP.spaceship.direction);
    var backb = MY_APP.spaceship.rotate(x - 5, y + 10, MY_APP.spaceship.direction);
    // the triangle
    // points to x+velX and y+velY
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(backa[0], backa[1]);
    context.lineTo(backb[0], backb[1]);
    context.closePath();


    // the outline
    context.lineWidth = 10;
    context.strokeStyle = '#666666';
    context.stroke();

    // the fill color
    context.fillStyle = "#FFCC00";
    context.fill();
  }
};

MY_APP.controller = {
  init: function() {
    MY_APP.init();
    MY_APP.loop = setInterval(MY_APP.controller.tic, TIC_INTERVAL);
  },

  tic: function() {
    MY_APP.view.render();
    for(var i = 0; i < MY_APP.asteroids.length; i++) {
      MY_APP.asteroids[i].tic();
    }
  }
};

$(document).ready(function() {
  MY_APP.controller.init();
});
