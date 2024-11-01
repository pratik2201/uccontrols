import { objectOpt, looping } from "ucbuilder/build/common.js";
import { Usercontrol } from "ucbuilder/Usercontrol.js";
import { TabChilds, tabChilds } from "uccontrols/controls/Splitter.uc.enumAndMore";
import { dragHandler } from "uccontrols/controls/tabControl.uc.drag.js";
import { intenseGenerator } from "ucbuilder/intenseGenerator.js";
import { Designer } from "uccontrols/designer/controls/tabControl.uc.designer.js";
import { ResourcesUC } from "ucbuilder/ResourcesUC.js";
import { newObjectOpt } from "ucbuilder/global/objectOpt.js";

interface TabRecord {
    caption: string;
    tabButton: HTMLElement;
    SESSION: TabChilds;
}
const tabRecord : TabRecord = {
    caption: '',
    tabButton: undefined,
    SESSION: undefined,
};
interface PushUCPera {
    atIndex?: number;
    refreshHeader?: boolean;
    setActive?: boolean;
}
const pushUCPera : PushUCPera = {
    atIndex: -1,
    refreshHeader: true,
    setActive: true,
};
export class tabControl extends Designer {
   

    SESSION_DATA: {
        tabChild: TabChilds[];
        activeIndex: number;
    } = {
        tabChild: [],
        activeIndex: 0,
    };

    dragHandle: dragHandler = new dragHandler();
    source: TabRecord[] = [];

    constructor() {
        super();this.initializecomponent(arguments, this);
        this.init();
    }

    init(): void {
        this.tpt_itemnode.init(this);
        this.ucExtends.Events.loadLastSession.on(() => {
            this.loadSession();
        });
        this.ucExtends.Events.onDataImport = (data) => {
            switch (data.type) {
                case 'uc':
                    if (objectOpt.parse(data.data, Usercontrol.name)) {
                        let uc: Usercontrol = data.data;
                        this.pushUc(uc);
                        return true;
                    }
                    break;
            }
            return false;
        };
        this.dragHandle.init(this);
    }

    get length(): number {
        return this.tabView.children.length;
    }

    loadSession(): void {
        this.SESSION_DATA.tabChild.forEach(node => {
            let nuc = intenseGenerator.generateUC(node.filePath, {
                parentUc: this,
                session: { loadBySession: true }
            });
            nuc.ucExtends.session.setSession(node.session[""]);
            this.pushUc(nuc, { refreshHeader: false, setActive: false });
        });
        this.refreshTabHeader();
        this.tpt_itemnode.setActive(this.SESSION_DATA.activeIndex);
    }

 
    pushUc(uc: Usercontrol, pera?: PushUCPera): void {
        let args = newObjectOpt.copyProps(pera, pushUCPera);
        uc.ucExtends.windowstate = 'dock';
        if (args.atIndex == -1)
            this.tabView.appendChild(uc.ucExtends.self);
        else {
            this.tabView.children.item(args.atIndex).before(uc.ucExtends.self);
        }
        uc.ucExtends.Events.activate.on(() => {
            this.tpt_itemnode.setActive(uc.ucExtends.self.index());
        });
        if (args.refreshHeader) this.refreshTabHeader();
        if (args.setActive)
            this.tpt_itemnode.setActive(uc.ucExtends.self.index());
    }

    refreshTabHeader(): void {
        this.tabHeader.innerHTML = "";
        this.SESSION_DATA.tabChild.length = 0;
        this.source.length = 0;
        looping.htmlChildren(this.tabView, (htEle: HTMLElement) => {
            let uc: Usercontrol = ResourcesUC.getBaseObject(htEle);
            let ucext = uc.ucExtends;
            let ssn: TabChilds = objectOpt.clone(tabChilds);
            ssn.filePath = ucext.fileInfo.html.rootPath;
            ssn.fstamp = ucext.stampRow.stamp;
            ssn.index = htEle.index();
            ssn.stamp = htEle.stamp();

            uc.ucExtends.session.exchangeParentWith(ssn.session);
            this.SESSION_DATA.tabChild.push(ssn);
            let row = {
                tabName: htEle.getAttribute("x-caption"),
            };
            let tab: TabRecord = objectOpt.clone(tabRecord);
            tab.caption = htEle.getAttribute("x-caption");
            tab.SESSION = ssn;
            let nnode = this.tpt_itemnode.primary.extended.generateNode(tab);
            tab.tabButton = nnode;
            uc.ucExtends.Events.afterClose.on(() => {
                this.SESSION_DATA.tabChild.splice(nnode.index(), 1);
                nnode.remove();
            });
            this.tabHeader.appendChild(nnode);
        });
    }
}