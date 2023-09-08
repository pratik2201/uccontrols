const { objectOpt } = require('@ucbuilder:/build/common.js');
const { Rect } = require('@ucbuilder:/global/drawing/shapes.js');
const { Template } = require('@ucbuilder:/Template.js');
const comboboxItem = require('@uccontrols:/controls/combobox/comboboxitem.tpt.js');
const { keyBoard } = require('@ucbuilder:/global/hardware/keyboard.js');
const { intenseGenerator } = require('@ucbuilder:/intenseGenerator.js');
const { designer } = require('./combobox.uc.designer.js');
/**
* @typedef {import ("@uccontrols:/controls/LinearList.uc.binderNode").binderNode} binderNode
*/
class combobox extends designer {
    set source(val) { this.binder.source = val; }
    get itemTemplate() {
        if (this.binder == undefined) return undefined;
        return this.binder.template;
    }
    /** @type {binderNode}  */
    binder = undefined;
    /** @type {Template}  */
    set itemTemplate(val) {
        if (this.binder == undefined)
            this.binder = this.ll_view.bindNew();
        this.binder.template = intenseGenerator.parseTPT(val, this.ucExtends.PARENT);
    }
    /** @type {Template}  */
    _seletecteditemTemplate = undefined;
    get seletecteditemTemplate() { return this._seletecteditemTemplate; }
    set seletecteditemTemplate(value) {
        this._seletecteditemTemplate = intenseGenerator.parseTPT(value, this.ucExtends.PARENT);
    }
    set selectedIndex(val) {
        this.binder.selectedIndex = val;
        //this.ll_view.lv_items.lvUI.currentIndex = val;
        //this.binder.template.extended.generateNode(val);
        //this.binder.selectedIndex
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
    }
    get hasfocused() {
        return this.ucExtends.self.contains(document.activeElement) ||
            this.ll_view.ucExtends.self.contains(document.activeElement);
    }
    constructor() {
        //eval(designer.giveMeHug);



        let evalExp = /\(@([\w.]*?)\)/gim;
        arguments[arguments.length - 1].source.beforeContentAssign = (content) => {
            let rtrn = content.replace(evalExp,
                (match, namespacetoObject, offset, input_string) => {
                    return eval(namespacetoObject);
                });
            return rtrn;
        };
        super(arguments);
        Array.from(this.ucExtends.self.attributes)
            .filter(s => s.nodeName.startsWith("x:"))
            .forEach(p => {
                let atr = p.nodeName.slice(2);
                let v = p.value.startsWith("=") ? "'" + p.value.slice(1) + "'" : p.value;
                let cv = designer.setChildValueByNameSpace(this, atr, eval(v));
                if (!cv)
                    console.log("'" + atr + "' property not set from designer");
            });


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
        /*this.cmd_drop.addEventListener("mousedown", (e) => {
            if (this.binder.hasBound) { this.binder.hide(); return; }
            this.openList();
            e.stopImmediatePropagation();
        });*/
        this.ucExtends.self.on("keyup mouseup", (e) => {
            switch (objectOpt.getClassName(e)) {
                case KeyboardEvent.name:
                    this.ucExtends.self.focus();
                    break;
            }
            if (!this.binder.hasBound) {
                this.openList();

                e.stopImmediatePropagation();
            }
        });
        this.ucExtends.self.addEventListener("keyup", (e) => {
            if (e.keyCode == keyBoard.keys.space) {
                if (this.binder.hasBound) { this.binder.hide(); return; }
                this.openList();
                e.preventDefault();
            }
        });
        this.binder.Events.selectedIndexChange.on((ninex, oindex) => {
            let selRec = this.binder.selectedRecord;
            this.txt_editor.innerHTML = "";
            //console.log(this.binder.template);
            //console.log(this.seletecteditemTemplate);
            if (this.seletecteditemTemplate == undefined)
                this.txt_editor.appendChild(this.binder.template.extended.generateNode(this.binder.selectedRecord));
            else this.txt_editor.appendChild(this.seletecteditemTemplate.extended.generateNode(this.binder.selectedRecord));


        });
        /* this.cmd_drop.addEventListener("mouseup",()=>{
             this.txt_editor.focus();
         })*/
    }
}
module.exports = combobox;