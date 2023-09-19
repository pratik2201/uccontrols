const { Rect } = require("@uccontrols:/../ucbuilder/global/drawing/shapes");
const datagrid = require("@uccontrols:/controls/datagrid.uc");
const { mouseForMove } = require("@ucbuilder:/global/mouseForMove");
const { gridResizer } = require("@uccontrols:/../ucbuilder/global/gridResizer");
/**
 * @typedef {import ("@uccontrols:/controls/datagrid.uc").datagrid} datagrid
 */
class columnResizeManage {
    constructor() { }
    /** @type {Rect}  */
    dgvDomRect = new Rect();
    
    get lastOverCell() { return this.main.hoverEfct.lastOverCell; }
    nameList = gridResizer.getConvertedNames('grid-template-columns');
    /**
     * @param {datagrid} main 
     */
    init(main) {
        this.main = main;
        let isCaptured = false;
        let mouseMv = new mouseForMove();
        mouseMv.bind(this.main.resizerVertical, {
            onDown: (e, dpoint) => {
                isCaptured = this.main.keepMeasurementOf == 'columnOnly' || this.main.keepMeasurementOf == 'both';
                if(isCaptured){
                    console.log('s');
                }
            },
            onMove: (e, diff) => {

            },
            onUp: (e, diff) => {

            }
        });
    }
    /** @param {MouseEvent} e */
    resizeLeftRight = (e) => {
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
    }

}
module.exports = { columnResizeManage };