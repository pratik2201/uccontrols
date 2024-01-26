"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tabControl = void 0;
const common_js_1 = require("ucbuilder/build/common.js");
const Usercontrol_js_1 = require("ucbuilder/Usercontrol.js");
const Splitter_uc_enumAndMore_1 = require("uccontrols/controls/Splitter.uc.enumAndMore");
const tabControl_uc_drag_js_1 = require("uccontrols/controls/tabControl.uc.drag.js");
const intenseGenerator_js_1 = require("ucbuilder/intenseGenerator.js");
const tabControl_uc_designer_js_1 = require("./tabControl.uc.designer.js");
const ResourcesUC_js_1 = require("ucbuilder/ResourcesUC.js");
const objectOpt_js_1 = require("ucbuilder/global/objectOpt.js");
const tabRecord = {
    caption: '',
    tabButton: undefined,
    SESSION: undefined,
};
const pushUCPera = {
    atIndex: -1,
    refreshHeader: true,
    setActive: true,
};
class tabControl extends tabControl_uc_designer_js_1.Designer {
    constructor() {
        super();
        this.SESSION_DATA = {
            tabChild: [],
            activeIndex: 0,
        };
        this.dragHandle = new tabControl_uc_drag_js_1.dragHandler();
        this.source = [];
        this.initializecomponent(arguments, this);
        this.init();
    }
    init() {
        this.tpt_itemnode.init(this);
        this.ucExtends.Events.loadLastSession.on(() => {
            this.loadSession();
        });
        this.ucExtends.Events.onDataImport = (data) => {
            switch (data.type) {
                case 'uc':
                    if (common_js_1.objectOpt.parse(data.data, Usercontrol_js_1.Usercontrol.name)) {
                        let uc = data.data;
                        this.pushUc(uc);
                        return true;
                    }
                    break;
            }
            return false;
        };
        this.dragHandle.init(this);
    }
    get length() {
        return this.tabView.children.length;
    }
    loadSession() {
        this.SESSION_DATA.tabChild.forEach(node => {
            let nuc = intenseGenerator_js_1.intenseGenerator.generateUC(node.filePath, {
                parentUc: this,
                session: { loadBySession: true }
            });
            nuc.ucExtends.session.setSession(node.session[""]);
            this.pushUc(nuc, { refreshHeader: false, setActive: false });
        });
        this.refreshTabHeader();
        this.tpt_itemnode.setActive(this.SESSION_DATA.activeIndex);
    }
    pushUc(uc, pera) {
        let args = objectOpt_js_1.newObjectOpt.copyProps(pera, pushUCPera);
        uc.ucExtends.windowstate = 'dock';
        if (args.atIndex == -1)
            this.tabView.appendChild(uc.ucExtends.self);
        else {
            this.tabView.children.item(args.atIndex).before(uc.ucExtends.self);
        }
        uc.ucExtends.Events.activate.on(() => {
            this.tpt_itemnode.setActive(uc.ucExtends.self.index());
        });
        if (args.refreshHeader)
            this.refreshTabHeader();
        if (args.setActive)
            this.tpt_itemnode.setActive(uc.ucExtends.self.index());
    }
    refreshTabHeader() {
        this.tabHeader.innerHTML = "";
        this.SESSION_DATA.tabChild.length = 0;
        this.source.length = 0;
        common_js_1.looping.htmlChildren(this.tabView, (htEle) => {
            let uc = ResourcesUC_js_1.ResourcesUC.getBaseObject(htEle);
            let ucext = uc.ucExtends;
            let ssn = common_js_1.objectOpt.clone(Splitter_uc_enumAndMore_1.tabChilds);
            ssn.filePath = ucext.fileInfo.html.rootPath;
            ssn.fstamp = ucext.stampRow.stamp;
            ssn.index = htEle.index();
            ssn.stamp = htEle.stamp();
            uc.ucExtends.session.exchangeParentWith(ssn.session);
            this.SESSION_DATA.tabChild.push(ssn);
            let row = {
                tabName: htEle.getAttribute("x-caption"),
            };
            let tab = common_js_1.objectOpt.clone(tabRecord);
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
exports.tabControl = tabControl;
