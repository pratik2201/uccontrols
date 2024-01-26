"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemNode = void 0;
const common_js_1 = require("ucbuilder/build/common.js");
const DragHelper_1 = require("ucbuilder/global/drag/DragHelper");
const itemNode_tpt_enumAndMode_js_1 = require("uccontrols/controls/tabControl/itemNode.tpt.enumAndMode.js");
const itemNode_tpt_designer_js_1 = require("./itemNode.tpt.designer.js");
const ResourcesUC_js_1 = require("ucbuilder/ResourcesUC.js");
class itemNode extends itemNode_tpt_designer_js_1.Designer {
    constructor() {
        super(...arguments);
        this.draging = new DragHelper_1.DragHelper();
        this.dragButtonIndex = -1;
        this.dblclick_listner = (ev) => {
            let index = ev.currentTarget.index();
            let uc = ResourcesUC_js_1.ResourcesUC.getBaseObject(this.main.tabView.children.item(index));
            if (this.primary.extended.Events.onDataExport({
                type: 'uc',
                data: uc,
            }) === true) {
                this.removeAt(index, false);
            }
        };
        this.mouseup_listner = (ev) => {
            let index = ev.currentTarget.index();
            this.setActive(index);
            this.main.tabView.children.item(index).focus();
        };
    }
    dragVisibility(isVisible, tarEle) {
        if (isVisible) {
            itemNode_tpt_enumAndMode_js_1.dropIndictors.asArray.forEach(s => {
                tarEle.appendChild(s);
                s.style.visibility = "visible";
            });
            this.primary.extended.stampRow.passElement(itemNode_tpt_enumAndMode_js_1.dropIndictors.asArray);
        }
        else {
            itemNode_tpt_enumAndMode_js_1.dropIndictors.asArray.forEach(s => s.style.visibility = "hidden");
        }
    }
    init(main) {
        this.main = main;
        this.draging.dragEnter((htEle, ev) => {
            let ht = ev.target;
            ht = ht.closest(`[role="tabbutton"]`);
            if (ht != undefined) {
                itemNode.dragHereElement.setAttribute('drag-here', 'no');
                itemNode.dragHereElement = ht;
                itemNode.dragHereElement.setAttribute('drag-here', 'ok');
            }
            else {
                itemNode.dragHereElement.setAttribute('drag-here', 'no');
            }
        }, [this.main.tabHeader]);
        this.draging.dragDrop((htEle, ev) => {
            let dta = DragHelper_1.DragHelper.draggedData;
            if (dta.type == "uc") {
                try {
                    let htE = ev.target;
                    let index = -1;
                    let ht = htE.closest(`[role="tabbutton"]`);
                    if (ht != undefined)
                        index = htE.index();
                    let uc = dta.data;
                    this.main.pushUc(uc, { atIndex: index });
                    DragHelper_1.DragHelper.dragResult = this.dragButtonIndex == -1;
                }
                catch (exc) {
                    DragHelper_1.DragHelper.dragResult = false;
                }
            }
        }, [this.main.tabHeader]);
        this.primary.extended.Events.onGenerateNode = (mainnode, json) => {
            mainnode.addEventListener("mouseup", this.mouseup_listner);
            mainnode.addEventListener("dblclick", this.dblclick_listner);
            mainnode.setAttribute("role", "tabbutton");
            let ctrls = this.primary.getAllControls(mainnode);
            ctrls.btn_close.addEventListener("mousedown", (e) => {
                let index = mainnode.index();
                let uc = ResourcesUC_js_1.ResourcesUC.getBaseObject(this.main.tabView.children.item(index));
                uc.ucExtends.destruct();
            });
            DragHelper_1.DragHelper.DRAG_ME(mainnode, (evt) => {
                this.dragButtonIndex = mainnode.index();
                let uc = ResourcesUC_js_1.ResourcesUC.getBaseObject(this.main.tabView.children.item(this.dragButtonIndex));
                return {
                    type: "uc",
                    data: uc,
                };
            }, (evt) => {
                let idx = this.dragButtonIndex;
                this.dragButtonIndex = -1;
                if (DragHelper_1.DragHelper.dragResult === true) {
                    this.removeAt(idx, false);
                }
            });
        };
    }
    removeAt(index, removeView = true) {
        if (removeView)
            this.main.tabView.children.item(index).remove();
        this.main.SESSION_DATA.tabChild.splice(index, 1);
        this.main.refreshTabHeader();
        let ni = Math.max(--index, 0);
        this.setActive(ni);
    }
    setActive(index) {
        try {
            common_js_1.looping.htmlChildren(this.main.tabView, s => {
                s.style.visibility = "collapse";
                s.style.height = "0px";
                s.style.width = "0px";
            });
            common_js_1.looping.htmlChildren(this.main.tabHeader, s => {
                s.setAttribute("active", "0");
            });
            if (index < this.main.length) {
                let ele = this.main.tabView.children.item(index);
                ele.style.visibility = "visible";
                ele.style.height = "100%";
                ele.style.width = "100%";
                ele.setAttribute("active", "1");
                this.main.tabHeader.children.item(index).setAttribute("active", "1");
                this.main.SESSION_DATA.activeIndex = index;
                this.main.ucExtends.session.onModify();
            }
        }
        catch (e) {
            console.log(e);
        }
    }
}
exports.itemNode = itemNode;
itemNode.dragHereElement = document.createElement('ele');
