import { Designer } from "uccontrols/designer/controls/winFrame.uc.designer";
import { objectResizer } from "@ucbuilder/global/draging/objectResizer.js";
import { UcStates } from "@ucbuilder/enumAndMore.js";
import { ResizeMoveEvent } from "@ucbuilder/global/draging/ResizeMoveEvent.js";
import { objectMover } from "@ucbuilder/global/draging/objectMover.js";
import { CommonEvent } from "@ucbuilder/global/commonEvent.js";
export type winStates = "maximize" | "normal";
export class winFrame extends Designer {
    private _backgroundOpacity: number = 0.500;
    set backgroundOpacity(val: number) { this._backgroundOpacity = val > 1 ? val / 1000 : val }
    get backgroundOpacity(): number { return this._backgroundOpacity; }
    static hasInitedTransperency: boolean = false;

    
    get parentUCExt() { return this.ucExtends.PARENT.ucExtends; }
    get parentElementHT() { return this.parentUCExt.wrapperHT; }
    constructor() {
        super();
        this.initializecomponent(arguments, this);
        let p = this.ucExtends.PARENT;

        p.ucExtends.dialogForm = p;
    }
    
    get DragEvents() { return this.dragMoveEvent.Events; }

    dragMoveEvent: ResizeMoveEvent;
    resizer: objectResizer;
    mover: objectMover;
    $() {
        this.ucExtends.session.autoLoadSession = true;
        this.init();
        this.dragMoveEvent = new ResizeMoveEvent();

        this.resizer = new objectResizer(this.dragMoveEvent);
        this.resizer.finalRect = this.SESSION_DATA.rect;
        this.resizer.containerHT = this.parentElementHT;
        this.resizer.passElement(this);
        this.resizer.activate();
        this.mover = new objectMover(this.dragMoveEvent);
        this.mover.finalRect = this.SESSION_DATA.rect;
        this.mover.holderHT.push(this.title_panel);
        this.mover.containerHT = this.parentElementHT;
        this.mover.activate();


        if (this.ucExtends.mode == 'client') {
            this.parentUCExt.Events.loaded.on(() => {
                //setTimeout(() => {
                // debugger;
                let chd = window.getComputedStyle(this.ucExtends.wrapperHT);
                // this.parentElementHT.style.width = chd.width;
                // this.parentElementHT.style.height = chd.height;
                //console.log(chd.height + ":" + this.parentElementHT.offsetHeight);
                this.SESSION_DATA.rect.width = parseFloat(chd.width);
                this.SESSION_DATA.rect.height = parseFloat(chd.height);
                // })
            });
        }

        this.parentUCExt.Events.activate.on(() => {
            //this.parentElementHT.before(winFrame.transperency);
        });
        this.ucExtends.Events.loadLastSession.on(() => {
            //debugger;

            this.resizer.finalRect = this.SESSION_DATA.rect;
            this.loadSession();
        });
        this.resizer.Events.onResizeEnd.on(() => {
            this.ucExtends?.session.onModify();
        });
        this.ucExtends.Events.afterClose.on(() => {

            this.resizer.Events = undefined;
        })


    }
    loadSession(): void {
        let selectRect = this.SESSION_DATA.rect;
        let containerHT = this.resizer.containerHT;
        this.ucExtends.windowstate = this.SESSION_DATA.winState;
        this.checkState(this.SESSION_DATA.winState);
    }
    checkState(state: UcStates): void {
        this.SESSION_DATA.winState = state;

        switch (state) {
            case 'dock':
                this.ucExtends.self.setAttribute("win-state", "dock");
                this.SESSION_DATA.oldstyleText = this.parentElementHT.style.cssText;
                Object.assign(this.parentElementHT.style, {
                    position: "static",
                    width: "100%",
                    height: "100%",
                    display: "block",
                });
                this.resizer.resizer.cssDisplay("none");
                break;
            case 'normal':
                this.ucExtends.self.setAttribute("win-state", "normal");

                Object.assign(this.parentElementHT.style, {
                    position: "absolute",
                    left: this.SESSION_DATA.rect.left + "px",
                    top: this.SESSION_DATA.rect.top + "px",
                    width: this.SESSION_DATA.rect.width + "px",
                    height: this.SESSION_DATA.rect.height + "px",
                });

                // this.drag.resizer.cssDisplay("block");
                break;
        }
    }
    init(): void {

        this.initEvent();
        this.lbl_title.innerText = this.parentUCExt.wrapperHT.getAttribute("x-caption");

    }
    private SESSION_DATA = {
        winState: 'normal' as UcStates,
        oldstyleText: '',
        rect: {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
        }
    }
    initEvent(): void {
        this.ucExtends.initalComponents.changeStage(this.container1);
        this.parentUCExt.initalComponents.stageHT = this.container1;

        this.parentUCExt.Events.captionChanged.on((nval) => {
            this.lbl_title.innerText = nval;
        });
        this.cmd_close.on('mousedown', (event) => {
            event.stopImmediatePropagation();
        });
        this.cmd_close.on('mouseup', (event) => {
            event.stopImmediatePropagation();
            this.parentUCExt.close();
        });

    }

}