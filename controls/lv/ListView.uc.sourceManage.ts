import { uniqOpt } from "ucbuilder/build/common";
import { CommonEvent } from "ucbuilder/global/commonEvent";
import { pagerATTR } from "./ListView.uc.nodeHandler";
export interface ListViewItemInfo {
  row: object,
  element: HTMLElement,
  index: number
}export interface BasicSize {
  width: number,
  height: number
}
export interface RowInfo {
  element?: HTMLElement,
  isModified?: boolean,
  //size?: BasicSize,
  height?: number,
  width?: number,
  runningHeight?: number,
  index?: number,  filterIndex?: number,

  next?: RowInfo,
  prev?: RowInfo
}
type IndexType = "isAtLast" | "isAtTop" | "continue" | "undefined";
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
  //rowInfo: RowInfo[] = [];
  getRow(index: number): RowInfo {
   /* if (!this[index]) debugger;
    else */return this[index][SourceManage.ACCESS_KEY];
  }
  getRowByObj(row: K): RowInfo {
    return row[SourceManage.ACCESS_KEY];
  }
  setRow(index: number, val: RowInfo) {
    let row = this[index];
    if (row) {
      let obj = row[SourceManage.ACCESS_KEY] as RowInfo;
      row[SourceManage.ACCESS_KEY] = val;
    }
  }
  allElementSize: BasicSize = {
    width: 0,
    height: 0
  }
  clear() {
    this.length = 0;
    //this.rowInfo.length = 0;
    //this.update();
  }
  getBottomIndex(topIndex: number, containerHeight: number, { length = undefined, overflowed = false }: { length?: number, overflowed?: boolean }): { index: number, status: IndexType } {
    let h = 0;
    let len = length ? length : this.length;
    //let rows = this.rowInfo;
    let i = topIndex;
    for (; i <= len - 1; i++) {
      //if (!this.rowInfo[i]) debugger;
      h += this.getRow(i).height;
      if (h > containerHeight) break;
    }
    topIndex = overflowed ? i : i - 1;

    let status: IndexType = 'continue';
    if (topIndex == len - 1) status = 'isAtLast';
    else if (topIndex == -1) status = 'undefined';
    return {
      index: topIndex,//index < 0 ? len : index,
      status: status,
    }
  }
  getTopIndex(botomIndex: number, containerHeight: number, { overflowed = false }: { length?: number, overflowed?: boolean }): { index: number, status: IndexType } {
    //let len = length ? length : this.length;
    // let rows = this.rowInfo;
    let i = botomIndex;
    let h = 0;
    for (; i >= 0; i--) {
      h += this.getRow(i).height;
      if (h > containerHeight) { break; }
    }
    botomIndex = overflowed ? i : i + 1;

    let status: IndexType = 'continue';
    if (botomIndex == 0) status = 'isAtTop';
    else if (botomIndex == -1) status = 'undefined';
    return {
      index: botomIndex,//index < 0 ? len : index,
      status: status,
    }

    /*let h = 0;
    let index = botomIndex;
    let obj: RowInfo;
    //console.log(`[${containerHeight}]`);
    index = botomIndex;
    while (h < containerHeight) {
      index--;
      obj = this.rowInfo[index];
      if (!obj) break;
      h += obj.height;
    }
    index += 1;
    let len = this.length;
    //return index >= len ? len - 1 : index;
    return {
      index: index >= len ? 0 : index,
      status: index == 0 ? "isAtTop" : "continue",
    }*/
  }
  getIndex(topPoint: number, length: number = undefined) {
    let len = length ? length : this.length;
    //let rows = this.rowInfo;
    let i = 0;
    let h = 0;
    for (; i <= len - 1; i++) {
      h = this.getRow(i).runningHeight;
      if (h > topPoint) break;

    }
    return topPoint == 0 ? 0 : i + 1;
  }
  loop_PerticularInfo(src: K[], callback = (row: K, info: RowInfo, index: number) => { }) {
    let rInfo: RowInfo;
    // let w: number = 0, h: number = 0;
    let akey = SourceManage.ACCESS_KEY;
    let obj: K = undefined;
    for (let i = 0, len = src.length; i < len; i++) {
      //rInfo = this.rowInfo[i];
      let obj = src[i];
      rInfo = obj[akey];
      if (rInfo == undefined) {
        rInfo = { isModified: false, index: i, height: 0, width: 0, runningHeight: 0 };
        obj[akey] = rInfo;
        //this.rowInfo[i] = rInfo;
      }
      callback(src[i], rInfo, i);
    }
    this.updateRunningSize();
  }
  loop_RowInfo(callback = (row: K, info: RowInfo, index: number) => { }) {
    console.log('loop_RowInfo...called');
    this.loop_PerticularInfo(this, callback);
    this.onUpdateRowInfo.fire();
  }
  private updateRunningSize() {
    let w: number = 0, h: number = 0; let rInfo: RowInfo;
    let akey = SourceManage.ACCESS_KEY;
    let obj: K = undefined;
    for (let i = 0, len = this.length; i < len; i++) {
      let obj = this[i];
      rInfo = obj[akey];
      rInfo.filterIndex = i;
      rInfo.element?.data(pagerATTR.itemIndex, i);
      h += rInfo.height;
      w = Math.max(w, rInfo.width);
      rInfo.runningHeight = h;
    }
    this.allElementSize = {
      width: w,
      height: h
    };
  }
  ihaveCompletedByMySide() {
    let len = this.length;
    //this.rowInfo = new Array<RowInfo>(len);
    //let rInfo = this.rowInfo;
    this.originalSource = [];
    for (let i = 0; i < len; i++) {
      let obj = this[i];
      obj[SourceManage.ACCESS_KEY] = { isModified: false, index: i, height: 0, width: 0, runningHeight: 0 };
      this.originalSource.push(obj);
    }
    this.updateRunningSize();
    this.onCompleteUserSide.fire([len]);
    this.onUpdate.fire([len]);
  }
  originalSource: K[] = []
  callToFill(...indexes) {
    let len = this.length;
    for (let i = 0; i < indexes.length; i++) {
      let row = this[indexes[i]][SourceManage.ACCESS_KEY] as RowInfo;
      if (row) row.isModified = true;
    }
    this.updateRunningSize();
    this.onUpdate.fire([len]);
  }
  static ACCESS_KEY = uniqOpt.guid;
  onCompleteUserSide = new CommonEvent<(arrayLen: number) => void>();
  onUpdate = new CommonEvent<(arrayLen: number) => void>();
  onUpdateRowInfo = new CommonEvent<() => void>();
};