const { objectOpt } = require("@ucbuilder:/build/common");
const Splitter = require("@uccontrols:/controls/Splitter.uc");
const { boxHandler } = require("@uccontrols:/controls/Splitter.uc.boxHandler");
const {  spliterType } = require("@uccontrols:/controls/Splitter.uc.enumAndMore");
const { resizeHandler } = require("@uccontrols:/controls/Splitter.uc.resizeHandler");

class splitersGrid {
    constructor() { }
    /** @type {HTMLElement}  */
    grid = undefined;
    /** @type {Splitter}  */
    main = undefined;
    
   

    /** @type {HTMLElement[]}  */
    allElementHT = undefined;
    
    get info() { return this.main.SESSION_DATA; }
    set type(val) {
        this.main.resizer.type =
        this.info.type =  val;
    }
   
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
        this.main.resizer.init(this);
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