const { objectOpt, controlOpt } = require('@ucbuilder:/build/common.js');
const { boxHandler } = require('@uccontrols:/controls/Splitter.uc.boxHandler.js');
const { spliterType, splitterCell, measurementRow } = require('@uccontrols:/controls/Splitter.uc.enumAndMore.js');
const { splitersGrid } = require('@uccontrols:/controls/Splitter.uc.splitersGrid.js');
const { intenseGenerator } = require('@ucbuilder:/intenseGenerator.js');

const { designer } = require('./Splitter.uc.designer.js');
const { resizeHandler } = require('@uccontrols:/controls/Splitter.uc.resizeHandler.js');
class Splitter extends designer {



    SESSION_DATA = {

        /** @type {measurementRow[]}  */
        measurement: [],
        attribList: "",
        /** @type {spliterType}  */ 
        type: 'notdefined',

    };
    allowSplitRow = true;
    allowSplitColumn = true;
    allowResizeRow = true;
    allowResizeColumn = true;
    generateNode = true;
    constructor() {
        eval(designer.giveMeHug);
        this.resizer.measurement = this.SESSION_DATA.measurement;
        this.resizer.grid = this.mainContainer;
        this.resizer.uc = this;
        this.resizer.bluePrint = objectOpt.clone(measurementRow);
        this.resizer.Events.onMouseDown = (pIndex, cIndex) => {
            this.resizer.isPrevCollapsable = this.resizer.allElementHT[pIndex].data('box').uc.length === 0;
            this.resizer.isNextCollapsable = this.resizer.allElementHT[cIndex].data('box').uc.length === 0;
        };
        this.fillGargebase();
        this.tree.init(this.mainContainer, this);
        this.tree.type = this.SESSION_DATA.type;
        this.ucExtends.Events.loadLastSession.on(() => {
            this.loadSession();
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
    }
    fillGargebase() {
        /*let ctrls = [];
        let gcHt = this.ucExtends.garbageElementsHT;
        if(gcHt.length>0){
            while (gcHt.length != 0) {
                let row = this.sadoNodeMoklo(this);
                row.box.view.appendChild(gcHt[0]);
                this.mainContainer.appendChild(row.box.node);
            }
        }*/
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
    /*pushPrimaryContainer() {
        let row = this.navoNodeMoklo(this.tree);

        this.tree.pushBox(row.box);
        this.tree.refresh();
    }*/
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

            //sadoNode.view.appendChild(ucs.ucExtends.self);
            //console.log(node.session);
            ucs.ucExtends.session.setSession(cell.data.session[""]);
        });

        this.resizer.giveResizer();

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
        /**   AA LE... MOKLYO */
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
        /** @type {Splitter}  */
        let uc = intenseGenerator.generateUC("@uccontrols:/controls/Splitter.uc.html", {
            wrapperHT: elementHT,
            parentUc: this
        });

        /**   AA LE... MOKLYU */
        return uc;
    }
}
module.exports = Splitter;