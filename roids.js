"use-strict";



var MY_APP = {};
MY_APP.Asteroid = function(x,y,velX, velY){
  this.x = x || 0;
  this.y = y || 0;
  this.velX = velX || 0;
  this.velY = velY || 0;
};

MY_APP.Asteroid.prototype.tic = function() {
  this.x += this.velX;
  this.y += this.velY;
};

MY_APP.View = {
  roidBody: function(x, y){

  }
}
