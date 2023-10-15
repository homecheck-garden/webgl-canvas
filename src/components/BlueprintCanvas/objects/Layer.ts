import {fabric} from "fabric";

export default class Layer {
    private objects: [] = [];
    private _locked: boolean = false;
    private canvas: fabric.Canvas;

    get locked(): boolean {
        return this._locked;
    }

    set locked(value: boolean) {
        this._locked = value;
        this.group.selectable = !this._locked;
    }

    constructor(name: string, canvas: fabric.Canvas) {
        this.canvas = canvas;
        this.name = name;
    }

    public addObject(obj: any): void {
        this.canvas.add(obj)
        obj.setCoords();
        this.canvas.requestRenderAll();
    }

    public removeObject(obj: any): void {
        const index = this.objects.indexOf(obj, 0);
        if (index > -1) {
            let found = this.objects.splice(index, 1);
            this.canvas.remove(found[0]);
            return true;
        }
        return false;
    }

    public removeAll(): void {
        this.objects.forEach(o => {
            o.remove();
        });
    }

    public setCanvas(canvas: fabric.Canvas) {
        this.canvas = canvas;
    }
}