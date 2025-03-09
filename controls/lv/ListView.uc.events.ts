import { CommonEvent } from "ucbuilder/global/commonEvent.js";
import { KeyboardKeys } from "ucbuilder/lib/hardware.js";
import { ListView } from "uccontrols/controls/lv/ListView.uc";
import { SourceProperties } from "sharepnl/util/datasources/PropertiesHandler.js";
import { TabIndexManager } from "ucbuilder/lib/TabIndexManager.js";
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
    this.main.ll_view.addEventListener('focusin', (e: MouseEvent) => {
      let src = this.main.source;
      let row = src.nodes.getRowInfoFromChild(e.target as any);
      if (row != undefined && row.index != src.info.currentIndex)
        src.info.currentIndex = row.index;
    });
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
   // let hasCompleteKeyDownEvent = true;
   // this.main.ucExtends.wrapperHT  OLD WAS THIS 
   /*this.main.ll_view.addEventListener("keydown", (e: KeyboardEvent) => {
   //   if (!hasCompleteKeyDownEvent) return;


    //  hasCompleteKeyDownEvent = false;
      //setTimeout(() => {
      this.doKeyEvent(e);
      //hasCompleteKeyDownEvent = true;
      //}, 1);
   });
    */
    /*this.pagerLv.Events.onkeydown = (e: KeyboardEvent) => {
        if (!hasCompleteKeyDownEvent) return;
        hasCompleteKeyDownEvent = false;
        setTimeout(() => {
            this.doKeyEvent(e);
            hasCompleteKeyDownEvent = true;
        }, 1);
    };*/


  }
  
  /*doKeyEvent(e: KeyboardEvent): boolean {
    //if (!e.shiftKey) return false;
    let editMode = this.main.source.EditorMode;
    let cfg = this.sconfig;
    let selectorTxt = '';
    if (editMode && cfg.currentItem!=undefined) {      
      selectorTxt = document.activeElement.selector(cfg.currentItem.element);
     // console.log(selectorTxt);
    }
    let cIndex = cfg.currentIndex;
    let result = false;
    cfg.main.ArrangingContents = true;
    switch (e.keyCode) {
      case KeyboardKeys.Up: // up key 
        cfg.movePrev(e);
        break;
      case KeyboardKeys.Down: // down key
        cfg.moveNext(e);
        break;
      case KeyboardKeys.PageUp: // page up key
        cfg.pagePrev(e);
        cfg.currentIndex = cfg.top == 0 ? this.main.source.info.defaultIndex : cfg.top;
        //this.main.Refresh();
        break;
      case KeyboardKeys.PageDown: // page down key
        cfg.pageNext(e);
        cfg.currentIndex = cfg.bottomIndex;
        //this.main.Refresh();
        break;
      case KeyboardKeys.End: // end key
        cfg.top = cfg.lastSideTopIndex;
        cfg.main.nodes.fill();
        cfg.currentIndex = cfg.sourceLength - 1;
        break;
      case KeyboardKeys.Home: // home key  
        cfg.top = 0;
        cfg.main.nodes.fill();
        cfg.currentIndex = 0;
        break;
      default:
        cfg.main.ArrangingContents = false;
        return cIndex != cfg.currentIndex;
    }

    cfg.main.scrollbar.refreshScrollbarSilantly();
    cfg.main.ArrangingContents = false;
    let res = cIndex != cfg.currentIndex;    
    if (res) {
      let ci = cfg.currentItem;
      if (editMode && ci!=undefined && selectorTxt!='') {
        let ele = ci.element.querySelector(selectorTxt) as HTMLInputElement;
        if (ele != null)  ele.focus();
        else TabIndexManager.moveNext(ci.element)
      }
    }
    return res;
  }*/



}