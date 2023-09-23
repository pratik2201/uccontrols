const { uniqOpt } = require('@ucbuilder:/build/common.js');
const { commonEvent } = require('@ucbuilder:/global/commonEvent.js');
const { TempleteNode } = require('@ucbuilder:/Template.js');
const { binderNode } = require('@uccontrols:/controls/comboBox.uc.binderNode.js');
const { scrollerLV } = require('@ucbuilder:/global/listUI/scrollerLV');
const { intenseGenerator } = require('@ucbuilder:/intenseGenerator.js');
const { designer } = require('./LinearList.uc.designer.js');
class LinearList extends designer {
   
    get itemTemplate() {
        
        return this.lvUI.itemTemplate;
    }
    
    set itemTemplate(value) {
        this.lvUI.itemTemplate = intenseGenerator.parseTPT(value,this);
        /** @type {string}  
        let s = value;
        console.log(s);*/ 
        //if(s.includes("attributetemplate"))
            //console.log(this.lvUI.itemTemplate.extended.stampRow.stamp+';'+this.ucExtends.stampRow.stamp);
    }
    get Records(){ return this.lvUI.Records;  }
    get Events() { return this.lvUI.Events; }
    
    lvUI = new scrollerLV();

   
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