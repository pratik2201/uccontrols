"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListView = void 0;
const ListView_uc_designer_js_1 = require("./ListView.uc.designer.js");
const common_js_1 = require("ucbuilder/build/common.js");
const intenseGenerator_1 = require("ucbuilder/intenseGenerator");
const pagerLV_1 = require("ucbuilder/global/listUI/pagerLV");
const simpleScroll_1 = require("ucbuilder/global/listUI/pager/scrollNodes/simpleScroll");
const newPagerScroll_js_1 = require("ucbuilder/global/listUI/pager/scrollNodes/newPagerScroll.js");
class ListView extends ListView_uc_designer_js_1.Designer {
    constructor() {
        super();
        this.accessKey = common_js_1.propOpt.ATTR.ACCESS_KEY;
        this.lvUI = new pagerLV_1.pagerLV();
        this.topSpace = 0;
        this.initializecomponent(arguments, this);
        let cbox = this.lvUI.scroller.scrollBox;
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
        let hscroller = new simpleScroll_1.simpleScroll('Horizontal');
        hscroller.init(this.lvUI, this.hscrollbar1);
        let vscroller = new newPagerScroll_js_1.newPagerScroll('Vertical');
        vscroller.elementNode.beginText = this.begin_scroll_text;
        vscroller.elementNode.endText = this.end_scroll_text;
        vscroller.init(this.lvUI, this.vscrollbar1);
        vscroller.Events.onChangeHiddenCount.on((b, e) => {
            this.begin_scroll_text.innerText = b == 0 ? "" : "▲ " + b + "";
            this.end_scroll_text.innerText = e == 0 ? "" : "▼ " + e + "";
        });
        // this.ucExtends.passElement(hnodes.scrollbar);
        //this.ucExtends.passElement(vnodes.scrollbar);
        this.lvUI.scroller.scrollBox.vScrollbar.Events.onChangeHiddenCount = (b, e) => {
            this.begin_scroll_text.innerText = b == 0 ? "   " : "▲ " + b + "";
            this.end_scroll_text.innerText = e == 0 ? "    " : "▼ " + e + "";
        };
        this.init();
        this.ucExtends.Events.loadLastSession.on(() => {
            /*timeoutCall.start(() => {
                this.lvUI.currentIndex = this.SESSION_DATA.currentIndex;
            }, 1);*/
        });
        this.Events.currentItemIndexChange.on((oindex, nindex, evt, evtType) => {
            if (evtType == 'Mouse')
                this.ucExtends.session.onModify();
        });
    }
    get source() { return this.lvUI.source; }
    indexOf(ele) { return this.lvUI.nodes.indexOf(ele); }
    get itemTemplate() {
        return this.lvUI.itemTemplate;
    }
    set itemTemplate(value) {
        this.lvUI.itemTemplate = intenseGenerator_1.intenseGenerator.parseTPT(value, this.ucExtends.PARENT);
    }
    get Events() { return this.lvUI.Events; }
    get SESSION_DATA() { return this.lvUI.OPTIONS.SESSION; }
    set SESSION_DATA(val) { this.lvUI.OPTIONS.SESSION = val; }
    get lvUiNodes() { return this.lvUI.nodes; }
    ;
    get lvUiRecords() { return this.lvUI.Records; }
    get currentRecord() { return this.lvUI.source[this.lvUI.OPTIONS.SESSION.currentIndex]; }
    init() {
        this.initListView();
    }
    initListView() {
        let _this = this;
        let uc = this.ucExtends.wrapperHT;
        uc.setAttribute('tabindex', '-1');
        this.lvUI.Events.newItemGenerate.on(
        /** @param {HTMLElement} ele */
        (ele, index) => {
            ele.setAttribute("x-tabindex", '' + index);
        });
    }
}
exports.ListView = ListView;
