let app = new Vue({
    el: '#app',
    data: {
        logo: 'https://ubidots.com/img/logo.png',
        time: 0,
        sumtotal: 0,
        status: 'conectado',
        num: 0,
    }

}) 

let containersRy = document.querySelector(".container");
let svg = document.querySelector(".typeRange");
let output = document.querySelector(".output");
let outline = document.querySelector(".outline");
let fill = document.querySelector(".fill");
let center = document.querySelector(".center");
let needle = document.querySelector(".needle");
   
let rad = Math.PI / 180;
let NS = "http:\/\/www.w3.org/2000/svg";

let W = parseInt(window.getComputedStyle(svg, null).getPropertyValue("width"));
let offset = 40;
let cx = ~~(W / 2);
let cy = 160;

let r1 = cx - offset;
let delta = ~~(r1 / 4);

let initVal = 0;


var socket = io.connect('https://5596ceb2.ngrok.io');
  socket.on('info', (activity) => {
   if (!activity) app.status = 'desconectado';
   $('button').click(() => {
      if ( (app.num > 20) || (app.num < 0) || (isNaN(app.num)) ) {
         $('.status').css('color', '#c0392b');
         $('button').addClass('disabled');
          app.status = 'desconectado';
          socket.disconnect();
    } else {
      if ( (app.num <= 20) && (app.num >= 0) && (!isNaN(app.num) ) ) {
        //  Materialize.toast('Enviado a el server!', 4000);  
          $('.status').css('color', '#27ae60');
          socket.emit('number', parseInt(app.num));
          app.status = 'conectado';
        }
  } 
})    
   initVal = activity.sum;
   app.time = activity.time;
   app.sumtotal = activity.sumtotal;
  // console.log(app.time)
  (function ViewData(){
    let val = initVal;
    let newVal = (!isNaN(val) && val >= 0 && val <= 100) ? val : 0;
    let pa = (newVal * 1.8) - 180;
    let p = {};
    p.x = cx + r1 * Math.cos(pa * rad);
    p.y = cy + r1 * Math.sin(pa * rad);
    updateInput(p, cx, cy, r1, offset, delta)
  })();

});

let isDragging = false;

let x1 = cx + r1,
  y1 = cy;
let r2 = r1 - delta;

let x2 = offset,
  y2 = cy;
let x3 = x1 - delta,
  y3 = cy;

function drawScale() {
  sr1 = r1 + 5;
  sr2 = r2 - 5;
  srT = r1 + 20;
  let scale = document.querySelector(".scale");
  clearRect(scale)
  let n = 0;
  for (let sa = -180; sa <= 0; sa += 18) {
    let sx1 = cx + sr1 * Math.cos(sa * rad);
    let sy1 = cy + sr1 * Math.sin(sa * rad);
    let sx2 = cx + sr2 * Math.cos(sa * rad);
    let sy2 = cy + sr2 * Math.sin(sa * rad);
    let sxT = cx + srT * Math.cos(sa * rad);
    let syT = cy + srT * Math.sin(sa * rad);

    let scaleLine = document.createElementNS(NS, "line");
    let scaleLineObj = {
      class: "scale",
      x1: sx1,
      y1: sy1,
      x2: sx2,
      y2: sy2
    };
    setSVGAttributes(scaleLine, scaleLineObj);

    scale.appendChild(scaleLine);

    let scaleText = document.createElementNS(NS, "text");
    let scaleTextObj = {
      class: "scale",
      x: sxT,
      y: syT,
    };
    setSVGAttributes(scaleText, scaleTextObj);
    scaleText.textContent = n * 10;
    scale.appendChild(scaleText);

    n++

  }

}

function drawInput(cx, cy, r1, offset, delta, a) {

  let d1 = getD1(cx, cy, r1, offset, delta);
  let d2 = getD2(cx, cy, r1, offset, delta, a);

  drawScale();

  outline.setAttributeNS(null, "d", d1);
  fill.setAttributeNS(null, "d", d2);

  drawNeedle(cx, cy, r1, a);
}

function updateInput(p, cx, cy, r1, offset, delta) {

  let x = p.x;
  let y = p.y;
  let lx = cx - x;
  let ly = cy - y;

  let a = Math.atan2(ly, lx) / rad - 180;

  drawInput(cx, cy, r1, offset, delta, a);
  output.innerHTML = Math.round((a + 180) / 1.8);
  initialValue.value = Math.round((a + 180) / 1.8);
}

function getD1(cx, cy, r1, offset, delta) {

  let x1 = cx + r1,
    y1 = cy;
  let x2 = offset,
    y2 = cy;
  let r2 = r1 - delta;
  let x3 = x1 - delta,
    y3 = cy;
  let d1 =
    "M " + x1 + ", " + y1 + " A" + r1 + "," + r1 + " 0 0 0 " + x2 + "," + y2 + " H" + (offset + delta) + " A" + r2 + "," + r2 + " 0 0 1 " + x3 + "," + y3 + " z";
  return d1;
}

function getD2(cx, cy, r1, offset, delta, a) {
  a *= rad;
  let r2 = r1 - delta;
  let x4 = cx + r1 * Math.cos(a);
  let y4 = cy + r1 * Math.sin(a);
  let x5 = cx + r2 * Math.cos(a);
  let y5 = cy + r2 * Math.sin(a);

  let d2 =
    "M " + x4 + ", " + y4 + " A" + r1 + "," + r1 + " 0 0 0 " + x2 + "," + y2 + " H" + (offset + delta) + " A" + r2 + "," + r2 + " 0 0 1 " + x5 + "," + y5 + " z";
  return d2;
}

function drawNeedle(cx, cy, r1, a) {

  let nx1 = cx + 5 * Math.cos((a - 90) * rad);
  let ny1 = cy + 5 * Math.sin((a - 90) * rad);

  let nx2 = cx + (r1 + 15) * Math.cos(a * rad);
  let ny2 = cy + (r1 + 15) * Math.sin(a * rad);

  let nx3 = cx + 5 * Math.cos((a + 90) * rad);
  let ny3 = cy + 5 * Math.sin((a + 90) * rad);

  let points = nx1 + "," + ny1 + " " + nx2 + "," + ny2 + " " + nx3 + "," + ny3;
  needle.setAttributeNS(null, "points", points);
}


function oMousePos(elmt, evt) {
  let ClientRect = elmt.getBoundingClientRect();
  return { //obj
    x: Math.round(evt.clientX - ClientRect.left),
    y: Math.min(Math.round(evt.clientY - ClientRect.top), cy)
  }
}

function clearRect(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

function setSVGAttributes(elmt, oAtt) {
  for (let prop in oAtt) {
    elmt.setAttributeNS(null, prop, oAtt[prop]);
  }
}

// events
window.addEventListener("load", function() {
  let pa = (initVal * 1.8) - 180;
  let p = {}
  p.x = cx + r1 * Math.cos(pa * rad);
  p.y = cy + r1 * Math.sin(pa * rad);
  updateInput(p, cx, cy, r1, offset, delta)
}, false);