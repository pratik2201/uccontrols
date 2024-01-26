"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Splitter = void 0;
const Splitter_uc_nodeManage_1 = require("uccontrols/controls/Splitter.uc.nodeManage");
const common_1 = require("ucbuilder/build/common");
const Splitter_uc_enumAndMore_1 = require("uccontrols/controls/Splitter.uc.enumAndMore");
const Splitter_uc_splitersGrid_1 = require("uccontrols/controls/Splitter.uc.splitersGrid");
const intenseGenerator_1 = require("ucbuilder/intenseGenerator");
const Splitter_uc_designer_1 = require("./Splitter.uc.designer");
const Splitter_uc_resizeHandler_1 = require("uccontrols/controls/Splitter.uc.resizeHandler");
const jqFeatures_1 = require("ucbuilder/global/jqFeatures");
class Splitter extends Splitter_uc_designer_1.Designer {
    constructor() {
        super();
        this.SESSION_DATA = {
            measurement: [],
            attribList: "",
            primaryContainer: "uccontrols/controls/tabControl.uc",
            type: 'notdefined',
            isMainSplitter: false,
            children: []
        };
        this.allowSplitRow = true;
        this.allowSplitColumn = true;
        this.allowResizeRow = true;
        this.allowResizeColumn = true;
        this.generateNode = true;
        this.nodeMng = new Splitter_uc_nodeManage_1.nodeManage();
        this.gapSize = 0;
        this.minSizeValue = 20;
        this.tree = new Splitter_uc_splitersGrid_1.splitersGrid();
        this.exportedUccontainer = undefined;
        this.resizer = new Splitter_uc_resizeHandler_1.resizeHandler();
        this.initializecomponent(arguments, this);
        this.ucExtends.session.autoLoadSession = true;
        this.nodeMng.init(this);
        this.ucExtends.Events.newSessionGenerate.on(() => {
            this.pushPrimaryContainer();
        });
        this.resizer.init(this);
        this.fillGargebase();
        this.tree.init(this.mainContainer, this);
        this.tree.type = this.SESSION_DATA.type;
        this.ucExtends.Events.loadLastSession.on(() => {
            this.loadSession();
            this.loadChildSession();
        });
        this.resizer.Events.onRefresh = (i, measurement) => {
            let obj = measurement.data;
            let box = this.tree.allElementHT[i].data('box');
            box.uc.ucExtends.session.exchangeParentWith(obj.session);
            obj.ucPath = box.uc.ucExtends.fileInfo.html.rootPath;
            obj.attribList = common_1.controlOpt.xPropToAttr(box.uc.ucExtends.self);
        };
        this.ucExtends.Events.onDataExport = (data) => {
            if (!this.SESSION_DATA.isMainSplitter) {
                return this.ucExtends.PARENT.ucExtends.Events.onDataExport(data);
            }
            switch (data.type) {
                case 'uc':
                    let uc = data.data;
                    uc.ucExtends.windowstate = 'normal';
                    this.exportedUccontainer.appendChild(uc.ucExtends.self);
                    this.pushChildSession(uc);
                    return true;
            }
        };
    }
    fillGargebase() {
        // let ctrls = [];
        // let gcHt = this.ucExtends.garbageElementsHT;
        // if(gcHt.length>0){
        //     while (gcHt.length != 0) {
        //         let row = this.sadoNodeMoklo(this);
        //         row.box.view.appendChild(gcHt[0]);
        //         this.mainContainer.appendChild(row.box.node);
        //     }
        // }
    }
    get length() {
        let len = 0;
        this.tree.allElementHT.forEach(ele => {
            let bx = ele.data('box');
            let val = bx.uc['length'];
            if (val != undefined)
                len += val;
        });
        return len;
    }
    get myPropertiesText() {
        return common_1.controlOpt.xPropToAttr(this.ucExtends.self);
    }
    loadSession() {
        this.tree.type = this.SESSION_DATA.type;
        this.resizer.measurement = this.SESSION_DATA.measurement;
        this.SESSION_DATA.measurement.forEach(cell => {
            let sadoNode = this.nodeMng.givePlainNode(this.tree);
            this.ucExtends.passElement(sadoNode.node);
            this.mainContainer.appendChild(sadoNode.node);
            let elementHT = `<e${cell.data.attribList}></e>`.$();
            let ucs = intenseGenerator_1.intenseGenerator.generateUC(cell.data.ucPath, {
                wrapperHT: elementHT,
                session: { loadBySession: true },
                parentUc: this
            });
            sadoNode.view.appendChild(ucs.ucExtends.self);
            sadoNode.box.uc = ucs;
            ucs.ucExtends.session.setSession(cell.data.session[""]);
        });
        this.resizer.giveResizer();
    }
    loadChildSession() {
        if (!this.SESSION_DATA.isMainSplitter)
            return;
        this.exportedUccontainer.innerHTML = "";
        let backUp = common_1.objectOpt.clone(this.SESSION_DATA.children);
        this.SESSION_DATA.children.length = 0;
        backUp.forEach(s => {
            let uc = intenseGenerator_1.intenseGenerator.generateUC(s.filePath, {
                parentUc: this,
                session: { loadBySession: true }
            });
            let ucExt = uc.ucExtends;
            this.exportedUccontainer.append(uc.ucExtends.self);
            ucExt.session.setSession(s.session[""]);
            s.stamp = uc.ucExtends.self.stamp();
            this.pushChildSession(uc);
        });
    }
    initMain(exportedUccontainer) {
        this.exportedUccontainer = exportedUccontainer;
        this.SESSION_DATA.isMainSplitter = true;
    }
    refreshZindexOfWindows() {
        this.SESSION_DATA.children.forEach(row => {
            let ele = jqFeatures_1.jqFeatures.getElementById(row.stamp);
            row.index = ele.index();
        });
        this.ucExtends.session.onModify();
    }
    pushChildSession(uc) {
        let nstamp = uc.ucExtends.self.stamp();
        let row;
        row = this.SESSION_DATA.children.find(s => s.stamp == nstamp);
        if (row == undefined) {
            row = common_1.objectOpt.clone(Splitter_uc_enumAndMore_1.tabChilds);
            row.stamp = nstamp;
            row.fstamp = uc.ucExtends.stampRow.stamp;
            row.filePath = uc.ucExtends.fileInfo.html.rootPath;
            uc.ucExtends.session.exchangeParentWith(row.session, () => {
                common_1.arrayOpt.removeByCallback(this.SESSION_DATA.children, s => s.stamp == nstamp);
            });
            this.SESSION_DATA.children.push(row);
            this.ucExtends.session.onModify();
        }
        uc.ucExtends.Events.activate.on(() => {
            this.refreshZindexOfWindows();
        });
        uc.ucExtends.Events.beforeClose.on(() => {
            let index = this.SESSION_DATA.children.findIndex(s => s.stamp == nstamp);
            common_1.arrayOpt.removeAt(this.SESSION_DATA.children, index);
            this.ucExtends.session.onModify();
        });
    }
    pushPrimaryContainer() {
        let row = this.nodeMng.giveReadyNode(this.tree);
        this.tree.pushBox(row.box);
        this.tree.refresh();
    }
}
exports.Splitter = Splitter;
