import { objectOpt, looping } from 'ucbuilder/build/common.js';
import { Usercontrol } from 'ucbuilder/Usercontrol.js';
import { tabChilds } from 'uccontrols:/controls/Splitter.uc.enumAndMore.js';
import { dragHandler } from 'uccontrols:/controls/tabControl.uc.drag.js';
import { intenseGenerator } from 'ucbuilder/intenseGenerator.js';
import { Designer } from './tabControl.uc.designer.js';
import { ResourcesUC } from 'ucbuilder/ResourcesUC.js';
import { newObjectOpt } from 'ucbuilder/global/objectOpt.js';

interface tabRecord {
    caption: string;
    tabButton: HTMLElement | undefined;
    SESSION: tabChilds | undefined;
}

export class tabControl extends Designer {
    SESSION_DATA: {
        tabChild: tabChilds[];
        activeIndex: number;
    } = {
        tabChild: [],
        activeIndex: 0,
    };

    dragHandle: dragHandler = new dragHandler();
    source: tabRecord[] = [];

    constructor() {
        super();
        eval(designer.giveMeHug);
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

    static pushUCPera = {
        atIndex: -1,
        refreshHeader: true,
        setActive: true,
    };

    pushUc(uc: Usercontrol, pera: typeof tabControl.pushUCPera): void {
        let args = newObjectOpt.copyProps(pera, tabControl.pushUCPera);
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
            let ssn: tabChilds = objectOpt.clone(tabChilds);
            ssn.filePath = ucext.fileInfo.html.rootPath;
            ssn.fstamp = ucext.fileStamp;
            ssn.index = htEle.index();
            ssn.stamp = htEle.stamp();

            uc.ucExtends.session.exchangeParentWith(ssn.session);
            this.SESSION_DATA.tabChild.push(ssn);
            let row = {
                tabName: htEle.getAttribute("x-caption"),
            };
            let tab: tabRecord = objectOpt.clone(tabRecord);
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