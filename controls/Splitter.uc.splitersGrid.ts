import { boxHandler } from "uccontrols/controls/Splitter.uc.boxHandler";
import { SpliterType } from "uccontrols/controls/Splitter.uc.enumAndMore";
import { Splitter } from "uccontrols/controls/Splitter.uc";

export class splitersGrid {
    grid: HTMLElement;
    main: Splitter;
    allElementHT: NodeListOf<HTMLElement>;

    get info(): any { return this.main.SESSION_DATA; }
    _type: SpliterType = 'notdefined';

    set type(val: SpliterType) {
        this._type = val;
        switch (val) {
            case 'columns': this.main.resizer.allowResize = this.main.allowResizeColumn; break;
            case 'rows': this.main.resizer.allowResize = this.main.allowResizeColumn; break;
            default: this.main.resizer.allowResize = false; break;
        }
        this.main.resizer.type = this.info.type = val;
    }

    get type(): SpliterType { return this._type; }
    get measurement(): any { return this.info.measurement; }
    get lastIndex(): number { return this.info.measurement.length - 1; }
    get length(): number { return this.info.measurement.length; }

    init(grid: HTMLElement, main: Splitter): void {
        this.grid = grid;
        this.allElementHT = this.grid.childNodes as NodeListOf<HTMLElement>;
        this.main = main;
        this.info.attribList = this.main.myPropertiesText;
    }

    pushBox(box: boxHandler, afterIndex: number = -1): void {
        if (afterIndex == -1)
            this.grid.prepend(box.node);
        else {
            let node = this.allElementHT[afterIndex];
            node.after(box.node);
        }
    }

    refresh(): void {
        this.main.resizer.refresh();
    }
}