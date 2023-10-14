<template>
  <div>
    <canvas id="canvas" ref="c"></canvas>
  </div>
</template>

<script setup lang="ts">
import {fabric} from 'fabric';
import {onMounted, ref} from 'vue'
import CustomObject from "@/components/objects/CustomObject";

let c = ref(null);
let canvas: any = null;

const backgroundObjects: Array<Object> = [];
const objects: Array<Object> = [];

let editLayer: string = 'background';

const props = defineProps(['width', 'height', 'editLayer'])

onMounted(() => {
  let mode = 'edit'
  canvas = new fabric.Canvas(c.value, {
    // You can specify Fabric.js options here
    width: props.width,
    height: props.height,
    selection: false,
  });

  canvas.on("mouse:wheel", (opt: any) => {
    opt.e.preventDefault()
    opt.e.stopPropagation()
    if (opt.e.ctrlKey) {
      let delta = opt.e.deltaY;
      let zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      canvas.zoomToPoint({x: opt.e.offsetX, y: opt.e.offsetY}, zoom);
      canvas.requestRenderAll();

    } else {
      let e = opt.e;
      let vpt = canvas.viewportTransform;
      vpt[4] += e.deltaX;
      vpt[5] += e.deltaY;
      canvas.requestRenderAll();
    }
    canvas.forEachObject((object: any) => {
      object.setCoords();
    });
    canvas.requestRenderAll();
  })
  let zoomStartScale = 1, currentX = 0, currentY = 0, lastX = 0, lastY = 0;

  canvas.on({
    'touch:gesture': function (evt: any) {
      if (evt.e.touches?.length == 2) {
        if (evt.e.type == 'touchstart') {
          mode = 'pan'
          canvas.selectable = false;
          console.log('pan mode');

          lastX = evt.e.touches[0].clientX;
          lastY = evt.e.touches[0].clientY;
        }

        let distanceX = Math.abs(evt.e.touches[0].clientX - evt.e.touches[1].clientX);
        let distanceY = Math.abs(evt.e.touches[0].clientY - evt.e.touches[1].clientY);

        if (distanceX >= 100 || distanceY >= 100) {
          mode = 'zoom'
          console.log('zoom mode');
        } else {
          mode = 'pan'
          console.log('pan mode');
        }

        if (mode === 'zoom' && evt.self.state != 'up') {

          let x = evt.e.touches[0]?.clientX - (evt.e.touches[0]?.clientX - evt.e.touches[1]?.clientX) / 2
          let y = evt.e.touches[0]?.clientY - (evt.e.touches[0]?.clientY - evt.e.touches[1]?.clientY) / 2
          let point = new fabric.Point(x, y);
          ////let point = new fabric.Point(evt.self.x, evt.self.y);

          if (evt.self.state == "start") {
            zoomStartScale = canvas.getZoom();
          }
          let delta = zoomStartScale * evt.self.scale;
          canvas.zoomToPoint(point, delta);
        }
      }
    },
    'selection:created': function () {
    },
    'selection:cleared': function () {
    },
    'touch:drag': function (evt: any) {
      if (mode === 'pan' && evt.self.state != 'up') {
        currentX = evt.e.clientX ? evt.e.clientX:evt.e.touches[0].clientX;
        currentY = evt.e.clientY ? evt.e.clientY:evt.e.touches[0].clientY;
        let xChange = currentX - lastX;
        let yChange = currentY - lastY;

        let delta = new fabric.Point(xChange, yChange);
        console.log(`pan delta:${delta}`);
        canvas.relativePan(delta);

        lastX = currentX;
        lastY = currentY;
      }
    },
  });

  canvas.on("mouse:down", function (opt: any) {
    if (!opt.target) {
      mode = 'pan';
      lastX = opt.e.clientX ? opt.e.clientX:opt.e.touches[0].clientX;
      lastY = opt.e.clientY ? opt.e.clientY:opt.e.touches[0].clientY;
    }
  }, false);

  canvas.on("mouse:up", function (opt: any) {
    if (mode !== 'edit') {
      mode = 'edit';
      canvas.selectable = true;
      canvas.forEachObject((object: any) => {
        object.setCoords();
      });
      canvas.requestRenderAll();
    }
  }, false);

  canvas.on("mouse:up", function (opt: any) {
    if (mode !== 'edit') {
      mode = 'edit';
      canvas.selectable = true;
      canvas.forEachObject((object: any) => {
        object.setCoords();
      });
      canvas.requestRenderAll();
    }
  }, false);

  document.onkeydown = function(evt) {
    if (canvas.getActiveObject()) {
      switch (evt.key) {
        case 'Backspace': // delete
        case 'Delete': // delete
          canvas.remove(canvas.getActiveObject());
      }
      canvas.renderAll();
    }
  }
})

