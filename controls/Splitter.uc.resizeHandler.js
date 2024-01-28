"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resizeHandler = void 0;
const shapes_1 = require("ucbuilder/global/drawing/shapes");
const GridResizer_1 = require("ucbuilder/global/GridResizer");
const mouseForMove_1 = require("ucbuilder/global/mouseForMove");
const Splitter_uc_enumAndMore_1 = require("uccontrols/controls/Splitter.uc.enumAndMore");
const common_1 = require("ucbuilder/build/common");
class resizeHandler {
    constructor() {
        this.nameList = (0, GridResizer_1.getConvertedNames)('grid-template-columns');
        this.gridRsz = new GridResizer_1.GridResizer();
        this.bluePrint = {
            size: undefined,
            data: Object.assign({}, Splitter_uc_enumAndMore_1.splitterCell)
        };
        this.uc = undefined;
        this._type = 'notdefined';
        this.Events = {
            onRefresh: (index, measurement) => {
            },
            onMouseDown: (prevIndex, currentIndex) => {
            },
            beforeCollepse: (index, spaceAllocateIndex) => {
                return false;
            },
        };
        this.allowResize = true;
        this.resizerHTlist = [];
        this.minSizeForCollapse = 20;
        this.isPrevCollapsable = false;
        this.isNextCollapsable = false;
        this.gridRsz.resizeMode = 'slider';
    }
    set measurement(value) { this.gridRsz.measurement = value; }
    get measurement() { return this.gridRsz.measurement; }
    init(uc) {
        this.uc = uc;
        this.measurement = this.uc.SESSION_DATA.measurement;
        this.gridRsz.init({
            grid: uc.mainContainer,
            nodeName: "node",
        });
        this.bluePrint = common_1.objectOpt.clone(Splitter_uc_enumAndMore_1.splitterMeasurementRow);
        this.allElementHT = this.grid.childNodes;
        this.Events.onMouseDown = (pIndex, cIndex) => {
            this.isPrevCollapsable = this.allElementHT[pIndex].data('box').uc.length === 0;
            this.isNextCollapsable = this.allElementHT[cIndex].data('box').uc.length === 0;
        };
    }
    get grid() {
        return this.gridRsz.options.grid;
    }
    get type() {
        return this._type;
    }
    set type(value) {
        this._type = value;
        switch (value) {
            case "columns":
                this.nameList = (0, GridResizer_1.getConvertedNames)('grid-template-columns');
                this.gridRsz.gridTemplate = this.nameList.gridTemplate;
                break;
            case "rows":
                this.nameList = (0, GridResizer_1.getConvertedNames)('grid-template-rows');
                this.gridRsz.gridTemplate = this.nameList.gridTemplate;
                break;
        }
    }
    refresh() {
        let len = this.allElementHT.length;
        if (len == 0) {
            return;
        }
        let hasStyle = this.gridRsz.hasDefinedStyles;
        let offsetSize = this.nameList.offsetSize;
        this.gridFullSize = hasStyle ? 0 : this.grid[offsetSize];
        let eqSize = this.gridFullSize / len;
        let obj = undefined;
        if (hasStyle) {
            for (let i = 0; i < len; i++) {
                this.Events.onRefresh(i, this.measurement[i]);
            }
        }
        else {
            for (let i = 0; i < len; i++) {
                obj = common_1.objectOpt.clone(this.bluePrint);
                obj.size = eqSize;
                this.measurement[i] = obj;
                this.Events.onRefresh(i, obj);
            }
        }
        this.giveResizer();
    }
    giveResizer() {
        if (!this.allowResize) {
            this.gridRsz.refreshView();
            return;
        }
        let len = this.allElementHT.length;
        this.resizerHTlist.forEach(s => s.delete());
        this.resizerHTlist = [];
        for (let i = 1; i < len; i++) {
            let resHt = this.uc.ucExtends.passElement(resizeHandler.resizerHT.cloneNode(true));
            resHt.setAttribute("role", this.nameList.dir);
            this.allElementHT[i].append(resHt);
            this.resizerHTlist.push(resHt);
            this.doWithIndex(resHt, i);
        }
        this.gridRsz.refreshView();
    }
    doWithIndex(resizer, index) {
        let _this = this;
        let selectionRect = new shapes_1.Rect();
        let selection_oldPoint = 0;
        let selection_oldSize = 0;
        let prevNode = undefined;
        let nextNode = undefined;
        let mouseMv = new mouseForMove_1.MouseForMove();
        let xy_text = _this.nameList.point;
        let size_text = _this.nameList.size;
        mouseMv.bind({
            onDown: (e, dpoint) => {
                let htEle = _this.allElementHT[index];
                _this.uc.ucExtends.passElement(resizeHandler.drawSelectionHT);
                document.body.appendChild(resizeHandler.drawSelectionHT);
                Object.assign(resizeHandler.drawSelectionHT.style, selectionRect.applyHT.all());
                resizeHandler.drawSelectionHT.style.visibility = "visible";
                selectionRect.setBy.domRect(htEle.getClientRects()[0]);
                Object.assign(resizeHandler.drawSelectionHT.style, selectionRect.applyHT.all());
                selection_oldPoint = selectionRect.location[xy_text];
                selection_oldSize = selectionRect.size[size_text];
                this.Events.onMouseDown(index - 1, index);
                prevNode = this.measurement[index - 1];
                nextNode = this.measurement[index];
            },
            onMove: (e, diff) => {
                let dval = diff[xy_text];
                if ((prevNode.size + dval) <= _this.minSizeForCollapse && _this.isPrevCollapsable) {
                    diff[xy_text] -= prevNode.size + dval;
                }
                else if ((nextNode.size - dval) <= _this.minSizeForCollapse && _this.isNextCollapsable) {
                    diff[xy_text] += nextNode.size - dval;
                }
                dval = diff[xy_text];
                selectionRect.location[xy_text] = selection_oldPoint + dval;
                selectionRect.size[size_text] = selection_oldSize - dval;
                Object.assign(resizeHandler.drawSelectionHT.style, selectionRect.applyHT.all());
            },
            onUp: (e, diff) => {
                let ovl = prevNode.size;
                let dval = diff[xy_text];
                dval = (ovl + dval) <= 0 ? -ovl : dval;
                dval = (nextNode.size - dval) <= 0 ? nextNode.size : dval;
                prevNode.size += dval;
                nextNode.size = selectionRect.size[_this.nameList.size];
                _this.checkAndRemoveNode(index - 1, index);
                _this.gridRsz.refreshView();
                resizeHandler.drawSelectionHT.style.visibility = "collapse";
                _this.uc.ucExtends.session.onModify();
            }
        }, resizer);
    }
    removeNode(index, spaceAllocateIndex) {
        if (this.Events.beforeCollepse(index, spaceAllocateIndex) === false)
            return;
        let pmes = this.measurement[index];
        let nmes = this.measurement[spaceAllocateIndex];
        nmes.size += pmes.size;
        this.measurement.splice(index, 1);
        this.allElementHT[index].delete();
        this.refresh();
    }
    checkAndRemoveNode(prevIndex, nextIndex) {
        let pmes = this.measurement[prevIndex];
        let nmes = this.measurement[nextIndex];
        if (pmes.size <= this.minSizeForCollapse && this.isPrevCollapsable)
            this.removeNode(prevIndex, nextIndex);
        else if (nmes.size <= this.minSizeForCollapse && this.isNextCollapsable)
            this.removeNode(nextIndex, prevIndex);
    }
}
exports.resizeHandler = resizeHandler;
resizeHandler.resizerHT = `<resizer role="left"></resizer>`.$();
resizeHandler.drawSelectionHT = `<splitter-resizer-abc role="drawSelection"></splitter-resizer-abc>`.$();
