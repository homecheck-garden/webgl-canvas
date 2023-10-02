import { fabric } from 'fabric';

export default class CustomObject extends fabric.Object {
    constructor(options: fabric.IObjectOptions = {}) {
        super(options);
        // You can set custom properties here
        this.data = options.data || 'Default';
    }

    // Override the _render method for custom rendering
    _render(ctx: CanvasRenderingContext2D) {
        // Your custom rendering logic here
        ctx.fillStyle = this.fill as string;
        ctx.fillRect(
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        );

        // Call the superclass _render method to handle scaling, rotation, etc.
        super._render(ctx);
    }

    // Implement additional custom methods or interactions here
    yourCustomMethod() {
        // Your custom logic here
        console.log(`Custom property: ${this.data}`);
    }
}