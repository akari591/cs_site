/**
 * quietflow.js
 * Paul Krishnamurthy 2016
 *
 * https://paulkr.com
 * paul@paulkr.com
 */

function randCol (r, g, b, a) {
  return "rgba(" + Math.floor(Math.random() * r).toString() + "," +
                   Math.floor(Math.random() * g).toString() + "," +
                   Math.floor(Math.random() * b).toString() + "," + a + ")";
}

$.fn.quietflow = function (attributes) {

  // Cache node
  var $element = $(this);
  var $limitX  = $element.width();
  var $limitY  = $element.height();

  var centerX  = $limitX/2;
  var centerY  = $limitY/2;

  // Remove quietflow 
  $("#Quietflow").remove();

  var theme   = "starfield";
  var z_index = -1000;

  var effectNames = [
    "squareFlash",      
    "vortex",           
    "bouncingBalls",    
    "shootingLines",    
    "simpleGradient",   
    "starfield",        
    "layeredTriangles", 
    "cornerSpikes",     
    "floatingBoxes"
  ];

  // Theme defaults
  var defaults = {

    bouncingBalls : {
      specificColors  : [],
      backgroundCol   : "#ECF0F1",
      maxRadius       : 40,
      bounceSpeed     : 20,
      bounceBallCount : 50,
      transparent     : true
    },
  };

  // Create canvas and set attributes
  var canvas            = document.createElement("canvas");
  var ctx               = canvas.getContext("2d");
  canvas.id             = "Quietflow";
  canvas.width          = $limitX;
  canvas.height         = $limitY;
  canvas.style.zIndex   = z_index;
  canvas.style.position = "absolute";
  canvas.style.top      = 0;

  // Attach canvas to element
  var $checkValidID = $element.attr("id");

  if (!($checkValidID == undefined)){
    var appendObject = document.getElementById($checkValidID);
    appendObject.appendChild(canvas);
  } else {
    document.body.appendChild(canvas);
  }

  // Set theme
  if ($.inArray(attributes.theme, effectNames) > -1) {
    theme = attributes.theme;
  }

  var effectAttrs = {};
  effectAttrs     = $.extend(defaults[theme], attributes);

  // Update canvas on resize without clearing
  $(window).resize(function () {

    $limitX = $element.width();
    $limitY = $element.height();

    var oldWidth  =  $("#Quietflow").css("width").replace("px", "");
    var oldHeight = $("#Quietflow").css("height").replace("px", "");  

    $("#Quietflow").css({ 
      "width" : window.innerWidth, 
      "height": window.innerHeight
    }); 

    var ratio1 = oldWidth / window.innerWidth;
    var ratio2 = oldHeight / window.innerHeight;

    ctx.scale(ratio1, ratio2);
  });

  var id;

  // Render based on interval or automatically
  function render (callback) {

    if (effectAttrs.speed !== undefined) {
      setTimeout(function () {
        id = requestAnimationFrame(callback);
      }, effectAttrs.speed);
    } else {
      id = requestAnimationFrame(callback);
    }
  }

  // Effect animations

  function bouncingBallsEffect () {

    ctx.fillStyle = effectAttrs.backgroundCol;
    ctx.fillRect(0, 0, $limitX, $limitY);

    for (var i = 0; i < effectAttrs.bounceBallCount; i++) {

      var current = circleData[i],
          X       = 0,
          Y       = 1,
          RADIUS  = 2,
          DX      = 3,
          DY      = 4,
          COLOR   = 5;

      // Set boundaries
      if (current[X] + current[DX] > $limitX || current[X] + current[DX] < 0){
        current[3] = -current[3];
      } 
      if (current[Y] + current[DY] > $limitY || current[Y] + current[DY] < 0){
        current[DY] = -current[DY];
      }

      // Add delta x and y
      current[X] += current[DX];
      current[Y] += current[DY];

      // Draw circles
      ctx.beginPath();
      ctx.fillStyle = current[COLOR];
      ctx.arc(current[X], current[Y], current[RADIUS], 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();

    }

    render(bouncingBallsEffect);
  }

  // Effects
  switch (theme) {
    case "bouncingBalls":
      circleData = [];

      for (var i = 0; i < effectAttrs.bounceBallCount; i++) {

        // Random x, y, radius, dx, dy, (col)
        if (effectAttrs.specificColors.length == 0) {
          circleData.push([Math.random() * $limitX, 
                           Math.random() * $limitY,
                           Math.random() * effectAttrs.maxRadius, 
                           Math.random() * 2, 
                           Math.random() * 4, 
                           randCol(255, 255, 255, (effectAttrs.transparent ? .5 : 1))]);
        } else {
          circleData.push([Math.random() * $limitX, 
                           Math.random() * $limitY, 
                           Math.random() * effectAttrs.maxRadius, 
                           Math.random() * 2, 
                           Math.random() * 4, 
                           effectAttrs.specificColors[Math.floor(Math.random() * effectAttrs.specificColors.length)]]);
        }
      }

      bouncingBallsEffect();

      break;

  };

}
