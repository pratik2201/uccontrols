import { CommonEvent } from "ucbuilder/global/commonEvent";
import { keyBoard } from "ucbuilder/global/hardware/keyboard";
import { ListView } from "uccontrols/controls/lv/ListView.uc";
import { SourceProperties } from "ucbuilder/global/datasources/PropertiesHandler";
export class eventHandler {
  //#region  EVENT DECLARATION
  itemDoubleClick = new CommonEvent<(index: number, evt: MouseEvent) => void>();
  itemMouseDown = new CommonEvent<(index: number, evt: MouseEvent) => void>();
  itemMouseUp = new CommonEvent<(index: number, evt: MouseEvent) => void>();
  beforeOldItemRemoved = new CommonEvent<(itemHT: HTMLElement) => void>();
  onClearContainer = new CommonEvent<() => void>();
  newItemGenerate = new CommonEvent<(itemnode: HTMLElement, index: number) => void>();
  onChangeHiddenCount = new CommonEvent<(topHiddenCount: number, bottomHiddenCount: number) => void>();
  /*currentItemIndexChange = new CommonEvent<(
    oldIndex: number,
    newIndex: number,
    evt: MouseEvent | KeyboardEvent,
    eventType: ItemIndexChangeBy
  ) => void>();*/
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
  private _main: ListView;
  sconfig: SourceProperties;
  public get main() {
    return this._main;
  }
  public set main(value) {
    this._main = value;
    this.sconfig = value.sconfig;
  }

  //fireScrollEvent: boolean = true;
  constructor() {

  }
  init() {
    let nodes = this.main.source.nodes;
    this.main.ll_view.addEventListener("dblclick", (e: MouseEvent) => {
      let itm = nodes.getItemFromChild(e.target as HTMLElement);
      if (itm != null) {
        //this.main.navigate.config.currentIndex = nodes.getRowInfoFromChild(itm).index;
        //this.main.navigate.setCurrentIndex(itm.data(SourceIndexElementAttr).index, e, "Mouse");
        this.itemDoubleClick.fire([this.main.currentIndex, e]);
      }
    });
    let _main = this.main;
    let cfg = this.sconfig;
    let scrollbar = cfg.main.scrollbar;

    this.main.ll_view.addEventListener("mousedown", (e: MouseEvent) => {

      let itm = nodes.getRow(e.target as HTMLElement);
      if (itm != null) {
        
        //this.main.navigate.setCurrentIndex(itm.data(SourceIndexElementAttr).index, e, "Mouse");
        this.itemMouseDown.fire([this.main.currentIndex, e]);
      }
    });
    this.main.ll_view.addEventListener("mouseup", (e: MouseEvent) => {
      let itm = nodes.getRow(e.target as HTMLElement);
      if (itm != null) {
        cfg.currentIndex = itm.index;
        this.itemMouseUp.fire([cfg.currentIndex, e]);
      }
    });
    
    /*this.main.hscrollbar1.addEventListener("scroll", (e: Event) => {
      let scrollLeft = this.main.hscrollbar1.scrollLeft; //Math.floor(this.main.scroller1.scrollLeft / this.navigatePages.config.itemSize.width);
      //console.log(this.main.hscrollbar1.scrollLeft);
      this.main.scroller1.scrollLeft = scrollLeft;
    });*/

    this.main.ll_view.addEventListener("wheel", (e: WheelEvent) => {
      if (e.deltaY > 0) {
        cfg.pageNext(e as unknown as KeyboardEvent);
      } else {
        cfg.pagePrev(e as unknown as KeyboardEvent);
      }
      //scrollbar.refreshScrollbarSilantly();
    });
    let hasCompleteKeyDownEvent = true;
    this.main.ucExtends.wrapperHT.addEventListener("keydown", (e: KeyboardEvent) => {
      if (!hasCompleteKeyDownEvent) return;

      if (_main.editor.EditorMode && !e.shiftKey) return;
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
  onkeyDown_callback = (e): boolean => {
    return false;
  }
  isKeyEventActive = false;
  doKeyEvent(e: KeyboardEvent): boolean {
    if (this.onkeyDown_callback(e) === true) return true;
    let cfg = this.sconfig;
    
    cfg.main.ArrangingContents = true;
    this.isKeyEventActive = true;
    switch (e.keyCode) {
      case keyBoard.keys.up: // up key 
        cfg.movePrev(e);
        break;
      case keyBoard.keys.down: // down key
        cfg.moveNext(e);
        break;
      case keyBoard.keys.pageUp: // page up key
        cfg.pagePrev(e);
        cfg.currentIndex = cfg.top == 0 ? this.main.source.info.defaultIndex : cfg.top;
        //this.main.Refresh();
        break;
      case keyBoard.keys.pageDown: // page down key
        cfg.pageNext(e);
        cfg.currentIndex = cfg.bottomIndex;
        //this.main.Refresh();
        break;
      case keyBoard.keys.end: // end key
        cfg.top = cfg.lastSideTopIndex;
        cfg.main.nodes.fill();
        cfg.currentIndex = cfg.sourceLength - 1;
        break;
      case keyBoard.keys.home: // home key  
        cfg.top = 0;
        cfg.main.nodes.fill();
        cfg.currentIndex = 0;
        break;
      default: this.isKeyEventActive = false; return false;
    }
    
    cfg.main.scrollbar.refreshScrollbarSilantly();
    this.isKeyEventActive = false;
    return true;
  }
  


}