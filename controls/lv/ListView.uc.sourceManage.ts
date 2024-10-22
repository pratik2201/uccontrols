import { CommonEvent } from "ucbuilder/global/commonEvent";
export interface ListViewItemInfo {
  row: object,
  element: HTMLElement,
  index: number
}export interface BasicSize {
  width: number,
  height: number
}
export interface RowInfo {
  element: HTMLElement,
  isModified: boolean,
  size?: BasicSize,
  index: number
}
type IndexType = "isAtLast" | "isAtTop" | "continue";
export class SourceManage<K> extends Array<K> {
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
  allElementSize: BasicSize = {
    width: 0,
    height: 0
  }
  clear() {
    this.length = 0;
    this.rowInfo.length = 0;
    //this.update();
  }
  getBottomIndex(topIndex: number, containerHeight: number): { index: number, status: IndexType } {
    let h = 0;
    let index = topIndex;
    let obj: RowInfo;
    // console.log(`[${containerHeight}]`);
    index = topIndex - 1;
    do {
      index++;
      obj = this.rowInfo[index];
      if (!obj) break;
      h += obj.size.height;
    } while (h < containerHeight);
    index -= 1;
    let len = this.length;
    return {
      index: index < 0 ? len : index,
      status: index == len - 1 ? "isAtLast" : "continue",
    }
  }
  getTopIndex(botomIndex: number, containerHeight: number): { index: number, status: IndexType } {
    let h = 0;
    let index = botomIndex;
    let obj: RowInfo;
    //console.log(`[${containerHeight}]`);
    index = botomIndex;
    do {
      index--;
      obj = this.rowInfo[index];
      if (!obj) break;
      h += obj.size.height;
    } while (h < containerHeight);
    index += 1;
    let len = this.length;
    //return index >= len ? len - 1 : index;
    return {
      index: index >= len ? 0 : index,
      status: index == 0 ? "isAtTop" : "continue",
    }
  }
  loop_RowInfo(callback = (row: K, info: RowInfo, index: number) => { }) {
    let rInfo: RowInfo;
    console.log('loop_RowInfo...called');
    let w: number, h: number;
    for (let i = 0, len = this.length; i < len; i++) {
      rInfo = this.rowInfo[i];
      if (rInfo == undefined) {
        rInfo = {
          element: undefined,
          isModified: false,
          size: { width: 0, height: 0 },
          index: i,
        }
        this.rowInfo[i] = rInfo;
      }
      callback(this[i], rInfo, i);
      h += rInfo.size.height;
      w = Math.max(w, rInfo.size.width);
    }
    this.allElementSize = {
      width: w,
      height: h
    };
  }
  update(...indexes) {
    let len = this.length;
    if (indexes.length == 0)
      this.rowInfo = new Array(len);
    else for (let i = 0; i < indexes.length; i++) {
      let row = this.rowInfo[indexes[i]];
      if (row != undefined) row.isModified = true;
    }
    this.onUpdate.fire([len]);
    //console.log(this.rowInfo);

  }
  onUpdate = new CommonEvent<(arrayLen: number) => void>();
};