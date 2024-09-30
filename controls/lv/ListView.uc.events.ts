import { CommonEvent } from "ucbuilder/global/commonEvent";
import { R } from "uccontrols/R";
import { ItemIndexChangeBy } from "./ListView.uc.navigate";
import { pagerATTR } from "./ListView.uc.nodeHandler";
import { keyBoard } from "ucbuilder/global/hardware/keyboard";
export class eventHandler {
  //#region  EVENT DECLARATION
  itemDoubleClick = new CommonEvent<(index: number, evt: MouseEvent) => void>();
  itemMouseDown = new CommonEvent<(index: number, evt: MouseEvent) => void>();
  itemMouseUp = new CommonEvent<(index: number, evt: MouseEvent) => void>();
  beforeOldItemRemoved = new CommonEvent<(itemHT: HTMLElement) => void>();
  onClearContainer = new CommonEvent<() => void>();
  newItemGenerate = new CommonEvent<(itemnode: HTMLElement, index: number) => void>();
  currentItemIndexChange = new CommonEvent<(
    oldIndex: number,
    newIndex: number,
    evt: MouseEvent | KeyboardEvent,
    eventType: ItemIndexChangeBy
  ) => void>();
  onRowNavigationChanged = (
    callback: (evt: KeyboardEvent, valToAddRemove: number) => void,
    event: KeyboardEvent,
    valToAddRemove: number
  ): void => {
    callback(event, valToAddRemove);
  };
  onReachFirstRecord = (): boolean => {
    return false;
  };
  onReachLastRecord = (): boolean => {
    return false;
  };
  //#endregion
  private _main = R.controls.lv.ListView.type;
  public get main() {
    return this._main;
  }
  public set main(value) {
    this._main = value;
  }
  get navigatePages() {
    return this._main.navigate;
  }
  fireScrollEvent: boolean = true;
  constructor() {

  }
  init() {
    this.main.ll_view.addEventListener("mousedown", (e: MouseEvent) => {
      let itm = this.main.nodes.getItemFromChild(e.target as HTMLElement);
      if (itm != null) {
        this.main.navigate.setCurrentIndex(itm.data(pagerATTR.itemIndex), e, "Mouse");
        this.itemMouseDown.fire([this.main.currentIndex, e]);
      }
    });
    this.main.ll_view.addEventListener("mouseup", (e: MouseEvent) => {
      let itm = this.main.nodes.getItemFromChild(e.target as HTMLElement);
      if (itm != null) {
        this.itemMouseUp.fire([this.main.currentIndex, e]);
      }
    });
    this.fireScrollEvent = true;
    this.main.scroller1.addEventListener("scroll", (e: Event) => {
      if (!this.fireScrollEvent) { this.fireScrollEvent = true; return; }
      //this.scrollTop = Math.floor(this.scrollbarElement.scrollTop / this.itemHeight);
      //this.doContentScrollAt(this.scrollTop, false);
    });

    this.main.ll_view.addEventListener("wheel", (e: WheelEvent) => {
      /*if (e.deltaY > 0) {
          this.navigatePages.pageTo.downSide.Go(e as unknown as KeyboardEvent);
      } else {
          this.navigatePages.pageTo.upSide.Go(e as unknown as KeyboardEvent);
      }
      this.refreshScrollbarSilantly();*/
    });
    let hasCompleteKeyDownEvent = true;
    this.main.scroller1.addEventListener("keydown", (e: KeyboardEvent) => {
      if (!hasCompleteKeyDownEvent) return;
      hasCompleteKeyDownEvent = false;
      setTimeout(() => {
        this.doKeyEvent(e);
        hasCompleteKeyDownEvent = true;
      }, 1);
    });
    /*this.pagerLv.Events.onkeydown = (e: KeyboardEvent) => {
        if (!hasCompleteKeyDownEvent) return;
        hasCompleteKeyDownEvent = false;
        setTimeout(() => {
            this.doKeyEvent(e);
            hasCompleteKeyDownEvent = true;
        }, 1);
    };*/
  }
  doKeyEvent(e: KeyboardEvent) {
    switch (e.keyCode) {
      case keyBoard.keys.up: // up key
        this.navigatePages.moveTo.prevSide.Go(e);
        break;
      case keyBoard.keys.down: // down key

        this.navigatePages.moveTo.nextSide.Go(e);
        break;
      case keyBoard.keys.pageUp: // page up key
        this.navigatePages.pageTo.upSide.Go(e);
        break;
      case keyBoard.keys.pageDown: // page down key
        this.navigatePages.pageTo.downSide.Go(e);
        break;
      case keyBoard.keys.end: // end key
        this.main.currentIndex = this.main.source.length - 1;
        //this.nodes.callToFill();
        //this.nodes.onRendar();
        break;
      case keyBoard.keys.home: // home key
        this._main.currentIndex = 0;
        //this.nodes.callToFill();
        //this.nodes.onRendar();
        break;
      default: return;
    }
    this.refreshScrollbarSilantly();
  }

  refreshScrollbarSilantly() {
    this.fireScrollEvent = false;
    //this.scrollbarElement.scrollTop = (this.pagerLv.pageInfo.top * this.itemHeight);
    //this.Events.onChangeHiddenCount.fire([this.pageLvExtend.topHiddenRowCount, this.pageLvExtend.bottomHiddenRowCount]);
  }
}