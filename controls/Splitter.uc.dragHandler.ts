import { DragHelper } from "@ucbuilder/global/drag/dragHelper.js";
import { boxHandler } from "uccontrols/controls/Splitter.uc.boxHandler";
import { dropIndictors,PossiblePlaces } from "uccontrols/controls/Splitter.uc.enumAndMore";
import { splitersGrid } from "uccontrols/controls/Splitter.uc.splitersGrid";
import { Splitter } from "uccontrols/controls/Splitter.uc";

export class dragHandler {
    main: boxHandler | undefined;
    draging: DragHelper = new DragHelper();

    get splGrid(): splitersGrid {
        return this.main!.main;
    }
    spl: Splitter;
    init(main: boxHandler): void {
        this.main = main;
        this.spl = this.splGrid.main;
        DragHelper.ON_START((/*htEle,*/ev) => {
            let dta = DragHelper.draggedData;
            
            switch (dta.type) {
                case 'uc':
                    this.spl.ucExtends.self.setAttribute("isInDragMode", "1");
                    this.draging.start();
                    break;
            }

        }, (/*htEle,*/ev) => {
            this.spl.ucExtends.self.setAttribute("isInDragMode", "0");
            dropIndictors.asArray.forEach(s => s.remove());
            this.draging.stop();
        });

        let nodeStamp = this.main.node.stamp();
        this.draging
            .dragOver((/*htEle,*/ev) => {
            }, [this.main.node])
            .dragLeave((/*htEle,*/ev) => {
                /*if (ev.target.is(ev.currentTarget))
                    this.dragVisibility(false);*/
            }, [this.main.node])
            .dragEnter((/*htEle,*/ ev) => {
                
                if ((ev.currentTarget as HTMLElement).stamp() == nodeStamp) {
                    //console.log(ev.currentTarget.stamp()+" == "+nodeStamp);
                    let uq = (ev.target as HTMLElement).stamp();
                    let dir = 'none';
                    switch (uq) {
                        case dropIndictors.leftPoll.stamp(): dir = "left"; break;
                        case dropIndictors.topPoll.stamp(): dir = "top"; break;
                        case dropIndictors.rightPoll.stamp(): dir = "right"; break;
                        case dropIndictors.bottomPoll.stamp(): dir = "bottom"; break;
                        case nodeStamp: dir = "bottom"; break;
                        default:
                            this.dragVisibility(true);

                            break;
                    }
                    dropIndictors.indictor.setAttribute("dir", dir);
                    ev.stopImmediatePropagation();
                }
            }, [this.main.node])
            .dragDrop((/*htEle,*/ev) => {
                ev.stopPropagation();
                   
                let uq = (ev.target as HTMLElement).stamp();
                let dir:PossiblePlaces = 'none';
                switch (uq) {
                    case dropIndictors.leftPoll.stamp(): dir = 'leftRect'; break;
                    case dropIndictors.topPoll.stamp(): dir = 'topRect'; break;
                    case dropIndictors.rightPoll.stamp(): dir = 'rightRect'; break;
                    case dropIndictors.bottomPoll.stamp(): dir = 'bottomRect'; break;
                    default:
                        //this.dropHereFromDrag();
                        ev.stopPropagation();
                        //// this.splGrid.main.draging.node.end.fire();
                        return;
                }
                this.onDropNeeded(dir,true);
            }, [this.main.node]);
    }

    dragVisibility(isVisible: boolean): void {
        if (isVisible) {
            let allowedSplitRow = this.main!.splMain.allowSplitRow;
            let allowedSplitColumn = this.main!.splMain.allowSplitColumn;
            let attrVal = "";
            dropIndictors.asArray.forEach(s => {
                if (!allowedSplitRow) {
                    attrVal = s.getAttribute("dir");
                    if (attrVal == "top" || attrVal == "bottom") return;
                } 
                if (!allowedSplitColumn) {
                    attrVal = s.getAttribute("dir");
                    if (attrVal == "left" || attrVal == "right") return;
                }
                this.main!.node.appendChild(s);
                s.style.visibility = "visible";
            });
            this.splGrid.main.ucExtends.passElement(dropIndictors.asArray);
        } else {
            dropIndictors.asArray.forEach(s => s.style.visibility = "hidden");
        }
    }

    onDropNeeded = (dir: PossiblePlaces, importUcFromDrag: boolean = false): void => {

    }
}