const { objectOpt, controlOpt } = require("@ucbuilder:/build/common");
const { Rect } = require("@ucbuilder:/global/drawing/shapes");
const { gridResizer } = require("@ucbuilder:/global/gridResizer");
const Splitter = require("@uccontrols:/controls/Splitter.uc");
const { measurementRow } = require('@uccontrols:/controls/Splitter.uc.enumAndMore.js');
const { boxHandler } = require("@uccontrols:/controls/Splitter.uc.boxHandler");
const { spliterType, splitterCell } = require("@uccontrols:/controls/Splitter.uc.enumAndMore");
const { splitersGrid } = require("@uccontrols:/controls/Splitter.uc.splitersGrid");
/**
 * @typedef {import ("@ucbuilder:/Usercontrol").Usercontrol} Usercontrol
 */
class resizeHandler {
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
        this.gridRsz.fillMode = 'fill';
    }
    /** @type {Splitter}  */
    uc = undefined;
    /** @param {Splitter} uc */
    init(uc) {
        this.uc = uc;
        this.measurement = this.uc.SESSION_DATA.measurement;
        this.gridRsz.init({
            grid: uc.mainContainer,
            container: uc.ucExtends.self,
            uc: uc,
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
            case "columns": this.gridRsz.nameList.setByType('grid-template-columns'); break;
            case "rows": this.gridRsz.nameList.setByType('grid-template-rows'); break;
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
        let offsetSize = this.gridRsz.nameList.offsetSize;

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
            resHt.setAttribute("role", this.gridRsz.nameList.dir);
            this.allElementHT[i].append(resHt);
            this.resizerHTlist.push(resHt);
            this.doWithIndex(resHt, i);
        }
        this.gridRsz.refreshView();
    }
    /** @type {HTMLElement}  */
    static resizerHT = `<resizer role="left"></resizer>`.$();
    /** @type {HTMLElement}  */
    static drawSelectionHT = `<resizer role="drawSelection"></resizer>`.$();
    /**
     * @param {number} index 
     * @param {HTMLElement} resizer 
     */
    doWithIndex(resizer, index) {
        let _this = this;
        /** @type {number}  */
        let lpos = undefined;
        let measurement = _this.measurement;
        let prevSize = -1;
        let nextSize = -1;

        //console.log(resizer);
        resizer.addEventListener("mousedown", (downEvt) => {
            let htEle = _this.allElementHT[index];
            _this.uc.ucExtends.passElement(resizeHandler.drawSelectionHT);

            document.body.appendChild(resizeHandler.drawSelectionHT);
            let rct = new Rect();
            Object.assign(resizeHandler.drawSelectionHT.style, rct.applyHT.all());
            resizeHandler.drawSelectionHT.style.visibility = "visible";
            lpos = downEvt[_this.gridRsz.nameList.pagePoint];
            rct.setBy.domRect(htEle.getClientRects()[0]);
            rct.applyHT.all(resizeHandler.drawSelectionHT);
            let oval = rct.location[_this.gridRsz.nameList.point];
            let osz = rct.size[_this.gridRsz.nameList.size];
            let diff = 0;
            this.Events.onMouseDown(index - 1, index);

            function mousemoveEvent(moveEvt) {
                let cpos = moveEvt[_this.gridRsz.nameList.pagePoint];
                diff = cpos - lpos;

                if ((prevSize + diff) <= _this.minSizeForCollapse && _this.isPrevCollapsable) {
                    diff -= prevSize + diff;
                } else if ((nextSize - diff) <= _this.minSizeForCollapse && _this.isNextCollapsable) {
                    diff += nextSize - diff;
                }

                rct.location[_this.gridRsz.nameList.point] = oval + diff;
                rct.size[_this.gridRsz.nameList.size] = (osz - diff);

                Object.assign(resizeHandler.drawSelectionHT.style, rct.applyHT.all());
            }

            prevSize = this.measurement[index - 1].size;
            nextSize = this.measurement[index].size;
            document.body.on("mousemove", mousemoveEvent);
            document.body.on("mouseup mouseleave", mouseupEvent);

            function mouseupEvent(moveEvt) {
                let prev = measurement[index - 1];
                let next = measurement[index];
                let ovl = prev.size;
                diff = (ovl + diff) <= 0 ? -ovl : diff;
                diff = (next.size - diff) <= 0 ? next.size : diff;
                prev.size += diff;
                next.size = rct.size[_this.gridRsz.nameList.size];

                _this.checkAndRemoveNode(index - 1, index);
                _this.gridRsz.refreshView();

                resizeHandler.drawSelectionHT.style.visibility = "collapse";
                _this.uc.ucExtends.session.onModify();
                document.body.off("mousemove", mousemoveEvent);
                document.body.off("mouseup mouseleave", mouseupEvent);
            }
        });
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
