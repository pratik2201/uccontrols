const { uniqOpt } = require('@ucbuilder:/build/common.js');
const { commonEvent } = require('@ucbuilder:/global/commonEvent.js');
const { TempleteNode } = require('@ucbuilder:/Template.js');
const { binderNode } = require('@uccontrols:/controls/comboBox.uc.binderNode.js');
const { listUiHandler } = require('ucbuilder/global/listUiHandler.js');
const { intenseGenerator } = require('ucbuilder/intenseGenerator.js');
const { designer } = require('./LinearList.uc.designer.js');
class LinearList extends designer {
   
    get itemTemplate() {
        
        return this.lvUI.itemTemplate;
    }
    set itemTemplate(value) {
        this.lvUI.itemTemplate = intenseGenerator.parseTPT(value,this.ucExtends.PARENT);
    }
    get Records(){ return this.lvUI.Records;  }
    get Events() { return this.lvUI.Events; }
    
    lvUI = new listUiHandler();

   
    get source() {   return this.lvUI.source; }


    /** @type {TempleteNode}  */
    constructor() {
        eval(designer.giveMeHug);
    }
    init(){
        this.lvUI.init(this.ucExtends.self,this.ucExtends.self);
    }
    //set template(val) { this.lv_items.itemTemplate = val; }
    //get source() { return this.lv_items.source; }
    static ATTR = {
        SOURCE: "sdta" + uniqOpt.randomNo()
    }

   


}
module.exports = LinearList;