
import { Configuration, NavigatePages } from "uccontrols/controls/lv/ListView.uc.navigate";
import { SourceIndexElementAttr, RowInfo } from "ucbuilder/global/datasources/SourceManage";
import { ListView } from "uccontrols/controls/lv/ListView.uc";

export class nodeHandler {
  navigate: NavigatePages;
  config: Configuration;
  allItemHT: NodeListOf<HTMLElement>;
  private _main :ListView;
  get main() {
    return this._main;
  }
  public set main(value) {
    this._main = value;
    this.navigate = this.main.navigate;
    this.config = this.navigate.config;
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
    /// console.log('fill...called');

    let curIndex = _records.currentIndex;
    for (let index = _records.top, len = _records.bottomIndex; index <= len; index++) {
      ht = this.append(index);

      if (index == curIndex)
        this.main.currentIndex = index;
    }
  };
  generateElement(index: number): { hasGenerated: boolean, element: HTMLElement } {
    let hasGenerated = false;
    let element: HTMLElement = undefined;
    let src = this.main.source;
    let obj = src[index];    
    let row = src.getRowByObj(obj);
    
    if (row != undefined) {
      hasGenerated = row.isModified;
      
      element = hasGenerated ? this.getNode(index) : row.element;
      row.isModified = false;
      row.index = index;
      row.element = element;
    } else {
     // console.log('----NEW `RowInfo` ADDED----');
      console.warn('----NEW `RowInfo` ADDED----');      
      element = this.getNode(index);
      hasGenerated = true;
      row = new RowInfo();
      row.element = element;
      row.index = index;
      row.row = obj;
      src.setRow(index, row);
    }
    console.log([hasGenerated, (this.config.top)]);
    
    element.setAttribute('x-tabindex', ''+(index - this.config.top));
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
      itemNode.element.data(SourceIndexElementAttr, index);
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
      itemNode.element.data(SourceIndexElementAttr, index);
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