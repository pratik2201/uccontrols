import { CommonEvent } from "ucbuilder/global/commonEvent";
export interface ListViewItemInfo {
  row: object,
  element: HTMLElement,
  index: number
}
export interface RowInfo {
  element: HTMLElement,
  isModified: boolean,
  index: number
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
  rowInfo: RowInfo[] = [];
  clear() {
    this.length = 0;
    this.update();
  }
  update(...indexes) {
    let len = this.length;
    if(indexes.length==0)
      this.rowInfo = new Array(len);
    else for (let i = 0; i < indexes.length; i++) {
      let row = this.rowInfo[indexes[i]];
      if (row!=undefined) row.isModified = true;
    }
    this.onUpdate.fire([len]);
    //console.log(this.rowInfo);

  }
  onUpdate = new CommonEvent<(arrayLen: number) => void>();
};