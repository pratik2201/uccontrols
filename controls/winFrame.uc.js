"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.winFrame = void 0;
const winFrame_uc_designer_js_1 = require("./winFrame.uc.designer.js");
const draguc_js_1 = require("uccontrols/controls/common/draguc.js");
const ResourcesUC_js_1 = require("ucbuilder/ResourcesUC.js");
const winFrame_uc_winManager_js_1 = require("uccontrols/controls/winFrame.uc.winManager.js");
const timeoutCall_1 = require("ucbuilder/global/timeoutCall");
const keyboard_js_1 = require("ucbuilder/global/hardware/keyboard.js");
class winFrame extends winFrame_uc_designer_js_1.Designer {
    constructor() {
        super();
        this._backgroundOpacity = 0.500;
        this.manage = undefined;
        this.drag = new draguc_js_1.dragUc();
        this.SESSION_DATA = {
            winState: 'normal',
            oldstyleText: '',
            rect: {
                left: 0,
                top: 0,
                width: 0,
                height: 0,
            }
        };
        this.initializecomponent(arguments, this);
        this.ucExtends.session.autoLoadSession = true;
        //this.parentUCExt = this.ucExtends.PARENT.ucExtends;
        //this.parentElementHT = this.parentUCExt.wrapperHT;
        if (this.ucExtends.mode == 'client') {
            this.parentUCExt.Events.afterInitlize.on(() => {
                let form_container = this.parentUCExt.self.parentElement;
                this.manage = winFrame_uc_winManager_js_1.winContiner.getManager(form_container, this);
                this.parentElementHT.before(this.manage.transperency);
            });
        }
        this.drag.finalRect = this.SESSION_DATA.rect;
        this.SESSION_DATA.rect.width = parseFloat(this.parentElementHT.style.width);
        this.SESSION_DATA.rect.height = parseFloat(this.parentElementHT.style.height);
        this.init();
        this.parentUCExt.Events.activate.on(() => {
            //this.parentElementHT.before(winFrame.transperency);
        });
        this.ucExtends.Events.loadLastSession.on(() => {
            //debugger;
            this.drag.finalRect = this.SESSION_DATA.rect;
            this.loadSession();
        });
        this.drag.Events.onmouseup = (evt) => {
            this.ucExtends.session.onModify();
            return false;
        };
        this.drag.Events.onResizeEnd.on(() => {
            this.ucExtends.session.onModify();
        });
    }
    set backgroundOpacity(val) { this._backgroundOpacity = val > 1 ? val / 1000 : val; }
    get backgroundOpacity() { return this._backgroundOpacity; }
    get allowMove() { return this.drag.allowMove; }
    set allowMove(val) { this.drag.allowMove = val; }
    get allowResize() { return this.drag.allowResize; }
    set allowResize(val) { this.drag.allowResize = val; }
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
            this.container1.appendChild(ctr);
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
    init() {
        this.initEvent();
        this.lbl_title.innerText = this.parentUCExt.wrapperHT.getAttribute("x-caption");
    }
    initEvent() {
        //this.parentUCExt = this.ucExtends.PARENT.ucExtends;
        //this.parentElementHT = this.parentUCExt.wrapperHT;
        // this.container = ResourcesUC.contentHT;
        this.designAll();
        this.drag.init(this.parentElementHT, this.title_panel);
        this.drag.resizer.connect(this);
        this.parentUCExt.Events.captionChanged.on((nval) => {
            this.lbl_title.innerText = nval;
        });
        this.cmd_close.on('mouseup', (event) => {
            this.doCloseWindow();
        });
        this.parentElementHT.addEventListener('keyup', (e) => {
            switch (e.keyCode) {
                case keyboard_js_1.keyBoard.keys.escape:
                    this.doCloseWindow();
                    break;
            }
        });
    }
    doCloseWindow() {
        console.log('window is closing...');
        setTimeout(() => {
            let result = this.parentUCExt.destruct();
            if (result === true) {
                this.manage.pop();
            }
        }, 1);
    }
    showDialog({ defaultFocusAt = undefined } = {}) {
        this.manage.push(this.ucExtends.PARENT);
        ResourcesUC_js_1.ResourcesUC.contentHT.append(this.parentElementHT);
        timeoutCall_1.timeoutCall.start(() => {
            if (defaultFocusAt == undefined) {
                ResourcesUC_js_1.ResourcesUC.tabMng.moveNext(this.ucExtends.self);
            }
            else {
                ResourcesUC_js_1.ResourcesUC.tabMng.focusTo(defaultFocusAt);
            }
        });
    }
}
exports.winFrame = winFrame;
winFrame.transperency = "<transperencyBack></transperencyBack>".$();
winFrame.hasInitedTransperency = false;
