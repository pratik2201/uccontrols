const { objectOpt, controlOpt } = require("@ucbuilder:/build/common");
const { Rect, Point } = require("@ucbuilder:/global/drawing/shapes");
const { gridResizer, namingConversion } = require("@ucbuilder:/global/gridResizer");
const { mouseForMove } = require("@ucbuilder:/global/mouseForMove");
const Splitter = require("@uccontrols:/controls/Splitter.uc");
const { measurementRow } = require('@uccontrols:/controls/Splitter.uc.enumAndMore.js');
const { boxHandler } = require("@uccontrols:/controls/Splitter.uc.boxHandler");
const { spliterType, splitterCell } = require("@uccontrols:/controls/Splitter.uc.enumAndMore");
const { splitersGrid } = require("@uccontrols:/controls/Splitter.uc.splitersGrid");
/**
 * @typedef {import ("@ucbuilder:/Usercontrol").Usercontrol} Usercontrol
 */
class resizeHandler {
    /** @type {namingConversion}  */
    nameList = undefined;
    gridRsz = new gridResizer();
    /** @type {measurementRow}  */
    bluePrint = {
        /** @type {HTMLElement}  */
        size: undefined,
        data: {}
    };

    set measurement(value) { this.gridRsz.measurement = value; }
    get measurement() { return this.gridRsz.measurement; }

    constructor() {
        this.gridRsz.resizeMode = 'slider';
    }
    /** @type {Splitter}  */
    uc = undefined;
    /** @param {Splitter} uc */
    init(uc) {
        this.uc = uc;
        this.measurement = this.uc.SESSION_DATA.measurement;
        this.gridRsz.init({
            grid: uc.mainContainer,
            nodeName: "node",
        });
        this.bluePrint = objectOpt.clone(measurementRow);
        this.allElementHT = this.grid.childNodes;
        this.Events.onMouseDown = (pIndex, cIndex) => {
            this.isPrevCollapsable = this.allElementHT[pIndex].data('box').uc.length === 0;
            this.isNextCollapsable = this.allElementHT[cIndex].data('box').uc.length === 0;
        };
    }
    get grid() {
        return this.gridRsz.options.grid;
    }


    /** @type {HTMLElement[]}  */
    allElementHT = undefined;


    /** @type {spliterType}  */
    _type = '';
    get type() {
        return this._type;
    }
    set type(value) {
        this._type = value;
        switch (value) {
            case "columns":
                this.nameList = gridResizer.getConvertedNames('grid-template-columns');
                this.gridRsz.gridTemplate = this.nameList.gridTemplate;
                break;
            case "rows":
                this.nameList = gridResizer.getConvertedNames('grid-template-rows');
                this.gridRsz.gridTemplate = this.nameList.gridTemplate;
                break;
        }
    }


