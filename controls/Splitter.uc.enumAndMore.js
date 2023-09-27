const { commonEvent } = require("@ucbuilder:/global/commonEvent");
const { newObjectOpt } = require("@ucbuilder:/global/objectOpt");

class dragInfo {
    constructor() { }
    /** @private */
    dragData = undefined;
    /** @private */
    lastDroppedData = undefined;
    setDragData = (data) => { this.dragData = data; this.hasDropped = false; }
    hasDropped = true;
    getDragData = () => {
        //console.log('drag.getDragData');
        this.lastDroppedData = this.dragData;
        //this.dragData = undefined;
        this.hasDropped = true;
        return this.lastDroppedData;
    }

    getLastData = () => { return this.lastDroppedData; }
    onDragStart = new commonEvent();
    onDragEnd = new commonEvent();
}

/*const spliterType = Object.freeze({
    NOT_DEFINED: "NOT_DEFINED",
    ROW: "ROW",
    COLUMN: "COLUMN",
});*/
const tabChilds = {
    index: -1,
    stamp: "",
    filePath: "",
    fstamp: "",
    session: {},
};
const splitterCell = {
   
    ucPath: "",
    attribList: "",
    /** @type {{}}  */
    session: {},
};

const measurementRow = {
    /** @type {number}  */ 
    size: undefined,
    data: newObjectOpt.clone(splitterCell),
}

const dropIndictors = {
    /** @type {HTMLElement}  */
    leftPoll: '<drop parent="dragassets" dir="left" ></drop>'.$(),
    /** @type {HTMLElement}  */
    rightPoll: '<drop parent="dragassets" dir="right" ></drop>'.$(),
    /** @type {HTMLElement}  */
    topPoll: '<drop parent="dragassets" dir="top" ></drop>'.$(),
    /** @type {HTMLElement}  */
    bottomPoll: '<drop parent="dragassets" dir="bottom" ></drop>'.$(),
    /** @type {HTMLElement}  */
    indictor: '<indicator parent="dragassets" dir="none" ></indicator>'.$(),

    /** @type {container[]}  */
    get asArray() {
        return [dropIndictors.indictor,
        dropIndictors.leftPoll,
        dropIndictors.topPoll,
        dropIndictors.rightPoll,
        dropIndictors.bottomPoll];
    },
    possiblePlaces: Object.freeze({
        leftRect: "leftRect",
        centerRect: "centerRect",
        rightRect: "rightRect",
        topRect: "topRect",
        bottomRect: "bottomRect",
        none: "none",
    })
};

module.exports = {
    dragInfo,
    dropIndictors,
    /** @type {"notdefined"|"columns"|"rows"}  */
    spliterType : 'notdefined',
    tabChilds,
    dragDataNode: {
        uc: undefined,
        tabBx: undefined
    },
    tabBoxRow: {
        /** @type {tabChilds[]}  */
        children: [],
        nodeId: "",
        role: "",
    },
    splitterCell,
    measurementRow
};