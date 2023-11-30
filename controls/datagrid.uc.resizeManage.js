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

class resizeManage {
    constructor() { }


    updateAr() {
        let counter = 0;
        this.measurement.forEach((row) => {
            counter += row.size;
            row.runningSize = counter;
        });
        /*counter = 0;
        this.measurementExp.forEach((row) => {
            counter += row.size;
            row.runningSize = counter;
        });*/
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
        let nlen = ar.length;
        if (this.measurement.length != nlen) {
            let rtrn = undefined;
            this.measurement.length = 0;

            ar.forEach((s, index) => {
                if (s === 'auto') {
                    if (index == nlen - 1) {   // if last element auto
                        s = Number.MAX_VALUE;
                    }
                }
                let sz = parseFloat(s);
                rtrn = new measurementNode();
                rtrn.size = sz;
                this.measurement.push(rtrn);
            });
            this.updateAr();
        } else {
            let sz = 0;
            for (let i = 0; i < ar.length; i++) {
                sz = parseFloat(ar[i]);
                if (!isNaN(sz)) this.measurement[i].size = sz;
            }
        }
        console.log(this.measurement
            .map(s => s.size)
            .join('px ') + 'px');
    }
    nameList = gridResizer.getConvertedNames('grid-template-columns');

    /** @type {measurementNode[]}  */
    measurement = [];

    fillSize = false;
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
                    if (rightNode != undefined)
                        rightNodeSize = rightNode.size;
                    leftNodeSize = leftNode.size;

                    this.isResizing = true;
                } else return false;
                evt.preventDefault();
            },
            onMove: (e, diff) => {
                let dval = diff.x;
                if (e.shiftKey || this.fillSize) { //  FILL MODE
                    if (rightNode == undefined) {
                        leftNode.size = leftNodeSize + dval;
                    } else {
                        diff.x = (dval > 0) ? Math.min(dval, rightNodeSize) : Math.max(dval, (leftNodeSize * -1));
                        dval = diff.x;
                        leftNode.size = leftNodeSize + dval;
                        rightNode.size = rightNodeSize - dval;
                    }
                } else {   //  INCREASE MODE
                    leftNode.size = leftNodeSize + dval;
                }
                if (isSettingSize) return;
                isSettingSize = true;
                setTimeout(() => {
                    this.varValue = this.measureText;
                    this.Events.onResizing.fire(e, diff);
                    isSettingSize = false;
                }, 1);
            },
            onUp: (e, diff) => {
                if (this.isResizing)
                    this.updateAr();
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
        onResizing: new commonEvent(),
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
    /** @param {MouseEvent} __e  */
    mousemovelistner = (__e) => {
        if (this.isResizing || this.isCheckingHoverCollission) return;
        let ete = __e;
        this.isCheckingHoverCollission = true;
        setTimeout(() => {
            if (!this.hasMouseEntered) return;
            this.isCheckingHoverCollission = false;
            let x = ete.clientX - this.parentOffset.x;
            this.collissionResult = this.main.resizer.hasCollission(x);
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
        return this.measurement.length <= 1 ?
            'auto'
            :
            this.fillSize ?
                this.measurement
                    .map(s => s.size)
                    .slice(0, -1)
                    .join('px ') + 'px auto'
                :
                this.measurement
                    .map(s => s.size)
                    .join('px ') + 'px';

    }

}
module.exports = { resizeManage };
