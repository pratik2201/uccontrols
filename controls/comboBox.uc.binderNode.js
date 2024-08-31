"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.binderNode = void 0;
const commonEvent_1 = require("ucbuilder/global/commonEvent");
const shapes_js_1 = require("ucbuilder/global/drawing/shapes.js");
const comboBox_uc_positionar_1 = require("uccontrols/controls/comboBox.uc.positionar");
const keyboard_1 = require("ucbuilder/global/hardware/keyboard");
class binderNode {
    constructor() {
        this.hasMouseDownedOnItem = false;
        this._selectedIndex = -1;
        this._source = [];
        this.filteredSource = [];
        this.fireSelectedIndexChangeEvent = true;
        this.allowedElementList = [];
        this.hasBound = false;
        this.direction = "";
        this.dontOpen = false;
        this.verticalMinHeight = 15;
        this.horizontalMinHeight = 15;
        this.itemMouseUp_listner = (index, evt) => {
            var _a;
            this.hasMouseDownedOnItem = false;
            this.dontOpen = true;
            
           
            (_a = this.boundElement) === null || _a === void 0 ? void 0 : _a.focus();
            this.dontOpen = false;
            this.hide();
            if (this.selectedIndex != index)
                this.selectedIndex = index;
            evt.stopImmediatePropagation();
        };
        this.itemMouseDown_listner = (index, evt) => {
            this.hasMouseDownedOnItem = true;
        };
        this.bindInputBox = ({ elementHT = undefined, bindUpDownKeys = true, bindFocusEvents = true, } = {}) => {
            this.boundElement = elementHT;
            if (bindUpDownKeys) {
                this.Events.onShow.on(() => {
                    var _a;
                    elementHT === null || elementHT === void 0 ? void 0 : elementHT.addEventListener("keydown", this.main.lvUI.keydown_listner);
                    this.main.Events.itemMouseUp.on(this.itemMouseUp_listner);
                    this.main.Events.itemMouseDown.on(this.itemMouseDown_listner);
                    elementHT === null || elementHT === void 0 ? void 0 : elementHT.addEventListener("keydown", this.keyup_listner);
                    (_a = this.boundElement) === null || _a === void 0 ? void 0 : _a.focus();
                });
                this.Events.onHide.on(() => {
                    elementHT === null || elementHT === void 0 ? void 0 : elementHT.removeEventListener("keydown", this.main.lvUI.keydown_listner);
                    this.main.Events.itemMouseUp.off(this.itemMouseUp_listner);
                    this.main.Events.itemMouseDown.off(this.itemMouseDown_listner);
                    elementHT === null || elementHT === void 0 ? void 0 : elementHT.removeEventListener("keydown", this.keyup_listner);
                });
            }
            if (bindFocusEvents) {
                elementHT === null || elementHT === void 0 ? void 0 : elementHT.addEventListener("focusin", (e) => {
                    let txtboxRect = new shapes_js_1.Rect();
                    txtboxRect.setBy.domRect(e.target.getClientRects()[0]);
                    this.showAt(txtboxRect);
                });
                elementHT === null || elementHT === void 0 ? void 0 : elementHT.addEventListener("mousedown", (e) => {
                    let htE = e.target;
                    if (!document.activeElement.is(htE) || this.hasBound)
                        return;
                    let txtboxRect = new shapes_js_1.Rect();
                    txtboxRect.setBy.domRect(htE.getClientRects()[0]);
                    this.showAt(txtboxRect);
                });
            }
            elementHT === null || elementHT === void 0 ? void 0 : elementHT.addEventListener("blur", (e) => {
                this.mousedown_focus_listner(e);
            });
        };
        this.Events = {
            selectedIndexChange: new commonEvent_1.CommonEvent(),
            onShow: new commonEvent_1.CommonEvent(),
            onHide: new commonEvent_1.CommonEvent(),
            isOutOfTarget: (target) => { return true; },
        };
        this.mousedown_focus_listner = (e) => {
            if (this.isOutOfTarget(document.activeElement))
                this.hide();
        };
        this.keyup_listner = (evt) => {
            switch (evt.keyCode) {
                case keyboard_1.keyBoard.keys.enter:
                    this.fireSelectedIndexChangeEvent = true;
                    this.selectedIndex = this.main.lvUI.currentIndex;
                    this.hide();
                    evt.preventDefault();
                    break;
            }
        };
    }
    get selectedRecord() { return this.filteredSource[this._selectedIndex]; }
    get selectedItem() { return this.main.Records.itemAt(this._selectedIndex); }
    get selectedIndex() { return this._selectedIndex; }
    set selectedIndex(val) {
        let node = undefined;
        if (val >= 0 && val < this.filteredSource.length) {
            let oIndex = this.selectedIndex;
            node = this.selectedItem;
            if (node != undefined)
                node.setAttribute('is-selected', '0');
            this._selectedIndex = val;
            node = this.selectedItem;
            if (node != undefined)
                node.setAttribute('is-selected', '1');
            console.log('dsfe');
            if (this.fireSelectedIndexChangeEvent)
                this.Events.selectedIndexChange.fire([val, oIndex]);
            else
                this.fireSelectedIndexChangeEvent = true;
        }
    }
    set source(val) {
        this._source = val;
        this.filteredSource = [];
        this.filteredSource = [...val];
    }
    init(main) {
        this.main = main;
        this.position = new comboBox_uc_positionar_1.Positionar();
        this.position.init(this.main.ucExtends.self);
    }
    isOutOfTarget(tar) {
        let res = (!this.hasMouseDownedOnItem &&
            !this.main.ucExtends.self.contains(tar)
            && this.allowedElementList.findIndex(s => s.is(tar)) == -1
            && this.Events.isOutOfTarget(tar));
        return res;
    }
    showAt(txtboxRect) {
        var _a;
        this.main.itemTemplate = this.template;
        this.main.source.rows = this.filteredSource;
        this.main.nodes.fill();
        this.main.lvUI.currentIndex = this.main.lvUI.currentIndex;
        this.hasBound = true;
        this.selectedIndex = this.selectedIndex;
        this.Events.onShow.fire();
        (_a = this.position) === null || _a === void 0 ? void 0 : _a.show(txtboxRect);
    }
    hide() {
        this.hasBound = false;
        this.Events.onHide.fire();
        Object.assign(this.main.ucExtends.self.style, {
            'visibility': 'collapse',
        });
    }
}
exports.binderNode = binderNode;
