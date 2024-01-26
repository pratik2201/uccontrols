"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinearList = void 0;
const common_js_1 = require("ucbuilder/build/common.js");
const scrollerLV_1 = require("ucbuilder/global/listUI/scrollerLV");
const intenseGenerator_js_1 = require("ucbuilder/intenseGenerator.js");
const LinearList_uc_designer_js_1 = require("./LinearList.uc.designer.js");
class LinearList extends LinearList_uc_designer_js_1.Designer {
    constructor() {
        super();
        this.lvUI = new scrollerLV_1.ScrollerLV();
        this.initializecomponent(arguments, this);
    }
    get itemTemplate() {
        return this.lvUI.itemTemplate;
    }
    set itemTemplate(value) {
        this.lvUI.itemTemplate = intenseGenerator_js_1.intenseGenerator.parseTPT(value, this);
    }
    get Records() {
        return this.lvUI.Records;
    }
    get nodes() {
        return this.lvUI.nodes;
    }
    get Events() {
        return this.lvUI.Events;
    }
    get source() {
        return this.lvUI.source;
    }
    init() {
        this.lvUI.init(this.ucExtends.self, this.ucExtends.self);
    }
}
exports.LinearList = LinearList;
LinearList.ATTR = {
    SOURCE: "sdta" + common_js_1.uniqOpt.randomNo()
};
