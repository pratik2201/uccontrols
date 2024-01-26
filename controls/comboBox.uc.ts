import { Rect } from 'ucbuilder/global/drawing/shapes';
import { Template,TemplateNode } from 'ucbuilder/Template';
import {comboboxItem} from 'uccontrols/controls/combobox/comboboxitem.tpt';
import { keyBoard } from 'ucbuilder/global/hardware/keyboard';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';
import { Designer } from './combobox.uc.designer';
import {binderNode} from 'uccontrols/controls/comboBox.uc.binderNode';

export class comboBox extends Designer {
    private _source: any;
    private _itemTemplate: TemplateNode;
    private _seletecteditemTemplate: TemplateNode;
    private _selectedIndex: number;
    private _openOn: ("click" | "dblclick" | "focus" | "enterKey" | "spacebarKey")[];
    private _isOpeinig: boolean;

    public set source(val: any) { this.binder.source = val; }
    public get itemTemplate(): TemplateNode {
        if (this.binder == undefined) return undefined;
        return this.binder.template;
    }
    public set itemTemplate(val: TemplateNode | Template | string) {
        if (this.binder == undefined)
            this.binder = this.bindNew();
        this.binder.template = intenseGenerator.parseTPT(val, this.ucExtends.PARENT);
    }
    public get seletecteditemTemplate(): TemplateNode { return this._seletecteditemTemplate; }
    public set seletecteditemTemplate(value: TemplateNode) {
        this._seletecteditemTemplate = intenseGenerator.parseTPT(value, this.ucExtends.PARENT);
    }
    public get selectedIndex(): number { return this.binder.selectedIndex; }
    public set selectedIndex(val: number) {
        this.binder.selectedIndex = val;
    }
    public static openOptions: "click" | "dblclick" | "focus" | "enterKey" | "spacebarKey" = "click";
    public openOn: ("click" | "dblclick" | "focus" | "enterKey" | "spacebarKey")[] = [];

    public binder: binderNode | undefined;
    private isOpeinig: boolean = false;

    constructor() {
        super(); this.initializecomponent(arguments, this);
        this.ll_view.init();
        if (this.binder == undefined)
            this.binder = this.bindNew();

        if (this.itemTemplate == undefined) {
            this.itemTemplate = intenseGenerator.generateTPT('uccontrols/controls/comboBox/comboboxItem.tpt', {
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
            this.cmd_drop.setAttribute('isopened', 'true');
        });
        this.binder.Events.onHide.on(() => {
            this.cmd_drop.setAttribute('isopened', 'false');
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

    private openList() {
        let txtboxRect = new Rect();
        txtboxRect.setBy.domRect(this.ucExtends.self.getClientRects()[0]);

        this.binder.showAt(txtboxRect);
        this.ll_view.lvUI.currentIndex = this.selectedIndex;
    }

    public hasfocused() {
        return this.ucExtends.self.contains(document.activeElement) ||
            this.ll_view.ucExtends.self.contains(document.activeElement);
    }

    private openComboByEvent = (e: Event) => {
        if (!this.binder.hasBound) {
            this.openList();
            e.stopImmediatePropagation();
        }
    }

    private changeSelectedText() {
        this.txt_editor.innerHTML = "";
        if (this.seletecteditemTemplate == undefined)
            this.txt_editor.appendChild(this.binder.template.extended.generateNode(this.binder.selectedRecord));
        else this.txt_editor.appendChild(this.seletecteditemTemplate.extended.generateNode(this.binder.selectedRecord));
    }

    private bindNew(): binderNode {
        let binder = new binderNode();
        binder.init(this.ll_view);
        return binder;
    }
}