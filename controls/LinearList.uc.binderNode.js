const { commonEvent } = require("@ucbuilder:/global/commonEvent");
const { Rect } = require("@ucbuilder:/global/drawing/shapes");
const { Template } = require("@ucbuilder:/Template");
const LinearList = require("@uccontrols:/controls/LinearList.uc");
const { positionar } = require("@uccontrols:/controls/LinearList.uc.positionar");
const { keyBoard } = require("@ucbuilder:/global/hardware/keyboard");

class binderNode {
    constructor() {

    }
    /**
     * 
     * @param {number} index 
     * @param {MouseEvent} evt 
     */
    itemMouseUp_listner = (index, evt) => {
        this.selectedIndex = index;
        this.hide();
        this.dontOpen = true;
        this.boundElement.focus();
        this.dontOpen = false;
        evt.stopImmediatePropagation();

    }
    /**
     * @param {{
     *  elementHT :HTMLElement,
     *  bindUpDownKeys :boolean,
     *  bindFocusEvents :boolean
     * }} param0 
     */
    bindInputBox = ({
        elementHT = undefined,
        bindUpDownKeys = true,
        bindFocusEvents = true,
    } = {}) => {
        this.boundElement = elementHT;
        if (bindUpDownKeys) {
            this.Events.onShow.on(() => {
                elementHT.addEventListener("keydown", this.main.lvUI.keydown_listner);
                this.main.Events.itemMouseUp.on(this.itemMouseUp_listner);
                elementHT.addEventListener("keyup", this.keyup_listner);

            });
            this.Events.onHide.on(() => {
                elementHT.removeEventListener("keydown", this.main.lvUI.keydown_listner);
                this.main.Events.itemMouseUp.off(this.itemMouseUp_listner);
                elementHT.removeEventListener("keyup", this.keyup_listner);
            });
        }
        if (bindFocusEvents) {
            elementHT.addEventListener("focusin", (e) => {
                let txtboxRect = new Rect();
                txtboxRect.setBy.domRect(e.target.getClientRects()[0]);
                this.showAt(txtboxRect);
            });
            elementHT.addEventListener("mousedown", (e) => {
                if (!document.activeElement.is(e.target) || this.hasBound) return;
                let txtboxRect = new Rect();
                txtboxRect.setBy.domRect(e.target.getClientRects()[0]);
                this.showAt(txtboxRect);
            });
        }

        elementHT.addEventListener("blur", (e) => {
            setTimeout(() => {
                this.mousedown_focus_listner(e);
            }, 0);
        });
    }

    
    /** @private */
    _selectedIndex = -1;
    get selectedRecord() { return this.filteredSource[this._selectedIndex]; };
    get selectedItem() { return this.main.Records.itemAt(this._selectedIndex); }
    get selectedIndex() { return this._selectedIndex; }
    set selectedIndex(val) {
        //  if (this.hasBound) {
        /** @type {HTMLElement}  */
        let node = undefined;
        if (val >= 0 && val <= this.filteredSource.length) {
            let oIndex = this.selectedIndex;
            node = this.selectedItem;
            if (node != undefined)
                node.setAttribute('is-selected', '0');
            this._selectedIndex = val;
            node = this.selectedItem;
            if (node != undefined)
                node.setAttribute('is-selected', '1');
            this.Events.selectedIndexChange.fire(val, oIndex);
        }
        // }
    }

    /** @type {Template}  */
    template = undefined;
    
    _source = [];
    filteredSource = [];
    set source(val) {
        this._source = val;
        this.filteredSource = [];
        this.filteredSource = [...val];
    }
    /** @type {LinearList}  */
    main = undefined;
    /** @type {positionar}  */
    position = undefined;
    /** @param {LinearList} main */
    init(main) {
        this.main = main;

        this.position = new positionar();
        this.position.init(this.main.ucExtends.self);
    }
    Events = {
        /**
         * @type {{on:(callback = (
         *          newindex:number,
         *          oldIndex:number,
         * ) =>{})} & commonEvent}
         */
        selectedIndexChange: new commonEvent(),
        /**
         * @type {{on:(callback = (
         * ) =>{})} & commonEvent}
         */
        onShow: new commonEvent(),
        /**
         * @type {{on:(callback = (
         * ) =>{})} & commonEvent}
         */
        onHide: new commonEvent(),
        /** @param {HTMLElement} target  @returns */
        isOutOfTarget: (target) => { return true; },
    };
    /** @type {HTMLElement[]}  */
    allowedElementList = [];
    /** @param {HTMLElement} tar */
    isOutOfTarget(tar) {
        
        return (!this.main.ucExtends.self.contains(tar)
            && this.allowedElementList.findIndex(s => s.is(tar)) == -1
            && this.Events.isOutOfTarget(tar));
    }
    /**  @param {MouseEvent|FocusEvent} e  */
    mousedown_focus_listner = (e) => {

        if (this.isOutOfTarget(document.activeElement)) this.hide();
    }
    /** @param {KeyboardEvent} evt */
    keyup_listner = (evt) => {
        switch (evt.keyCode) {
            case keyBoard.keys.enter:
                this.selectedIndex = this.main.lvUI.currentIndex;
                this.hide();
                evt.preventDefault();
                break;
        }
        //this.selectedIndex = index;
        //this.hide();
    }
    hasBound = false;
    get direction() { return this.position.direction; }
    set direction(val) { this.position.direction = val; }
    dontOpen = false;
    /** @param {Rect} txtboxRect */
    showAt(txtboxRect) {
        this.main.itemTemplate = this.template;
        console.log('here');
        this.main.source.rows = this.filteredSource;
        this.main.Records.fill();
        this.main.lvUI.currentIndex = this.main.lvUI.currentIndex;
        
        this.hasBound = true;
        this.selectedIndex = this.selectedIndex;
        this.Events.onShow.fire();
        this.position.show(txtboxRect);

    }
    verticalMinHeight = 15;
    horizontalMinHeight = 15;
    hide() {
        this.hasBound = false;
        this.Events.onHide.fire();
        //setTimeout(() => {
        Object.assign(this.main.ucExtends.self.style, {
            'visibility': 'collapse',
        });

        // }, 1);

    }

}
module.exports = { binderNode };