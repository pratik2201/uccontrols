const { boxHandler } = require("@uccontrols:/controls/Splitter.uc.boxHandler");
/**
 * @typedef {import ('@uccontrols:/controls/Splitter.uc.enumAndMore').spliterType} spliterType
 * @typedef {import ('@uccontrols:/controls/Splitter.uc')} Splitter
 */
class splitersGrid {
    constructor() { }
    /** @type {HTMLElement}  */
    grid = undefined;
    /** @type {Splitter}  */
    main = undefined;



    /** @type {container[]}  */
    allElementHT = undefined;

    get info() { return this.main.SESSION_DATA; }
    /** @type {spliterType}  */
    _type = 'notdefined';

    set type(val) {
        this._type = val;
        switch (val) {
            case 'columns': this.main.resizer.allowResize = this.main.allowResizeColumn; break;
            case 'rows': this.main.resizer.allowResize = this.main.allowResizeColumn; break;
            default: this.main.resizer.allowResize = false; break;
        }
        this.main.resizer.type =
            this.info.type = val;

    }
    get type() { return this._type; }
    get measurement() { return this.info.measurement; }
    get lastIndex() { return this.info.measurement.length - 1; }
    get length() { return this.info.measurement.length; }

    /** 
     * @param {HTMLElement} grid 
     * @param {Splitter} main 
     */
    init(grid, main) {

        this.grid = grid;

        this.allElementHT = this.grid.childNodes;
        //this.data = this.main.SESSION_DATA.record;
        this.main = main;
        this.info.attribList = this.main.myPropertiesText;
        //this.main.resizer.init(this);
        /*if (this.info == undefined)
            this.data.splInfo = objectOpt.clone(splitterRow);*/



    }

    /**
     * @param {boxHandler} box
     * @param {index} afterIndex
     */
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
module.exports = { splitersGrid };