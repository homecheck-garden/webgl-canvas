import {fabric} from "fabric";

export default class Layer {
    public name: string;
    public objects: fabric.Object[] = [];
    private _locked: boolean = false;
    private _selectable: boolean = false;

    private canvas: fabric.Canvas | null;

    get locked(): boolean {
        return this._locked;
    }

    set locked(value: boolean) {
        this._locked = value;
        this.objects.forEach(obj => {
            obj.selectable = !value;
        })
    }

    get selectable(): boolean {
        return this._selectable;
    }

    set selectable(value: boolean) {
        this._selectable = value;
        this.objects.forEach(obj => {
            obj.selectable = value;
        })
    }

    constructor(name: string, canvas: fabric.Canvas | null = null) {
        this.canvas = canvas;
        this.name = name;
    }

    public addObject(obj: any): void {
        this.canvas?.add(obj)
        obj.setCoords();
        this.canvas?.requestRenderAll();
        this.objects.push(obj);
    }

    public removeObject(obj: any): fabric.Object | boolean {
        const index = this.objects.indexOf(obj, 0);
        if (index > -1) {
            let found = this.objects.splice(index, 1);
            this.canvas?.remove(found[0]);
            return found[0];
        }
        return false;
    }

    public removeAll(): void {
        this.objects.forEach(o => {
            this.canvas?.remove(o)
        });
        this.objects = []
    }

    public setCanvas(canvas: fabric.Canvas) {
        this.canvas = canvas;
    }
}