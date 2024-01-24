import { Usercontrol } from "ucbuilder/Usercontrol";
import { Rect, Point } from "ucbuilder/global/drawing/shapes";
import { getConvertedNames, GridResizer, NamingConversion } from "ucbuilder/global/GridResizer";
import { MouseForMove } from "ucbuilder/global/mouseForMove";
import { Splitter } from "uccontrols/controls/Splitter.uc";
import { boxHandler } from "uccontrols/controls/Splitter.uc.boxHandler";
import { splitterMeasurementRow,SplitterMeasurementRow, SpliterType, splitterCell } from "uccontrols/controls/Splitter.uc.enumAndMore";
import { splitersGrid } from "uccontrols/controls/Splitter.uc.splitersGrid";
import { objectOpt } from "ucbuilder/build/common";

export class resizeHandler {
    nameList: NamingConversion = getConvertedNames('grid-template-columns');
    gridRsz: GridResizer = new GridResizer();
    bluePrint: SplitterMeasurementRow = {
        size: undefined,
        data: Object.assign({},splitterCell)
    };

    set measurement(value: SplitterMeasurementRow[]) { this.gridRsz.measurement = value; }
    get measurement(): SplitterMeasurementRow[] { return this.gridRsz.measurement as SplitterMeasurementRow[]; }

    constructor() {
        this.gridRsz.resizeMode = 'slider';
    }

    uc: Splitter = undefined;
    allElementHT: NodeListOf<HTMLElement>;
    init(uc: Splitter): void {
        this.uc = uc;
        this.measurement = this.uc.SESSION_DATA.measurement;
        /*this.gridRsz.init({
            grid: uc.mainContainer,
            nodeName: "node",
        });*/
        this.bluePrint = objectOpt.clone(splitterMeasurementRow);
        this.allElementHT = this.grid.childNodes as NodeListOf<HTMLElement>;
        this.Events.onMouseDown = (pIndex: number, cIndex: number): void => {
            this.isPrevCollapsable = this.allElementHT[pIndex].data('box').uc.length === 0;
            this.isNextCollapsable = this.allElementHT[cIndex].data('box').uc.length === 0;
        };
    }

    get grid(): HTMLElement {
        return this.gridRsz.options.grid;
    }


    _type: SpliterType = 'notdefined';
    get type(): SpliterType {
        return this._type;
    }
    set type(value: SpliterType) {
        this._type = value;
        switch (value) {
            case "columns":
                this.nameList = getConvertedNames('grid-template-columns');
                this.gridRsz.gridTemplate = this.nameList.gridTemplate;
                break;
            case "rows":
                this.nameList = getConvertedNames('grid-template-rows');
                this.gridRsz.gridTemplate = this.nameList.gridTemplate;
                break;
        }
    }

    Events = {
        onRefresh: (index: number, measurement: SplitterMeasurementRow): void => {

        },
        onMouseDown: (prevIndex: number, currentIndex: number): void => {

        },
        beforeCollepse: (index: number, spaceAllocateIndex: number): boolean => {
            return false;
        },
    }
    gridFullSize: number;
    allowResize: boolean = true;

    refresh(): void {
        let len: number = this.allElementHT.length;
        if (len == 0) { return; }
        let hasStyle: boolean = this.gridRsz.hasDefinedStyles;

        let offsetSize: string = this.nameList.offsetSize;

        this.gridFullSize = hasStyle ? 0 : this.grid[offsetSize];
        let eqSize: number = this.gridFullSize / len;
        let obj: SplitterMeasurementRow = undefined;
        if (hasStyle) {
            for (let i = 0; i < len; i++) {
                this.Events.onRefresh(i, this.measurement[i]);
            }
        } else {
            for (let i = 0; i < len; i++) {
                obj = objectOpt.clone(this.bluePrint);
                obj.size = eqSize;
                this.measurement[i] = obj;
                this.Events.onRefresh(i, obj);
            }
        }
        this.giveResizer();
    }

    resizerHTlist: HTMLElement[] = [];

