import Layer from "@/components/BlueprintCanvas/objects/Layer";
import {fabric} from "fabric";

export default class LayerManager {

    layers:Layer[] = [];
    canvas:fabric.Canvas;
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
            this.canvas.remove(found[0].group);
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
}