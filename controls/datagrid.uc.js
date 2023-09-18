const { hoverEffect } = require('@uccontrols:/controls/datagrid.uc.hoverEffect.js');
const { columnResizeManage } = require('@uccontrols:/controls/datagrid.uc.columnResizeManage.js');
const { rowResizeManage } = require('@uccontrols:/controls/datagrid.uc.rowResizeManage');
const { Rect } = require('ucbuilder/global/drawing/shapes.js');
const { gridResizer } = require('ucbuilder/global/gridResizer.js');
const { designer } = require('./datagrid.uc.designer.js');
class datagrid extends designer {
    constructor() {
        eval(designer.giveMeHug);
        this.init();
        this.container1.style.setProperty("--winfo", "30px 150px 100px auto");        
    }
    /** @type {"columnOnly"|"rowsOnly"|"both"} */
    keepMeasurementOf = 'columnOnly';

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
    gridRsz = new gridResizer();
    hoverEfct = new hoverEffect();
    colsResizeMng = new columnResizeManage();
    rowsResizeMng = new rowResizeManage();
    init() {
        let changed = false;
        this.gridRsz.fillMode = 'fill';
        this.hoverEfct.init(this);
        this.colsResizeMng.init(this);
        this.rowsResizeMng.init(this);

    }


}
module.exports = datagrid;