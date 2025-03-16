import { DragHelper } from "@ucbuilder/global/drag/dragHelper.js";
import { Usercontrol } from "@ucbuilder/Usercontrol.js";
import { tabControl } from "uccontrols/controls/tabControl.uc";

export class dragHandler {
    main: tabControl;
    draging: DragHelper;

    constructor() {
        this.draging = new DragHelper();
    }

    init(main: tabControl) {
        this.main = main;
        this.draging.dragDrop((/*htEle,*/ev) => {
            let dta = DragHelper.draggedData;
            if (dta.type == "uc") {
                try {
                    let uc: Usercontrol = dta.data;
                    this.main.pushUc(uc);
                    DragHelper.dragResult = true;
                } catch (exc) {
                    DragHelper.dragResult = false;
                }
            }
        }, [this.main.tabView]);

        DragHelper.ON_START((/*htEle,*/ev) => {
            let dragdata = DragHelper.draggedData;
            if (dragdata.type == "uc") {
                this.draging.start();
                this.main.tpt_itemnode.draging.start();
            }
        }, (/*htEle,*/ev) => {
            this.draging.stop();
            this.main.tpt_itemnode.draging.stop();
        });
    }
}