import { uniqOpt } from 'ucbuilder/build/common.js';
import { TemplateNode } from 'ucbuilder/Template.js';
import { scrollerLV } from 'ucbuilder/global/listUI/scrollerLV';
import { intenseGenerator } from 'ucbuilder/intenseGenerator.js';
import { Designer } from './LinearList.uc.designer.js';
export class LinearList extends Designer {
    lvUI: scrollerLV = new scrollerLV();

    get itemTemplate(): TemplateNode {
        return this.lvUI.itemTemplate;
    }

    set itemTemplate(value: TemplateNode) {
        this.lvUI.itemTemplate = intenseGenerator.parseTPT(value, this);
    }

    get Records(): any {
        return this.lvUI.Records;
    }

    get nodes(): any {
        return this.lvUI.nodes;
    }

    get Events(): any {
        return this.lvUI.Events;
    }

    get source(): any {
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