const addPoint = () => {
  const point = getInsertionPoint();
  const circle = new fabric.Circle({
    left: point.x,
    top: point.y,
    radius: 5,
    fill: 'red',
  });

  circle.hasControls = false;
  canvas.add(circle);
}

const addCircle = () => {
  const point = getInsertionPoint();
  const circle = new fabric.Circle({
    left: point.x,
    top: point.y,
    radius: 50,
    fill: 'blue',
    snapAngle: 45,
    snapThreshold: 7,
  });

  canvas.add(circle);
  addToLayer(editLayer, circle);
}

const addRect = () => {
  const point = getInsertionPoint();
  const rect = new fabric.Rect({
    left: point.x,
    top: point.y,
    width: 100,
    height: 100,
    fill: 'red',
    snapAngle: 45,
    snapThreshold: 7,
  });
  canvas.add(rect);
  addToLayer(editLayer, rect);
}

const addTriangle = () => {
  const point = getInsertionPoint();
  const triangle = new fabric.Triangle({
    left: point.x,
    top: point.y,
    width: 100,
    height: 100,
    fill: 'blue',
    snapAngle: 45,
    snapThreshold: 7,
  });
  canvas.add(triangle);
  addToLayer(editLayer, triangle);
}

const addLine = () => {
  const point = getInsertionPoint();
  const line = new fabric.Line([point.x, point.y, point.x+200, point.y+0], {
    stroke: 'red',
    strokeWidth: 2,
    snapAngle: 45,
    snapThreshold: 7,
  });
  canvas.add(line);
  addToLayer(editLayer, line);
}

const addPolyline = () => {
  const point = getInsertionPoint();
  const polyline = new fabric.Polyline(
      [
        {x: point.x, y: point.y},
        {x: point.x + 100, y: point.y},
        {x: point.x + 50, y: point.y + 100},
      ],
      {
        stroke: 'green',
        strokeWidth: 3,
        fill: 'transparent',
        snapAngle: 45,
        snapThreshold: 7,
      }
  );
  canvas.add(polyline);
  addToLayer(editLayer, polyline);
}

const addPolygon = () => {
  const point = getInsertionPoint();
  let points = [
    {x: point.x, y: point.y+50},
    {x: point.x+50, y: point.y+100},
    {x: point.x+100, y: point.y+50},
    {x: point.x+75, y: point.y},
  ]

  const polygon = new fabric.Polygon(
      points,
      {
        fill: 'purple',
        snapAngle: 45,
        snapThreshold: 7,
      }
  );
  canvas.add(polygon);
  addToLayer(editLayer, polygon);
}

const addPath = () => {
  const point = getInsertionPoint();
  const path = new fabric.Path(`M ${point.x} ${point.y} L ${point.x+50} ${point.y+50} L ${point.x+100} ${point.y} Z`, {
    fill: 'orange',
    snapAngle: 45,
    snapThreshold: 7,
  });
  canvas.add(path);
  addToLayer(editLayer, path);
}

const addEllipse = () => {
  const point = getInsertionPoint();
  const ellipse = new fabric.Ellipse({
    left: point.x,
    top: point.y,
    rx: 50,
    ry: 30,
    fill: 'pink',
    snapAngle: 45,
    snapThreshold: 7,
  });
  canvas.add(ellipse);
  addToLayer(editLayer, ellipse);
}

