import { R } from "uccontrols/R";
import { Size } from "ucbuilder/global/drawing/shapes";
import { ListViewItemInfo } from "./ListView.uc.sourceManage";

export type ItemIndexChangeBy = "Other" | "Keyboard" | "Mouse";
export class Configuration {
  main = R.controls.lv.ListView.type;
  viewSize = new Size(0, 0);
  itemSize = new  Size(0, 0);
  perPageRecord = 20;
  itemsTotalSize = new Size(0, 0);
  //private _currentIndex = 0;
  public get currentIndex() {
    return this.currentItem.index;
  }
  public set currentIndex(value) {
   
    let eletof = value - this.top;
    let ci = this.currentItem;
    if(ci.element!=undefined)ci.element.setAttribute('iscurrent', '0');
    ci.element = this.main.ll_view.children[eletof] as HTMLElement;
    ci.index = value;
    ci.row = this.main.source[value];
    if(ci.element!=undefined)
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
export type PageNavigationResult = "DISPLAYED" | "OUTSIDE" | "LAST" | "FIRST";
export class NavigatePages {
  public config = new Configuration();
  private _main = R.controls.lv.ListView.type;
  public get main() {
    return this._main;
  }
  public set main(value) {
    this.config.main = this._main = value;

  }
  constructor() {

  }
  setCurrentIndex(val: number, evt: MouseEvent | KeyboardEvent = undefined, eventType: ItemIndexChangeBy = 'Other'): void {
    let cfg = this.config;
    let oldIndex = cfg.currentIndex;
    let changed = (val !== oldIndex);
    let currentItem = cfg.currentItem;
    let bIndex = cfg.minBottomIndex;
    if (val >= cfg.top && val <= bIndex) {
      cfg.currentIndex = val;
      //session.currentIndex = val;
    } else {
      if (val < cfg.top) {
        cfg.top = val;
      } else {
        cfg.top = val - cfg.perPageRecord + 1;
      }
      //session.currentIndex = val;
    }
    //if (currentItem.element != undefined)
    //  currentItem.element.setAttribute('iscurrent', '1');
    if (changed)
      this.main.Events.currentItemIndexChange.fire([oldIndex, val, evt, eventType]);
  }
  callNavigate = (callback: KeyboardNavigationCallback = (evt, vltr) => { }, event: KeyboardEvent, valToAddRemove?: number): void => {
    this.main.Events.onRowNavigationChanged(callback, event, valToAddRemove);
  };
  pageTo = {
    downSide: {
      check: (): PageNavigationResult => {
        let nextPageBottom = this.config.bottomIndex + this.config.perPageRecord;
        return (nextPageBottom < this.config.length - 1) ?
          'OUTSIDE'
          :
          'LAST';
      },
      Advance: {
        outside: (): void => {
          this.config.top += this.config.perPageRecord;
        },
        last: (): void => {
          if (this.config.bottomIndex > this.config.length) {
            this.config.top = 0;
            this.config.currentIndex = this.config.defaultIndex;
          } else this.config.top = this.config.length - this.config.perPageRecord;
        },
      },
      Go: (event: KeyboardEvent): void => {
        let dwnSide = this.pageTo.downSide;
        let cmd = dwnSide.check();
        switch (cmd) {
          case "OUTSIDE":
            this.callNavigate(dwnSide.Advance.outside, event);
            break;
          case "LAST":
            this.callNavigate(dwnSide.Advance.last, event);
            break;
        }
        this.main.Refresh();
        this.config.currentIndex = this.config.minBottomIndex;
      }
    },
    upSide: {
      check: (): PageNavigationResult => {
        let prevPageTop = this.config.top - this.config.perPageRecord;
        return (prevPageTop > this.config.defaultIndex) ?
          "OUTSIDE"
          :
          "FIRST";
      },
      Advance: {
        outside: (): void => {
          this.config.top -= this.config.perPageRecord;
          this.main.Refresh();
          this.config.currentIndex = this.config.top;
        },
        first: (): void => {
          this.config.top = 0;
          this.config.currentIndex = this.config.defaultIndex;
          this.main.Refresh();
          this.config.currentIndex = this.config.top;
        },
      },
      Go: (event: KeyboardEvent): void => {
        let upSd = this.pageTo.upSide;
        let cmd = upSd.check();
        switch (cmd) {
          case "OUTSIDE":
            this.callNavigate(upSd.Advance.outside, event);
            break;
          case "FIRST":
            this.callNavigate(upSd.Advance.first, event);
            break;
        }
        this.main.nodes.render();
      }
    }
  };
  moveTo = {
    prevSide: {
      check: (): PageNavigationResult => {
        
        /*if (this.config.currentIndex > this.config.top)
          return "DISPLAYED";
        else {
          if (this.config.top > this.config.defaultIndex) {
            return "OUTSIDE";
          } else {
            return "FIRST"
          }
        }*/
        return (this.config.currentIndex > this.config.top) ?
            "DISPLAYED"
            :
            (this.config.top > this.config.defaultIndex) ?
                "OUTSIDE"
                :
                "FIRST";
      },
      Advance: {
        dispayed: (evt: KeyboardEvent, valToCount: number = 1): void => {
          this.config.currentIndex -= valToCount;
        },
        outside: (evt: KeyboardEvent, valToCount: number = 1): HTMLElement => {
          let eleToRem = this.main.ll_view.lastElementChild as HTMLElement;
          this.main.Events.beforeOldItemRemoved.fire([eleToRem]);
          eleToRem.remove();
          this.config.top--;
          let ele = this.main.nodes.prepend(this.config.top);
          this.config.currentIndex--;
          return ele;
        },
        first: (evt: KeyboardEvent, valToCount: number = 1): void => {
          if (this.main.Events.onReachFirstRecord()) {
            this.config.top = this.config.lastSideTopIndex;
            this.main.Refresh();
            this.config.currentIndex = this.config.minBottomIndex;
          }
        }
      },
      Go: (event: KeyboardEvent, valToCount: number = 1): void => {
        let prvSide = this.moveTo.prevSide;
        let cmd = prvSide.check();
        switch (cmd) {
          case "DISPLAYED":
            this.callNavigate(prvSide.Advance.dispayed, event, valToCount);
            break;
          case "OUTSIDE":
            this.callNavigate(prvSide.Advance.outside, event, valToCount);
            break;
          case "FIRST":
            this.callNavigate(prvSide.Advance.first, event, valToCount);
            break;
        }
      }
    },
    nextSide: {
      check: (valToCount: number = 1): PageNavigationResult => {
        /*if (this.config.currentIndex < this.config.minBottomIndex)
          return "DISPLAYED";
        else {
          if (this.config.bottomIndex < this.config.length - 1)
            return "OUTSIDE";
          else return "LAST";
        }*/

         // console.log(this.config.top+":"+this.config._begin);
        return (this.config.currentIndex < this.config.minBottomIndex) ?
            "DISPLAYED"
            :
            (this.config.bottomIndex < this.config.length - 1) ?
                "OUTSIDE"
                :
                "LAST";
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
        last: (evt: KeyboardEvent, valToCount: number = 1): void => {
          if (this.main.Events.onReachLastRecord()) {
            this.config.top = 0;
            this.config.currentIndex = this.config.defaultIndex;
            this.main.Refresh();
          }
        }
      },
      Go: (event: KeyboardEvent, valToCount: number = 1): void => {
        let nxtSide = this.moveTo.nextSide;
        let cmd = nxtSide.check(valToCount);
        switch (cmd) {
          case "DISPLAYED":
            this.callNavigate(nxtSide.Advance.dispayed, event, valToCount);
            break;
          case "OUTSIDE":
            this.callNavigate(nxtSide.Advance.outside, event, valToCount);
            break;
          case "LAST":
            this.callNavigate(nxtSide.Advance.last, event, valToCount);
            break;
        }
      }
    }
  };

}