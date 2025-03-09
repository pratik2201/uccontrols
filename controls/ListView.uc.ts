import { Designer } from "uccontrols/_designer/controls/ListView.uc.designer.js";
import { propOpt } from "ucbuilder/build/common.js.js";
import { intenseGenerator } from "ucbuilder/intenseGenerator.js";
import { pagerLV } from "ucbuilder/global/listUI/pagerLV.js";
import { simpleScroll } from "ucbuilder/global/listUI/pager/scrollNodes/simpleScroll.js";
import { newPagerScroll } from "ucbuilder/global/listUI/pager/scrollNodes/newPagerScroll.js.js";
import { Template, TemplateNode } from "ucbuilder/Template.js.js";

export class ListView extends Designer {

    accessKey: string = ATTR_OF.X_NAME;
    lvUI = new pagerLV();
    get source() { return this.lvUI.source; }
    indexOf(ele: any): number { return this.lvUI.nodes.indexOf(ele); }
    get itemTemplate():TemplateNode{
        return this.lvUI.itemTemplate;
    }
    set itemTemplate(value: TemplateNode|string|Template) {
        this.lvUI.itemTemplate = intenseGenerator.parseTPT(value, this.ucExtends.PARENT);
    }
    get Events() { return this.lvUI.Events; }


    topSpace: number = 0;
    get SESSION_DATA(): any { return this.lvUI.OPTIONS.SESSION; }
    set SESSION_DATA(val: any) { this.lvUI.OPTIONS.SESSION = val; }
    constructor() {
        super(); this.initializecomponent(arguments, this);
         let cbox  = this.lvUI.scroller.scrollBox;
        // this.lvUI.scroller.scrollBox.hScrollbar;
        //let hnodes = cbox.hScrollbar.nodes;
        /*let vnodes = cbox.vScrollbar.nodes;
        //hnodes.scrollbar = hnodes.scrollbar.$();
        vnodes.scrollbar = vnodes.scrollbar.$();
        vnodes.beginText = this.begin_scroll_text;
        vnodes.endText = this.end_scroll_text;
        //this.hscrollbar1.appendChild(hnodes.scrollbar);
        this.vscrollbar1.appendChild(vnodes.scrollbar);*/
      
        this.lvUI.init(this.ll_view, this.scroller1, this);
       

        let hscroller = new simpleScroll('Horizontal'); 
        hscroller.init(this.lvUI,this.hscrollbar1);

        let vscroller = new newPagerScroll('Vertical');
        vscroller.elementNode.beginText = this.begin_scroll_text;
        vscroller.elementNode.endText = this.end_scroll_text;
        vscroller.init(this.lvUI,this.vscrollbar1);
        vscroller.Events.onChangeHiddenCount.on((b: number, e: number) => {
            this.begin_scroll_text.innerText = b == 0 ? "" : "▲ " + b + "";
            this.end_scroll_text.innerText = e == 0 ? "" : "▼ " + e + "";
        });
        

       // this.ucExtends.passElement(hnodes.scrollbar);
        //this.ucExtends.passElement(vnodes.scrollbar);
        this.lvUI.scroller.scrollBox.vScrollbar.Events.onChangeHiddenCount = (b: number, e: number) => {
            this.begin_scroll_text.innerText = b == 0 ? "   " : "▲ " + b + "";
            this.end_scroll_text.innerText = e == 0 ? "    " : "▼ " + e + "";
        }

        this.init();
        this.ucExtends.Events.loadLastSession.on(() => {
            /*timeoutCall.start(() => {
                this.lvUI.currentIndex = this.SESSION_DATA.currentIndex;
            }, 1);*/
        });

        this.Events.currentItemIndexChange.on((oindex: number, nindex: number, evt: any, evtType: string) => {
            if (evtType == 'Mouse') this.ucExtends.session.onModify();
        });

    }

    get lvUiNodes() { return this.lvUI.nodes; };
    get lvUiRecords() { return this.lvUI.Records; }
    get currentRecord(): any { return this.lvUI.source[this.lvUI.OPTIONS.SESSION.currentIndex]; }
    init() {
        this.initListView();
    }



    initListView() {
        let _this = this;
        let uc = this.ucExtends.wrapperHT;
        uc.setAttribute('tabindex', '-1');

        this.lvUI.Events.newItemGenerate.on(
            /** @param {HTMLElement} ele */
            (ele: HTMLElement, index: number) => {
                ele.setAttribute("x-tabindex", ''+index);
            });


    }
}