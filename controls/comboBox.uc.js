"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comboBox = void 0;
const shapes_1 = require("ucbuilder/global/drawing/shapes");
const keyboard_1 = require("ucbuilder/global/hardware/keyboard");
const intenseGenerator_1 = require("ucbuilder/intenseGenerator");
const combobox_uc_designer_1 = require("./combobox.uc.designer");
const comboBox_uc_binderNode_1 = require("uccontrols/controls/comboBox.uc.binderNode");
class comboBox extends combobox_uc_designer_1.Designer {
    constructor() {
        super();
        this.openOn = [];
        this.isOpeinig = false;
        this.openComboByEvent = (e) => {
            if (!this.binder.hasBound) {
                this.openList();
                e.stopImmediatePropagation();
            }
        };
        this.initializecomponent(arguments, this);
        this.ll_view.init();
        //if (this.binder == undefined)
        this.binder = this.bindNew();
        if (this.itemTemplate == undefined) {
            this.itemTemplate = intenseGenerator_1.intenseGenerator.generateTPT('uccontrols/controls/comboBox/comboboxItem.tpt', {
                parentUc: this
            });
        }
        this.binder.direction = 'bottom';
        this.binder.bindInputBox({
            elementHT: this.ucExtends.self,
            bindFocusEvents: true
        });
        this.binder.Events.onShow.on(() => {
            this.cmd_drop.setAttribute('isopened', 'true');
        });
        this.binder.Events.onHide.on(() => {
            this.cmd_drop.setAttribute('isopened', 'false');
        });
        this.txt_editor.addEventListener("dblclick", (e) => {
            if (this.binder.hasBound) {
                this.binder.hide();
                return;
            }
            this.openList();
        });
        this.ucExtends.self.addEventListener("keydown", (e) => {
            switch (e.keyCode) {
                case keyboard_1.keyBoard.keys.space:
                    this.openComboByEvent(e);
                    break;
                case keyboard_1.keyBoard.keys.up:
                    this.binder.fireSelectedIndexChangeEvent = !this.binder.hasBound;
                    this.selectedIndex--;
                    break;
                case keyboard_1.keyBoard.keys.down:
                    this.binder.fireSelectedIndexChangeEvent = !this.binder.hasBound;
                    this.selectedIndex++;
                    break;
            }
        });
        this.ucExtends.self.addEventListener("mouseup", this.openComboByEvent);
        this.cmd_drop.addEventListener("mouseup", this.openComboByEvent);
        this.txt_editor.addEventListener("mouseup", this.openComboByEvent);
        this.binder.Events.selectedIndexChange.on((ninex, oindex) => {
            this.changeSelectedText();
        });
    }
    set source(val) { this.binder.source = val; }
    get itemTemplate() {
        if (this.binder == undefined)
            return undefined;
        return this.binder.template;
    }
    set itemTemplate(val) {
        if (this.binder == undefined)
            this.binder = this.bindNew();
        this.binder.template = intenseGenerator_1.intenseGenerator.parseTPT(val, this.ucExtends.PARENT);
    }
    get seletecteditemTemplate() { return this._seletecteditemTemplate; }
    set seletecteditemTemplate(value) {
        this._seletecteditemTemplate = intenseGenerator_1.intenseGenerator.parseTPT(value, this.ucExtends.PARENT);
    }
    get selectedIndex() { return this.binder.selectedIndex; }
    set selectedIndex(val) {
        this.binder.selectedIndex = val;
    }
    openList() {
        let txtboxRect = new shapes_1.Rect();
        txtboxRect.setBy.domRect(this.ucExtends.self.getClientRects()[0]);
        this.binder.showAt(txtboxRect);
        this.ll_view.lvUI.currentIndex = this.selectedIndex;
    }
    hasfocused() {
        return this.ucExtends.self.contains(document.activeElement) ||
            this.ll_view.ucExtends.self.contains(document.activeElement);
    }
    changeSelectedText() {
        this.txt_editor.innerHTML = "";
        if (this.seletecteditemTemplate == undefined)
            this.txt_editor.appendChild(this.binder.template.extended.generateNode(this.binder.selectedRecord));
        else
            this.txt_editor.appendChild(this.seletecteditemTemplate.extended.generateNode(this.binder.selectedRecord));
    }
    bindNew() {
        let binder = new comboBox_uc_binderNode_1.binderNode();
        binder.init(this.ll_view);
        return binder;
    }
}
exports.comboBox = comboBox;
comboBox.openOptions = "click";
