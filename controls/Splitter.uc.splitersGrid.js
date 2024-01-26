"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitersGrid = void 0;
class splitersGrid {
    constructor() {
        this._type = 'notdefined';
    }
    get info() { return this.main.SESSION_DATA; }
    set type(val) {
        this._type = val;
        switch (val) {
            case 'columns':
                this.main.resizer.allowResize = this.main.allowResizeColumn;
                break;
            case 'rows':
                this.main.resizer.allowResize = this.main.allowResizeColumn;
                break;
            default:
                this.main.resizer.allowResize = false;
                break;
        }
        this.main.resizer.type = this.info.type = val;
    }
    get type() { return this._type; }
    get measurement() { return this.info.measurement; }
    get lastIndex() { return this.info.measurement.length - 1; }
    get length() { return this.info.measurement.length; }
    init(grid, main) {
        this.grid = grid;
        this.allElementHT = this.grid.childNodes;
        this.main = main;
        this.info.attribList = this.main.myPropertiesText;
    }
    pushBox(box, afterIndex = -1) {
        if (afterIndex == -1)
            this.grid.prepend(box.node);
        else {
            let node = this.allElementHT[afterIndex];
            node.after(box.node);
        }
    }
    refresh() {
        this.main.resizer.refresh();
    }
}
exports.splitersGrid = splitersGrid;
