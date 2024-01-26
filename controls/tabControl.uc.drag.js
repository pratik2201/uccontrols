"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dragHandler = void 0;
const dragHelper_1 = require("ucbuilder/global/drag/dragHelper");
class dragHandler {
    constructor() {
        this.draging = new dragHelper_1.DragHelper();
    }
    init(main) {
        this.main = main;
        this.draging.dragDrop((htEle, ev) => {
            let dta = dragHelper_1.DragHelper.draggedData;
            if (dta.type == "uc") {
                try {
                    let uc = dta.data;
                    this.main.pushUc(uc);
                    dragHelper_1.DragHelper.dragResult = true;
                }
                catch (exc) {
                    dragHelper_1.DragHelper.dragResult = false;
                }
            }
        }, [this.main.tabView]);
        dragHelper_1.DragHelper.ON_START((htEle, ev) => {
            let dragdata = dragHelper_1.DragHelper.draggedData;
            if (dragdata.type == "uc") {
                this.draging.start();
                this.main.tpt_itemnode.draging.start();
            }
        }, (htEle, ev) => {
            this.draging.stop();
            this.main.tpt_itemnode.draging.stop();
        });
    }
}
exports.dragHandler = dragHandler;
