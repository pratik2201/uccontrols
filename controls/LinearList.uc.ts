import { uniqOpt } from "ucbuilder/build/common.js";
import { TemplateNode } from "ucbuilder/Template.js";
import { ScrollerLV } from "ucbuilder/global/listUI/scrollerLV";
import { intenseGenerator } from "ucbuilder/intenseGenerator.js";
import { Designer } from "uccontrols/_designer/controls/LinearList.uc.designer.js";
export class LinearList extends Designer {
    lvUI: ScrollerLV = new ScrollerLV();

    get itemTemplate(): TemplateNode {
        return this.lvUI.itemTemplate;
    }

    set itemTemplate(value: TemplateNode) {
        this.lvUI.itemTemplate = intenseGenerator.parseTPT(value, this);
    }

    get Records()  {
        return this.lvUI.Records;
    }

    get nodes()  {
        return this.lvUI.nodes;
    }

    get Events()  {
        return this.lvUI.Events;
    }

    get source()  {
        return this.lvUI.source;
    }

    constructor() {
        super();
        this.initializecomponent(arguments, this);
    }

    init(): void {
        this.lvUI.init(this.ucExtends.self, this.ucExtends.self);
    }

    static ATTR = {
        SOURCE: "sdta" + uniqOpt.randomNo()
    }
}