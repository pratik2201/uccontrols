import { DragHelper } from "ucbuilder/global/drag/dragHelper";
import { Usercontrol } from "ucbuilder/Usercontrol";
import { tabControl } from "uccontrols/controls/tabControl.uc";

export class dragHandler {
    main: tabControl;
    draging: DragHelper;

    constructor() {
        this.draging = new DragHelper();
    }

    init(main: tabControl) {
        this.main = main;
        this.draging.dragDrop((ev: Event) => {
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

        DragHelper.ON_START((ev: Event) => {
            let dragdata = DragHelper.draggedData;
            if (dragdata.type == "uc") {
                this.draging.start();
                this.main.tpt_itemnode.draging.start();
            }
        }, (ev: Event) => {
            this.draging.stop();
            this.main.tpt_itemnode.draging.stop();
        });
    }
}