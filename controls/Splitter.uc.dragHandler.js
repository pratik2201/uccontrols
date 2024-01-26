"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dragHandler = void 0;
const dragHelper_1 = require("ucbuilder/global/drag/dragHelper");
const Splitter_uc_enumAndMore_1 = require("uccontrols/controls/Splitter.uc.enumAndMore");
class dragHandler {
    constructor() {
        this.draging = new dragHelper_1.DragHelper();
        this.onDropNeeded = (dir, importUcFromDrag = false) => {
        };
    }
    get splGrid() {
        return this.main.main;
    }
    init(main) {
        this.main = main;
        this.spl = this.splGrid.main;
        dragHelper_1.DragHelper.ON_START((htEle, ev) => {
            let dta = dragHelper_1.DragHelper.draggedData;
            switch (dta.type) {
                case 'uc':
                    this.spl.ucExtends.self.setAttribute("isInDragMode", "1");
                    this.draging.start();
                    break;
            }
        }, (htEle, ev) => {
            this.spl.ucExtends.self.setAttribute("isInDragMode", "0");
            Splitter_uc_enumAndMore_1.dropIndictors.asArray.forEach(s => s.remove());
            this.draging.stop();
        });
        let nodeStamp = this.main.node.stamp();
        this.draging
            .dragOver((htEle, ev) => {
        }, [this.main.node])
            .dragLeave((htEle, ev) => {
            /*if (ev.target.is(ev.currentTarget))
                this.dragVisibility(false);*/
        }, [this.main.node])
            .dragEnter((htEle, ev) => {
            if (ev.currentTarget.stamp() == nodeStamp) {
                //console.log(ev.currentTarget.stamp()+" == "+nodeStamp);
                let uq = ev.target.stamp();
                let dir = 'none';
                switch (uq) {
                    case Splitter_uc_enumAndMore_1.dropIndictors.leftPoll.stamp():
                        dir = "left";
                        break;
                    case Splitter_uc_enumAndMore_1.dropIndictors.topPoll.stamp():
                        dir = "top";
                        break;
                    case Splitter_uc_enumAndMore_1.dropIndictors.rightPoll.stamp():
                        dir = "right";
                        break;
                    case Splitter_uc_enumAndMore_1.dropIndictors.bottomPoll.stamp():
                        dir = "bottom";
                        break;
                    case nodeStamp:
                        dir = "bottom";
                        break;
                    default:
                        this.dragVisibility(true);
                        break;
                }
                Splitter_uc_enumAndMore_1.dropIndictors.indictor.setAttribute("dir", dir);
                ev.stopImmediatePropagation();
            }
        }, [this.main.node])
            .dragDrop((htEle, ev) => {
            ev.stopPropagation();
            let uq = ev.target.stamp();
            let dir = 'none';
            switch (uq) {
                case Splitter_uc_enumAndMore_1.dropIndictors.leftPoll.stamp():
                    dir = 'leftRect';
                    break;
                case Splitter_uc_enumAndMore_1.dropIndictors.topPoll.stamp():
                    dir = 'topRect';
                    break;
                case Splitter_uc_enumAndMore_1.dropIndictors.rightPoll.stamp():
                    dir = 'rightRect';
                    break;
                case Splitter_uc_enumAndMore_1.dropIndictors.bottomPoll.stamp():
                    dir = 'bottomRect';
                    break;
                default:
                    //this.dropHereFromDrag();
                    ev.stopPropagation();
                    //// this.splGrid.main.draging.node.end.fire();
                    return;
            }
            this.onDropNeeded(dir, true);
        }, [this.main.node]);
    }
    dragVisibility(isVisible) {
        if (isVisible) {
            let allowedSplitRow = this.main.splMain.allowSplitRow;
            let allowedSplitColumn = this.main.splMain.allowSplitColumn;
            let attrVal = "";
            Splitter_uc_enumAndMore_1.dropIndictors.asArray.forEach(s => {
                if (!allowedSplitRow) {
                    attrVal = s.getAttribute("dir");
                    if (attrVal == "top" || attrVal == "bottom")
                        return;
                }
                if (!allowedSplitColumn) {
                    attrVal = s.getAttribute("dir");
                    if (attrVal == "left" || attrVal == "right")
                        return;
                }
                this.main.node.appendChild(s);
                s.style.visibility = "visible";
            });
            this.splGrid.main.ucExtends.passElement(Splitter_uc_enumAndMore_1.dropIndictors.asArray);
        }
        else {
            Splitter_uc_enumAndMore_1.dropIndictors.asArray.forEach(s => s.style.visibility = "hidden");
        }
    }
}
exports.dragHandler = dragHandler;
