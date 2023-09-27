const { Rect } = require("@uccontrols:/../ucbuilder/global/drawing/shapes");
const datagrid = require("@uccontrols:/controls/datagrid.uc");
const { mouseForMove } = require("@ucbuilder:/global/mouseForMove");
const { gridResizer } = require("@uccontrols:/../ucbuilder/global/gridResizer");
const { hoverEffect } = require("@uccontrols:/controls/datagrid.uc.hoverEffect");

class columnResizeManage {
    constructor() { }
    /** @type {Rect}  */
    dgvDomRect = new Rect();

    get lastOverCell() { return this.main.hoverEfct.lastOverCell; }
    nameList = gridResizer.getConvertedNames('grid-template-columns');
    get isSliderMode() { return this.gridRsz.resizeMode === 'slider'; }
    gridRsz = new gridResizer();
    /**
     * @param {datagrid} main 
     */
    init(main) {
        this.main = main;
        let isCaptured = false;
        let isSliderMode = this.gridRsz.resizeMode == 'fill';
        let mouseMv = new mouseForMove();
        let selectionRect = new Rect();
        
        let /** @type {HTMLElement}  */ rightCell,
        /** @type {HTMLElement}  */ leftCell;
        let selectionBackupRect = new Rect();
        
        mouseMv.bind(this.main.resizerVertical, {
            onDown: (e, dpoint) => {
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
                    diff.x = Math.min(diff.x,rightCell.offsetWidth);
                    selectionRect.left = selectionBackupRect.left + diff.x;
                    selectionRect.width = selectionBackupRect.width - diff.x;
                }                
                Object.assign(hoverEffect.drawSelectionHT.style, selectionRect.applyHT.all());
            },
            onUp: (e, diff) => {
                hoverEffect.drawSelectionHT.style.visibility = "collapse";
                console.log(diff);
            }
        });
    }
    

}
module.exports = { columnResizeManage };
