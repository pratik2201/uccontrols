import { resizeManage } from "ucbuilder/global/resizer/resizeManage";
import { Designer } from "./datagrid.uc.designer.js";
import { pagerLV } from "ucbuilder/global/listUI/pagerLV";
import { TemplateNode } from "ucbuilder/Template";
import { intenseGenerator } from "ucbuilder/intenseGenerator.js";
import { newObjectOpt } from "ucbuilder/global/objectOpt.js";
import { simpleScroll } from "ucbuilder/global/listUI/pager/scrollNodes/simpleScroll";
import { newPagerScroll } from "ucbuilder/global/listUI/pager/scrollNodes/newPagerScroll";
interface DatagridFillArguments {
    addHeader: boolean,
    headerRow: {},
    fillDetail: boolean,
    addFooter: boolean,
    footerRow: {},
  };
 const datagridFillArguments:DatagridFillArguments ={
    addHeader: true,
    headerRow: {},
    fillDetail: true,
    addFooter: false,
    footerRow: {},
  }
export class datagrid extends Designer {
  constructor() {
    super();
    this.initializecomponent(arguments, this);
    this.init();
    let cbox: HTMLElement = this.detail.scroller.scrollBox;

    this.detail.init(this.detailGridHT1, this.pagercntnr1, this);

    let hscroller: simpleScroll = new simpleScroll("h");
    hscroller.init(this.detail, this.hscrollbar1);
    hscroller.Event.onScroll.on((e: Event) => {
      this.headerSectionHT.scrollLeft = this.footerSectionHT.scrollLeft =
        this.hscrollbar1.scrollLeft;
    });
    this.pagercntnr1.addEventListener("scroll", (e: Event) => {
      this.headerSectionHT.scrollLeft =
        this.footerSectionHT.scrollLeft =
        this.pagercntnr1.scrollLeft =
          this.hscrollbar1.scrollLeft;
    });

    let vscroller: newPagerScroll = new newPagerScroll("v");
    vscroller.elementNode.beginText = this.begin_scroll_text;
    vscroller.elementNode.endText = this.end_scroll_text;
    vscroller.init(this.detail, this.vscrollbar1);
    vscroller.Events.onChangeHiddenCount.on((b: number, e: number) => {
      this.begin_scroll_text.innerText = b == 0 ? "" : "▲ " + b + "";
      this.end_scroll_text.innerText = e == 0 ? "" : "▼ " + e + "";
    });
  }

  _paging: boolean = true;
  get paging(): boolean {
    return this._paging;
  }
  set paging(value: boolean) {
    this._paging = value;
  }

  get varName(): string {
    return this.resizer.varName;
  }
  set varName(value: string) {
    this.resizer.varName = value;
  }
  get varValue(): string {
    return this.resizer.varValue;
  }
  set varValue(value: string) {
    this.resizer.varValue = value;
  }

  get itemTemplate(): TemplateNode {
    return this.detail.itemTemplate;
  }
  set itemTemplate(value: TemplateNode) {
    this.detail.itemTemplate = intenseGenerator.parseTPT(
      value,
      this.ucExtends.PARENT
    );
  }

  _headerTemplate: TemplateNode = undefined;
  get headerTemplate(): TemplateNode {
    return this._headerTemplate;
  }
  set headerTemplate(value: TemplateNode) {
    this._headerTemplate = intenseGenerator.parseTPT(
      value,
      this.ucExtends.PARENT
    );
  }

  _footerTemplate: TemplateNode | undefined = undefined;
  get footerTemplate(): TemplateNode | undefined {
    return this._footerTemplate;
  }
  set footerTemplate(value: TemplateNode | undefined) {
    this._footerTemplate = intenseGenerator.parseTPT(
      value,
      this.ucExtends.PARENT
    );
  }

  
  fill(params: DatagridFillArguments) {
    let args = Object.assign(params, datagridFillArguments);
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

  detail: pagerLV = new pagerLV();

  resizer: resizeManage = new resizeManage();

  init() {
    let changed = false;
    Object.assign(this.resizer.options, {
      container: this.ucExtends.self,
      grid: this.pagercntnr1,
      getVarValue: (varname: string) =>
        this.detail.itemTemplate.extended.getCSS_localVar(varname),
      setVarValue: (varname: string, val: string) =>
        this.detail.itemTemplate.extended.setCSS_localVar(varname, val),
    });
    this.resizer.init();
  }
}