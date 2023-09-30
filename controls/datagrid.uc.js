const { hoverEffect } = require('@uccontrols:/controls/datagrid.uc.hoverEffect.js');
const { columnResizeManage } = require('@uccontrols:/controls/datagrid.uc.columnResizeManage.js');
const { rowResizeManage } = require('@uccontrols:/controls/datagrid.uc.rowResizeManage');
const { Rect } = require('@ucbuilder:/global/drawing/shapes.js');
const { gridResizer } = require('@ucbuilder:/global/gridResizer.js');
const { designer } = require('./datagrid.uc.designer.js');
const { pagerLV } = require('@ucbuilder:/global/listUI/pagerLV');
const { Template } = require('@ucbuilder:/Template');
const { intenseGenerator } = require('@ucbuilder:/intenseGenerator.js');
const { newObjectOpt } = require('@ucbuilder:/global/objectOpt.js');
/** 
 * @typedef {import ("@ucbuilder:/global/listUI/pager/scrollNodes/pagerScroll").pagerScroll} pagerScroll
 * @typedef {import ("@ucbuilder:/global/listUI/pager/scrollNodes/simpleScroll").simpleScroll} simpleScroll
 */

class datagrid extends designer {
    constructor() {
        eval(designer.giveMeHug);
        this.init();
        this.container1.style.setProperty("--xxxxwinfo", "20px 150px 200px 120px 250px 100px 80px 350px");

        let cbox = this.detail.scroller.scrollBox;
        let hnodes = cbox.hScrollbar.nodes;
        let vnodes = cbox.vScrollbar.nodes;
        hnodes.scrollbar = hnodes.scrollbar.$();
        vnodes.scrollbar = vnodes.scrollbar.$();
        vnodes.beginText = this.begin_scroll_text;
        vnodes.endText = this.end_scroll_text;
        this.hscrollbar1.appendChild(hnodes.scrollbar);
        this.vscrollbar1.appendChild(vnodes.scrollbar);
        this.detail.init(this.detailGridHT1, this.pagercntnr1, this);
        
       
        this.detail.scroller.scrollBox.vScrollbar.Events.onChangeHiddenCount = (b, e) => {
            this.begin_scroll_text.innerText = b == 0 ? "" : "▲ " + b + "";
            this.end_scroll_text.innerText = e == 0 ? "" : "▼ " + e + "";
        }
        this.ucExtends.passElement(hnodes.scrollbar);
        this.ucExtends.passElement(vnodes.scrollbar);
    }


    _paging = true;
    get paging() {
        return this._paging;
    }
    set paging(value) {
        this._paging = value;
        //this.pagecntnr1.setAttribute('paging',value);
    }


    //set
    get detailItemTemplate() { return this.detail.itemTemplate; }
    set detailItemTemplate(value) { this.detail.itemTemplate = intenseGenerator.parseTPT(value, this.ucExtends.PARENT); }

    /** @type {Template}  */
    _headerItemTemplate = undefined;
    get headerItemTemplate() { return this._headerItemTemplate; }
    set headerItemTemplate(value) {
        this._headerItemTemplate = intenseGenerator.parseTPT(value, this.ucExtends.PARENT);
    }
    static dgvFillArgs = {
        addHeader: true,
        headerRow: {},
        addFooter: false,
        footerRow: {},
    };
    /** @param {datagrid.dgvFillArgs} params */
    fill(params) {
        let args = newObjectOpt.copyProps(params, datagrid.dgvFillArgs);
        this.detail.nodes.fill();
        if (args.addHeader) {
            this.headerGridHT1.appendChild(this.headerItemTemplate.extended.generateNode(args.headerRow));
        }
        if (args.addFooter) {
            this.footerGridHT1.appendChild(this.footerItemTemplate.extended.generateNode(args.footerRow));
        }
    }
    /** @type {Template}  */
    _footerItemTemplate = undefined;
    get footerItemTemplate() { return this._footerItemTemplate; }
    set footerItemTemplate(value) {
        this._footerItemTemplate = intenseGenerator.parseTPT(value, this.ucExtends.PARENT);;
    }

    detail = new pagerLV();
    /** @type {"columnOnly"|"rowsOnly"|"both"} */
    keepMeasurementOf = 'columnOnly';

    node = {
        rowNodeName: "ROW",
        cellNodeName: "CELL"
    }

    /** @type {HTMLElement}  */
    static drawSelectionHT = `<resizer role="drawSelection" ></resizer>`.$();
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
