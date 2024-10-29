import { R } from "uccontrols/R";
import { Size } from "ucbuilder/global/drawing/shapes";
import { ListViewItemInfo, RowInfo } from "ucbuilder/global/datasources/SourceManage";

export type ItemIndexChangeBy = "Other" | "Keyboard" | "Mouse";
export class Configuration {
  main = R.controls.lv.ListView.type;
  viewSize = new Size(0, 0);
  itemSize = new Size(0, 0);
  perPageRecord = 20;
  itemsTotalSize = new Size(0, 0);
  //private _currentIndex = 0;
  public get currentIndex() {
    return this.currentItem?.index ?? 0;
  }
  public set currentIndex(value) {
    //let eletof = value - this.top;
    if (value >= this.sourceLength) return;
    let cItem = this.currentItem;
    let prevIndex = 0;
    let isPreviousUndefined = (cItem == undefined);

    if (!isPreviousUndefined) {  prevIndex = cItem.index; cItem.element.setAttribute('aria-current', `false`); }
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
  defaultIndex = 0;
  top = 0;



  //private get _bottomIndex() { return (this.top + this.perPageRecord) - 1; }
  get bottomIndex() {
    let vh = this.viewSize.height;
    if (vh == 0) return this.sourceLength - 1;
    return this.main.source.getBottomIndex(this.top, this.viewSize.height, { overflowed: false }).index;
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
  private _main = R.controls.lv.ListView.type;
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
      check: (): PageNavigationResult => {
        let cfg = this.config;
        //let nextPageBottom = cfg.bottomIndex + cfg.perPageRecord;
        let nextPageBottom = this.main.source.getBottomIndex(cfg.top, cfg.viewSize.height * 2, { overflowed: false });

        return (nextPageBottom.index < cfg.length - 1) ? 'OUTSIDE' : 'LAST';
      },
      Advance: {
        outside: (): void => {
          this.config.top += this.config.perPageRecord;
        },
        noCoverageTop: (evt: KeyboardEvent): void => {
          console.log('adsa');
          // let cfg = this.config;
          // cfg.top = cfg.currentIndex+cfg.perPageRecord;
          // cfg.currentIndex = cfg.top+1;
          //this.pageTo.downSide.Advance.outside();

        },
        noCoverageBottom: (evt: KeyboardEvent): void => {
          // let cfg = this.config;
          // if (cfg.currentIndex < cfg.length - 1) this.moveTo.nextSide.Advance.dispayed(evt, valToCount);
          // cfg.top = Math.max(cfg.currentIndex - cfg.perPageRecord+1, cfg.defaultIndex);
          // this.main.Refresh();
        },
        last: (): void => {
          let cfg = this.config;
          if (cfg.bottomIndex > cfg.length) {
            cfg.top = 0;
            //cfg.currentIndex = this.config.defaultIndex;
          } else cfg.top = cfg.length - cfg.perPageRecord;
        },
      },
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
      check: (): PageNavigationResult => {
        let cfg = this.config;
        let prevPageTop = cfg.top - cfg.perPageRecord;
        //if (cfg.currentIndex > cfg.minBottomIndex) return 'NO_COVERAGE_BOTTOM';
        //if (cfg.currentIndex < cfg.top) return 'NO_COVERAGE_TOP';
        return (prevPageTop > cfg.defaultIndex) ? "OUTSIDE" : "FIRST";
      },
      Advance: {
        outside: (): void => {
          this.config.top -= this.config.perPageRecord;
          //this.main.Refresh();
          //this.config.currentIndex = this.config.top;
        },
        noCoverageTop: (evt: KeyboardEvent): void => {
          // let cfg = this.config;
          // cfg.top = cfg.currentIndex;
          // if (cfg.currentIndex > cfg.defaultIndex + 1)
          //   this.moveTo.prevSide.Advance.outside(evt, valToCount);
          // this.main.Refresh();
        },
        noCoverageBottom: (evt: KeyboardEvent): void => {
          // let cfg = this.config;
          // cfg.top = Math.max(cfg.currentIndex - cfg.perPageRecord, cfg.defaultIndex);
          // this.moveTo.prevSide.Advance.dispayed(evt, valToCount);
          // this.main.Refresh();
        },
        first: (): void => {
          this.config.top = 0;
          //this.config.currentIndex = this.config.defaultIndex;
          //this.main.Refresh();
          //this.config.currentIndex = this.config.top;
        },
      },
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


        /*
        let upSd = this.pageTo.upSide;
        let cmd = upSd.check();
        switch (cmd) {
          case "NO_COVERAGE_TOP": this.callNavigate(upSd.Advance.noCoverageTop, event); break;
          case "NO_COVERAGE_BOTTOM": this.callNavigate(upSd.Advance.noCoverageBottom, event); break;
          case "OUTSIDE": this.callNavigate(upSd.Advance.outside, event); break;
          case "FIRST": this.callNavigate(upSd.Advance.first, event); break;
        }
        this.main.Refresh();*/
        //this.config.currentIndex = this.config.top;
        //this.main.nodes.render();
      }
    }
  };
  moveTo = {
    prevSide: {
      check: (): PageNavigationResult => {
        let cfg = this.config;
        if (cfg.currentIndex > cfg.bottomIndex) return 'NO_COVERAGE_BOTTOM';
        if (cfg.currentIndex < cfg.top) return 'NO_COVERAGE_TOP';
        return (cfg.currentIndex > cfg.top) ? "DISPLAYED" : (cfg.top > 0) ? "OUTSIDE" : "FIRST"; ///@ cfg.defaultIndex
      },
      Advance: {

        dispayed: (evt: KeyboardEvent, valToCount: number = 1): void => {
          this.config.currentIndex -= valToCount;
        },
        outside: (evt: KeyboardEvent, valToCount: number = 1): HTMLElement => {
          let eleToRem = this.main.ll_view.lastElementChild as HTMLElement;
          let cfg = this.config;
          this.main.Events.beforeOldItemRemoved.fire([eleToRem]);
          eleToRem.remove();
          cfg.top--;
          let ele = this.main.nodes.prepend(cfg.top);
          cfg.currentIndex--;
          return ele;
        },
        noCoverageTop: (evt: KeyboardEvent, valToCount: number = 1): void => {
          let cfg = this.config;
          cfg.top = cfg.currentIndex;
          if (cfg.currentIndex > cfg.defaultIndex + 1)
            this.moveTo.prevSide.Advance.outside(evt, valToCount);
          this.main.Refresh();
        },
        noCoverageBottom: (evt: KeyboardEvent, valToCount: number = 1): void => {
          let cfg = this.config;
          cfg.top = Math.max(cfg.currentIndex - cfg.perPageRecord, cfg.defaultIndex);
          this.moveTo.prevSide.Advance.dispayed(evt, valToCount);
          this.main.Refresh();
        },
        first: (evt: KeyboardEvent, valToCount: number = 1): void => {
          let cfg = this.config;
          if (this.main.Events.onReachFirstRecord()) {
            cfg.top = cfg.lastSideTopIndex;
            this.main.Refresh();
            cfg.currentIndex = cfg.bottomIndex;
          }
        }
      },
      Go: (event: KeyboardEvent, valToCount: number = 1): void => {
        let prvSide = this.moveTo.prevSide;
        let cfg = this.config;
        let src = this.main.source;
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
        /* let bottomInfo = src.getBottomIndex(cfg.top, containerHeight, { length: len });
        if (cindex == bottomInfo.index) {  // IF IS AT BOTTOM 
           if (bottomInfo.index == len - 1) return; //  IF IS LAST INDEX
           let topRw = src.rowInfo[cfg.top];
           let nextRow = src.rowInfo[bottomInfo.index + 1];
           let contentHeight = src.rowInfo[bottomInfo.index].runningHeight - (topRw.runningHeight - topRw.height);
           this.main.nodes.append(nextRow.index);
           contentHeight += nextRow.height;
           let diff = contentHeight - containerHeight;
           if (diff > 0) {
             let topInfo = src.getBottomIndex(cfg.top, diff, { length: len, overflowed: true });
             if (topInfo.status == 'continue') {
               for (let i = cfg.top; i <= topInfo.index; i++) {
                 tmpRow = src.rowInfo[i];
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
                   this.main.nodes.append(i);
                 }
               }
             }
           }*/

        // cfg.currentIndex = nextRow.index;




        /*let cmd = prvSide.check();
        switch (cmd) {
          case "NO_COVERAGE_TOP": this.callNavigate(prvSide.Advance.noCoverageTop, event, valToCount); break;
          case "NO_COVERAGE_BOTTOM": this.callNavigate(prvSide.Advance.noCoverageBottom, event, valToCount); break;
          case "DISPLAYED": this.callNavigate(prvSide.Advance.dispayed, event, valToCount); break;
          case "OUTSIDE": this.callNavigate(prvSide.Advance.outside, event, valToCount); break;
          case "FIRST": this.callNavigate(prvSide.Advance.first, event, valToCount); break;
        }*/
      }
    },
    nextSide: {
      check: (valToCount: number = 1): PageNavigationResult => {
        let cfg = this.config;
        if (cfg.currentIndex > cfg.bottomIndex) return 'NO_COVERAGE_BOTTOM';
        if (cfg.currentIndex < cfg.top) return 'NO_COVERAGE_TOP';
        return (cfg.currentIndex < cfg.bottomIndex) ? "DISPLAYED" : (cfg.bottomIndex < cfg.length - 1) ? "OUTSIDE" : "LAST";
      },
      Advance: {
        dispayed: (evt: KeyboardEvent, valToCount: number = 1): void => {
          this.config.currentIndex += valToCount;
        },
        outside: (evt: KeyboardEvent, valToCount: number = 1): HTMLElement => {
          let lastTopIndex = this.config.lastSideTopIndex;
          if (this.config.top < lastTopIndex) {
            let eleToRem = this.main.ll_view.firstElementChild as HTMLElement;
            this.main.Events.beforeOldItemRemoved.fire([eleToRem]);
            eleToRem.remove();
            this.config.top++;
          } else this.config.top = lastTopIndex;
          let newItemEle = this.main.nodes.append(this.config.bottomIndex);
          this.config.currentIndex++;
          return newItemEle;
        },
        noCoverageTop: (evt: KeyboardEvent, valToCount: number = 1): void => {
          let cfg = this.config;
          cfg.top = cfg.currentIndex + 1;
          this.moveTo.nextSide.Advance.dispayed(evt, valToCount);
          this.main.Refresh();
        },
        noCoverageBottom: (evt: KeyboardEvent, valToCount: number = 1): void => {
          let cfg = this.config;
          if (cfg.currentIndex < cfg.length - 1) this.moveTo.nextSide.Advance.dispayed(evt, valToCount);
          cfg.top = Math.max(cfg.currentIndex - cfg.perPageRecord + 1, cfg.defaultIndex);
          this.main.Refresh();
        },
        last: (evt: KeyboardEvent, valToCount: number = 1): void => {
          if (this.main.Events.onReachLastRecord()) {
            this.config.top = 0;
            this.config.currentIndex = this.config.defaultIndex;
            this.main.Refresh();

          }
          //console.log(this.main.source.rowInfo);
        }
      },
      Go: (event: KeyboardEvent, valToCount: number = 1): void => {
        let nxtSide = this.moveTo.nextSide;
        let cfg = this.config;
        let src = this.main.source;
        let len = src.length;
        //debugger;
        let cindex = cfg.currentIndex;
        let containerHeight = cfg.viewSize.height;
        let tmpRow: RowInfo<any>;
        let bottomInfo = src.getBottomIndex(cfg.top, containerHeight, { length: len });
        let bObj = src.getRow(cindex);
        //console.log('IS SELECTABLE :- ' + bObj.isSelectable);
        if (cindex == bottomInfo.index) {  // IF IS AT BOTTOM 
         // debugger;
       
          if (bottomInfo.index == len - 1) return; //  IF IS LAST INDEX
          let topRw = src.getRow(cfg.top);
          let nextRow = src.getRow(bottomInfo.index + 1);
          let contentHeight = src.getRow(bottomInfo.index).runningHeight - (topRw.runningHeight - topRw.height);
          this.main.nodes.append(nextRow.index);
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
                  this.main.nodes.append(i);
                }
              }
            }
          }

          //console.log(src.rowInfo[1].runningHeight);
          //console.log(diff);

          //console.log([containerHeight, contentHeight]);

          cfg.currentIndex = nextRow.index;

          /*let topSpace = src.getBottomIndex(cfg.top, nextRow.height);
          for (let i = cfg.top; i < topSpace.index; i++) {
            src.rowInfo[i].element.remove();
          }*/

          //console.log(diff);
          //  console.log([cindex,btmInf.index]);

          /*if (diff < 0) {  // IF TOP HEIGHT LARGER THAN NEW ROW
           
          } else if (diff == 0) {
            topRw.element.remove();
            let ele = this.main.nodes.append(nextRow.index);
            cfg.top = topRw.index + 1;
            cfg.currentIndex = nextRow.index;
          } else {  // IF BOTTOM ROW HEIGHT LARGER THAN TOP ROW
            let nindex = src.getBottomIndex(cfg.top + 1, diff);
            if (nindex.index == -1) {  // IF NO INDEX FOUND 
              let ele = this.main.nodes.append(nextRow.index);
            }
            //  if (nindex.status == 'isAtTop') {
            let ele = this.main.nodes.append(nextRow.index);
            for (let i = topRw.index; i <= nindex.index; i++) {
              src.rowInfo[i].element.remove();
            }
            cfg.top = nindex.index + 1;
            cfg.currentIndex = nextRow.index;
            //  }
          }*/




        } else {
          this.main.currentIndex++;
        }
        /*if (this.config.top < lastTopIndex) {            
          let eleToRem = this.main.ll_view.firstElementChild as HTMLElement;
          this.main.Events.beforeOldItemRemoved.fire([eleToRem]);
          eleToRem.remove();
          this.config.top++;
        } else this.config.top = lastTopIndex;
        let newItemEle = this.main.nodes.append(this.config.minBottomIndex);
        this.config.currentIndex++;
        return newItemEle;*/



        /*let cmd = nxtSide.check(valToCount);
        switch (cmd) {
          case "NO_COVERAGE_TOP": this.callNavigate(nxtSide.Advance.noCoverageTop, event, valToCount); break;
          case "NO_COVERAGE_BOTTOM": this.callNavigate(nxtSide.Advance.noCoverageBottom, event, valToCount); break;
          case "DISPLAYED": this.callNavigate(nxtSide.Advance.dispayed, event, valToCount); break;
          case "OUTSIDE": this.callNavigate(nxtSide.Advance.outside, event, valToCount); break;
          case "LAST": this.callNavigate(nxtSide.Advance.last, event, valToCount); break;
        }*/
      }
    }
  };

}