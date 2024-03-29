"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Movable = void 0;
const Movable_uc_designer_js_1 = require("./Movable.uc.designer.js");
const draguc_js_1 = require("uccontrols/controls/common/draguc.js");
const commonEvent_js_1 = require("ucbuilder/global/commonEvent.js");
const dragHelper_js_1 = require("ucbuilder/global/drag/dragHelper.js");
class Movable extends Movable_uc_designer_js_1.Designer {
    constructor() {
        super();
        this._backgroundOpacity = 0.500;
        this.allowResize = true;
        this.drag = new draguc_js_1.dragUc();
        this.SESSION_DATA = {
            winState: 'normal',
            oldstyleText: "",
            rect: {
                left: 0,
                top: 0,
                width: 0,
                height: 0,
            }
        };
        this.movableEvents = {
            extended: {
                onActivateWindow: new commonEvent_js_1.CommonEvent(),
            },
            onActivateWindow(callback) {
                this.extended.onActivateWindow.on(callback);
            },
            onResizeStart(callback) {
                this.drag.Events.onResizeStart.on(callback);
            },
            onResizeEnd(callback) {
                this.drag.Events.onResizeEnd.on(callback);
            },
            onMoveStart(callback) {
                this.drag.Events.onMoveStart.on(callback);
            },
            onMoveEnd(callback) {
                this.drag.Events.onMoveEnd.on(callback);
            },
        };
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
    set backgroundOpacity(val) { this._backgroundOpacity = val > 1 ? val / 1000 : val; }
    get backgroundOpacity() { return this._backgroundOpacity; }
    get allowMove() { return this.drag.allowMove; }
    set allowMove(val) { this.drag.allowMove = val; }
    designAll() {
        let titleHT = this.ucExtends.wrapperHT;
        let ctrls = [];
        for (let index = 0; index < this.ucExtends.garbageElementsHT.length; index++) {
            const node = this.ucExtends.garbageElementsHT[index];
            if (!node.is(titleHT)) {
                ctrls.push(node);
            }
        }
        ctrls.forEach(ctr => {
            this.container1.append(ctr);
        });
        this.ucExtends.stageHT = this.container1;
    }
    get parentUCExt() { return this.ucExtends.PARENT.ucExtends; }
    get parentElementHT() { return this.parentUCExt.wrapperHT; }
    loadSession() {
        let selectRect = this.SESSION_DATA.rect;
        let containerHT = this.drag.containerHT;
        this.ucExtends.windowstate = this.SESSION_DATA.winState;
        this.checkState(this.SESSION_DATA.winState);
    }
    init() {
        this.initEvent();
        this.lbl_title.innerText = this.parentUCExt.wrapperHT.getAttribute("x-caption");
        this.drag.Events.onmouseup = (evt) => {
            this.ucExtends.session.onModify();
            return false;
        };
        this.dragme.addEventListener("dragstart", (e) => {
            e.dataTransfer.setDragImage(this.parentElementHT, 0, 0);
        });
        this.cmd_close.addEventListener("mouseup", (e) => {
            this.parentUCExt.destruct();
        });
    }
    initEvent() {
        this.parentUCExt.Events.captionChanged.on((nval) => {
            this.lbl_title.innerText = nval;
        });
        this.parentUCExt.Events.winStateChanged.on((state) => {
            this.checkState(state);
        });
        this.checkState(this.parentUCExt.windowstate);
        // this.container = ResourcesUC.contentHT;
        this.designAll();
        this.drag.init(this.parentElementHT, this.title_panel);
        this.drag.resizer.connect(this);
        dragHelper_js_1.DragHelper.DRAG_ME(this.dragme, (evt) => {
            return {
                type: "uc",
                data: this.ucExtends.PARENT,
            };
        }, (evt) => {
        });
        this.cmd_close.on('mousedown', (event) => {
            console.log('window is closing...');
            this.parentUCExt.destruct();
        });
        this.ucExtends.self.addEventListener("mousedown", (evt) => {
            if (this.parentUCExt.windowstate == 'dock')
                return;
            let pucHT = this.parentElementHT;
            if (pucHT.nextSibling != null)
                pucHT.parentElement.appendChild(pucHT);
            this.parentUCExt.Events.activate.fire();
            this.movableEvents.extended.onActivateWindow.fire([this.ucExtends.PARENT]);
        });
    }
    checkState(state) {
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
exports.Movable = Movable;
