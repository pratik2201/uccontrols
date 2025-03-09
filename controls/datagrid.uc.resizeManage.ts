import { MouseForMove } from "ucbuilder/global/mouseForMove.js";
import { GridResizer, NamingConversion } from "ucbuilder/global/gridResizer.js";
import { Point } from "ucbuilder/global/drawing/shapes.js";
import { CommonEvent } from "ucbuilder/global/commonEvent.js";

export class measurementNode {
  size: number = 0;
  runningSize: number = 0;

  get prevRunningSize(): number {
    return this.runningSize - this.size;
  }

  get minVal(): number {
    return this.runningSize - 2;
  }

  get maxVal(): number {
    return this.runningSize + 2;
  }

  hasCollission(val: number): boolean {
    return val >= this.minVal && val <= this.maxVal;
  }
}
interface ResizeOptions {
  grid: HTMLElement,
  container: HTMLElement,
  getVarValue: () => string,
  setVarValue: (val: string) => void,
}
export class resizeManage {
  constructor() { }

  updateAr(): void {
    let counter = 0;
    this.measurement.forEach((row) => {
      counter += row.size;
      row.runningSize = counter;
    });
  }

  hasCollission(val: number): { hasCollied: boolean; index: number } {
    let rtrn = { hasCollied: false, index: -1 };
    for (let i = 0; i < this.measurement.length; i++) {
      if (this.measurement[i].hasCollission(val)) {
        rtrn.hasCollied = true;
        rtrn.index = i;
        break;
      }
    }
    return rtrn;
  }

  fillArrFromText(txt: string): void {
    let ar = txt.split(/ +/);
    let nlen = ar.length;
    if (this.measurement.length != nlen) {
      let rtrn = undefined;
      this.measurement.length = 0;

      ar.forEach((s, index) => {
        if (s === "auto") {
          if (index == nlen - 1) {
            s = Number.MAX_VALUE.toString();
          }
        }
        let sz = parseFloat(s);
        rtrn = new measurementNode();
        rtrn.size = sz;
        this.measurement.push(rtrn);
      });
      this.updateAr();
    } else {
      let sz = 0;
      for (let i = 0; i < ar.length; i++) {
        sz = parseFloat(ar[i]);
        if (!isNaN(sz)) this.measurement[i].size = sz;
      }
    }
    //console.log(this.measurement.map((s) => s.size).join("px ") + "px");
  }

  isResizing: boolean = false;
  measurement: measurementNode[] = [];
  fillSize: boolean = false;
  options: ResizeOptions = {
      grid: undefined,
      container: undefined,
      getVarValue: (): string => {
        return "";
      },
      setVarValue: (val: string): void => { },
    };

  init(): void {
    let mouseMv = new MouseForMove();
    let leftIndex = 0,
      rightIndex = 0;

    let rightNode: measurementNode,
      leftNode: measurementNode;
    let rightNodeSize: number,
      leftNodeSize: number;

    this.isResizing = false;
    let isSettingSize = false;
    mouseMv.bind({
      onDown: (evt: MouseEvent, dpoint: Point): boolean => {
        this.fillArrFromText(this.options.getVarValue());
        if (this.collissionResult.hasCollied) {
          this.updateOffset();
          leftIndex = this.collissionResult.index;
          rightIndex = leftIndex + 1;
          rightNode = this.measurement[rightIndex];
          leftNode = this.measurement[leftIndex];
          if (rightNode != undefined) rightNodeSize = rightNode.size;
          leftNodeSize = leftNode.size;

          this.isResizing = true;
        } else return false;
        evt.preventDefault();
        return true;
      },
      onMove: (e: MouseEvent, diff: Point): void => {
        let dval = diff.x;
        if (e.shiftKey || this.fillSize) {
          if (rightNode == undefined) {
            leftNode.size = leftNodeSize + dval;
          } else {
            diff.x =
              dval > 0
                ? Math.min(dval, rightNodeSize)
                : Math.max(dval, leftNodeSize * -1);
            dval = diff.x;
            leftNode.size = leftNodeSize + dval;
            rightNode.size = rightNodeSize - dval;
          }
        } else {
          leftNode.size = leftNodeSize + dval;
        }
        if (isSettingSize) return;
        isSettingSize = true;
        setTimeout(() => {
          this.options.setVarValue(this.measureText);
          this.Events.onResizing.fire([e,diff]);
          isSettingSize = false;
        }, 1);
      },
      onUp: (e: MouseEvent, diff: Point): void => {
        if (this.isResizing) this.updateAr();
        isSettingSize = false;
        this.collissionResult.hasCollied = false;
        this.collissionResult.index = -1;
        this.isResizing = false;
      },
    },this.options.container);

    this.options.grid.addEventListener("mouseenter", (e: MouseEvent) => {
      this.updateOffset();
      this.options.container.addEventListener(
        "mousemove",
        this.mousemovelistner
      );
      this.hasMouseEntered = true;
    });
    this.options.grid.addEventListener("mouseleave", (e: MouseEvent) => {
      this.hasMouseEntered = false;
      this.options.container.removeEventListener(
        "mousemove",
        this.mousemovelistner
      );
    });
  }

  Events = {
    onResizing: new CommonEvent<(e:MouseEvent,p:Point)=>void>(),
  };

  parentOffset: DOMRect = new DOMRect();
  updateOffset(): void {
    this.parentOffset = this.options.grid.getClientRects()[0];
    this.parentOffset.x -= this.options.grid.scrollLeft;
    this.parentOffset.y -= this.options.grid.scrollTop;
  }

  hasMouseEntered: boolean = false;
  isCheckingHoverCollission: boolean = false;
  collissionResult: { hasCollied: boolean; index: number } = {
    hasCollied: false,
    index: -1,
  };

  mousemovelistner = (__e: MouseEvent): void => {
    if (this.isResizing || this.isCheckingHoverCollission) return;
    let ete = __e;
    this.isCheckingHoverCollission = true;
    setTimeout(() => {
      if (!this.hasMouseEntered) return;
      this.isCheckingHoverCollission = false;
      let x = ete.clientX - this.parentOffset.x;
      this.collissionResult = this.hasCollission(x);
      this.options.container.style.cursor = this.collissionResult.hasCollied
        ? "e-resize"
        : "";
    }, 1);
  };

  _varName: string = "gridsize";
  get varName(): string {
    return this._varName;
  }
  set varName(value: string) {
    this._varName = value;
  }

  getPrevIndex(index: number): number {
    let rm = this.measurement;
    index--;
    for (; index >= 0 && rm[index].size == 0; index--);
    return index;
  }

  get measureText(): string {
    return this.measurement.length <= 1
      ? "auto"
      : this.fillSize
        ? this.measurement
          .map((s) => s.size)
          .slice(0, -1)
          .join("px ") + "px auto"
        : this.measurement.map((s) => s.size).join("px ") + "px";
  }
}