
import { Size } from "ucbuilder/global/drawing/shapes";
import { ListViewItemInfo, RowInfo } from "ucbuilder/global/datasources/SourceManage";
import { ListView } from "uccontrols/controls/lv/ListView.uc";

export type ItemIndexChangeBy = "Other" | "Keyboard" | "Mouse";
interface PosNode {
  topIndex: number, append: number[], prepend: number[], remove: number[],
}
export class Configuration {
  main: ListView;
  viewSize = new Size(0, 0);
  itemSize = new Size(0, 0);
  perPageRecord = 20;
  //itemsTotalSize = new Size(0, 0);
  //private _currentIndex = 0;
  public get currentIndex() {
    return this.currentItem?.index ?? 0;
  }
  public set currentIndex(value) {
    //let eletof = value - this.top;
    if (value < 0 || value >= this.sourceLength) return;
    let cItem = this.currentItem;
    let prevIndex = 0;
    let isPreviousUndefined = (cItem == undefined);

    if (!isPreviousUndefined) { prevIndex = cItem.index; cItem.element.setAttribute('aria-current', `false`); }
    let src = this.main.source;
    let rObj = src.getRow(value);
    if (!rObj.isSelectable) {
      this.currentItem = rObj;
      if (prevIndex > value) { //  IF TOP SIDE SELECTED
        this.main.navigate.moveTo.prevSide.Go(undefined as KeyboardEvent);
      } else {      //  IF BOTTOM SIDE SELECTED
        this.main.navigate.moveTo.nextSide.Go(undefined as KeyboardEvent);
      }
      if (this.currentIndex != value) return;
      else {

        //console.log(prevIndex);
        rObj = src.getRow(prevIndex);

      }
    }
    cItem = this.currentItem = rObj;
    if (value <= 0) {
      this.main.vscrollbar1.scrollTop =
        this.top = 0;
    }
    cItem.element.setAttribute('aria-current', 'true');
  }
  currentItem: RowInfo<any>;
  /*currentItem = {
    element: undefined,
    index: -1,
    row: undefined,
  } as ListViewItemInfo;*/
  public length = 0;

  applyPos(whatsNext: PosNode) {
    let nodes = this.main.nodes;
    let src = this.main.source;
    let _append = whatsNext.append;
    for (let i = 0; i < _append.length; i++) nodes.append(_append[i]);
    let _prepend = whatsNext.prepend;
    for (let i = 0; i < _prepend.length; i++) nodes.prepend(_prepend[i]);

    let _remove = whatsNext.remove;
    for (let i = 0; i < _remove.length; i++) src.getRow(_remove[i]).element.remove();
    this.top = whatsNext.topIndex;
  }
  top = 0;
  getPos(cIndex = this.currentIndex): PosNode {
    let top = this.top;
    let rtrn: PosNode = { topIndex: top, prepend: [], append: [], remove: [], }
    let src = this.main.source;
    if (cIndex < 0 || cIndex >= src.info.length) return rtrn;
    let curBottomIndex = this.bottomIndex;
    let bottom = curBottomIndex;
    // let cIndex = this.currentIndex;
    let viewHeight = this.viewSize.height;

    let freespace = 0;
    if (cIndex < top) {
      top = cIndex;
      let bottomObj = src.getBottomIndex(top, viewHeight, { overflowed: false });
      bottom = bottomObj.index;
      freespace = viewHeight - bottomObj.size;
      if (freespace > 0)
        top = src.getTopIndex(top - 1, freespace, { overflowed: false }).index;
      for (let i = this.top - 1; i >= top; i--)rtrn.prepend.push(i);
      for (let i = bottom + 1; i <= curBottomIndex; i++)rtrn.remove.push(i);
      /*for (let i = this.newTop - 1; i >= top; i--) {
        //console.log('UP ADDED...'+i);
        this.main.nodes.prepend(i)
      }
      for (let i = bottom + 1; i <= this.newBottom; i++) {
        //console.log('UP REMOVED...'+i);
        SourceManage.getRow(src[i]).element.remove();
      }*/
      // console.log([this.newTop-top, this.newBottom-bottom,prevIndex,cIndex]);
    }
    if (bottom == 0) bottom = src.getBottomIndex(top, viewHeight, { overflowed: false }).index;
    if (cIndex > bottom) {
      bottom = cIndex;
      let topObj = src.getTopIndex(bottom, viewHeight, { overflowed: false });
      top = topObj.index;
      freespace = viewHeight - topObj.size;
      if (freespace > 0)
        bottom = src.getBottomIndex(bottom + 1, freespace, { overflowed: false }).index;

      for (let i = this.top; i < top; i++)
        rtrn.remove.push(i);
      for (let i = curBottomIndex + 1; i <= bottom; i++)
        rtrn.append.push(i);
      /*for (let i = this.newTop; i < top; i++) {
        console.log('DOWN REMOVED...' + i);
        SourceManage.getRow(src[i]).element.remove();
      }
      for (let i = this.newBottom + 1; i <= bottom; i++) {
        console.log('DOWN ADDED...' + i);
        this.main.nodes.append(i)
      }
      console.log([top - this.newTop, bottom - this.newBottom, this.newTop, this.newBottom,cIndex]);*/
    }
    rtrn.topIndex = top;
    //for (let i = this.newTop; i < top; i++)
    return rtrn;
  }
  updatePos() {
    this.top = this.getPos().topIndex;
    this.main.Events.refreshScrollbarSilantly();
    /* this._newBottom = bottom;
 
     this.main.ll_view.innerHTML = '';
     console.log([this._newTop, this._newBottom]);
     for (let i = this._newTop; i <= this._newBottom; i++) {
       let obj = SourceManage.getRow(src[i]);
       console.log(obj.isModified);
 
       ///if (!obj.element.isConnected)
       this.main.nodes.append(i);
     }
     this.top = top;*/
    /*if (this.newTop != this.top) {
      console.log(['=TOP==' + freespace + '===> ', this.newTop, this.newBottom, this.top, this.bottomIndex]);
    } else if (this.newBottom != this.bottomIndex) {
      console.log(['=BOTTOM==' + freespace + '===> ', this.newTop, this.newBottom, this.top, this.bottomIndex]);
    }*/
  }




