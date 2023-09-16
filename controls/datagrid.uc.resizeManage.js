const { Rect } = require("@uccontrols:/../ucbuilder/global/drawing/shapes");
const datagrid = require("@uccontrols:/controls/datagrid.uc");
/**
 * @typedef {import ("@uccontrols:/controls/datagrid.uc").datagrid} datagrid
 */
class resizeManage {
    constructor() { }
    /** @type {Rect}  */
    dgvDomRect = new Rect();
    get lastOverCell(){ return this.main.hoverEfct.lastOverCell; }
    //columnStyler = 
    /**
     * @param {datagrid} main 
     */
    init(main) {
        this.main = main;
        this.main.resizerTop.addEventListener("mousedown",(e)=>{
            console.log(this.lastOverCell);
        });
        this.main.resizerBottom.addEventListener("mousedown",(e)=>{
            console.log(this.lastOverCell);
        });
        this.main.resizerLeft.addEventListener("mousedown",(e)=>{
            console.log(this.lastOverCell);
        });
        this.main.resizerRight.addEventListener("mousedown",(e)=>{
            console.log(this.lastOverCell);
        });
    }

}
module.exports = { resizeManage };