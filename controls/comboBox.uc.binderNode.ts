import { CommonEvent } from "ucbuilder/global/commonEvent";
import { Rect } from 'ucbuilder/global/drawing/shapes.js';
import { Template, TemplateNode } from "ucbuilder/Template";
import {LinearList} from "uccontrols/controls/LinearList.uc";
import { Positionar } from "uccontrols/controls/comboBox.uc.positionar";
import { keyBoard } from "ucbuilder/global/hardware/keyboard";

export class binderNode {
    private boundElement: HTMLElement;
    private hasMouseDownedOnItem: boolean = false;
    private _selectedIndex: number = -1;
    private _source: any[] = [];
    private filteredSource: any[] = [];
    private main: LinearList;
    private position: Positionar;
    public fireSelectedIndexChangeEvent: boolean = true;
    template: TemplateNode;
    private allowedElementList: HTMLElement[] = [];
    public hasBound: boolean = false;
    public direction: string = "";
    private dontOpen: boolean = false;
    private verticalMinHeight: number = 15;
    private horizontalMinHeight: number = 15;

    constructor() {}

    public itemMouseUp_listner = (index: number, evt: MouseEvent): void => {
        this.hasMouseDownedOnItem = false;
        this.dontOpen = true;
             
        this.boundElement?.focus();
        this.dontOpen = false;
        this.hide();
        
        if (this.selectedIndex != index)
            this.selectedIndex = index;
        evt.stopImmediatePropagation();
    }

    public itemMouseDown_listner = (index: number, evt: MouseEvent): void => {
        this.hasMouseDownedOnItem = true;
    }

    public bindInputBox = ({
        elementHT = undefined,
        bindUpDownKeys = true,
        bindFocusEvents = true,
    }: {
        elementHT?: HTMLElement | undefined,
        bindUpDownKeys?: boolean,
        bindFocusEvents?: boolean,
    } = {}): void => {
        this.boundElement = elementHT;
        if (bindUpDownKeys) {
            this.Events.onShow.on(() => {
                elementHT?.addEventListener("keydown", this.main.lvUI.keydown_listner);
                this.main.Events.itemMouseUp.on(this.itemMouseUp_listner);
                this.main.Events.itemMouseDown.on(this.itemMouseDown_listner);
                elementHT?.addEventListener("keydown", this.keyup_listner);
                this.boundElement?.focus();
            });
            this.Events.onHide.on(() => {
                elementHT?.removeEventListener("keydown", this.main.lvUI.keydown_listner);
                this.main.Events.itemMouseUp.off(this.itemMouseUp_listner);
                this.main.Events.itemMouseDown.off(this.itemMouseDown_listner);
                elementHT?.removeEventListener("keydown", this.keyup_listner);
            });
        }
        if (bindFocusEvents) {
               
            elementHT?.addEventListener("focusin", (e) => {
                let txtboxRect = new Rect();
                txtboxRect.setBy.domRect((e.target as HTMLElement).getClientRects()[0]);
                this.showAt(txtboxRect);
            });
            elementHT?.addEventListener("mousedown", (e) => {
                let htE = e.target as HTMLElement;
                
                if (!document.activeElement.is(htE) || this.hasBound) return;
                let txtboxRect = new Rect();
                txtboxRect.setBy.domRect(htE.getClientRects()[0]);
                this.showAt(txtboxRect);
            });
        }
        elementHT?.addEventListener("blur", (e) => {
            this.mousedown_focus_listner(e);
        });
    }

    get selectedRecord(): any { return this.filteredSource[this._selectedIndex]; }
    get selectedItem(): any { return this.main.Records.itemAt(this._selectedIndex); }
    get selectedIndex(): number { return this._selectedIndex; }
    set selectedIndex(val: number) {
        let node: HTMLElement | undefined = undefined;
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
            else this.fireSelectedIndexChangeEvent = true;
        }
    }

    set source(val: any[]) {
        this._source = val;
        this.filteredSource = [];
        this.filteredSource = [...val];
    }

    public init(main: LinearList): void {
        this.main = main;
        this.position = new Positionar();
        this.position.init(this.main.ucExtends.self);
    }

    public Events = {
        selectedIndexChange: new CommonEvent<(newindex:number,oldIndex:number)=>void>(),
        onShow: new CommonEvent<()=>void>(),
        onHide: new CommonEvent<()=>void>(),
        isOutOfTarget: (target: Element|HTMLElement): boolean => { return true; },
    };

    public isOutOfTarget(tar: Element|HTMLElement): boolean {
        let res = (!this.hasMouseDownedOnItem &&
            !this.main.ucExtends.self.contains(tar)
            && this.allowedElementList.findIndex(s => s.is(tar)) == -1
            && this.Events.isOutOfTarget(tar));
        return res;
    }

    public mousedown_focus_listner = (e: MouseEvent | FocusEvent): void => {
        if (this.isOutOfTarget(document.activeElement)) this.hide();
    }

    public keyup_listner = (evt: KeyboardEvent): void => {
        switch (evt.keyCode) {
            case keyBoard.keys.enter:
                this.fireSelectedIndexChangeEvent = true;
                this.selectedIndex = this.main.lvUI.currentIndex;
                this.hide();
                evt.preventDefault();
                break;
        }
    }

    public showAt(txtboxRect: Rect): void {
       
        this.main.itemTemplate = this.template;
        this.main.source.rows = this.filteredSource;
        this.main.nodes.fill();
        this.main.lvUI.currentIndex = this.main.lvUI.currentIndex;
        this.hasBound = true;
        this.selectedIndex = this.selectedIndex;
        this.Events.onShow.fire();
        this.position?.show(txtboxRect);
    }

    public hide(): void {
        this.hasBound = false;
        this.Events.onHide.fire();
        Object.assign(this.main.ucExtends.self.style, {
            'visibility': 'collapse',
        });
    }
}