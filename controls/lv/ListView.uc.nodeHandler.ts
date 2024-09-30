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
    this.allItemHT = this.main.ll_view.childNodes as NodeListOf<HTMLElement>;
  }
  public clear(): void {
    this.main.ll_view.innerHTML = "";
    this.main.Events.onClearContainer.fire();
  };
  public fill(): void {
    let _records = this.main.navigate.config;
    this.clear();
    for (let index = _records.top, len = _records.minBottomIndex; index <= len; index++)
      this.append(index);
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
    itemNode.setAttribute('iscurrent', '0');
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


  loopVisibleRows(callback: (ele: HTMLElement) => boolean = (ele) => { return true; }): void {
    let _chldrns = this.main.ll_view.children;
    let cIndex = this.navigate.config.currentIndex;
    for (let index = 0; index < _chldrns.length; index++) {
      const element = _chldrns[index] as HTMLElement;
      //let itemindex = parseInt(element.data(pagerATTR.itemIndex));
      //element.setAttribute('isCurrent', (itemindex == cIndex) ? '1' : '0');
      if (!callback(element)) return;
    }
  };
  onRendar(): void {
    this.loopVisibleRows((ele) => {
      return true;
    });
  }
  __doactualRendar(): void {
    this.onRendar();
    // this.nodes.refreshHiddenCount();
  }
  render(): void {
    this.__doactualRendar();
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