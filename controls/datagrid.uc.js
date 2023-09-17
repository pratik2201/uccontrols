const { hoverEffect } = require('@uccontrols:/controls/datagrid.uc.hoverEffect.js');
const { resizeManage } = require('@uccontrols:/controls/datagrid.uc.resizeManage.js');
const { Rect } = require('ucbuilder/global/drawing/shapes.js');
const { designer } = require('./datagrid.uc.designer.js');
class datagrid extends designer {
    constructor() {
        eval(designer.giveMeHug);
        this.init();
        this.container1.style.setProperty("--winfo","30px 150px 100px 450px");
    }
    node = {
        rowNodeName: "ROW",
        cellNodeName: "CELL"
    }
    overInfo = {
        /** @type {HTMLElement}  */
        lastCell: undefined,
        /** @type {HTMLElement}  */
        lastRow: undefined,
        columnIndex: -1,
        rowIndex: -1,
        /** @type {DOMRect}  */
        containerLayout: undefined,
    }
    hoverEfct = new hoverEffect();
    resizeMng = new resizeManage();
    init() {
        let changed = false;
        this.hoverEfct.init(this);
        this.resizeMng.init(this);
    }
    
    
}
module.exports = datagrid;