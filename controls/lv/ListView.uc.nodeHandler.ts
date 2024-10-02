import { R } from "uccontrols/R";
import { NavigatePages } from "./ListView.uc.navigate";
import { uniqOpt } from "ucbuilder/build/common";

export const pagerATTR = Object.freeze({
  itemIndex: "itmIndx" + uniqOpt.randomNo()
})
export class nodeHandler {
  private _main = R.controls.lv.ListView.type;
  public get main() {
    return this._main;
  }
  navigate: NavigatePages;
  allItemHT: NodeListOf<HTMLElement>;
  public set main(value) {
    this._main = value;
    this.navigate = value.navigate;
    this.allItemHT = this.main.ll_view.childNodes as NodeListOf<HTMLElement>;
  }
  public clear(): void {
    this.main.ll_view.innerHTML = "";
    this.main.Events.onClearContainer.fire();
  };
  public fill(): void {
    let _records = this.main.navigate.config;
    this.clear();
    let ht: HTMLElement;
    let curIndex = this.navigate.config.currentIndex;
      for (let index = _records.top, len = _records.minBottomIndex; index <= len; index++) {
      ht = this.append(index);
      
      if (index == curIndex)
        this.main.currentIndex = index;
    }

  };
  generateElement(index: number): { hasGenerated: boolean, element: HTMLElement } {
    let hasGenerated = false;
    let element: HTMLElement = undefined;
    let src = this.main.source;
    let row = src.rowInfo[index];
    if (row != undefined) {
      hasGenerated = row.isModified;
      element = hasGenerated ? this.getNode(index) : row.element;
      row.isModified = false;
      row.index = index;      
    } else {
      element = this.getNode(index);
      hasGenerated = true;
      src.rowInfo[index] = {
        element: element,
        isModified: false,
        index:index,
      }
    }
    return {
      hasGenerated: hasGenerated,
      element: element
    }
  }
  prepend(index: number, replaceNode: boolean = false): HTMLElement {
    let itemNode = this.generateElement(index);
   
    let allHT = this.allItemHT;
    if (allHT.length == 0)
      this.main.ll_view.appendChild(itemNode.element);
    else {
      if (!replaceNode) {
        this.main.ll_view.prepend(itemNode.element);
      } else {
        allHT[index].replaceWith(itemNode.element);
      }
    }
    if (itemNode.hasGenerated) {
      itemNode.element.data(pagerATTR.itemIndex, index);    
      this.main.Events.newItemGenerate.fire([itemNode.element, index]);
    }
    return itemNode.element;
  }
  append(index: number, replaceNode: boolean = false): HTMLElement {
    let itemNode = this.generateElement(index);
    let allHT = this.allItemHT;
    if (allHT.length == 0)
      this.main.ll_view.appendChild(itemNode.element);
    else {
      if (!replaceNode) {
        this.main.ll_view.append(itemNode.element);
      } else {
        allHT[index].replaceWith(itemNode.element);
      }
    }
    if (itemNode.hasGenerated) {
      itemNode.element.data(pagerATTR.itemIndex, index);
      this.main.Events.newItemGenerate.fire([itemNode.element, index]);
    }
    return itemNode.element;
  }
  itemAt = (index: number) => {
    return this.allItemHT[index];
  }
  getItemFromChild(ele: HTMLElement): HTMLElement {
    let _container = this.main.ll_view;
    while (true) {
      if (ele.parentElement == null) {
        return null;
      } else if (_container.is(ele.parentElement)) {
        return ele;
      } else {
        ele = ele.parentElement;
      }
    }
  }
  getNode(index: number): HTMLElement {
    return this.main.itemTemplate.extended.generateNode(this.main.source[index]);
  }
}