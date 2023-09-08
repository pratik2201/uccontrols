const { designer } = require('./ListView.uc.designer.js');
const { propOpt } = require('@ucbuilder:/build/common.js');
const { PageMouseEvent } = require('@ucbuilder:/global/PageManage.enum.js');
const { ListViewSource } = require("@uccontrols:/controls/ListView.uc.enumAndMore");
const { listUiHandler } = require("@ucbuilder:/global/listUiHandler");
const { commonEvent } = require('@ucbuilder:/global/commonEvent.js');
const { Template } = require("@ucbuilder:/Template");
const { intenseGenerator } = require("@ucbuilder:/intenseGenerator")

class ListView extends designer {
    accessKey = propOpt.ATTR.ACCESS_KEY;

    /** @type {ListViewSource}  */
    get source() {   return this.lvUI.source; }
    lvUI = new listUiHandler();
    
    get itemTemplate() {
        return this.lvUI.itemTemplate;
    }
    set itemTemplate(value) {
        this.lvUI.itemTemplate = intenseGenerator.parseTPT(value,this.ucExtends.PARENT);
    }
    get Events (){ return this.lvUI.Events; }
    

    //get listviewEvents() { return this.pageMng.PageManage_extended.Events; }

    /** @type {number} */
    topSpace = 0;
    get SESSION_DATA() {  return this.lvUI.OPTIONS.SESSION; }
    set SESSION_DATA(val) { this.lvUI.OPTIONS.SESSION = val; }
    constructor() {
        eval(designer.giveMeHug);
       
        this.lvUI.init(this.listvw1, this.scroller1);
        this.init();
        this.ucExtends.Events.loadLastSession.on(() => {
            setTimeout(() => {
                this.lvUI.currentIndex = this.SESSION_DATA.currentIndex;
            }, 1);
        });

        this.Events.currentItemIndexChange.on((oindex, nindex, evt, evtType) => {
            if (evtType == 'Mouse') this.ucExtends.session.onModify();
        });
        
    }
    get Records(){ return this.lvUI.Records; }

    init() {

        this.initListView();
    }



    initListView() {
        let _this = this;
        let uc = this.ucExtends.wrapperHT;
        uc.setAttribute('tabindex', -1);
        
        this.lvUI.Events.newItemGenerate.on(
            /** @param {JQuery} ele */
            (ele, index) => {
                ele.setAttribute("x-tabindex", index);
            });


    }
}
module.exports = ListView;