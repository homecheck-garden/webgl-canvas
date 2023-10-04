<template>
  <canvas id="canvas" ref="c"></canvas>
</template>

<script setup lang="ts">
import {fabric} from 'fabric';
import {computed, onMounted, ref, WritableComputedRef} from 'vue'
import CustomObject from "@/components/objects/CustomObject";

let c = ref(null);
let canvas: any = null;

const backgroundObjects: Array<Object> = [];
const objects: Array<Object> = [];

let editLayer: string = 'background';

const props = defineProps(['width', 'height', 'editLayer'])

onMounted(() => {
  canvas = new fabric.Canvas(c.value, {
    // You can specify Fabric.js options here
    width: props.width,
    height: props.height,
  });

  canvas.on("mouse:wheel", (opt: any) => {
    opt.e.preventDefault()
    opt.e.stopPropagation()
    if (opt.e.ctrlKey) {
      console.log("pinch")
      let delta = opt.e.deltaY;
      let zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      canvas.zoomToPoint({x: opt.e.offsetX, y: opt.e.offsetY}, zoom);
    } else {
      let e = opt.e;
      let vpt = canvas.viewportTransform;
      vpt[4] += e.deltaX;
      vpt[5] += e.deltaY;
      canvas.requestRenderAll();
    }
  })
})


const addCircle = () => {
  const circle = new fabric.Circle({top: 100, radius: 50, fill: 'blue'});
  canvas.add(circle);
  addToLayer(editLayer, circle);
}

const addRect = () => {
  const rect = new fabric.Rect({top: 100, left: 100, width: 100, height: 100, fill: 'red'});
  canvas.add(rect);
  addToLayer(editLayer, rect);
}

const addTriangle = () => {
  const triangle = new fabric.Triangle({
    left: 50,
    top: 50,
    width: 100,
    height: 100,
    fill: 'blue',
  });
  canvas.add(triangle);
  addToLayer(editLayer, triangle);
}

const addLine = () => {
  const line = new fabric.Line([0, 0, 200, 0], {
    left: 50,
    top: 200,
    stroke: 'red',
    strokeWidth: 5,
  });
  canvas.add(line);
  addToLayer(editLayer, line);
}

const addPolyline = () => {
  const polyline = new fabric.Polyline(
      [
        {x: 50, y: 300},
        {x: 150, y: 300},
        {x: 100, y: 400},
      ],
      {
        stroke: 'green',
        strokeWidth: 5,
        fill: 'transparent',
      }
  );
  canvas.add(polyline);
  addToLayer(editLayer, polyline);
}

const addPolygon = () => {
  const polygon = new fabric.Polygon(
      [
        {x: 200, y: 50},
        {x: 250, y: 100},
        {x: 300, y: 50},
        {x: 275, y: 0},
      ],
      {
        fill: 'purple',
      }
  );
  canvas.add(polygon);
  addToLayer(editLayer, polygon);
}

const addPath = () => {
  const path = new fabric.Path('M 350 50 L 400 100 L 450 50 Z', {
    left: 300,
    top: 200,
    fill: 'orange',
  });
  canvas.add(path);
  addToLayer(editLayer, path);
}

const addEllipse = () => {
  const ellipse = new fabric.Ellipse({
    left: 400,
    top: 400,
    rx: 50,
    ry: 30,
    fill: 'pink',
  });
  canvas.add(ellipse);
  addToLayer(editLayer, ellipse);
}

const addCustomObject = () => {
  const customObj = new CustomObject({
    left: 100,
    top: 100,
    width: 50,
    height: 50,
    fill: 'blue',
    data: 'Custom Value',
  });

  canvas.add(customObj);
  addToLayer(editLayer, customObj);
}

const addImage = (url: string) => {
  fabric.Image.fromURL(url, (image) => {
    // You can specify the position and other properties of the image here
    image.set({left: 200, top: 200, scaleX: 0.5, scaleY: 0.5});

    canvas.add(image);
    addToLayer(editLayer, image);
  });
}

const setBackgroundColor = (color: string) => {
  canvas.backgroundColor = color;
  canvas.renderAll();
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

const setEditableLayer = (layer: string) => {
  editLayer = layer;
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
  addCustomObject,
  addImage,
  setBackgroundColor,
  getBackgroundColor,
  setEditableLayer,
})
</script>

<style scoped>
/* Add any custom styles for your canvas here */
#canvas {
  border: 1px solid grey;
}
</style>