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
    for (var i = 0; i < ASTEROID_COUNT; i++) {
      MY_APP.asteroids.push( new MY_APP.Asteroid() );
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

MY_APP.Asteroid = function(x,y,velX, velY, size){
  this.x = x || Math.floor( Math.random() * BOARD_WIDTH ) + 1;
  this.y = y || Math.floor( Math.random() * BOARD_HEIGHT ) + 1;
  this.velX = velX || (Math.floor( Math.random() * MAX_SPEED ) + 1 ) * (Math.round(Math.random()) * 2 - 1);
  this.velY = velY || (Math.floor( Math.random() * MAX_SPEED ) + 1 ) * (Math.round(Math.random()) * 2 - 1);
  this.size = size || Math.floor( Math.random() * MAX_SIZE ) + 1;
  this.color = MY_APP.getRandomColor();
};

MY_APP.Asteroid.prototype.tic = function() {
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