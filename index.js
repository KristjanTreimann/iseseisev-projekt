/*jshint esversion:6*/
let canvas, rect, text, circle;
let canvasImage = 'loikelaud_uus400x644.jpg';

window.onload = function(){
  canvas = new fabric.Canvas('c');//Canvas serves as a wrapper around <canvas> element, and is responsible for managing all of the fabric objects on that particular canvas. It takes an id of an element, and returns an instance of fabric.Canvas.
  //canvas.setBackgroundImage('loikelaud_uus400x644.jpg', canvas.renderAll.bind(canvas));
  canvas.setBackgroundColor({source: canvasImage}, function () {
    canvas.renderAll();
  }); 

 
  $("#rect").on("click", elemSpecs); //ristküliku lisamine
  $("#circ").on("click", elemSpecs); //ringi lisamine
  $("#tree").on("click", elemSpecs); //puu elemendi lisamine
  $("#textBtn").on("click", elemSpecs); //teksti lisamise funktsioon

  $("#save").on("click", saveToSVG); //salvestamise funktsioon
  $("#delete").on("click", deleteElement); //kustutamise funktsioon
  canvas.on('click', function(options) {
    changeOpt(options);
  });
  $("#controllers").html("");
};

function elemSpecs(e){
  console.log(e.target.id);
  
  if(e.target.id == 'rect'){ //kui tegemist on ristkülikuga siis, 
    $("#controllers").html('Stroke: <input type="number" id="stroke" min="1" max="10" value="5"><br>Fill: <input type="checkbox" id="fill" value="filled"><button onclick="createElem(1)">TEKITA</button>');
  } else if(e.target.id == 'circ'){ //kui ringiga siis
    $("#controllers").html('Stroke: <input type="number" id="stroke" min="1" max="10" value="1"><br>Fill: <input type="checkbox" id="fill" value="filled"><button onclick="createElem(2)">TEKITA</button>');
  } else if(e.target.id == 'tree'){//valmisdisainiga siis
    let fileNames = ["emaPuu","ema_puu.svg", "ema_puu_tekst.svg"];
    importSVG(fileNames);
  } else if(e.target.id == 'textBtn'){
    $("#controllers").html('Tekst: <input type="text" id="text" /><br>Font: <select id="fonts"><option value="Times New Roman" >Times New Roman</option><option value="Arial, Helvetica, sans-serif">Arial</option><option value="Verdana, Geneva, Tahoma, sans-serif">Verdana</option><option value="Lucida Sans, Lucida Sans Regular, Lucida Grande, Lucida Sans Unicode, Geneva, Verdana, sans-serif">Lucida Sans</option></select><br>Suurus: <input type="number" id="size" min="1" max="50" value="25"><button onclick="createElem(3)">TEKITA</button>');
  }
}

function createElem(nr) { //funktsioon elementide tekitamiseks
  let fillC, val;
  if(nr == 1){
    if(document.querySelector('#fill').checked){
      fillC = 'black';
    } else {
      fillC = 'transparent';
    }
    val = $('#stroke').val();
    rect = new fabric.Rect({ //With Fabric, we no longer need to erase the content before attempting to “modify” any content. We still work with objects, simply changing their properties, and then re-render canvas to get a “fresh picture”.
      left: 40,
      top: 40,
      width: 50,
      height: 50,   
      name: "rect",   
      fill: fillC,
      stroke: 'black',
      strokeWidth: parseInt(val),
    });  
    canvas.add(rect);
  } else if(nr == 2){
    if(document.querySelector('#fill').checked){
      fillC = 'black';
    } else {
      fillC = 'transparent';
    }
    val = $('#stroke').val();
    circle = new fabric.Circle({// All of them are exposed under fabric “namespace” as fabric.Circle
      left: 20, //Well, as you would expect there are those related to positioning — left, top;  stroke,  scaling and rotation — scaleX, scaleY, angle; and even those related to flipping — flipX, flipY and skewing skewX, skewY
      top: 20,// rendering — fill, opacity,
      radius: 20,  
      name: "circ",   
      fill: fillC,
      stroke: 'black',
      strokeWidth: val,//strokeWidth;
    });  
    canvas.add(circle);
  } else if(nr == 3){
    let size = $('#size').val();
    let font = $('#fonts').val();
    console.log(font);
    
    text = new fabric.Text($("#text").val(), { left: 100, top: 100, fontSize: parseInt(size), fontFamily: font });
    canvas.add(text);
  }
  $("#controllers").html("");
}

function importSVG(arr){
  for (let i = 1; i < arr.length; i++) {
      fabric.loadSVGFromURL('svg/' + arr[i], function(objects, options) { 
        let obj = fabric.util.groupSVGElements(objects, options);
        tree.obj = arr[0];
        canvas.add(obj); 
      }); 
    }
  canvas.renderAll();
}
function deleteElement(){
  console.log(canvas.getActiveObject()); 
  canvas.remove(canvas.getActiveObject());
      
}

function changeOpt(opt){
  console.log(opt.target);
  
  if(opt.target != null){
  }
}

function addTree(){
  fabric.loadSVGFromURL('../puit/svg/puu2.svg', function(objects, options) { 
    let tree = fabric.util.groupSVGElements(objects, options);
    tree.name = "tree";
    canvas.add(tree); 
    canvas.renderAll();
}); 
}

function makeText(){
  text = new fabric.Text($("#text").val(), { left: 100, top: 100});
  canvas.add(text);
}

function makeRect(){
  rect = new fabric.Rect({
    left: (canvas.width/2)-50,
    top: (canvas.height/2)-50,
    width: 50,
    height: 50,   
    name: "rect",   
    fill: 'transparent',
    stroke: 'black',
    strokeWidth: 5,
	});  
  canvas.add(rect);
}

function makeCirc(){//funktsioon ringi loomiseks 
  circle = new fabric.Circle({
    left: 40,
    top: 40,
    radius: 50,  
    name: "circ",   
    fill: 'transparent',
    stroke: 'black',
    strokeWidth: 1,
	});  
  canvas.add(circle);
}

function saveToSVG(){//salvestame svg-sse
  $("#savedContent").html(canvas.toSVG());

  canvas.backgroundImage = 0;
  canvas.backgroundColor = '#FFFFFF';//valgele taustale
  canvas.renderAll();
  let toFileSVG = canvas.toSVG().replace(/transparent/g, "none");
  let toFileJSON = canvas.toJSON();
  console.log(toFileSVG);
  console.log(toFileJSON);
  //console.log(test);
  download(toFileSVG,"test.svg","text/plain");
  //download(,"testJSON.txt","text/plain");

  canvas.setBackgroundColor({source: canvasImage}, function () {
    canvas.renderAll();
  }); 

}

function download(data, filename, type) {
  let file = new Blob([data], { type: type }); //Blobs are immutable objects that represent raw data.
  if (window.navigator.msSaveOrOpenBlob) // IE10+
      window.navigator.msSaveOrOpenBlob(file, filename);
  else { // Others
      let a = document.createElement("a"),
              url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function() {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);  
      }, 0); 
  }
}
