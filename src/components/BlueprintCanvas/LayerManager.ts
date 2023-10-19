import Layer from "@/components/BlueprintCanvas/objects/Layer";
import {fabric} from "fabric";

export default class LayerManager {

    layers:Layer[] = [];
    canvas:fabric.Canvas;
    currentLayer:Layer | undefined = undefined;

    constructor(canvas:fabric.Canvas) {
        this.canvas = canvas;
    }

    public addLayer(layer:Layer) {
        layer.setCanvas(this.canvas);
        this.layers.push(layer);
    }

    public removeLayer(layer:Layer) {
        const index = this.layers.indexOf(layer, 0);
        if (index > -1) {
            let found = this.layers.splice(index, 1);
            found[0].removeAll();
            return true;
        }
        return false;
    }

    public swapLayer(sourceIndex: number, targetIndex: number): boolean {
        if (
            sourceIndex < 0 ||
            sourceIndex >= this.layers.length ||
            targetIndex < 0 ||
            targetIndex >= this.layers.length
        ) {
            return false; // Indices are out of bounds
        }

        const sourceLayer = this.layers[sourceIndex];
        this.layers[sourceIndex] = this.layers[targetIndex];
        this.layers[targetIndex] = sourceLayer;
        return true;
    }

    public getLayerByName(layerName: string): Layer | undefined {
        return this.layers.find((layer) => layer.name === layerName);
    }

    public selectLayer(layerName: string){
        this.canvas?.discardActiveObject().requestRenderAll();
        this.currentLayer = this.getLayerByName(layerName);

        if(!this.currentLayer?.locked){
            this.currentLayer!.selectable = true;
        }

        this.layers.forEach(layer=>{
            if(layer != this.currentLayer) {
                layer.selectable = false;
            }
        })
        return this.currentLayer;
    }

    public SetLockAllLayers(locked:boolean){
        this.layers.forEach(layer=>{
            layer.locked = locked;
            if(layer != this.currentLayer) {
                layer.selectable = false;
            }
        })
    }

}