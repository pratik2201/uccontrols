const { Rect } = require("@uccontrols:/../ucbuilder/global/drawing/shapes");
const datagrid = require("@uccontrols:/controls/datagrid.uc");
const { mouseForMove } = require("@ucbuilder:/global/mouseForMove");
const { gridResizer } = require("@uccontrols:/../ucbuilder/global/gridResizer");
const { hoverEffect } = require("@uccontrols:/controls/datagrid.uc.hoverEffect");
/**
 * @typedef {{ size:number , backup:number }} measurementNode
 */
class columnResizeManage {
    constructor() { }
    /** @type {Rect}  */
    dgvDomRect = new Rect();
    /**
     * @param {string} txt 
     * @returns {measurementNode[]}
     */
    getArFromText(txt) {
        let ar = txt
            .split(/ +/);
        if (this.measurement.length != ar.length) {
            this.measurement = ar.map((s) => { let sz = parseFloat(s); return { size: sz, backup: sz } });
        } else {
            for (let i = 0; i < ar.length; i++) {
                const row = this.measurement[i];
                row.size = parseFloat(ar[i]);
            }
        }
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

        let /** @type {HTMLElement}  */ rightCell,
        /** @type {HTMLElement}  */ leftCell;
        let _rightselectionBackupRect = new Rect();
        let _leftselectionBackupRect = new Rect();
        let isShiftkey = false;
        mouseMv.bind(this.main.resizerVertical, {
            onDown: (e, dpoint) => {
                this.getArFromText(this.main.ucExtends.self.style.getPropertyValue('--xxxxwinfo'));
                rightCell = this.main.hoverEfct.getCell(document.elementsFromPoint(e.clientX, e.clientY));
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
                    let pos =  selectionRect.applyHT.all();
                    pos.left = pos.top = pos.width = pos.height = '0px';
                    pos.visibility = 'visible';
                    Object.assign(hoverEffect.drawSelectionHT.style, pos);
                }
                else return false;
            },
            onMove: (e, diff) => {
                if (!e.shiftKey) {
                    /*if (diff.x > 0)
                        diff.x = Math.min(diff.x, rightCell.offsetWidth);
                    else
                        diff.x = Math.max(diff.x, (leftCell.offsetWidth * -1));*/
                    selectionRect.left = _leftselectionBackupRect.left ;
                    selectionRect.width = _leftselectionBackupRect.width + diff.x;

                    /*selectionRect.width = leftCell.offsetWidth + diff.x;                    
                    selectionRect.left = _rightselectionBackupRect.left + diff.x;*/
                } else {
                    if (diff.x > 0)
                        diff.x = Math.min(diff.x, rightCell.offsetWidth);
                    else
                        diff.x = Math.max(diff.x, (leftCell.offsetWidth * -1));
                    selectionRect.left = _rightselectionBackupRect.left + diff.x;
                    selectionRect.width = _rightselectionBackupRect.width - diff.x;
                }
                Object.assign(hoverEffect.drawSelectionHT.style, selectionRect.applyHT.all());
            },
            onUp: (e, diff) => {
                leftCell = rightCell.previousElementSibling;
                if (leftCell != null) {
                    let lIndex, rIndex;
                    lIndex = leftCell.index();
                    rIndex = rightCell.index();
                    let dval = diff.x;
                    this.measurement[lIndex].size += dval;
                    if (e.shiftKey)
                        this.measurement[rIndex].size -= dval;
                    this.main.ucExtends.self
                        .style.setProperty("--xxxxwinfo", this.measureText);
                }
                hoverEffect.drawSelectionHT.style.visibility = "collapse";
                //return this
            }
        });
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