const addArrow = () => {
  let point =  getInsertionPoint()
  let headlen = 15;  // arrow head size
  let fromx = point.x, fromy = point.y+headlen, tox = point.x+100+headlen, toy = point.y+headlen;
  let angle = Math.atan2(toy - fromy, tox - fromx);

  // bring the line end back some to account for arrow head.
  tox = tox - (headlen) * Math.cos(angle);
  toy = toy - (headlen) * Math.sin(angle);

  // calculate the points.
  let points = [
    {
      x: fromx,  // start point
      y: fromy
    }, {
      x: fromx - (headlen / 4) * Math.cos(angle - Math.PI / 2),
      y: fromy - (headlen / 4) * Math.sin(angle - Math.PI / 2)
    }, {
      x: tox - (headlen / 4) * Math.cos(angle - Math.PI / 2),
      y: toy - (headlen / 4) * Math.sin(angle - Math.PI / 2)
    }, {
      x: tox - (headlen) * Math.cos(angle - Math.PI / 2),
      y: toy - (headlen) * Math.sin(angle - Math.PI / 2)
    }, {
      x: tox + (headlen) * Math.cos(angle),  // tip
      y: toy + (headlen) * Math.sin(angle)
    }, {
      x: tox - (headlen) * Math.cos(angle + Math.PI / 2),
      y: toy - (headlen) * Math.sin(angle + Math.PI / 2)
    }, {
      x: tox - (headlen / 4) * Math.cos(angle + Math.PI / 2),
      y: toy - (headlen / 4) * Math.sin(angle + Math.PI / 2)
    }, {
      x: fromx - (headlen / 4) * Math.cos(angle + Math.PI / 2),
      y: fromy - (headlen / 4) * Math.sin(angle + Math.PI / 2)
    }, {
      x: fromx,
      y: fromy
    }
  ];

  // Create a Fabric.js polygon object representing the arrow
  let arrow = new fabric.Polygon(points, {
    fill: 'black',      // Fill color
    strokeWidth: 2,     // Border width
    snapAngle: 45,
    snapThreshold: 7,
  });

  // Add the arrow to the canvas
  canvas.add(arrow);
  addToLayer(editLayer, arrow);
}

const addDoubleArrow = () => {
  let point = getInsertionPoint();
  let headlen = 15;  // arrow head size
  let fromx = point.x, fromy = point.y+headlen, tox = point.x+100+headlen, toy = point.y+headlen;
  let angle = Math.atan2(toy - fromy, tox - fromx);

  // bring the line end back some to account for arrow head.
  tox = tox - (headlen) * Math.cos(angle);
  toy = toy - (headlen) * Math.sin(angle);

  // calculate the points.
  let points = [
    {
      x: fromx,  // start point
      y: fromy
    }, {
      x: fromx + (headlen),
      y: fromy + (headlen),
    }, {
      x: fromx + headlen,
      y: fromy - (headlen / 4) * Math.sin(angle - Math.PI / 2)
    }, {
      x: tox - (headlen / 4) * Math.cos(angle - Math.PI / 2),
      y: toy - (headlen / 4) * Math.sin(angle - Math.PI / 2)
    }, {
      x: tox - (headlen) * Math.cos(angle - Math.PI / 2),
      y: toy - (headlen) * Math.sin(angle - Math.PI / 2)
    }, {
      x: tox + (headlen) * Math.cos(angle),  // tip
      y: toy + (headlen) * Math.sin(angle)
    }, {
      x: tox - (headlen) * Math.cos(angle + Math.PI / 2),
      y: toy - (headlen) * Math.sin(angle + Math.PI / 2)
    }, {
      x: tox - (headlen / 4) * Math.cos(angle + Math.PI / 2),
      y: toy - (headlen / 4) * Math.sin(angle + Math.PI / 2)
    }, {
      x: fromx + headlen,
      y: fromy - (headlen / 4),
    }, {
      x: fromx + headlen,
      y: fromy - headlen,
    }, {
      x: fromx,
      y: fromy
    }
  ];

// Create a Fabric.js polygon object representing the double-headed arrow
  let doubleArrow = new fabric.Polygon(points, {
    left: point.x,
    top: point.y,
    fill: 'black',      // Fill color
    strokeWidth: 2,     // Border width
    snapAngle: 45,
    snapThreshold: 7
  });

// Add the double-headed arrow to the canvas
  canvas.add(doubleArrow);
}

