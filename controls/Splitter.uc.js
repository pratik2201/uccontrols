const { controlOpt, objectOpt, arrayOpt } = require('@ucbuilder:/build/common.js');
const { boxHandler } = require('@uccontrols:/controls/Splitter.uc.boxHandler.js');
const { spliterType, splitterCell, measurementRow, tabChilds } = require('@uccontrols:/controls/Splitter.uc.enumAndMore.js');
const { splitersGrid } = require('@uccontrols:/controls/Splitter.uc.splitersGrid.js');
const { intenseGenerator } = require('@ucbuilder:/intenseGenerator.js');

const { designer } = require('./Splitter.uc.designer.js');
const { resizeHandler } = require('@uccontrols:/controls/Splitter.uc.resizeHandler.js');
const { jqFeatures } = require('ucbuilder/global/jqFeatures.js');

/**  @typedef {import("@ucbuilder:/Usercontrol.js").Usercontrol} Usercontrol */

class Splitter extends designer {



    SESSION_DATA = {

        /** @type {measurementRow[]}  */
        measurement: [],
        attribList: "",
        /** @type {spliterType}  */
        type: 'notdefined',

        isMainSplitter: false,
        /** @type {tabChilds[]}  */
        children: []
    };
    allowSplitRow = true;
    allowSplitColumn = true;
    allowResizeRow = true;
    allowResizeColumn = true;
    generateNode = true;
    constructor() {
        eval(designer.giveMeHug);
        
        this.ucExtends.session.autoLoadSession = true;
        
        this.ucExtends.Events.newSessionGenerate.on(()=>{
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
            /** @type {splitterCell}  */
            let obj = measurement.data;
            /** @type {boxHandler}  */
            let box = this.tree.allElementHT[i].data('box');
            box.uc.ucExtends.session.exchangeParentWith(obj.session);
            obj.ucPath = box.uc.ucExtends.fileInfo.html.rootPath;
            obj.attribList = controlOpt.xPropToAttr(box.uc.ucExtends.self);
        }

        this.ucExtends.Events.onDataExport = (data) => {
            if(!this.SESSION_DATA.isMainSplitter){
                return this.ucExtends.PARENT.ucExtends.Events.onDataExport(data);
            }
            switch (data.type) {
                case 'uc':
                    /** @type {Usercontrol}  */
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
            /** @type {boxHandler}  */
            let bx = ele.data('box');
            let val = bx.uc.length;
            if (val != undefined) len += val;
        });
        return len;
    }

    gapSize = 0;
    minSizeValue = 20;
    tree = new splitersGrid();

    get myPropertiesText() {
        return controlOpt.xPropToAttr(this.ucExtends.self);
    }

    loadSession() {
        this.tree.type = this.SESSION_DATA.type;
        this.resizer.measurement = this.SESSION_DATA.measurement;
        this.SESSION_DATA.measurement.forEach(cell => {
            let sadoNode = this.givePlainNode(this.tree);
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

    loadChildSession() {
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
    /** @type {HTMLElement}  */
    exportedUccontainer = undefined;
    /** @param {HTMLElement} exportedUccontainer */
    initMain(exportedUccontainer) {
        this.exportedUccontainer = exportedUccontainer;
        this.SESSION_DATA.isMainSplitter = true;
    }
    refreshZindexOfWindows() {
        this.SESSION_DATA.children.forEach(row => {
            /** @type {HTMLElement}  */
            let ele = jqFeatures.getElementById(row.stamp);
            row.index = ele.index();
        });
        this.ucExtends.session.onModify();
    }
    /** @param {Usercontrol} uc */
    pushChildSession(uc) {
        let nstamp = uc.ucExtends.self.stamp();
        /** @type {tabChilds}  */
        let row = undefined;
        row = this.SESSION_DATA.children.find(s => s.stamp == nstamp);
        if (row == undefined) {
            row = objectOpt.clone(tabChilds);
            row.stamp = nstamp;
            row.fstamp = uc.ucExtends.stampRow.stamp;
            row.filePath = uc.ucExtends.fileInfo.html.rootPath;
            uc.ucExtends.session.exchangeParentWith(row.session, () => {
                arrayOpt.removeByCallback(this.SESSION_DATA.children,
                    /** @param {tabChilds} s */ s => s.stamp == nstamp);

            });
            this.SESSION_DATA.children.push(row);
            this.ucExtends.session.onModify();
        }
        uc.ucExtends.Events.activate.on(() => {
            this.refreshZindexOfWindows();
        });
        uc.ucExtends.Events.beforeClose.on(() => {
            let index = this.SESSION_DATA.children.findIndex(s => s.stamp == nstamp);
            //this.SESSION_DATA.inActiveChildren.push(ssn);
            arrayOpt.removeAt(this.SESSION_DATA.children, index);
            this.ucExtends.session.onModify();
        });
    }


    pushPrimaryContainer() {
        let row = this.giveReadyNode(this.tree);

        this.tree.pushBox(row.box);
        this.tree.refresh();
    }
    resizer = new resizeHandler();
    containerList = [
        "@uccontrols:/controls/tabControl.uc"
    ];
    primaryContainer = "@uccontrols:/controls/tabControl.uc";
    /** @param {splitersGrid} splGrid */
    givePlainNode(splGrid) {
        /** @type {HTMLElement}  */
        let node = '<node></node>'.$();
        /** @type {HTMLElement}  */
        let view = '<view></view>'.$();
        node.appendChild(view);
        this.ucExtends.passElement(node);
        let box = new boxHandler();
        node.data('box', box);

        box.init(splGrid, node, view);
        return {
            node: node,
            view: view,
            box: box
        };
    }
    /** @param {splitersGrid} splGrid */
    giveReadyNode(splGrid) {
        let sadoNode = this.givePlainNode(splGrid);
        let ucs = intenseGenerator.generateUC(this.primaryContainer, { parentUc: this });

        sadoNode.view.appendChild(ucs.ucExtends.self);
        sadoNode.box.uc = ucs;
        return {
            node: sadoNode.node,
            view: sadoNode.view,
            box: sadoNode.box,
        }
    }
    /**
     * @param {spliterType} type
     * @returns {Splitter}
     */
    giveNewGrid(type = 'notdefined') {
        /** @type {HTMLElement}  */
        let elementHT = `<Splitter x.SESSION_DATA.type="=${type}"  ${this.myPropertiesText}  ></Splitter>`.$();
        elementHT.setAttribute("x:generateNode", false);
        elementHT.setAttribute("x:generateNode", false);
        /** @type {Splitter}  */
        let uc = intenseGenerator.generateUC("@uccontrols:/controls/Splitter.uc.html", {
            wrapperHT: elementHT,
            parentUc: this
        });
        
        return uc;
    }
}
module.exports = Splitter;