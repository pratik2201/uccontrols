import { Usercontrol } from "ucbuilder/Usercontrol";
import { boxHandler } from "uccontrols/controls/Splitter.uc.boxHandler";
import { nodeManage } from "uccontrols/controls/Splitter.uc.nodeManage";
import { controlOpt, objectOpt, arrayOpt } from "ucbuilder/build/common";
import { SpliterType, splitterCell, SplitterMeasurementRow, TabChilds, tabChilds, SplitterCell } from "uccontrols/controls/Splitter.uc.enumAndMore";
import { splitersGrid } from "uccontrols/controls/Splitter.uc.splitersGrid";
import { intenseGenerator } from "ucbuilder/intenseGenerator";
import { Designer } from "./Splitter.uc.designer";
import { resizeHandler } from "uccontrols/controls/Splitter.uc.resizeHandler";
import { jqFeatures } from "ucbuilder/global/jqFeatures";

export class Splitter extends Designer {
    SESSION_DATA: {
        measurement: SplitterMeasurementRow[];
        attribList: string;
        primaryContainer: string;
        type: SpliterType;
        isMainSplitter: boolean;
        children: TabChilds[];
    } = {
        measurement: [],
        attribList: "",
        primaryContainer: "uccontrols/controls/tabControl.uc",
        type: 'notdefined',
        isMainSplitter: false,
        children: []
    };

    allowSplitRow: boolean = true;
    allowSplitColumn: boolean = true;
    allowResizeRow: boolean = true;
    allowResizeColumn: boolean = true;

    generateNode: boolean = true;

    constructor() {
        super(); this.initializecomponent(arguments, this);
        
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
        this.resizer.Events.onRefresh = (i: number, measurement: SplitterMeasurementRow) => {
            let obj: SplitterCell = measurement.data;
            let box: boxHandler = this.tree.allElementHT[i].data('box');
            box.uc.ucExtends.session.exchangeParentWith(obj.session);
            obj.ucPath = box.uc.ucExtends.fileInfo.html.rootPath;
            obj.attribList = controlOpt.xPropToAttr(box.uc.ucExtends.self);
        }

        this.ucExtends.Events.onDataExport = (data: any) => {
            if (!this.SESSION_DATA.isMainSplitter) {
                return this.ucExtends.PARENT.ucExtends.Events.onDataExport(data);
            }
            switch (data.type) {
                case 'uc':
                    let uc: Usercontrol = data.data;
                    uc.ucExtends.windowstate = 'normal';
                    this.exportedUccontainer.appendChild(uc.ucExtends.self);
                    this.pushChildSession(uc);
                    return true;
            }
        };
    }

    fillGargebase(): void {
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

    get length(): number {
        let len = 0;
        this.tree.allElementHT.forEach(ele => {
            let bx: boxHandler = ele.data('box');
            let val = bx.uc['length'] as number;
            if (val != undefined) len += val;
        });
        return len;
    }

    nodeMng: nodeManage = new nodeManage();
    gapSize: number = 0;
    minSizeValue: number = 20;
    tree: splitersGrid = new splitersGrid();

    get myPropertiesText(): string {
        return controlOpt.xPropToAttr(this.ucExtends.self);
    }

    loadSession(): void {
        console.log(this.SESSION_DATA);
        this.tree.type = this.SESSION_DATA.type;
        
        this.resizer.measurement = this.SESSION_DATA.measurement;
        this.SESSION_DATA.measurement.forEach(cell => {
            let sadoNode = this.nodeMng.givePlainNode(this.tree);
            this.ucExtends.passElement(sadoNode.node);
            this.mainContainer.appendChild(sadoNode.node);
            let elementHT = `<e${cell.data.attribList}></e>`.$();
            let ucs = intenseGenerator.generateUC(cell.data.ucPath, {
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

    loadChildSession(): void {
        if (!this.SESSION_DATA.isMainSplitter) return;
        this.exportedUccontainer.innerHTML = "";
        let backUp = objectOpt.clone(this.SESSION_DATA.children);
        this.SESSION_DATA.children.length = 0;

        backUp.forEach(s => {
            let uc = intenseGenerator.generateUC(s.filePath, {
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

    exportedUccontainer: HTMLElement | undefined = undefined;

    initMain(exportedUccontainer: HTMLElement): void {
        this.exportedUccontainer = exportedUccontainer;
        this.SESSION_DATA.isMainSplitter = true;
    }

    refreshZindexOfWindows(): void {
        this.SESSION_DATA.children.forEach(row => {
            let ele = jqFeatures.getElementById(row.stamp);
            row.index = ele.index();
        });
        this.ucExtends.session.onModify();
    }

    pushChildSession(uc: Usercontrol): void {
        let nstamp = uc.ucExtends.self.stamp();
        let row: TabChilds;
        row = this.SESSION_DATA.children.find(s => s.stamp == nstamp);
        if (row == undefined) {
            row = objectOpt.clone(tabChilds);
            row.stamp = nstamp;
            row.fstamp = uc.ucExtends.stampRow.stamp;
            row.filePath = uc.ucExtends.fileInfo.html.rootPath;
            uc.ucExtends.session.exchangeParentWith(row.session, () => {
                arrayOpt.removeByCallback(this.SESSION_DATA.children,
                    s => s.stamp == nstamp);

            });
            this.SESSION_DATA.children.push(row);
            this.ucExtends.session.onModify();
        }
        uc.ucExtends.Events.activate.on(() => {
            this.refreshZindexOfWindows();
        });
        uc.ucExtends.Events.beforeClose.on(() => {
            let index = this.SESSION_DATA.children.findIndex(s => s.stamp == nstamp);
            arrayOpt.removeAt(this.SESSION_DATA.children, index);
            this.ucExtends.session.onModify();
        });
    }

    pushPrimaryContainer(): void {
       let row = this.nodeMng.giveReadyNode(this.tree);

        this.tree.pushBox(row.box);
        this.tree.refresh();
    }

    resizer: resizeHandler = new resizeHandler();
}