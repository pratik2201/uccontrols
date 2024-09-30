import { CommonEvent } from "ucbuilder/global/commonEvent";
export interface ListViewItemInfo{
  row: object,
  element: HTMLElement,
  index : number
}
export class SourceManage extends Array {
  /*_rows: any[] = [];
  get rows(): any[] { return this._rows; }
  set rows(value: any[]) {
    this._rows = value;
  } 
  clear() {
    this._rows.length = 0;
    
  }*/
  /*push(value: any[], atIndex: number = -1) {
    if (atIndex == -1)
      this._rows.push(...value);
    else
      this._rows.splice(atIndex, 0, ...value);
    this.update();
  }*/

  clear() {
    this.length = 0;
    this.update();
  }
  update() {
    this.onUpdate.fire([this.length]);
  }
  onUpdate = new CommonEvent<(arrayLen: number) => void>();
};