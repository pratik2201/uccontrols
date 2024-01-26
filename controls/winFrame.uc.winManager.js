"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.winManager = exports.winContiner = void 0;
const common_1 = require("ucbuilder/build/common");
const focusManage_1 = require("ucbuilder/global/focusManage");
class winContiner {
    static getManager(node, frame) {
        let rtrn = node.data(this.randomName);
        if (rtrn == undefined) {
            rtrn = new winManager(node, frame);
            node.data(this.randomName, rtrn);
        }
        return rtrn;
    }
}
exports.winContiner = winContiner;
winContiner.source = [];
winContiner.randomName = 'w' + common_1.uniqOpt.randomNo();
class winManager {
    constructor(mainNode, frame) {
        this.curIndex = 0;
        this.pages = [];
        this.transperency = "<transperencyBack></transperencyBack>".$();
        this.focusMng = new focusManage_1.FocusManager();
        this.push = (form) => {
            let _this = this;
            if (_this.CURRENT_WIN != undefined)
                this.setfreez(true, _this.CURRENT_WIN.ucExtends.self);
            _this.CURRENT_WIN = form;
            _this.pages.push(_this.CURRENT_WIN);
            _this.curIndex = _this.pages.length - 1;
        };
        this.pop = () => {
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
        };
        this.setfreez = (freez, element) => {
            if (freez) {
                this.focusMng.fetch();
                element.setAttribute('active', '0');
                let eles = element.querySelectorAll(common_1.controlOpt.ATTR.editableControls);
                eles.forEach((e) => {
                    let disableAttr = e.getAttribute("disabled");
                    if (disableAttr != null)
                        e.data(winManager.ATTR.DISABLE.OLD_VALUE, disableAttr);
                    e.setAttribute('disabled', 'true');
                    e.setAttribute(winManager.ATTR.DISABLE.NEW_VALUE, 'true');
                });
            }
            else {
                element.setAttribute('active', '1');
                let eles = element.querySelectorAll(`[${winManager.ATTR.DISABLE.NEW_VALUE}]`);
                eles.forEach((e) => {
                    let disableAttr = e.data(winManager.ATTR.DISABLE.OLD_VALUE);
                    if (disableAttr != undefined)
                        e.setAttribute('disabled', disableAttr);
                    else
                        e.setAttribute('disabled', 'false');
                    // e.removeAttribute('disabled', winManager.ATTR.DISABLE.NEW_VALUE);
                });
                this.focusMng.focus();
            }
        };
        this.mainNode = mainNode;
        frame.ucExtends.passElement(this.transperency);
    }
}
exports.winManager = winManager;
winManager.ATTR = {
    DISABLE: {
        NEW_VALUE: "disnval" + common_1.uniqOpt.randomNo(),
        OLD_VALUE: "disoval" + common_1.uniqOpt.randomNo(),
    }
};
