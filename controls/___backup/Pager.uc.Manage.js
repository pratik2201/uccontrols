const Pager_extends = require("@wfroot/appBuilder/Window/Util/Pager.uc.extends");
const { pageRowOption } = require("@wfroot/appBuilder/Window/codeFile/PageManage.enum");
const { propOpt } = require("@wfroot/appBuilder/Window/build/common");

class PagerManage extends Pager_extends {

    /** @param {{}[]} objs */
    static ____refreshSource(objs) {
        let rindex = 0;
        objs.map((row) => {
            let rOption = new pageRowOption();
            rOption.index = rindex++;
            row[propOpt.ATTR.OPTION] = rOption;
        });
    }    
    constructor(defaultIndex = 0) { super(); this.PageManage_extended.records.defaultIndex = defaultIndex; }
    get Events(){ return this.PageManage_extended.Events; }
    get element(){ return this.PageManage_extended.element; }
    get nodes(){ return this.PageManage_extended.nodes; }
}
module.exports = { PageManage: PagerManage }