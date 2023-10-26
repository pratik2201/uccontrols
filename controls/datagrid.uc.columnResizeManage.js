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
        }else{
            for (let i = 0; i < ar.length; i++) {
                const row = this.measurement[i];
                row.size = ar[i];
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
        let selectionBackupRect = new Rect();

        mouseMv.bind(this.main.resizerVertical, {
            onDown: (e, dpoint) => {
                this.getArFromText(this.main.ucExtends.self.style.getPropertyValue('--xxxxwinfo'));
                rightCell = this.main.hoverEfct.getCell(document.elementsFromPoint(e.clientX, e.clientY));
                isCaptured = this.main.keepMeasurementOf == 'columnOnly' || this.main.keepMeasurementOf == 'both';
                if (rightCell == undefined) return false;
                if (isCaptured) {
                    isSliderMode = this.isSliderMode;
                    this.main.ucExtends.passElement(hoverEffect.drawSelectionHT);
                    document.body.appendChild(hoverEffect.drawSelectionHT);
                    hoverEffect.drawSelectionHT.style.visibility = "visible";
                    selectionRect.setBy.domRect(rightCell.getClientRects()[0]);
                    selectionRect.top = this.main.dgvRect.top;
                    selectionRect.width = rightCell.offsetWidth;
                    selectionRect.height = this.main.dgvRect.height
                    selectionBackupRect.setBy.rect(selectionRect);
                    Object.assign(hoverEffect.drawSelectionHT.style, selectionRect.applyHT.all());
                }
                else return false;
            },
            onMove: (e, diff) => {
                if (!isSliderMode)
                    selectionRect.width = selectionBackupRect.width + diff.x;
                else {
                    //diff.x = Math.min(diff.x, rightCell.offsetWidth);
                    selectionRect.left = selectionBackupRect.left + diff.x;
                    selectionRect.width = selectionBackupRect.width - diff.x;
                }
                Object.assign(hoverEffect.drawSelectionHT.style, selectionRect.applyHT.all());
            },
            onUp: (e, diff) => {
                hoverEffect.drawSelectionHT.style.visibility = "collapse";
                let rIndex = rightCell.index();
                let lIndex = rIndex - 1;
                let dval = diff.x;
                let counter = 0;
                let increate = Math.sign(dval);
                let index = rIndex;
                /** @type {measurementNode}  */ 
                let newsizeval = undefined;
                console.log('wwwww > ' + diff.x);
                dval = Math.abs(dval);
                do {
                    newsizeval = this.measurement[index];
                    let vtc = Math.min(newsizeval.size, dval);
                    this.measurement[index].size -= vtc;
                    console.log(" ===> " + dval);
                    dval -= vtc;
                    console.log(index + " : " + dval);
                    index += increate;
                    if (counter++ == 8) break;
                } while (dval > 0);
                if (increate === 1) {
                    this.measurement[lIndex].size += Math.abs(diff.x);
                }
                this.main.ucExtends.self
                    .style.setProperty("--xxxxwinfo", this.measureText);
                /*leftCell = rightCell.previousElementSibling;
                if (leftCell != null) {
                    let lIndex = leftCell.index();
                    let rIndex = rightCell.index();
                    let dval = diff.x;
                    this.measurement[lIndex] += dval;
                    this.measurement[rIndex] -= dval;
                    console.log(dval);
                    this.main.ucExtends.self
                            .style.setProperty("--xxxxwinfo", this.measureText);
                }*/
                //return this
            }
        });
    }
    get measureText() {
        console.log(this.measurement);
        return this.measurement.length <= 1 ? 'auto'
            : (this.measurement.map(s=>s.size))
                .join('px ') + 'px';
        /* return this.measurement.length <= 1 ? 'auto'
             : this.measurement
                 .slice(0, -1)
                 .join('px ') + 'px auto';*/
    }

}
module.exports = { columnResizeManage };
