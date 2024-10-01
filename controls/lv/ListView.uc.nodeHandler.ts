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

  prepend(index: number, replaceNode: boolean = false): HTMLElement {
    let itemNode = this.getNode(index);
    itemNode.data(pagerATTR.itemIndex, index);
    let allHT = this.allItemHT;
    if (allHT.length == 0)
      this.main.ll_view.appendChild(itemNode);
    else {
      if (!replaceNode) {
        this.main.ll_view.prepend(itemNode);
      } else {
        allHT[index].replaceWith(itemNode);
      }
    }
    this.main.Events.newItemGenerate.fire([itemNode, index]);
    return itemNode;
  }
  append(index: number, replaceNode: boolean = false): HTMLElement {
    let itemNode = this.getNode(index);
    itemNode.data(pagerATTR.itemIndex, index);
    
    let allHT = this.allItemHT;
    if (allHT.length == 0)
      this.main.ll_view.appendChild(itemNode);
    else {
      if (!replaceNode) {
        this.main.ll_view.append(itemNode);
      } else {
        allHT[index].replaceWith(itemNode);
      }
    }
    this.main.Events.newItemGenerate.fire([itemNode, index]);
    return itemNode;
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