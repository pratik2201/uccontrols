const { uniqOpt } = require('ucbuilder/build/common.js');
const { TemplateNode } = require('ucbuilder/Template.js');
const { scrollerLV } = require('ucbuilder/global/listUI/scrollerLV');
const { intenseGenerator } = require('ucbuilder/intenseGenerator.js');
const { designer } = require('./LinearList.uc.designer.js');
class LinearList extends designer {
   
    get itemTemplate() {
        
        return this.lvUI.itemTemplate;
    }
    
    set itemTemplate(value) {
        this.lvUI.itemTemplate = intenseGenerator.parseTPT(value,this);       
    }
    get Records(){ return this.lvUI.Records;  }
    get nodes(){ return this.lvUI.nodes;  }
    get Events() { return this.lvUI.Events; }
    
    lvUI = new scrollerLV();

   
    get source() {   return this.lvUI.source; }


    /** @type {TemplateNode}  */
    constructor() {
        eval(designer.giveMeHug);
    }
    init(){
        this.lvUI.init(this.ucExtends.self,this.ucExtends.self);
    }
  
    static ATTR = {
        SOURCE: "sdta" + uniqOpt.randomNo()
    }

   


}
module.exports = LinearList;