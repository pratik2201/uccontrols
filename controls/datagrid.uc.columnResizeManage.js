const { Rect } = require("@uccontrols:/../ucbuilder/global/drawing/shapes");
const datagrid = require("@uccontrols:/controls/datagrid.uc");
const { mouseForMove } = require("@ucbuilder:/global/mouseForMove");
const { gridResizer } = require("@uccontrols:/../ucbuilder/global/gridResizer");
const { hoverEffect } = require("@uccontrols:/controls/datagrid.uc.hoverEffect");
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
    /** @type {Rect}  */
    dgvDomRect = new Rect();
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
    getArFromText(txt) {
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
        console.log(this.measurement);
    }
    get lastOverCell() { return this.main.hoverEfct.lastOverCell; }
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
        this.columnGridStylePera = "--xxinfo" + this.main.ucExtends.stampRow.stamp;
        let isCaptured = false;
        let isSliderMode = this.gridRsz.resizeMode == 'fill';
        let mouseMv = new mouseForMove();
        let selectionRect = new Rect();
        let leftIndex = 0, rightIndex = 0;
        let /** @type {HTMLElement}  */ rightCell,
        /** @type {HTMLElement}  */ leftCell;
        let _rightselectionBackupRect = new Rect();
        let _leftselectionBackupRect = new Rect();
        /** @type {measurementNode}  */
        let rightNode,/** @type {measurementNode}  */ leftNode;
        let isShiftkey = false;
        /** @type {DOMRect}  */
        let pagerOffset;
        let isResizing = false;
        mouseMv.bind(this.main.detailGridHT1, {
            onDown: (evt, dpoint) => {
                this.getArFromText(this.main.ucExtends.self.style.getPropertyValue('--xxxxwinfo'));
                pagerOffset = this.main.pagercntnr1.getClientRects()[0];
                pagerOffset.x-=this.main.pagercntnr1.scrollLeft;
                pagerOffset.y-=this.main.pagercntnr1.scrollTop;
                if (this.main.hoverEfct.collissionResult.hasCollied) {
                    leftIndex = this.main.hoverEfct.collissionResult.index;
                    rightIndex = leftIndex + 1;
                    this.main.ucExtends.passElement(hoverEffect.drawSelectionHT);
                    document.body.appendChild(hoverEffect.drawSelectionHT);
                    rightNode = this.measurement[rightIndex];
                    leftNode = this.measurement[leftIndex];

                    _leftselectionBackupRect.location.x = pagerOffset.left + leftNode.prevRunningSize;
                    _leftselectionBackupRect.location.y = pagerOffset.top;
                    _leftselectionBackupRect.size.height = pagerOffset.height;
                    _leftselectionBackupRect.size.width = leftNode.size;

                    _rightselectionBackupRect.location.x = pagerOffset.left + rightNode.prevRunningSize;
                    _rightselectionBackupRect.location.y = pagerOffset.top;
                    _rightselectionBackupRect.size.height = pagerOffset.height;
                    _rightselectionBackupRect.size.width = rightNode.size;


                    let pos = _rightselectionBackupRect.applyHT.all();
                    selectionRect.setBy.rect(_leftselectionBackupRect);
                    pos.left = pos.top = pos.width = pos.height = '0px';
                    pos.visibility = 'visible';
                    Object.assign(hoverEffect.drawSelectionHT.style, pos);
                    isResizing = true;
                }

                /* rightCell = this.main.hoverEfct.getCell(document.elementsFromPoint(evt.clientX, evt.clientY));
                 isCaptured = this.main.keepMeasurementOf == 'columnOnly' || this.main.keepMeasurementOf == 'both';
                 if (rightCell == undefined) return false;
                 leftCell = rightCell.previousElementSibling;
                 if (isCaptured) {
                     isSliderMode = this.isSliderMode;
                     this.main.ucExtends.passElement(hoverEffect.drawSelectionHT);
                     document.body.appendChild(hoverEffect.drawSelectionHT);
 
                     selectionRect.setBy.domRect(rightCell.getClientRects()[0]);
                     selectionRect.width = rightCell.offsetWidth;
                     selectionRect.top = this.main.dgvRect.top;
                     selectionRect.height = this.main.dgvRect.height;
 
                     _rightselectionBackupRect.setBy.rect(selectionRect);
                     _leftselectionBackupRect.setBy.rect(_rightselectionBackupRect);
                     _leftselectionBackupRect.width = leftCell.offsetWidth;
                     let lccr = leftCell.getClientRects()[0];
                     _leftselectionBackupRect.left = lccr.left;
                     let pos = selectionRect.applyHT.all();
                     pos.left = pos.top = pos.width = pos.height = '0px';
                     pos.visibility = 'visible';
                     Object.assign(hoverEffect.drawSelectionHT.style, pos);
                 }
                 else return false;*/
            },
            onMove: (e, diff) => {
                if (!e.shiftKey) {
                    /* diff.x =  (diff.x > 0)?Math.min(diff.x, rightCell.offsetWidth) : Math.max(diff.x, (leftCell.offsetWidth * -1)); */
                    // selectionRect.left = _leftselectionBackupRect.left;
                    selectionRect.width = leftNode.size + diff.x;


                    /*selectionRect.width = leftCell.offsetWidth + diff.x;                    
                    selectionRect.left = _rightselectionBackupRect.left + diff.x;*/
                } else {
                    //diff.x = (diff.x > 0) ? Math.min(diff.x, rightCell.offsetWidth) : Math.max(diff.x, (leftCell.offsetWidth * -1));

                    selectionRect.left = (pagerOffset.left + rightNode.prevRunningSize) + diff.x;
                    selectionRect.width = rightNode.size - diff.x;
                    //selectionRect.left = _rightselectionBackupRect.left + diff.x;
                    //selectionRect.width = _rightselectionBackupRect.width - diff.x;
                }
                Object.assign(hoverEffect.drawSelectionHT.style, selectionRect.applyHT.all());
            },
            onUp: (e, diff) => {
                if (isResizing) {
                    let dval = diff.x;
                    leftNode.size += dval;
                    if (e.shiftKey)
                        rightNode.size -= dval;
                    this.updateAr();
                    this.main.ucExtends.self
                        .style.setProperty("--xxxxwinfo", this.measureText);
                    hoverEffect.drawSelectionHT.style.visibility = "collapse";
                    this.main.ucExtends.self.focus();
                }
                isResizing = false;
                /*leftCell = rightCell.previousElementSibling;
                if (leftCell != null) {
                    let lIndex, rIndex;
                    lIndex = leftCell.index();
                    rIndex = rightCell.index();
                    let dval = diff.x;
                    this.measurement[lIndex].size += dval;
                    if (e.shiftKey)
                        this.measurement[rIndex].size -= dval;
                    this.updateAr();
                    this.main.ucExtends.self
                        .style.setProperty("--xxxxwinfo", this.measureText);
                }
                hoverEffect.drawSelectionHT.style.visibility = "collapse";
                this.main.ucExtends.self.focus();*/
                //return this
            }
        });
        this.getArFromText(this.main.ucExtends.self.style.getPropertyValue('--xxxxwinfo'));
    }
    getPrevIndex(index) {
        let rm = this.measurement;
        index--;
        for (; index >= 0 && rm[index].size == 0; index--);
        return index;
    }
    get measureText() {
        // console.log(this.measurement);
        return this.measurement.length <= 1 ? 'auto'
            : (this.measurement.map(s => s.size))
                .join('px ') + 'px';
        /* return this.measurement.length <= 1 ? 'auto'
             : this.measurement
                 .slice(0, -1)
                 .join('px ') + 'px auto';*/
    }

}
module.exports = { columnResizeManage };
