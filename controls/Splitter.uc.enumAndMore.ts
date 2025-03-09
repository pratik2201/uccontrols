import { CommonEvent } from "ucbuilder/global/commonEvent.js";
import { Usercontrol } from "ucbuilder/Usercontrol.js";
import { MeasurementRow } from "ucbuilder/global/GridResizer.js";

export interface TabChilds {
    index: number;
    stamp: string;
    filePath: string;
    fstamp: string;
    session: {};
}
export const tabChilds: TabChilds = {
    index: -1,
    stamp: "",
    filePath: "",
    fstamp: "",
    session: {},
}



export interface SplitterCell {
    ucPath: string;
    attribList: string;
    session: {};
}
export const splitterCell: SplitterCell = {
    ucPath: "",
    attribList: "",
    session: {},
}


export interface SplitterMeasurementRow extends MeasurementRow {
    data: SplitterCell;
}
export const splitterMeasurementRow: SplitterMeasurementRow = {
    /** @type {number}  */
    size: undefined,
    data: Object.assign({}, splitterCell),
}
export type PossiblePlaces = "leftRect" | "centerRect" | "rightRect" | "topRect" | "bottomRect" | "none";
export type PossibleDirection = "leftRect" | "centerRect" | "rightRect" | "topRect" | "bottomRect" | "none";

export interface DropIndictors {
    leftPoll: HTMLElement;
    rightPoll: HTMLElement;
    topPoll: HTMLElement;
    bottomPoll: HTMLElement;
    indictor: HTMLElement;
    asArray: HTMLElement[];
  
}
export const dropIndictors: DropIndictors = {
    leftPoll: '<drop parent="dragassets" dir="left" ></drop>'.$(),
    rightPoll: '<drop parent="dragassets" dir="right" ></drop>'.$(),
    topPoll: '<drop parent="dragassets" dir="top" ></drop>'.$(),
    bottomPoll: '<drop parent="dragassets" dir="bottom" ></drop>'.$(),
    indictor: '<indicator parent="dragassets" dir="none" ></indicator>'.$(),
    /** @type {HTMLElement[]}  */
    get asArray() {
        return [dropIndictors.indictor,
        dropIndictors.leftPoll,
        dropIndictors.topPoll,
        dropIndictors.rightPoll,
        dropIndictors.bottomPoll];
    },
}

class DragInfo {
    constructor() { }
    dragData: any = undefined;
    lastDroppedData: any = undefined;
    hasDropped: boolean = true;
    setDragData = (data: any) => { this.dragData = data; this.hasDropped = false; }
    getDragData = () => {
        this.lastDroppedData = this.dragData;
        this.hasDropped = true;
        return this.lastDroppedData;
    }
    getLastData = () => { return this.lastDroppedData; }
    onDragStart = new CommonEvent<() => void>;
    onDragEnd = new CommonEvent<() => void>;
}
export type SpliterType = "notdefined" | "columns" | "rows";


/*export interface DragDataNode {
    uc: Usercontrol,
    tabBx: undefined,
}*/
export interface TabBoxRow {
    children: TabChilds[];
    nodeId: string;
    role: string;
}
export const tabBoxRow: TabBoxRow = {
    children: [],
    nodeId: '',
    role: '',
};