const { Rect } = require("@uccontrols:/../ucbuilder/global/drawing/shapes");
const datagrid = require("@uccontrols:/controls/datagrid.uc");
const { mouseForMove } = require("@ucbuilder:/global/mouseForMove");
const { gridResizer } = require("@uccontrols:/../ucbuilder/global/gridResizer");
const { Point } = require("ucbuilder/global/drawing/shapes");
class measurementNode {
    /** @type {number}  */
    size = 0;
    /** @type {number}  */
    backup = 0;
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
    
    
    /** @type {HTMLElement}  */
    static drawSelectionHT = `<resizer role="drawSelection"></resizer>`.$();

    updateAr() {
        let counter = 0;
        this.measurement.forEach((row) => {
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
            this.measurement.length = 0;
            ar.forEach((s) => {
                let sz = parseFloat(s);
                rtrn = new measurementNode();
                rtrn.size = sz;
                rtrn.backup = sz;
                this.measurement.push(rtrn);
            });
            this.updateAr();
        } else {
            for (let i = 0; i < ar.length; i++) {
                const row = this.measurement[i];
                row.size = parseFloat(ar[i]);
            }
        }
        // console.log(this.measurement);
    }
    nameList = gridResizer.getConvertedNames('grid-template-columns');
    get isSliderMode() { return this.gridRsz.resizeMode === 'slider'; }
    gridRsz = new gridResizer();
    /** @type {measurementNode[]}  */
    measurement = [];
    /**
     * @param {datagrid} main 
     */
    init(main) {
        this.main = main;
        let isCaptured = false;
        let isSliderMode = this.gridRsz.resizeMode == 'fill';
        let mouseMv = new mouseForMove();
        let selectionRect = new Rect();
        let leftIndex = 0, rightIndex = 0;
        let /** @type {HTMLElement}  */ rightCell,
        /** @type {HTMLElement}  */ leftCell;

        /** @type {measurementNode}  */
        let rightNode,/** @type {measurementNode}  */ leftNode;
        let isShiftkey = false;
        /** @type {DOMRect}  */
        let pagerOffset;
        let isResizing = false;
        mouseMv.bind(this.main.ucExtends.self, {
            onDown: (evt, dpoint) => {

                this.fillArrFromText(this.varValue);
                pagerOffset = this.main.pagercntnr1.getClientRects()[0];
                pagerOffset.x -= this.main.pagercntnr1.scrollLeft;
                pagerOffset.y -= this.main.pagercntnr1.scrollTop;
                if (this.collissionResult.hasCollied) {
                    leftIndex = this.collissionResult.index;
                    rightIndex = leftIndex + 1;
                    this.main.ucExtends.passElement(columnResizeManage.drawSelectionHT);
                    document.body.appendChild(columnResizeManage.drawSelectionHT);
                    rightNode = this.measurement[rightIndex];
                    leftNode = this.measurement[leftIndex];
                    selectionRect.location.y = pagerOffset.top;
                    selectionRect.size.height = pagerOffset.height;
                    selectionRect.location.x = pagerOffset.left + leftNode.prevRunningSize;
                    let pos = selectionRect.applyHT.all();
                    pos.left = pos.top = pos.width = pos.height = '0px';
                    pos.visibility = 'visible';
                    Object.assign(columnResizeManage.drawSelectionHT.style, pos);
                    isResizing = true;
                }
            },
            onMove: (e, diff) => {
                if (!e.shiftKey) {
                    selectionRect.width = leftNode.size + diff.x;
                } else {
                    if (rightNode == undefined)
                        selectionRect.width = leftNode.size + diff.x;
                    else {
                        diff.x = (diff.x > 0) ? Math.min(diff.x, rightNode.size) : Math.max(diff.x, (leftNode.size * -1));
                        selectionRect.left = (pagerOffset.left + rightNode.prevRunningSize) + diff.x;
                        selectionRect.width = rightNode.size - diff.x;
                    }
                }
                Object.assign(columnResizeManage.drawSelectionHT.style, selectionRect.applyHT.all());
            },
            onUp: (e, diff) => {
                if (isResizing) {
                    let dval = diff.x;
                    leftNode.size += dval;
                    if (e.shiftKey && rightNode != undefined)
                        rightNode.size -= dval;
                    this.updateAr();
                   
                    this.varValue = this.measureText;
                    columnResizeManage.drawSelectionHT.style.visibility = "collapse";
                    this.main.ucExtends.self.focus();
                }
                isResizing = false;
            }
        });





        this.main.pagercntnr1.addEventListener("mouseenter", (e) => {
            let cliRect = this.main.pagercntnr1.getClientRects()[0];
            this.parentOffset.setBy.value(cliRect.x-this.main.pagercntnr1.scrollLeft, cliRect.y-this.main.pagercntnr1.scrollTop);
           // this.main.dgvRect = this.main.ucExtends.self.getClientRects()[0];
            this.main.ucExtends.self.addEventListener("mousemove", this.mousemovelistner);
            this.hasMouseEntered = true;
        });
        this.main.pagercntnr1.addEventListener("mouseleave", (e) => {
            this.hasMouseEntered = false;
            this.main.ucExtends.self.removeEventListener("mousemove", this.mousemovelistner);
        });
    }
    parentOffset = new Point();
    hasMouseEntered = false;
    isCheckingHoverCollission = false;
    collissionResult = { hasCollied: false, index: -1 };
    /** @param {MouseEvent} e  */
    mousemovelistner = (e) => {
        if (this.isCheckingHoverCollission) return;
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
    set varValue(val) {  this.main.detail.itemTemplate.extended.setCSS_localVar(this.varName, val); }
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

}
module.exports = { columnResizeManage };
