import { Designer } from './Movable.uc.designer.js';
import { dragUc } from 'uccontrols/controls/common/draguc.js';
import { UcStates } from 'ucbuilder/enumAndMore';
import { CommonEvent } from 'ucbuilder/global/commonEvent.js';
import { Usercontrol } from 'ucbuilder/Usercontrol.js';
import { DragHelper } from 'ucbuilder/global/drag/dragHelper.js';

export class Movable extends Designer {

    private _backgroundOpacity: number = 0.500;
    set backgroundOpacity(val: number) { this._backgroundOpacity = val > 1 ? val / 1000 : val }
    get backgroundOpacity(): number { return this._backgroundOpacity; }

    allowResize: boolean = true;

    get allowMove(): boolean { return this.drag.allowMove; }
    set allowMove(val: boolean) { this.drag.allowMove = val; }

    designAll(): void {
        let titleHT: HTMLElement = this.ucExtends.wrapperHT;
        let ctrls: HTMLElement[] = [];
        for (let index = 0; index < this.ucExtends.garbageElementsHT.length; index++) {
            const node = this.ucExtends.garbageElementsHT[index] as HTMLElement;
            if (!node.is(titleHT)) {
                ctrls.push(node);
            }
        }
        ctrls.forEach(ctr => {
            this.container1.append(ctr);
        });
        this.ucExtends.stageHT = this.container1;
    }

    drag: dragUc = new dragUc();
    SESSION_DATA = {
        winState: 'normal' as UcStates,
        oldstyleText: "",
        rect: {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
        }
    }
    get parentUCExt() { return this.ucExtends.PARENT.ucExtends }
    get parentElementHT() { return this.parentUCExt.wrapperHT }
    constructor() {
        super();
        this.initializecomponent(arguments, this);

        this.ucExtends.session.autoLoadSession = true;

        this.drag.finalRect = this.SESSION_DATA.rect;
        this.SESSION_DATA.rect.width = parseFloat(this.parentElementHT.style.width);
        this.SESSION_DATA.rect.height = parseFloat(this.parentElementHT.style.height);

        this.init();
        this.ucExtends.Events.loadLastSession.on(() => {
            this.drag.finalRect = this.SESSION_DATA.rect;
            this.loadSession();
        });
    }

    loadSession(): void {
        let selectRect = this.SESSION_DATA.rect;
        let containerHT = this.drag.containerHT;
        this.ucExtends.windowstate = this.SESSION_DATA.winState;
        this.checkState(this.SESSION_DATA.winState);
    }

    init(): void {
        this.initEvent();
        this.lbl_title.innerText = this.parentUCExt.wrapperHT.getAttribute("x-caption");
        this.drag.Events.onmouseup = (evt) => {
            this.ucExtends.session.onModify();
            return false;
        }
        this.dragme.addEventListener("dragstart", (e) => {
            e.dataTransfer.setDragImage(this.parentElementHT, 0, 0);
        })
        this.cmd_close.addEventListener("mouseup", (e) => {
            this.parentUCExt.destruct();
        });
    }

    movableEvents = {
        extended: {
            onActivateWindow: new CommonEvent<(uc: Usercontrol) => void>(),
        },
        onActivateWindow(callback: (uc: Usercontrol) => void): void {
            this.extended.onActivateWindow.on(callback);
        },
        onResizeStart(callback: () => void): void {
            this.drag.Events.onResizeStart.on(callback);
        },
        onResizeEnd(callback: (uc: Usercontrol) => void): void {
            this.drag.Events.onResizeEnd.on(callback);
        },
        onMoveStart(callback: (uc: Usercontrol) => void): void {
            this.drag.Events.onMoveStart.on(callback);
        },
        onMoveEnd(callback: (uc: Usercontrol) => void): void {
            this.drag.Events.onMoveEnd.on(callback);
        },
    }

    initEvent(): void {
        this.parentUCExt.Events.captionChanged.on((nval: string) => {
            this.lbl_title.innerText = nval;
        });
        this.parentUCExt.Events.winStateChanged.on((state: UcStates) => {
            this.checkState(state);
        });
        this.checkState(this.parentUCExt.windowstate);

       // this.container = ResourcesUC.contentHT;

        this.designAll();

        this.drag.init(this.parentElementHT, this.title_panel);
        this.drag.resizer.connect(this);

        DragHelper.DRAG_ME(this.dragme,
            (evt) => {
                return {
                    type: "uc",
                    data: this.ucExtends.PARENT,
                };
            },
            (evt) => {

            });

        this.cmd_close.on('mousedown', (event) => {
            console.log('window is closing...');
            this.parentUCExt.destruct();
        });
        this.ucExtends.self.addEventListener("mousedown", (evt) => {
            if (this.parentUCExt.windowstate == 'dock') return;
            let pucHT = this.parentElementHT;
            if (pucHT.nextSibling != null)
                pucHT.parentElement.appendChild(pucHT);
            this.parentUCExt.Events.activate.fire();
            this.movableEvents.extended.onActivateWindow.fire([this.ucExtends.PARENT]);
        });
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
                this.drag.resizer.cssDisplay("none");
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

                this.drag.resizer.cssDisplay("block");
                break;
        }
    }
}