const addTextbox = () => {
  const point = getInsertionPoint();
  let text = new fabric.Textbox('Hello World', {
    left: point.x,
    top: point.y,
    snapAngle: 45,
    snapThreshold: 7
  });
  canvas.add(text);
}

const addCustomObject = () => {
  const point = getInsertionPoint();

  const customObj = new CustomObject({
    left: point.x,
    top: point.y,
    width: 50,
    height: 50,
    fill: 'blue',
    data: 'Custom Value',
    snapAngle: 45,
    snapThreshold: 7,
  });

  canvas.add(customObj);
  addToLayer(editLayer, customObj);
}

const addImage = (url: string) => {
  const point = getInsertionPoint();
  fabric.Image.fromURL(url, (image) => {
    // You can specify the position and other properties of the image here
    image.set({
      left: point.x,
      top: point.y,
      snapAngle: 45,
      snapThreshold: 7,
    });

    canvas.add(image);
    addToLayer(editLayer, image);
  });
}

const focusToCenter = () => {
  canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
  canvas.requestRenderAll();
}

const focusToSelection = () => {
  let selectedObject = canvas.getActiveObject();

  if (selectedObject) {
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;

    let deltaX = centerX - (selectedObject.left + selectedObject.width / 2 * selectedObject.scaleX);
    let deltaY = centerY - (selectedObject.top + selectedObject.height / 2 * selectedObject.scaleY);

    let newTransform = [1, 0, 0, 1, 0, 0];
    newTransform[4] += deltaX;
    newTransform[5] += deltaY;

    canvas.setViewportTransform(newTransform);
    canvas.requestRenderAll();
  }
}

const setBackgroundColor = (color: string) => {
  canvas.backgroundColor = color;
  canvas.requestRenderAll();
}

const getBackgroundColor = () => {
  return canvas.backgroundColor;
}

const addToLayer = (layer: string, object: any) => {
  if (layer == 'background') {
    backgroundObjects.push(object)
  } else {
    objects.push(object)
  }
}

const exportJSON = () => {
  return canvas.toDatalessJSON();
}

const loadJSON = (json: string) => {
  canvas.loadFromJSON(json, (objects: any, options: any) => {
    console.log(`${objects.length} objects are loaded: ${options}`)
  });
}

const setEditableLayer = (layer: string) => {
  editLayer = layer;
}

const translatePath = (point: any) => {
  const fabricPoint = new fabric.Point(point.x, point.y);
  const invertedMatrix = fabric.util.invertTransform(canvas.viewportTransform);
  return fabric.util.transformPoint(fabricPoint, invertedMatrix);
}

const getInsertionPoint = () =>{
  return fabric.util.transformPoint(new fabric.Point(canvas.width/2, canvas.height/2), fabric.util.invertTransform(canvas.viewportTransform));
}

defineExpose({
  addCircle,
  addRect,
  addTriangle,
  addLine,
  addPolyline,
  addPolygon,
  addPath,
  addEllipse,
  addArrow,
  addDoubleArrow,
  addTextbox,
  addCustomObject,
  addImage,
  addPoint,
  focusToCenter,
  focusToSelection,
  setBackgroundColor,
  getBackgroundColor,
  setEditableLayer,
  exportJSON,
  loadJSON,
  translatePath,
})
</script>

<style scoped>
/* Add any custom styles for your canvas here */
#canvas {
  border: 1px solid grey;
}
</style>