    Events = {
        /**
         * @param {number} index 
         * @param {measurementRow} measurement 
         */
        onRefresh: (index, measurement) => {

        },
        onMouseDown: (prevIndex, currentIndex) => {

        },
        /**
         * @param {number} index this indexed node will removed
         * @param {number} spaceAllocateIndex this node will consume all those space of removed node
         * @returns {boolean} return `false` will prevent the action
         */
        beforeCollepse: (index, spaceAllocateIndex) => {

        },

        //beforePushingResizer:()=>{ return true; }
    }
    allowResize = true;
    refresh() {

        let len = this.allElementHT.length;
        if (len == 0) { return; }
        let hasStyle = this.gridRsz.hasDefinedStyles;
        let offsetSize = this.nameList.offsetSize;

        this.gridFullSize = hasStyle ? 0 : this.grid[offsetSize];
        let eqSize = this.gridFullSize / len;
        let obj = undefined;
        if (hasStyle) {
            for (let i = 0; i < len; i++) {
                this.Events.onRefresh(i, this.measurement[i]);
            }
        } else {
            for (let i = 0; i < len; i++) {
                obj = objectOpt.clone(this.bluePrint);
                obj.size = eqSize;
                this.measurement[i] = obj;
                this.Events.onRefresh(i, obj);
            }
        }
        this.giveResizer();
    }
    /** @type {HTMLElement[]}  */
    resizerHTlist = [];
    giveResizer() {
        if (!this.allowResize) { this.gridRsz.refreshView(); return; }
        let len = this.allElementHT.length;
        this.resizerHTlist.forEach(s => s.delete());
        this.resizerHTlist = [];
        for (let i = 1; i < len; i++) {
            let resHt = this.uc.ucExtends.passElement(resizeHandler.resizerHT.cloneNode(true));
            resHt.setAttribute("role", this.nameList.dir);
            this.allElementHT[i].append(resHt);
            this.resizerHTlist.push(resHt);
            this.doWithIndex(resHt, i);
        }
        this.gridRsz.refreshView();
    }
    /** @type {HTMLElement}  */
    static resizerHT = `<resizer role="left"></resizer>`.$();
    /** @type {HTMLElement}  */
    static drawSelectionHT = `<splitter-resizer-abc role="drawSelection"></splitter-resizer-abc>`.$();
    /**
     * @param {number} index 
     * @param {HTMLElement} resizer 
     */
    doWithIndex(resizer, index) {
        let _this = this;
        /** @type {number}  */
        //let lpos = undefined;
        //let measurement = _this.measurement;
        let selectionRect = new Rect();
        let selection_oldPoint = 0;
        let selection_oldSize = 0;
        /**  @type {measurementRow} */
        let prevNode = undefined;
        /**  @type {measurementRow} */
        let nextNode = undefined;
        let mouseMv = new mouseForMove();
        let xy_text = _this.nameList.point;
        let size_text = _this.nameList.size;
        mouseMv.bind(resizer, {
            onDown: (e, dpoint) => {
                let htEle = _this.allElementHT[index];
                _this.uc.ucExtends.passElement(resizeHandler.drawSelectionHT);
                document.body.appendChild(resizeHandler.drawSelectionHT);
                Object.assign(resizeHandler.drawSelectionHT.style, selectionRect.applyHT.all());
                resizeHandler.drawSelectionHT.style.visibility = "visible";
                selectionRect.setBy.domRect(htEle.getClientRects()[0]);
                selectionRect.applyHT.all(resizeHandler.drawSelectionHT);
                
                selection_oldPoint = selectionRect.location[xy_text];
                selection_oldSize = selectionRect.size[size_text];
                this.Events.onMouseDown(index - 1, index);
                prevNode = this.measurement[index - 1];
                nextNode = this.measurement[index];
            },
            onMove: (e, diff) => {
                let dval = diff[xy_text];
                if ((prevNode.size + dval) <= _this.minSizeForCollapse && _this.isPrevCollapsable) {
                    diff[xy_text] -= prevNode.size + dval;
                } else if ((nextNode.size - dval) <= _this.minSizeForCollapse && _this.isNextCollapsable) {
                    diff[xy_text] += nextNode.size - dval;
                }
                dval = diff[xy_text];
                selectionRect.location[xy_text] = selection_oldPoint + dval;
                selectionRect.size[size_text] = selection_oldSize - dval;
                Object.assign(resizeHandler.drawSelectionHT.style, selectionRect.applyHT.all());

            },
            onUp: (e, diff) => {
                let ovl = prevNode.size;
                let dval = diff[xy_text];
                dval = (ovl + dval) <= 0 ? -ovl : dval;
                dval = (nextNode.size - dval) <= 0 ? nextNode.size : dval;
                prevNode.size += dval;
                nextNode.size = selectionRect.size[_this.nameList.size];
                _this.checkAndRemoveNode(index - 1, index);
                _this.gridRsz.refreshView();
                resizeHandler.drawSelectionHT.style.visibility = "collapse";
                _this.uc.ucExtends.session.onModify();
            }
        })

    }
    /**
     * @param {number} index item index to remove
     * @param {number} spaceAllocateIndex item index in which removed element's space will added
     */
    removeNode(index, spaceAllocateIndex) {
        if (this.Events.beforeCollepse(index, spaceAllocateIndex) === false) return;
        let pmes = this.measurement[index];
        let nmes = this.measurement[spaceAllocateIndex];
        nmes.size += pmes.size;
        this.measurement.splice(index, 1);
        this.allElementHT[index].delete();
        this.refresh();
    }

    minSizeForCollapse = 20;
    isPrevCollapsable = false;
    isNextCollapsable = false;
    checkAndRemoveNode(prevIndex, nextIndex) {
        // /** @type {HTMLElement}  */
        // let node = undefined;
        // /** @type {boxHandler}  */
        // let box = undefined;        
        let pmes = this.measurement[prevIndex];
        let nmes = this.measurement[nextIndex];
        if (pmes.size <= this.minSizeForCollapse && this.isPrevCollapsable)
            this.removeNode(prevIndex, nextIndex);
        else if (nmes.size <= this.minSizeForCollapse && this.isNextCollapsable)
            this.removeNode(nextIndex, prevIndex);
    }
}
module.exports = { resizeHandler };
