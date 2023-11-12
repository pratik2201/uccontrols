const { Rect } = require("@uccontrols:/../ucbuilder/global/drawing/shapes");
const datagrid = require("@uccontrols:/controls/datagrid.uc");
const { mouseForMove } = require("@ucbuilder:/global/mouseForMove");
const { gridResizer } = require("@uccontrols:/../ucbuilder/global/gridResizer");
const { Point } = require("ucbuilder/global/drawing/shapes");
const { timeoutCall } = require("ucbuilder/global/timeoutCall");
const { commonEvent } = require("ucbuilder/global/commonEvent");
class measurementNode {
    /** @type {number}  */
    size = 0;

    /** @type {number}  */
    runningSize = 0;

    get prevRunningSize() { return this.runningSize - this.size; }

    get minVal() { return this.runningSize - 2; }
    get maxVal() { return this.runningSize + 2; }

    hasCollission(val) {
        return val >= this.minVal && val <= this.maxVal;
    }
}

class columnResizeManage {
    constructor() { }


    updateAr() {
        let counter = 0;
        this.measurement.forEach((row) => {
            counter += row.size;
            row.runningSize = counter;
        });
        counter = 0;
        this.measurementExp.forEach((row) => {
            counter += row.size;
            row.runningSize = counter;
        });
    }
    hasCollission(val) {
        let rtrn = { hasCollied: false, index: -1, };
        for (let i = 0; i < this.measurement.length; i++) {
            if (this.measurement[i].hasCollission(val)) { rtrn.hasCollied = true; rtrn.index = i; break; }
        }
        return rtrn;
    }
    /**
     * @param {string} txt 
     * @returns {measurementNode[]}
     */
    fillArrFromText(txt) {
        let ar = txt
            .split(/ +/);
        if (this.measurement.length != ar.length) {
            let rtrn = undefined;
            this.measurement.length =
                this.measurementExp.length = 0;
            ar.forEach((s) => {
                let sz = parseFloat(s);
                rtrn = new measurementNode();
                rtrn.size = sz;
                this.measurement.push(rtrn);
                rtrn = new measurementNode();
                rtrn.size = sz;
                this.measurementExp.push(rtrn);
            });
            this.updateAr();
        } else {
            for (let i = 0; i < ar.length; i++) {
                this.measurement[i].size =
                    this.measurementExp[i].size = parseFloat(ar[i]);
            }
        }
        // console.log(this.measurement);
    }
    nameList = gridResizer.getConvertedNames('grid-template-columns');
    
    /** @type {measurementNode[]}  */
    measurement = [];
    /** @type {measurementNode[]}  */
    measurementExp = [];
    /**
     * @param {datagrid} main 
     */
    init(main) {
        this.main = main;
        
        let mouseMv = new mouseForMove();
        let leftIndex = 0, rightIndex = 0;
       
        /** @type {measurementNode}  */
        let rightNode,/** @type {measurementNode}  */ leftNode;
        /** @type {measurementNode}  */
        let rightNodeSize,/** @type {measurementNode}  */ leftNodeSize;

        this.isResizing = false;
        let isSettingSize = false;
        mouseMv.bind(this.main.ucExtends.self, {
            onDown: (evt, dpoint) => {
                this.fillArrFromText(this.varValue);
                if (this.collissionResult.hasCollied) {
                    this.updateOffset();
                    leftIndex = this.collissionResult.index;
                    rightIndex = leftIndex + 1;
                    rightNode = this.measurement[rightIndex];
                    leftNode = this.measurement[leftIndex];
                    if(rightNode!=undefined)
                    rightNodeSize = rightNode.size;
                    leftNodeSize = leftNode.size;

                    this.isResizing = true;
                }else return false;
                evt.preventDefault();
            },
            onMove: (e, diff) => {
                let dval = diff.x;
                if (!e.shiftKey) {
                    leftNode.size = leftNodeSize + dval;
                } else {
                    if (rightNode == undefined) {
                        leftNode.size = leftNodeSize + dval;
                    } else {
                        diff.x = (dval > 0) ? Math.min(dval, rightNodeSize) : Math.max(dval, (leftNodeSize * -1));
                        dval = diff.x;
                        leftNode.size = leftNodeSize + dval;
                        rightNode.size = rightNodeSize - dval;
                    }
                }
                if (isSettingSize) return;
                isSettingSize = true;
                setTimeout(() => {
                    this.varValue = this.measureText;
                    this.Events.onResizing.fire(e,diff);
                    isSettingSize = false;
                }, 1);
            },
            onUp: (e, diff) => {
                if (this.isResizing) {
                    /*let dval = diff.x;
                    leftNode.size += dval;
                    if (e.shiftKey && rightNode != undefined)
                        rightNode.size -= dval;
                    this.updateAr();
                    this.varValue = this.measureText;*/
                    this.updateAr();
                    ///this.main.ucExtends.self.focus();
                }
                isSettingSize = false;
                this.collissionResult.hasCollied = false;
                this.collissionResult.index = -1;
                this.isResizing = false;
            }
        });





        this.main.pagercntnr1.addEventListener("mouseenter", (e) => {
            this.updateOffset();
            this.main.ucExtends.self.addEventListener("mousemove", this.mousemovelistner);
            this.hasMouseEntered = true;
        });
        this.main.pagercntnr1.addEventListener("mouseleave", (e) => {
            this.hasMouseEntered = false;
            this.main.ucExtends.self.removeEventListener("mousemove", this.mousemovelistner);
        });
    }
    Events = {
        /**
         * @type {{on:(callback = (
         *          evt:MouseEvent,
         *          diff:Point,
         * ) =>{})} & commonEvent}
         */
        onResizing:new commonEvent(),
    }
    parentOffset = new DOMRect();
    updateOffset() {
        this.parentOffset = this.main.pagercntnr1.getClientRects()[0];
        this.parentOffset.x -= this.main.pagercntnr1.scrollLeft;
        this.parentOffset.y -= this.main.pagercntnr1.scrollTop;
    }
    hasMouseEntered = false;
    isCheckingHoverCollission = false;
    collissionResult = { hasCollied: false, index: -1 };
    /** @param {MouseEvent} e  */
    mousemovelistner = (e) => {
        
        if (this.isResizing || this.isCheckingHoverCollission) return;
        this.isCheckingHoverCollission = true;
        setTimeout(() => {
            this.isCheckingHoverCollission = false;
            if (!this.hasMouseEntered) return;
            let x = e.clientX - this.parentOffset.x;
            this.collissionResult = this.main.colsResizeMng.hasCollission(x);
            this.main.ucExtends.self.style.cursor = (this.collissionResult.hasCollied) ? 'e-resize' : '';
        }, 1);
    }
    _varName = "gridsize";
    get varName() { return this._varName; }
    set varName(value) { this._varName = value; }
    get varValue() { return this.main.detail.itemTemplate.extended.getCSS_localVar(this.varName); }
    set varValue(val) { console.log('assigned'); this.main.detail.itemTemplate.extended.setCSS_localVar(this.varName, val); }
    getPrevIndex(index) {
        let rm = this.measurement;
        index--;
        for (; index >= 0 && rm[index].size == 0; index--);
        return index;
    }
    get measureText() {
        return this.measurement.length <= 1 ? 'auto'
            : (this.measurement.map(s => s.size))
                .join('px ') + 'px';
    }
    get measureExpText() {
        return this.measurementExp.length <= 1 ? 'auto'
            : (this.measurementExp.map(s => s.size))
                .join('px ') + 'px';
    }
}
module.exports = { columnResizeManage };
