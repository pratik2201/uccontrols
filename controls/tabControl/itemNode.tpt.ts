import { looping } from 'ucbuilder/build/common.js';
import { DragHelper } from 'ucbuilder/global/drag/DragHelper';
import { tabControl } from 'uccontrols/controls/tabControl.uc';
import { dropIndictors } from 'uccontrols/controls/tabControl/itemNode.tpt.enumAndMode.js';
import { ResourcesUC } from 'ucbuilder/ResourcesUC.js';
import { Usercontrol } from 'ucbuilder/Usercontrol.js';
import { Designer } from './itemNode.tpt.designer';

export class itemNode extends Designer {
    main: tabControl;
    dragVisibility(isVisible: boolean, tarEle: HTMLElement): void {
        if (isVisible) {
            dropIndictors.asArray.forEach(s => {
                tarEle.appendChild(s);
                s.style.visibility = "visible";
            });
            this.primary.extended.stampRow.passElement(dropIndictors.asArray);
        } else {
            dropIndictors.asArray.forEach(s => s.style.visibility = "hidden");
        }
    }
    draging = new DragHelper();
    static dragHereElement: HTMLElement = document.createElement('ele');
    init(main: tabControl): void {
        this.main = main;

        this.draging.dragEnter((/*htEle,*/ev) => {
            let ht: HTMLElement = ev.target as HTMLElement;
            ht = ht.closest(`[role="tabbutton"]`);
            if (ht != undefined) {
                itemNode.dragHereElement.setAttribute('drag-here', 'no');
                itemNode.dragHereElement = ht;
                itemNode.dragHereElement.setAttribute('drag-here', 'ok');
            } else {
                itemNode.dragHereElement.setAttribute('drag-here', 'no');
            }
        }, [this.main.tabHeader]);
        this.draging.dragDrop((/*htEle,*/ev) => {
            let dta = DragHelper.draggedData;
            if (dta.type == "uc") {
                try {
                    let htE = ev.target as HTMLElement;
                    let index = -1;
                    let ht = htE.closest(`[role="tabbutton"]`);
                    if (ht != undefined) index = htE.index();
                    let uc = dta.data as Usercontrol;
                    this.main.pushUc(uc, { atIndex: index });

                    DragHelper.dragResult = this.dragButtonIndex == -1;
                } catch (exc) {
                    DragHelper.dragResult = false;
                }
            }
        }, [this.main.tabHeader]);


        this.primary.extended.Events.onGenerateNode = (mainnode: HTMLElement, json: any) => {
            mainnode.addEventListener("mouseup", this.mouseup_listner);
            mainnode.addEventListener("dblclick", this.dblclick_listner);
            mainnode.setAttribute("role", "tabbutton");

            let ctrls = this.primary.getAllControls(mainnode);

            ctrls.btn_close.addEventListener("mousedown", (e) => {
                let index = mainnode.index();
                let uc = ResourcesUC.getBaseObject(this.main.tabView.children.item(index) as HTMLElement);
                uc.ucExtends.destruct();
            });
            DragHelper.DRAG_ME(mainnode,
                (evt: MouseEvent) => {
                    this.dragButtonIndex = mainnode.index();
                    let uc = ResourcesUC.getBaseObject(this.main.tabView.children.item(this.dragButtonIndex) as HTMLElement);
                    return {
                        type: "uc",
                        data: uc,
                    };
                },
                (evt: MouseEvent) => {
                    let idx = this.dragButtonIndex;
                    this.dragButtonIndex = -1;
                    if (DragHelper.dragResult === true) {
                        this.removeAt(idx, false);
                    }

                });
        };
    }
    dragButtonIndex = -1;
    removeAt(index: number, removeView: boolean = true): void {
        if (removeView) this.main.tabView.children.item(index).remove();
        this.main.SESSION_DATA.tabChild.splice(index, 1);
        this.main.refreshTabHeader();
        let ni = Math.max(--index, 0);
        this.setActive(ni);
    }
    dblclick_listner = (ev: MouseEvent): void => {
        let index = (ev.currentTarget as HTMLElement).index();
        let uc = ResourcesUC.getBaseObject(this.main.tabView.children.item(index) as HTMLElement);

        if (this.primary.extended.Events.onDataExport({
            type: 'uc',
            data: uc,
        }) === true) {
            this.removeAt(index, false);
        }
    }
    mouseup_listner = (ev: MouseEvent): void => {
        let index = (ev.currentTarget as HTMLElement).index();
        this.setActive(index);
        (this.main.tabView.children.item(index) as HTMLElement).focus();
    }

    setActive(index: number): void {
        try {
            looping.htmlChildren(this.main.tabView, s => {
                s.style.visibility = "collapse";
                s.style.height = "0px";
                s.style.width = "0px";
            });
            looping.htmlChildren(this.main.tabHeader, s => {
                s.setAttribute("active", "0");
            });
            if (index < this.main.length) {
                let ele = this.main.tabView.children.item(index) as HTMLElement;
                ele.style.visibility = "visible";
                ele.style.height = "100%";
                ele.style.width = "100%";
                ele.setAttribute("active", "1");
                this.main.tabHeader.children.item(index).setAttribute("active", "1");
                this.main.SESSION_DATA.activeIndex = index;
                this.main.ucExtends.session.onModify();
            }
        } catch (e) {
            console.log(e);
        }
    }
}