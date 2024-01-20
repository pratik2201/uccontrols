const { designer } = require('./winFrame.uc.designer.js');
const { dragUc } = require('@uccontrols:/controls/common/draguc.js');
const { ucStates } = require('ucbuilder/enumAndMore');
const { controlOpt } = require('ucbuilder/build/common.js');
const { ResourcesUC } = require('ucbuilder/ResourcesUC.js');
const { winManager, winContiner } = require('@uccontrols:/controls/winFrame.uc.winManager.js');
const { timeoutCall } = require("ucbuilder/global/timeoutCall");
const { keyBoard } = require('ucbuilder/global/hardware/keyboard.js');

class winFrame extends designer {

    /** @type {number} @private */
    _backgroundOpacity = 0.500;
    set backgroundOpacity(val) { this._backgroundOpacity = val > 1 ? val / 1000 : val }
    get backgroundOpacity() { return this._backgroundOpacity; }

    /** @type {HTMLElement}  */
    static transperency = "<transperencyBack></transperencyBack>".$();
    static hasInitedTransperency = false;
    /** @type {Boolean} */
    allowResize = true;

    get allowMove() { return this.drag.allowMove; }
    set allowMove(val) { this.drag.allowMove = val; }
    get allowResize() { return this.drag.allowResize; }
    set allowResize(val) { this.drag.allowResize = val; }

    designAll() {

        let titleHT = this.ucExtends.wrapperHT;

        let ctrls = [];
        for (let index = 0; index < this.ucExtends.garbageElementsHT.length; index++) {
            const node = this.ucExtends.garbageElementsHT[index];
            //if (node.nodeType == node.ELEMENT_NODE) {
            if (!node.is(titleHT)) {
                ctrls.push(node);
            }
            // }
        }
        ctrls.forEach(ctr => {
            this.container1.appendChild(ctr);
        });
        this.ucExtends.stageHT = this.container1;
        //console.log(this.container1.innerHTML);
        //console.log('designAll');
    }

    //#endregion
    /** @type {winManager}  */
    manage = undefined;
    constructor() {
        eval(designer.giveMeHug);
        this.ucExtends.session.autoLoadSession = true;
        this.parentUCExt = this.ucExtends.PARENT.ucExtends;
        /** @type {HTMLElement}  */
        this.parentElementHT = this.parentUCExt.wrapperHT;
        if (this.ucExtends.mode == 'client') {
            this.parentUCExt.Events.afterInitlize.on(() => {
                let form_container = this.parentUCExt.self.parentElement;
                this.manage = winContiner.getManager(form_container, this);
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
        }
        this.drag.Events.onResizeEnd.on(() => {
            this.ucExtends.session.onModify();
        });

    }
    loadSession() {
        let selectRect = this.SESSION_DATA.rect;
        let containerHT = this.drag.containerHT;
        this.ucExtends.windowstate = this.SESSION_DATA.winState;
        this.checkState(this.SESSION_DATA.winState);
    }
    /** @param {ucStates} state */
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


                /* this.parentElementHT.style.left = `${this.SESSION_DATA.rect.left}px`;
                 this.parentElementHT.style.top = `${this.SESSION_DATA.rect.top}px`;
                 this.parentElementHT.style.width = `${this.SESSION_DATA.rect.width}px`;
                 this.parentElementHT.style.height = `${this.SESSION_DATA.rect.height}px`;*/
                this.drag.resizer.cssDisplay("block");
                break;
        }
    }
    init() {

        this.initEvent();
        this.lbl_title.innerText = this.parentUCExt.wrapperHT.getAttribute("x-caption");

    }
    drag = new dragUc();
    SESSION_DATA = {
        /** @type {ucStates} */
        winState: 'normal',
        rect: {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
        }
    }
    initEvent() {
        this.parentUCExt = this.ucExtends.PARENT.ucExtends;
        this.parentElementHT = this.parentUCExt.wrapperHT;

        this.container = ResourcesUC.contentHT;

        //this.ucExtends.._..updateLayout();
        this.designAll();

        this.drag.init(this.parentElementHT, this.title_panel); // this.ucExtends.self
        this.drag.resizer.connect(this);
        this.parentUCExt.Events.captionChanged.on((nval) => {
            this.lbl_title.innerText = nval;
        });
        this.cmd_close.on('mouseup', (event) => {
            this.doCloseWindow();
        });
        this.parentElementHT.addEventListener('keyup', (e) => {
            switch (e.keyCode) {
                case keyBoard.keys.escape:
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
    /**
     * @param {{
     *  defaultFocusAt:container
     * }} param0 
     */
    showDialog({ defaultFocusAt = undefined } = {}) {
        this.manage.push(this.ucExtends.PARENT);

        ResourcesUC.contentHT.append(this.parentElementHT);
        //this.parentUCExt.Events.activate.fire();
        // console.log('showDialog');
        timeoutCall.start(() => {
            if (defaultFocusAt == undefined) {
                ResourcesUC.tabMng.moveNext(this.ucExtends.self);
            } else {
                ResourcesUC.tabMng.focusTo(defaultFocusAt);
            }
        }, 0);


    }
}
module.exports = winFrame;          