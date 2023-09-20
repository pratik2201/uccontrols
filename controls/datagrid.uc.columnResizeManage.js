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
        let selectionBackupRect = new Rect();
        mouseMv.bind(this.main.resizerVertical, {
            onDown: (e, dpoint) => {
                let htEle = this.main.hoverEfct.getCell(document.elementsFromPoint(e.clientX, e.clientY));
                isCaptured = this.main.keepMeasurementOf == 'columnOnly' || this.main.keepMeasurementOf == 'both';
                if (htEle == undefined) return false;
                if (isCaptured) {
                    isSliderMode = this.isSliderMode;
                    this.main.ucExtends.passElement(hoverEffect.drawSelectionHT);
                    document.body.appendChild(hoverEffect.drawSelectionHT);
                    hoverEffect.drawSelectionHT.style.visibility = "visible";
                    selectionRect.setBy.domRect(htEle.getClientRects()[0]);
                    selectionRect.top = this.main.dgvRect.top;
                    selectionRect.width = htEle.offsetWidth;
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
                    selectionRect.left = selectionBackupRect.left + diff.x;
                    selectionRect.width = selectionBackupRect.width - diff.x;
                }
                Object.assign(hoverEffect.drawSelectionHT.style, selectionRect.applyHT.all());
            },
            onUp: (e, diff) => {
                hoverEffect.drawSelectionHT.style.visibility = "collapse";
            }
        });
    }
    /** @param {MouseEvent} e */
    resizeLeftRight = (e) => {
        let htEle = _this.allElementHT[index];
        _this.uc.ucExtends.passElement(resizeHandler.drawSelectionHT);

        document.body.appendChild(resizeHandler.drawSelectionHT);

        Object.assign(resizeHandler.drawSelectionHT.style, selectionRect.applyHT.all());
        resizeHandler.drawSelectionHT.style.visibility = "visible";
        lpos = downEvt[_this.gridRsz.nameList.pagePoint];
        selectionRect.setBy.domRect(htEle.getClientRects()[0]);
        selectionRect.applyHT.all(resizeHandler.drawSelectionHT);
        selection_oldPoint = selectionRect.location[xy_text];
        selection_oldSize = selectionRect.size[size_text];
        let oval = selectionRect.location[_this.gridRsz.nameList.point];
        let osz = selectionRect.size[_this.gridRsz.nameList.size];
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

            selectionRect.location[_this.gridRsz.nameList.point] = oval + diff;
            selectionRect.size[_this.gridRsz.nameList.size] = (osz - diff);

            Object.assign(resizeHandler.drawSelectionHT.style, selectionRect.applyHT.all());
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
            next.size = selectionRect.size[_this.gridRsz.nameList.size];

            _this.checkAndRemoveNode(index - 1, index);
            _this.gridRsz.refreshView();

            resizeHandler.drawSelectionHT.style.visibility = "collapse";
            _this.uc.ucExtends.session.onModify();
            document.body.off("mousemove", mousemoveEvent);
            document.body.off("mouseup mouseleave", mouseupEvent);
        }
    }

}
module.exports = { columnResizeManage };
