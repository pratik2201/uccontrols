const { objectOpt } = require('ucbuilder/build/common.js');
const { Rect } = require('ucbuilder/global/drawing/shapes.js');
const { Template } = require('ucbuilder/Template.js');
const comboboxItem = require('@uccontrols:/controls/combobox/comboboxitem.tpt.js');
const { keyBoard } = require('ucbuilder/global/hardware/keyboard.js');
const { intenseGenerator } = require('ucbuilder/intenseGenerator.js');
const { designer } = require('./combobox.uc.designer.js');
const { binderNode } = require('@uccontrols:/controls/comboBox.uc.binderNode');

class combobox extends designer {
    set source(val) { this.binder.source = val; }
    get itemTemplate() {
        if (this.binder == undefined) return undefined;
        return this.binder.template;
    }

    /** @type {binderNode}  */
    binder = undefined;
    /** @type {TemplateNode}  */
    set itemTemplate(val) {
        if (this.binder == undefined)
            this.binder = this.bindNew();
        this.binder.template = intenseGenerator.parseTPT(val, this.ucExtends.PARENT);
    }
    /** @type {TemplateNode}  */
    _seletecteditemTemplate = undefined;
    get seletecteditemTemplate() { return this._seletecteditemTemplate; }
    set seletecteditemTemplate(value) {
        this._seletecteditemTemplate = intenseGenerator.parseTPT(value, this.ucExtends.PARENT);
    }
    get selectedIndex() { return this.binder.selectedIndex; }
    set selectedIndex(val) {
        this.binder.selectedIndex = val;
    }
    /** @type {"click"|"dblclick"|"focus"|"enterKey"|"spacebarKey"}  */
    static openOptions = "click"
    /** @type {combobox.openOptions[]}  */
    openOn = [];

    isOpeinig = false;
    openList() {
        let txtboxRect = new Rect();
        txtboxRect.setBy.domRect(this.ucExtends.self.getClientRects()[0]);
       
        this.binder.showAt(txtboxRect);
        this.ll_view.lvUI.currentIndex = this.selectedIndex;
    }
    get hasfocused() {
        return this.ucExtends.self.contains(document.activeElement) ||
            this.ll_view.ucExtends.self.contains(document.activeElement);
    }
    constructor() {
        eval(designer.giveMeHug);
        this.ll_view.init();
        if (this.binder == undefined)
            this.binder = this.bindNew();

        //console.log(this.itemTemplate);
        if (this.itemTemplate == undefined) {

            this.itemTemplate = intenseGenerator.generateTPT('@uccontrols:/controls/comboBox/comboboxItem.tpt', {
                parentUc: this
            });
        }
        this.binder.direction = 'bottom';

        this.binder.bindInputBox(
            {
                elementHT: this.ucExtends.self,
                bindFocusEvents: false
            }
        );

        this.binder.Events.onShow.on(() => {
            this.cmd_drop.setAttribute('isopened', true);
        });
        this.binder.Events.onHide.on(() => {
            this.cmd_drop.setAttribute('isopened', false);
        });

        this.txt_editor.addEventListener("dblclick", (e) => {
            if (this.binder.hasBound) { this.binder.hide(); return; }
            this.openList();
        });

        this.ucExtends.self.addEventListener("keydown", (e) => {
            switch (e.keyCode) {
                case keyBoard.keys.space:
                    this.openComboByEvent(e);
                    break;
                case keyBoard.keys.up:
                    this.binder.fireSelectedIndexChangeEvent = !this.binder.hasBound;
                    this.selectedIndex--;
                    break;
                case keyBoard.keys.down:
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
    openComboByEvent = (e) => {

        if (!this.binder.hasBound) {
            this.openList();
            e.stopImmediatePropagation();
        }
    }
    changeSelectedText() {
        this.txt_editor.innerHTML = "";
        if (this.seletecteditemTemplate == undefined)
            this.txt_editor.appendChild(this.binder.template.extended.generateNode(this.binder.selectedRecord));
        else this.txt_editor.appendChild(this.seletecteditemTemplate.extended.generateNode(this.binder.selectedRecord));
    }

    /** @returns {binderNode}  */
    bindNew() {
        let binder = new binderNode();
        binder.init(this.ll_view);
        return binder;
    }
}
module.exports = combobox;