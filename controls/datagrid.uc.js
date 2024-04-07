"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.datagrid = void 0;
const resizeManage_1 = require("ucbuilder/global/resizer/resizeManage");
const datagrid_uc_designer_js_1 = require("./datagrid.uc.designer.js");
const pagerLV_1 = require("ucbuilder/global/listUI/pagerLV");
const intenseGenerator_js_1 = require("ucbuilder/intenseGenerator.js");
const simpleScroll_1 = require("ucbuilder/global/listUI/pager/scrollNodes/simpleScroll");
const newPagerScroll_1 = require("ucbuilder/global/listUI/pager/scrollNodes/newPagerScroll");
;
const datagridFillArguments = {
    addHeader: true,
    headerRow: {},
    fillDetail: true,
    addFooter: false,
    footerRow: {},
};
class datagrid extends datagrid_uc_designer_js_1.Designer {
    constructor() {
        super();
        this._paging = true;
        this._headerTemplate = undefined;
        this._footerTemplate = undefined;
        this.detail = new pagerLV_1.pagerLV();
        this.resizer = new resizeManage_1.resizeManage();
        this.initializecomponent(arguments, this);
        this.init();
        let cbox = this.detail.scroller.scrollBox;
        this.detail.init(this.detailGridHT1, this.pagercntnr1, this);
        let hscroller = new simpleScroll_1.simpleScroll("Horizontal");
        hscroller.init(this.detail, this.hscrollbar1);
        hscroller.Event.onScroll.on((e) => {
            this.headerSectionHT.scrollLeft = this.footerSectionHT.scrollLeft =
                this.hscrollbar1.scrollLeft;
        });
        this.pagercntnr1.addEventListener("scroll", (e) => {
            this.headerSectionHT.scrollLeft =
                this.footerSectionHT.scrollLeft =
                    this.pagercntnr1.scrollLeft =
                        this.hscrollbar1.scrollLeft;
        });
        let vscroller = new newPagerScroll_1.newPagerScroll("Vertical");
        vscroller.elementNode.beginText = this.begin_scroll_text;
        vscroller.elementNode.endText = this.end_scroll_text;
        vscroller.init(this.detail, this.vscrollbar1);
        vscroller.Events.onChangeHiddenCount.on((b, e) => {
            this.begin_scroll_text.innerText = b == 0 ? "" : "▲ " + b + "";
            this.end_scroll_text.innerText = e == 0 ? "" : "▼ " + e + "";
        });
    }
    get paging() {
        return this._paging;
    }
    set paging(value) {
        this._paging = value;
    }
    get varName() {
        return this.resizer.varName;
    }
    set varName(value) {
        this.resizer.varName = value;
    }
    get varValue() {
        return this.resizer.varValue;
    }
    /*set varValue(value: string) {
      this.resizer.varValue = value;
    }*/
    get itemTemplate() {
        return this.detail.itemTemplate;
    }
    set itemTemplate(value) {
        this.detail.itemTemplate = intenseGenerator_js_1.intenseGenerator.parseTPT(value, this.ucExtends.PARENT);
    }
    get headerTemplate() {
        return this._headerTemplate;
    }
    set headerTemplate(value) {
        this._headerTemplate = intenseGenerator_js_1.intenseGenerator.parseTPT(value, this.ucExtends.PARENT);
    }
    get footerTemplate() {
        return this._footerTemplate;
    }
    set footerTemplate(value) {
        this._footerTemplate = intenseGenerator_js_1.intenseGenerator.parseTPT(value, this.ucExtends.PARENT);
    }
    fill(params) {
        let args = Object.assign(params, datagridFillArguments);
        if (args.fillDetail)
            this.detail.nodes.fill();
        if (args.addHeader) {
            this.headerGridHT1.innerHTML = "";
            this.headerGridHT1.appendChild(this.headerTemplate.extended.generateNode(args.headerRow));
        }
        if (args.addFooter) {
            this.footerGridHT1.innerHTML = "";
            this.footerGridHT1.appendChild(this.footerTemplate.extended.generateNode(args.footerRow));
        }
    }
    init() {
        let changed = false;
        Object.assign(this.resizer.options, {
            container: this.ucExtends.self,
            grid: this.pagercntnr1,
            getVarValue: (varname) => this.detail.itemTemplate.extended.getCSS_localVar(varname),
            setVarValue: (varname, val) => this.detail.itemTemplate.extended.setCSS_localVar(varname, val),
        });
        this.resizer.init();
    }
}
exports.datagrid = datagrid;
