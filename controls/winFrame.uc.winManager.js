
const { uniqOpt, controlOpt } = require('ucbuilder/build/common');
const { focusManage } = require('ucbuilder/global/focusManage');
/**
 * @typedef {import ("@uccontrols:/controls/winFrame.uc")} winFrame
 */
class winContiner {

    static source = [];
    static randomName = 'w' + uniqOpt.randomNo();
    /**
     * 
     * @param {HTMLElement} node
     * @param {winFrame} frame
     * @returns {winManager}
     */
    static getManager(node, frame) {
        /** @type {winManager}  */
        let rtrn = node.data(this.randomName);
        if (rtrn == undefined) {
            rtrn = new winManager(node, frame);
            node.data(this.randomName, rtrn);
        }
        return rtrn;
    }
}
/** 
 * @typedef {import ('@ucbuilder:/Usercontrol').Usercontrol} Usercontrol
 */
class winManager {
    /**
     * @param {HTMLElement} mainNode 
     * @param {winFrame} frame
     */
    constructor(mainNode, frame) {
        this.mainNode = mainNode;
        frame.ucExtends.passElement(this.transperency);
    }
    curIndex = 0;
    /** @type {Usercontrol}  */
    CURRENT_WIN = undefined;
    /** @type {Usercontrol[]}  */
    pages = [];

    /** @type {HTMLElement}  */
    transperency = "<transperencyBack></transperencyBack>".$();

    /** @param {Usercontrol} form */
    push = (form) => {
        let _this = this;
        if (_this.CURRENT_WIN != undefined) 
            this.setfreez(true, _this.CURRENT_WIN.ucExtends.self);
        _this.CURRENT_WIN = form;
        _this.pages.push(_this.CURRENT_WIN);
        _this.curIndex = _this.pages.length - 1;
    }

    pop = () => {       
        this.curIndex = this.pages.length - 1;
        this.curIndex--;
       if (this.curIndex >= 0) {
            this.pages.pop();
            this.CURRENT_WIN = this.pages[this.curIndex];
            if (this.CURRENT_WIN != undefined) {
                let _wrapperHT = this.CURRENT_WIN.ucExtends.self;
                _wrapperHT.before(this.transperency);
                this.setfreez(false, _wrapperHT);
                return;
            }
        }
        this.transperency.remove();
        this.CURRENT_WIN = undefined;
    }

    /** @private */
    static ATTR = {
        DISABLE: {
            NEW_VALUE: "disnval" + uniqOpt.randomNo(),
            OLD_VALUE: "disoval" + uniqOpt.randomNo(),
        }
    }
    /** @private */
    focusMng = new focusManage();
    /**
     * @param {boolean} freez 
     * @param {HTMLElement} element 
     */
    setfreez = (freez, element) => {
        if (freez) {
            this.focusMng.fatch();
            element.setAttribute('active', '0');
            let eles = element.querySelectorAll(controlOpt.ATTR.editableControls);
            eles.forEach(
                /** @param {HTMLElement} e */
                e => {
                    let disableAttr = e.getAttribute("disabled");
                    if (disableAttr != null) e.data(winManager.ATTR.DISABLE.OLD_VALUE, disableAttr);
                    e.setAttribute('disabled', true);
                    e.setAttribute(winManager.ATTR.DISABLE.NEW_VALUE, true);
                });

        } else {
            element.setAttribute('active', '1');
            let eles = element.querySelectorAll(`[${winManager.ATTR.DISABLE.NEW_VALUE}]`);
            eles.forEach(
                /** @param {HTMLElement} e */
                e => {
                    let disableAttr = e.data(winManager.ATTR.DISABLE.OLD_VALUE);
                    if (disableAttr != undefined) e.setAttribute('disabled', disableAttr);
                    else e.setAttribute('disabled', false);
                    e.removeAttribute('disabled', winManager.ATTR.DISABLE.NEW_VALUE);
                });
            this.focusMng.focus();
        }
    }
}
module.exports = { winManager, winContiner };          