    giveResizer(): void {
        if (!this.allowResize) { this.gridRsz.refreshView(); return; }
        let len: number = this.allElementHT.length;
        this.resizerHTlist.forEach(s => s.delete());
        this.resizerHTlist = [];
        for (let i = 1; i < len; i++) {
            let resHt = this.uc.ucExtends.passElement(resizeHandler.resizerHT.cloneNode(true) as HTMLElement) as HTMLElement;
            resHt.setAttribute("role", this.nameList.dir);
            this.allElementHT[i].append(resHt);
            this.resizerHTlist.push(resHt);
            this.doWithIndex(resHt, i);
        }
        this.gridRsz.refreshView();
    }

    static resizerHT: HTMLElement = `<resizer role="left"></resizer>`.$();
    static drawSelectionHT: HTMLElement = `<splitter-resizer-abc role="drawSelection"></splitter-resizer-abc>`.$();

    doWithIndex(resizer: HTMLElement, index: number): void {
        let _this: resizeHandler = this;
        let selectionRect: Rect = new Rect();
        let selection_oldPoint: number = 0;
        let selection_oldSize: number = 0;
        let prevNode: SplitterMeasurementRow = undefined;
        let nextNode: SplitterMeasurementRow = undefined;
        let mouseMv: MouseForMove = new MouseForMove();
        let xy_text: string = _this.nameList.point;
        let size_text: string = _this.nameList.size;
        mouseMv.bind({
            onDown: (e: MouseEvent, dpoint: Point): void => {
                let htEle: HTMLElement = _this.allElementHT[index];
                _this.uc.ucExtends.passElement(resizeHandler.drawSelectionHT);
                document.body.appendChild(resizeHandler.drawSelectionHT);
                Object.assign(resizeHandler.drawSelectionHT.style, selectionRect.applyHT.all());
                resizeHandler.drawSelectionHT.style.visibility = "visible";
                selectionRect.setBy.domRect(htEle.getClientRects()[0]);
                Object.assign(resizeHandler.drawSelectionHT.style,selectionRect.applyHT.all());

                selection_oldPoint = selectionRect.location[xy_text];
                selection_oldSize = selectionRect.size[size_text];
                this.Events.onMouseDown(index - 1, index);
                prevNode = this.measurement[index - 1];
                nextNode = this.measurement[index];
            },
            onMove: (e: MouseEvent, diff: Point): void => {
                let dval: number = diff[xy_text];
                if ((prevNode.size + dval) <= _this.minSizeForCollapse && _this.isPrevCollapsable) {
                    diff[xy_text] -= prevNode.size + dval;
                } else if ((nextNode.size - dval) <= _this.minSizeForCollapse && _this.isNextCollapsable) {
                    diff[xy_text] += nextNode.size - dval;
                }
                dval = diff[xy_text];
                selectionRect.location[xy_text] = selection_oldPoint + dval;
                selectionRect.size[size_text] = selection_oldSize - dval;
                Object.assign(resizeHandler.drawSelectionHT.style, selectionRect.applyHT.all());
            },
            onUp: (e: MouseEvent, diff: Point): void => {
                let ovl: number = prevNode.size;
                let dval: number = diff[xy_text];
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

    removeNode(index: number, spaceAllocateIndex: number): void {
        if (this.Events.beforeCollepse(index, spaceAllocateIndex) === false) return;
        let pmes: SplitterMeasurementRow = this.measurement[index];
        let nmes: SplitterMeasurementRow = this.measurement[spaceAllocateIndex];
        nmes.size += pmes.size;
        this.measurement.splice(index, 1);
        this.allElementHT[index].delete();
        this.refresh();
    }

    minSizeForCollapse: number = 20;
    isPrevCollapsable: boolean = false;
    isNextCollapsable: boolean = false;

    checkAndRemoveNode(prevIndex: number, nextIndex: number): void {
        let pmes: SplitterMeasurementRow = this.measurement[prevIndex];
        let nmes: SplitterMeasurementRow = this.measurement[nextIndex];
        if (pmes.size <= this.minSizeForCollapse && this.isPrevCollapsable)
            this.removeNode(prevIndex, nextIndex);
        else if (nmes.size <= this.minSizeForCollapse && this.isNextCollapsable)
            this.removeNode(nextIndex, prevIndex);
    }
}