const { columnResizeManage } = require('@uccontrols:/controls/datagrid.uc.columnResizeManage.js');
const { designer } = require('./datagrid.uc.designer.js');
const { pagerLV } = require('@ucbuilder:/global/listUI/pagerLV');
const { TemplateNode } = require('@ucbuilder:/Template');
const { intenseGenerator } = require('@ucbuilder:/intenseGenerator.js');
const { newObjectOpt } = require('@ucbuilder:/global/objectOpt.js');
const { simpleScroll } = require('@ucbuilder:/global/listUI/pager/scrollNodes/simpleScroll');
const { newPagerScroll } = require('@ucbuilder:/global/listUI/pager/scrollNodes/newPagerScroll');
/** 
 * @typedef {import ("@ucbuilder:/global/listUI/pager/scrollNodes/pagerScroll").pagerScroll} pagerScroll
 * @typedef {import ("@ucbuilder:/global/listUI/pager/scrollNodes/simpleScroll").simpleScroll} simpleScroll
 */

class datagrid extends designer {
    constructor() {
        eval(designer.giveMeHug);
        this.init();
        let cbox = this.detail.scroller.scrollBox;
        
        this.detail.init(this.detailGridHT1, this.pagercntnr1, this);

        let hscroller = new simpleScroll('h');
        hscroller.init(this.detail,this.hscrollbar1);
        hscroller.Event.onScroll.on((e)=>{
            this.headerSectionHT.scrollLeft =
            this.footerSectionHT.scrollLeft = this.hscrollbar1.scrollLeft;
        });

        let vscroller = new newPagerScroll('v');
        vscroller.elementNode.beginText = this.begin_scroll_text;
        vscroller.elementNode.endText = this.end_scroll_text;
        vscroller.init(this.detail,this.vscrollbar1);
        vscroller.Events.onChangeHiddenCount.on((b, e) => {
            this.begin_scroll_text.innerText = b == 0 ? "" : "▲ " + b + "";
            this.end_scroll_text.innerText = e == 0 ? "" : "▼ " + e + "";
        });
        


        
    }


    _paging = true;
    get paging() {
        return this._paging;
    }
    set paging(value) {
        this._paging = value;
        //this.pagecntnr1.setAttribute('paging',value);
    }

    get varName() {
        return this.colsResizeMng.varName;
    }
    set varName(value) {
        this.colsResizeMng.varName = value;
    }
    get varValue() {
        return this.colsResizeMng.varValue;
    }
    set varValue(value) {
        
        this.colsResizeMng.varValue = value;
    }
    
    //set
    get detailItemTemplate() { return this.detail.itemTemplate; }
    set detailItemTemplate(value) {
        this.detail.itemTemplate = intenseGenerator.parseTPT(value, this.ucExtends.PARENT);
        //let node = this.detail.itemTemplate.extended.generateNode({});
        //this.detail.nodes.itemSize.update(node);
    }

    /** @type {TemplateNode}  */
    _headerItemTemplate = undefined;
    get headerItemTemplate() { return this._headerItemTemplate; }
    set headerItemTemplate(value) {
        this._headerItemTemplate = intenseGenerator.parseTPT(value, this.ucExtends.PARENT);
    }
    static dgvFillArgs = {
        addHeader: true,
        headerRow: {},
        fillDetail: true,
        addFooter: false,
        footerRow: {},
    };
    /** @param {datagrid.dgvFillArgs} params */
    fill(params) {
        let args = newObjectOpt.copyProps(params, datagrid.dgvFillArgs);
        if (args.fillDetail)
            this.detail.nodes.fill();
        if (args.addHeader) {
            this.headerGridHT1.appendChild(this.headerItemTemplate.extended.generateNode(args.headerRow));
        }
        if (args.addFooter) {
            this.footerGridHT1.appendChild(this.footerItemTemplate.extended.generateNode(args.footerRow));
        }
    }
    /** @type {TemplateNode}  */
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
   
    colsResizeMng = new columnResizeManage();

    init() {
        let changed = false;
        this.colsResizeMng.gridRsz.resizeMode = 'slider';
        this.colsResizeMng.init(this);

    }


}
module.exports = datagrid;
