const { resizeManage } = require("@ucbuilder:/global/resizer/resizeManage");
const { designer } = require("./datagrid.uc.designer.js");
const { pagerLV } = require("@ucbuilder:/global/listUI/pagerLV");
const { TemplateNode } = require("@ucbuilder:/Template");
const { intenseGenerator } = require("@ucbuilder:/intenseGenerator.js");
const { newObjectOpt } = require("@ucbuilder:/global/objectOpt.js");
const {
  simpleScroll,
} = require("@ucbuilder:/global/listUI/pager/scrollNodes/simpleScroll");
const {
  newPagerScroll,
} = require("@ucbuilder:/global/listUI/pager/scrollNodes/newPagerScroll");
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

    let hscroller = new simpleScroll("h");
    hscroller.init(this.detail, this.hscrollbar1);
    hscroller.Event.onScroll.on((e) => {
      this.headerSectionHT.scrollLeft = this.footerSectionHT.scrollLeft =
        this.hscrollbar1.scrollLeft;
    });
    this.pagercntnr1.addEventListener("scroll", (e) => {
      //console.log('s');
      this.headerSectionHT.scrollLeft =
        this.footerSectionHT.scrollLeft =
        this.pagercntnr1.scrollLeft =
          this.hscrollbar1.scrollLeft;
    });
    /*this.colsResizeMng.Events.onResizing.on((evt, diff) => {
            this.pagercntnr1.scrollLeft = this.hscrollbar1.scrollLeft;
        });*/
    let vscroller = new newPagerScroll("v");
    vscroller.elementNode.beginText = this.begin_scroll_text;
    vscroller.elementNode.endText = this.end_scroll_text;
    vscroller.init(this.detail, this.vscrollbar1);
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
  set varValue(value) {
    this.resizer.varValue = value;
  }

  get itemTemplate() {
    return this.detail.itemTemplate;
  }
  set itemTemplate(value) {
    this.detail.itemTemplate = intenseGenerator.parseTPT(
      value,
      this.ucExtends.PARENT
    );
  }

  /** @type {TemplateNode}  */
  _headerTemplate = undefined;
  get headerTemplate() {
    return this._headerTemplate;
  }
  set headerTemplate(value) {
    this._headerTemplate = intenseGenerator.parseTPT(
      value,
      this.ucExtends.PARENT
    );
  }
  /** @type {TemplateNode}  */
  _footerTemplate = undefined;
  get footerTemplate() {
    return this._footerTemplate;
  }
  set footerTemplate(value) {
    this._footerTemplate = intenseGenerator.parseTPT(
      value,
      this.ucExtends.PARENT
    );
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
    if (args.fillDetail) this.detail.nodes.fill();
    if (args.addHeader) {
      this.headerGridHT1.innerHTML = "";
      this.headerGridHT1.appendChild(
        this.headerTemplate.extended.generateNode(args.headerRow)
      );
    }
    if (args.addFooter) {
      this.footerGridHT1.innerHTML = "";
      this.footerGridHT1.appendChild(
        this.footerTemplate.extended.generateNode(args.footerRow)
      );
    }
  }

  detail = new pagerLV();

  resizer = new resizeManage();

  init() {
    let changed = false;
    this.resizer.options = {
      container: this.ucExtends.self,
      grid: this.pagercntnr1,
      getVarValue: (varname) =>
        this.detail.itemTemplate.extended.getCSS_localVar(varname),
      setVarValue: (varname, val) =>
        this.detail.itemTemplate.extended.setCSS_localVar(varname, val),
    };
    this.resizer.init();
  }
}
module.exports = datagrid;
