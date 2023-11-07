const { designer } = require('./ListView.uc.designer.js');
const { propOpt } = require('@ucbuilder:/build/common.js');
const { intenseGenerator } = require("@ucbuilder:/intenseGenerator");
const { pagerLV } = require('@ucbuilder:/global/listUI/pagerLV');
const { simpleScroll } = require('@ucbuilder:/global/listUI/pager/scrollNodes/simpleScroll');
/** 
 * @typedef {import ("@ucbuilder:/global/listUI/pager/scrollNodes/pagerScroll").pagerScroll} pagerScroll
 * @typedef {import ("@ucbuilder:/global/listUI/pager/scrollNodes/simpleScroll").simpleScroll} simpleScroll
 */

class ListView extends designer {

    accessKey = propOpt.ATTR.ACCESS_KEY;
    lvUI = new pagerLV();
    get source() { return this.lvUI.source; }
    indexOf(ele) { return this.lvUI.nodes.indexOf(ele); }
    get itemTemplate() {
        return this.lvUI.itemTemplate;
    }
    set itemTemplate(value) {
        this.lvUI.itemTemplate = intenseGenerator.parseTPT(value, this.ucExtends.PARENT);
    }
    get Events() { return this.lvUI.Events; }


    /** @type {number} */
    topSpace = 0;
    get SESSION_DATA() { return this.lvUI.OPTIONS.SESSION; }
    set SESSION_DATA(val) { this.lvUI.OPTIONS.SESSION = val; }
    constructor() {
        eval(designer.giveMeHug);
         let cbox = this.lvUI.scroller.scrollBox;
        // this.lvUI.scroller.scrollBox.hScrollbar;
        //let hnodes = cbox.hScrollbar.nodes;
        let vnodes = cbox.vScrollbar.nodes;
        //hnodes.scrollbar = hnodes.scrollbar.$();
        vnodes.scrollbar = vnodes.scrollbar.$();
        vnodes.beginText = this.begin_scroll_text;
        vnodes.endText = this.end_scroll_text;
        //this.hscrollbar1.appendChild(hnodes.scrollbar);
        this.vscrollbar1.appendChild(vnodes.scrollbar);
        this.lvUI.init(this.ll_view, this.scroller1, this);

        let hscroller = new simpleScroll('h');
        hscroller.init(this.lvUI,this.hscrollbar1);

       // this.ucExtends.passElement(hnodes.scrollbar);
        this.ucExtends.passElement(vnodes.scrollbar);
        this.lvUI.scroller.scrollBox.vScrollbar.Events.onChangeHiddenCount = (b, e) => {
            this.begin_scroll_text.innerText = b == 0 ? "   " : "▲ " + b + "";
            this.end_scroll_text.innerText = e == 0 ? "    " : "▼ " + e + "";
        }

        this.init();
        this.ucExtends.Events.loadLastSession.on(() => {
            /*timeoutCall.start(() => {
                this.lvUI.currentIndex = this.SESSION_DATA.currentIndex;
            }, 1);*/
        });

        this.Events.currentItemIndexChange.on((oindex, nindex, evt, evtType) => {
            if (evtType == 'Mouse') this.ucExtends.session.onModify();
        });

    }

    get lvUiNodes() { return this.lvUI.nodes; };
    get lvUiRecords() { return this.lvUI.Records; }
    get currentRecord() { return this.lvUI.source[this.lvUI.OPTIONS.SESSION.currentIndex]; }
    init() {
        this.initListView();
    }



    initListView() {
        let _this = this;
        let uc = this.ucExtends.wrapperHT;
        uc.setAttribute('tabindex', -1);

        this.lvUI.Events.newItemGenerate.on(
            /** @param {HTMLElement} ele */
            (ele, index) => {
                ele.setAttribute("x-tabindex", index);
            });


    }
}
module.exports = ListView;