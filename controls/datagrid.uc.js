const { hoverEffect } = require('@uccontrols:/controls/datagrid.uc.hoverEffect.js');
const { columnResizeManage } = require('@uccontrols:/controls/datagrid.uc.columnResizeManage.js');
const { rowResizeManage } = require('@uccontrols:/controls/datagrid.uc.rowResizeManage');
const { Rect } = require('ucbuilder/global/drawing/shapes.js');
const { gridResizer } = require('ucbuilder/global/gridResizer.js');
const { designer } = require('./datagrid.uc.designer.js');
const { listUiHandler } = require('@ucbuilder:/global/listUiHandler.js');
const { intenseGenerator } = require('@uccontrols:/../ucbuilder/intenseGenerator.js');
class datagrid extends designer {
    constructor() {
        eval(designer.giveMeHug);
        this.init();        
       
        this.container1.style.setProperty("--winfo", "30px 30px 260px 20px 100px auto");
        
        this.detail.init(this.detailGridHT1,this.detailSectionHT);
        this.header.init(this.headerGridHT1,this.headerSectionHT);
        this.footer.init(this.footerGridHT1,this.footerSectionHT);
    }
    get detailItemTemplate() { return this.detail.itemTemplate; }
    set detailItemTemplate(value) {  this.detail.itemTemplate = intenseGenerator.parseTPT(value, this.ucExtends.PARENT); }

    get headerItemTemplate() { return this.header.itemTemplate; }
    set headerItemTemplate(value) {  this.header.itemTemplate = intenseGenerator.parseTPT(value, this.ucExtends.PARENT); }

    get footerItemTemplate() { return this.footer.itemTemplate; }
    set footerItemTemplate(value) {  this.footer.itemTemplate = intenseGenerator.parseTPT(value, this.ucExtends.PARENT); }


    header = new listUiHandler();
    detail = new listUiHandler();
    footer = new listUiHandler();
    /** @type {"columnOnly"|"rowsOnly"|"both"} */
    keepMeasurementOf = 'columnOnly';

    node = {
        rowNodeName: "ROW",
        cellNodeName: "CELL"
    }
    
    /** @type {HTMLElement}  */
    static drawSelectionHT = `<resizer role="drawSelection"></resizer>`.$();
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
    /** @type {DOMRect}  */
    dgvRect = undefined;
    hoverEfct = new hoverEffect();
    colsResizeMng = new columnResizeManage();
    rowsResizeMng = new rowResizeManage();

    init() {
        let changed = false;
        this.colsResizeMng.gridRsz.resizeMode = 'slider';
        this.rowsResizeMng.gridRsz.resizeMode = 'unfill';
        this.hoverEfct.init(this);
        this.colsResizeMng.init(this);
        this.rowsResizeMng.init(this);

    }


}
module.exports = datagrid;
