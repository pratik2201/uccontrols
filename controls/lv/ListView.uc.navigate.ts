import { R } from "uccontrols/R";
import { Size } from "ucbuilder/global/drawing/shapes";
import { ListViewItemInfo } from "./ListView.uc.sourceManage";

export type ItemIndexChangeBy = "Other" | "Keyboard" | "Mouse";
export class Configuration {
  main = R.controls.lv.ListView.type;
  viewSize = new Size(0, 0);
  itemSize = new Size(0, 0);
  perPageRecord = 20;
  itemsTotalSize = new Size(0, 0);
  //private _currentIndex = 0;
  public get currentIndex() {
    return this.currentItem.index;
  }
  public set currentIndex(value) {

    let eletof = value - this.top;
    let ci = this.currentItem;
    if (ci.element != undefined) ci.element.setAttribute('iscurrent', '0');
    ci.element = this.main.ll_view.children[eletof] as HTMLElement;
    ci.index = value;
    ci.row = this.main.source[value];
    if (ci.element != undefined)
      ci.element.setAttribute('iscurrent', '1');
  }
  currentItem = {
    element: undefined,
    index: -1,
    row: undefined,
  } as ListViewItemInfo;
  public length = 0;
  defaultIndex = 0;
  top = 0;

  get minBottomIndex() { return Math.min(this.bottomIndex, this.length - 1); }

  get bottomIndex() { return (this.top + this.perPageRecord) - 1; }
  get topHiddenRowCount() {
    return ((this.bottomIndex - this.perPageRecord) + 1);
  }
  get bottomHiddenRowCount() {
    return Math.max(0, (this.length - (this.top + this.perPageRecord)));
  }
  get lastSideTopIndex() { return Math.max(0, this.length - this.perPageRecord); }
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
  constructor() {  }
  setCurrentIndex(val: number, evt: MouseEvent | KeyboardEvent = undefined, eventType: ItemIndexChangeBy = 'Other'): void {
    let cfg = this.config;
    let oldIndex = cfg.currentIndex;
    let changed = (val !== oldIndex);
    let currentItem = cfg.currentItem;
    let bIndex = cfg.minBottomIndex;
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
        let nextPageBottom = cfg.bottomIndex + cfg.perPageRecord;
        //if (cfg.currentIndex > cfg.minBottomIndex) return 'NO_COVERAGE_BOTTOM';
       // if (cfg.currentIndex < cfg.top) return 'NO_COVERAGE_TOP';
        return (nextPageBottom < cfg.length - 1) ? 'OUTSIDE' :  'LAST';
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
        let dwnSide = this.pageTo.downSide;
        let cmd = dwnSide.check();
        switch (cmd) {
          case "NO_COVERAGE_TOP": this.callNavigate(dwnSide.Advance.noCoverageTop, event); break;
          case "NO_COVERAGE_BOTTOM": this.callNavigate(dwnSide.Advance.noCoverageBottom, event); break;
          case "OUTSIDE": this.callNavigate(dwnSide.Advance.outside, event);  break;
          case "LAST": this.callNavigate(dwnSide.Advance.last, event); break;
        }
        this.main.Refresh();
        //this.config.currentIndex = this.config.minBottomIndex;
      }
    },
    upSide: {
      check: (): PageNavigationResult => {
        let cfg = this.config;
        let prevPageTop = cfg.top - cfg.perPageRecord;
        //if (cfg.currentIndex > cfg.minBottomIndex) return 'NO_COVERAGE_BOTTOM';
        //if (cfg.currentIndex < cfg.top) return 'NO_COVERAGE_TOP';
        return (prevPageTop > cfg.defaultIndex) ?  "OUTSIDE"  : "FIRST";
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
        let upSd = this.pageTo.upSide;
        let cmd = upSd.check();
        switch (cmd) {
          case "NO_COVERAGE_TOP": this.callNavigate(upSd.Advance.noCoverageTop, event); break;
          case "NO_COVERAGE_BOTTOM": this.callNavigate(upSd.Advance.noCoverageBottom, event); break;
          case "OUTSIDE": this.callNavigate(upSd.Advance.outside, event); break;
          case "FIRST": this.callNavigate(upSd.Advance.first, event); break;
        }
        this.main.Refresh();
        //this.config.currentIndex = this.config.top;
        //this.main.nodes.render();
      }
    }
  };
  moveTo = {
    prevSide: {
      check: (): PageNavigationResult => {
        let cfg = this.config;
        if (cfg.currentIndex > cfg.minBottomIndex) return 'NO_COVERAGE_BOTTOM';
        if (cfg.currentIndex < cfg.top) return 'NO_COVERAGE_TOP';
        return (cfg.currentIndex > cfg.top) ? "DISPLAYED" : (cfg.top > cfg.defaultIndex) ? "OUTSIDE" : "FIRST";
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
            cfg.currentIndex = cfg.minBottomIndex;
          }
        }
      },
      Go: (event: KeyboardEvent, valToCount: number = 1): void => {
        let prvSide = this.moveTo.prevSide;
        let cmd = prvSide.check();
        switch (cmd) {
          case "NO_COVERAGE_TOP": this.callNavigate(prvSide.Advance.noCoverageTop, event, valToCount); break;
          case "NO_COVERAGE_BOTTOM": this.callNavigate(prvSide.Advance.noCoverageBottom, event, valToCount); break;
          case "DISPLAYED": this.callNavigate(prvSide.Advance.dispayed, event, valToCount); break;
          case "OUTSIDE": this.callNavigate(prvSide.Advance.outside, event, valToCount); break;
          case "FIRST": this.callNavigate(prvSide.Advance.first, event, valToCount); break;
        }
      }
    },
    nextSide: {
      check: (valToCount: number = 1): PageNavigationResult => {
        let cfg = this.config;
        if (cfg.currentIndex > cfg.minBottomIndex) return 'NO_COVERAGE_BOTTOM';
        if (cfg.currentIndex < cfg.top) return 'NO_COVERAGE_TOP';
        return (cfg.currentIndex < cfg.minBottomIndex) ? "DISPLAYED" : (cfg.bottomIndex < cfg.length - 1) ? "OUTSIDE" : "LAST";
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
          let newItemEle = this.main.nodes.append(this.config.minBottomIndex);
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
          cfg.top = Math.max(cfg.currentIndex - cfg.perPageRecord+1, cfg.defaultIndex);
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
        let cmd = nxtSide.check(valToCount);
        switch (cmd) {
          case "NO_COVERAGE_TOP": this.callNavigate(nxtSide.Advance.noCoverageTop, event, valToCount); break;
          case "NO_COVERAGE_BOTTOM": this.callNavigate(nxtSide.Advance.noCoverageBottom, event, valToCount); break;
          case "DISPLAYED": this.callNavigate(nxtSide.Advance.dispayed, event, valToCount); break;
          case "OUTSIDE": this.callNavigate(nxtSide.Advance.outside, event, valToCount); break;
          case "LAST": this.callNavigate(nxtSide.Advance.last, event, valToCount); break;
        }
      }
    }
  };

}