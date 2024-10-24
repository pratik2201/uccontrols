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
  element?: HTMLElement,
  isModified?: boolean,
  //size?: BasicSize,
  height?: number,
  width?: number,
  runningHeight?: number,
  index?: number,
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
  getBottomIndex(topIndex: number, containerHeight: number, { length = undefined, overflowed = false }: { length?: number, overflowed?: boolean }): { index: number, status: IndexType } {
    let h = 0;
    let len = length ? length : this.length;
    let rows = this.rowInfo;
    let i = topIndex;
    for (; i <= len - 1; i++) {
      //if (!this.rowInfo[i]) debugger;
      h += rows[i].height;
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
    let rows = this.rowInfo;
    let i = botomIndex;
    let h = 0;
    for (; i >= 0; i--) {
      h += rows[i].height;
      if (h > containerHeight) { break;  }
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
    let rows = this.rowInfo;
    let i = 0;
    let h = 0;
    for (; i <= len - 1; i++) {
      h = rows[i].runningHeight;
      if (h > topPoint) break;

    }
    return topPoint == 0 ? 0 : i + 1;
  }
  loop_RowInfo(callback = (row: K, info: RowInfo, index: number) => { }) {
    let rInfo: RowInfo;
    console.log('loop_RowInfo...called');
    let w: number = 0, h: number = 0;
    for (let i = 0, len = this.length; i < len; i++) {
      rInfo = this.rowInfo[i];
      if (rInfo == undefined) {
        rInfo = { isModified: false, index: i, height: 0, width: 0, runningHeight: 0 };
        this.rowInfo[i] = rInfo;
      }
      /*if (rInfo == undefined) {
        rInfo = {
          element: undefined,
          isModified: false,
          width: 0, height: 0,
          runningHeight: 0,
          index: i,
        }
        this.rowInfo[i] = rInfo;
      }*/
      callback(this[i], rInfo, i);
      h += rInfo.height;
      w = Math.max(w, rInfo.width);
      rInfo.runningHeight = h;
      console.log([rInfo.index, rInfo.height, rInfo.runningHeight]);

    }
    this.allElementSize = {
      width: w,
      height: h
    };
    this.onUpdateRowInfo.fire();
  }
  update(...indexes) {
    let len = this.length;
    if (indexes.length == 0)
      this.rowInfo = new Array<RowInfo>(len);//.fill({ element:undefined,height:0,index:-1,isModified:false,width:0,runningHeight:0 });
    else for (let i = 0; i < indexes.length; i++) {
      let row = this.rowInfo[indexes[i]];
      if (row) row.isModified = true;
    }
    this.onUpdate.fire([len]);
    //console.log(this.rowInfo);
  }

  onUpdate = new CommonEvent<(arrayLen: number) => void>();
  onUpdateRowInfo = new CommonEvent<() => void>();
};