  //private get _bottomIndex() { return (this.top + this.perPageRecord) - 1; }
  get bottomIndex() {
    let src = this.main.source;
    let vh = this.viewSize.height;
    if (vh == 0) return src.length - 1;
    return src.getBottomIndex(this.top, vh, { overflowed: false }).index;
  }
  get sourceLength() { return this.main.source.info.length; /*this.main.source.length*/ }
  get topHiddenRowCount() {
    // console.log("topHiddenRowCount:" + this.top);

    return this.top;
    //return ((this.bottomIndex - this.top) + 1);
  }
  get bottomHiddenRowCount() {
    let len = this.sourceLength;
    let vh = this.viewSize.height;
    if (vh == 0) return 0;
    let bIndex = this.main.source.getBottomIndex(this.top, vh, { length: len, overflowed: false })
    return Math.max(0, len - (bIndex.index) - 1);
    //return Math.max(0, (this.length - (this.top + this.perPageRecord)));
  }
  get lastSideTopIndex() {
    let src = this.main.source;
    return src.getTopIndex(src.length - 1, this.viewSize.height, { overflowed: false }).index;
    //return Math.max(0, this.length - this.perPageRecord);
  }
  get isLastSideTopIndex() { return this.lastSideTopIndex == this.top; }
}
type KeyboardNavigationCallback = (evt: KeyboardEvent, valToAddRemove: number) => void;
export type PageNavigationResult = "DISPLAYED" | "NO_COVERAGE_TOP" | "NO_COVERAGE_BOTTOM" | "OUTSIDE" | "LAST" | "FIRST";
export class NavigatePages {
  public config = new Configuration();
  private _main: ListView;
  public get main() {
    return this._main;
  }
  public set main(value) {
    this.config.main = this._main = value;
  }
  constructor() { }
  setCurrentIndex(val: number, evt: MouseEvent | KeyboardEvent = undefined, eventType: ItemIndexChangeBy = 'Other'): void {
    let cfg = this.config;
    let oldIndex = cfg.currentIndex;
    let changed = (val !== oldIndex);
    // let currentItem = cfg.currentItem;
    let bIndex = cfg.bottomIndex;
    if (val >= cfg.top && val <= bIndex) {
      cfg.currentIndex = val;
    } else {
      if (val < cfg.top) {
        cfg.top = val;
      } else {
        cfg.top = val - cfg.perPageRecord + 1;
      }
    }
    if (changed)
      this.main.Events.currentItemIndexChange.fire([oldIndex, val, evt, eventType]);
  }
  callNavigate = (callback: KeyboardNavigationCallback = (evt, vltr) => { }, event: KeyboardEvent, valToAddRemove?: number): void => {
    this.main.Events.onRowNavigationChanged(callback, event, valToAddRemove);
  };
  pageTo = {
    downSide: {
      Go: (event: KeyboardEvent): void => {
        let cfg = this.config;
        let src = this.main.source;
        let len = src.length;
        let bindex = cfg.bottomIndex;
        if (bindex == len - 1) return;
        //  debugger;
        let nextPageBottom = src.getBottomIndex(cfg.top, cfg.viewSize.height * 2, { length: len, overflowed: false });
        switch (nextPageBottom.status) {
          case 'continue':
            this.callNavigate(() => {
              cfg.top = bindex + 1;
            }, event);
            //this.callNavigate(dwnSide.Advance.outside, event);
            break;
          case 'isAtLast':
            cfg.top = src.getTopIndex(len - 1, cfg.viewSize.height, { length: len, overflowed: false }).index;
            break;
        }
        this.main.Refresh();
      }
    },
    upSide: {
      Go: (event: KeyboardEvent): void => {
        let cfg = this.config;
        let src = this.main.source;
        if (cfg.top == 0) return;
        let previousPageTop = src.getTopIndex(cfg.top, cfg.viewSize.height, { overflowed: false });
        switch (previousPageTop.status) {
          case 'continue':
            this.callNavigate(() => {
              cfg.top = previousPageTop.index;
            }, event);
            break;
          case 'isAtTop':
            cfg.top = 0;
            break;
        }
        this.main.Refresh();
      }
    }
  };
  moveTo = {
    prevSide: {

      Go: (event: KeyboardEvent, valToCount: number = 1): void => {
       
        let cfg = this.config;
        let src = this.main.source;
        let whatsNext = cfg.getPos(cfg.currentIndex -1);
        if (whatsNext.topIndex == cfg.top) { cfg.currentIndex--; return; }
        cfg.applyPos(whatsNext);
        cfg.currentIndex--;
        return;
        
        let len = this.main.source.length;
        let cindex = cfg.currentIndex;
        let containerHeight = cfg.viewSize.height;
        let tmpRow: RowInfo<any>;
        if (cfg.top == cindex) {
          if (cfg.top == 0) return;
          let bottomRw = src.getRow(src.getBottomIndex(cfg.top, containerHeight, { length: len }).index);
          let prevRow = src.getRow(cfg.top - 1);
          let contentHeight = bottomRw.runningHeight - (src.getRow(cfg.top).runningHeight - src.getRow(cfg.top).height);
          let tIndex = cfg.top;
          this.main.nodes.prepend(prevRow.index);
          cfg.top = tIndex = prevRow.index;
          contentHeight += prevRow.height;
          let diff = contentHeight - containerHeight;
          if (diff > 0) { // IF CONTENT IS LARGER THAN CONTAINER
            //console.log(diff);
            let bottomInfo = src.getTopIndex(bottomRw.index, diff, { length: len, overflowed: true });
            if (bottomInfo.status == 'continue') {
              for (let i = bottomInfo.index; i <= bottomRw.index; i++) {
                tmpRow = src.getRow(i);
                this.main.Events.beforeOldItemRemoved.fire([tmpRow.element]);
                tmpRow.element.remove();
                contentHeight -= tmpRow.height;
              }
            }
          }
          diff = containerHeight - contentHeight;
          if (diff > 0) {  // IF  CONTAINER IS LARGER THAN CONTENT

            let nindex = prevRow.index - 1;

            let topInfo = src.getTopIndex(nindex, diff, { length: len });
            if (topInfo.status != 'undefined') {
              for (let i = nindex; i >= topInfo.index; i--) {
                this.main.nodes.prepend(i);
              }
              cfg.top = topInfo.index;
            }
          }
          cfg.currentIndex = tIndex;
        } else {
          cfg.currentIndex--;
        }
      }
    },
    nextSide: {

      Go: (event: KeyboardEvent, valToCount: number = 1): void => {
        let cfg = this.config;
        let src = this.main.source;
        let whatsNext = cfg.getPos(cfg.currentIndex + 1);
        if (whatsNext.topIndex == cfg.top) { cfg.currentIndex++; return; }
        cfg.applyPos(whatsNext);
        cfg.currentIndex++;
        return;
        let len = src.length;
        //debugger;
        let cindex = cfg.currentIndex;
        let containerHeight = cfg.viewSize.height;
        let tmpRow: RowInfo<any>;
        let bottomInfo = src.getBottomIndex(cfg.top, containerHeight, { length: len });
        let bObj = src.getRow(cindex);

        //console.log('IS SELECTABLE :- ' + bObj.isSelectable);
        if (cindex == bottomInfo.index) {  // IF IS AT BOTTOM 
          //debugger;
          if (bottomInfo.index == len - 1) return; //  IF IS LAST INDEX
          let topRw = src.getRow(cfg.top);
          let nextRow = src.getRow(bottomInfo.index + 1);
          let contentHeight = src.getRow(bottomInfo.index).runningHeight - (topRw.runningHeight - topRw.height);
          this.main.nodes.append(nextRow.index);//.setAttribute('x-tabindex',''+(nextRow.index-cfg.top));
          contentHeight += nextRow.height;
          let diff = contentHeight - containerHeight;
          if (diff > 0) {  // IF CONTENT IS LARGER THAN CONTAINER
            let topInfo = src.getBottomIndex(cfg.top, diff, { length: len, overflowed: true });
            if (topInfo.status == 'continue') {
              for (let i = cfg.top; i <= topInfo.index; i++) {
                tmpRow = src.getRow(i);
                this.main.Events.beforeOldItemRemoved.fire([tmpRow.element]);
                tmpRow.element.remove();
                contentHeight -= tmpRow.height;
              }
              cfg.top = topInfo.index + 1;
            }
            diff = containerHeight - contentHeight;
            if (diff > 0) {
              let nindex = nextRow.index + 1;
              bottomInfo = src.getBottomIndex(nindex, diff, { length: len });
              if (bottomInfo.status != 'undefined') {
                for (let i = nindex; i <= bottomInfo.index; i++) {
                  this.main.nodes.append(i);//.setAttribute('x-tabindex',''+(i-cfg.top));
                }
              }
            }
          }
          cfg.currentIndex = nextRow.index;
        } else {
          this.main.currentIndex++;
        }
      }
    }
  };

}