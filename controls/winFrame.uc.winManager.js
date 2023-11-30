
const { uniqOpt } = require('ucbuilder/build/common');
const { focusManage } = require('ucbuilder/global/focusManage');
/** 
 * @typedef {import ('@ucbuilder:/Usercontrol').Usercontrol} Usercontrol
 */
class winManager {

    curIndex = 0;
    /** @type {Usercontrol}  */
    CURRENT_WIN = undefined;
    /** @type {Usercontrol[]}  */
    pages = [];

    /** @param {Usercontrol} form */
    push = (form) => {
        let _this = this;
        if (_this.CURRENT_WIN != undefined) {
            this.setfreez(true,_this.CURRENT_WIN.ucExtends.wrapperHT);
        }
        _this.CURRENT_WIN = form;
        _this.pages.push(_this.CURRENT_WIN);
        _this.curIndex = _this.pages.length - 1;
    }

    pop = () => {
        this.curIndex--;
        if (this.curIndex >= 0) {
            this.pages.pop();
            this.curIndex = this.pages.length - 1;
            this.CURRENT_WIN = this.pages[this.curIndex];
            if (this.CURRENT_WIN != undefined) {
                this.setfreez(false,this.CURRENT_WIN.ucExtends.wrapperHT);
            }

        }
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
    setfreez = (freez,element) => {
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
module.exports = { winManager };          