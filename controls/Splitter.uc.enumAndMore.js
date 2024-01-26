"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tabBoxRow = exports.dropIndictors = exports.splitterMeasurementRow = exports.splitterCell = exports.tabChilds = void 0;
const commonEvent_1 = require("ucbuilder/global/commonEvent");
exports.tabChilds = {
    index: -1,
    stamp: "",
    filePath: "",
    fstamp: "",
    session: {},
};
exports.splitterCell = {
    ucPath: "",
    attribList: "",
    session: {},
};
exports.splitterMeasurementRow = {
    /** @type {number}  */
    size: undefined,
    data: Object.assign({}, exports.splitterCell),
};
exports.dropIndictors = {
    leftPoll: '<drop parent="dragassets" dir="left" ></drop>'.$(),
    rightPoll: '<drop parent="dragassets" dir="right" ></drop>'.$(),
    topPoll: '<drop parent="dragassets" dir="top" ></drop>'.$(),
    bottomPoll: '<drop parent="dragassets" dir="bottom" ></drop>'.$(),
    indictor: '<indicator parent="dragassets" dir="none" ></indicator>'.$(),
    /** @type {HTMLElement[]}  */
    get asArray() {
        return [exports.dropIndictors.indictor,
            exports.dropIndictors.leftPoll,
            exports.dropIndictors.topPoll,
            exports.dropIndictors.rightPoll,
            exports.dropIndictors.bottomPoll];
    },
};
class DragInfo {
    constructor() {
        this.dragData = undefined;
        this.lastDroppedData = undefined;
        this.hasDropped = true;
        this.setDragData = (data) => { this.dragData = data; this.hasDropped = false; };
        this.getDragData = () => {
            this.lastDroppedData = this.dragData;
            this.hasDropped = true;
            return this.lastDroppedData;
        };
        this.getLastData = () => { return this.lastDroppedData; };
        this.onDragStart = new commonEvent_1.CommonEvent;
        this.onDragEnd = new commonEvent_1.CommonEvent;
    }
}
exports.tabBoxRow = {
    children: [],
    nodeId: '',
    role: '',
};
