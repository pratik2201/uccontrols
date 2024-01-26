"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resizeManage = exports.measurementNode = void 0;
const mouseForMove_1 = require("ucbuilder/global/mouseForMove");
const commonEvent_1 = require("ucbuilder/global/commonEvent");
class measurementNode {
    constructor() {
        this.size = 0;
        this.runningSize = 0;
    }
    get prevRunningSize() {
        return this.runningSize - this.size;
    }
    get minVal() {
        return this.runningSize - 2;
    }
    get maxVal() {
        return this.runningSize + 2;
    }
    hasCollission(val) {
        return val >= this.minVal && val <= this.maxVal;
    }
}
exports.measurementNode = measurementNode;
class resizeManage {
    constructor() {
        this.isResizing = false;
        this.measurement = [];
        this.fillSize = false;
        this.options = {
            grid: undefined,
            container: undefined,
            getVarValue: () => {
                return "";
            },
            setVarValue: (val) => { },
        };
        this.Events = {
            onResizing: new commonEvent_1.CommonEvent(),
        };
        this.parentOffset = new DOMRect();
        this.hasMouseEntered = false;
        this.isCheckingHoverCollission = false;
        this.collissionResult = {
            hasCollied: false,
            index: -1,
        };
        this.mousemovelistner = (__e) => {
            if (this.isResizing || this.isCheckingHoverCollission)
                return;
            let ete = __e;
            this.isCheckingHoverCollission = true;
            setTimeout(() => {
                if (!this.hasMouseEntered)
                    return;
                this.isCheckingHoverCollission = false;
                let x = ete.clientX - this.parentOffset.x;
                this.collissionResult = this.hasCollission(x);
                this.options.container.style.cursor = this.collissionResult.hasCollied
                    ? "e-resize"
                    : "";
            }, 1);
        };
        this._varName = "gridsize";
    }
    updateAr() {
        let counter = 0;
        this.measurement.forEach((row) => {
            counter += row.size;
            row.runningSize = counter;
        });
    }
    hasCollission(val) {
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
    fillArrFromText(txt) {
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
        }
        else {
            let sz = 0;
            for (let i = 0; i < ar.length; i++) {
                sz = parseFloat(ar[i]);
                if (!isNaN(sz))
                    this.measurement[i].size = sz;
            }
        }
        //console.log(this.measurement.map((s) => s.size).join("px ") + "px");
    }
    init() {
        let mouseMv = new mouseForMove_1.MouseForMove();
        let leftIndex = 0, rightIndex = 0;
        let rightNode, leftNode;
        let rightNodeSize, leftNodeSize;
        this.isResizing = false;
        let isSettingSize = false;
        mouseMv.bind({
            onDown: (evt, dpoint) => {
                this.fillArrFromText(this.options.getVarValue());
                if (this.collissionResult.hasCollied) {
                    this.updateOffset();
                    leftIndex = this.collissionResult.index;
                    rightIndex = leftIndex + 1;
                    rightNode = this.measurement[rightIndex];
                    leftNode = this.measurement[leftIndex];
                    if (rightNode != undefined)
                        rightNodeSize = rightNode.size;
                    leftNodeSize = leftNode.size;
                    this.isResizing = true;
                }
                else
                    return false;
                evt.preventDefault();
                return true;
            },
            onMove: (e, diff) => {
                let dval = diff.x;
                if (e.shiftKey || this.fillSize) {
                    if (rightNode == undefined) {
                        leftNode.size = leftNodeSize + dval;
                    }
                    else {
                        diff.x =
                            dval > 0
                                ? Math.min(dval, rightNodeSize)
                                : Math.max(dval, leftNodeSize * -1);
                        dval = diff.x;
                        leftNode.size = leftNodeSize + dval;
                        rightNode.size = rightNodeSize - dval;
                    }
                }
                else {
                    leftNode.size = leftNodeSize + dval;
                }
                if (isSettingSize)
                    return;
                isSettingSize = true;
                setTimeout(() => {
                    this.options.setVarValue(this.measureText);
                    this.Events.onResizing.fire([e, diff]);
                    isSettingSize = false;
                }, 1);
            },
            onUp: (e, diff) => {
                if (this.isResizing)
                    this.updateAr();
                isSettingSize = false;
                this.collissionResult.hasCollied = false;
                this.collissionResult.index = -1;
                this.isResizing = false;
            },
        }, this.options.container);
        this.options.grid.addEventListener("mouseenter", (e) => {
            this.updateOffset();
            this.options.container.addEventListener("mousemove", this.mousemovelistner);
            this.hasMouseEntered = true;
        });
        this.options.grid.addEventListener("mouseleave", (e) => {
            this.hasMouseEntered = false;
            this.options.container.removeEventListener("mousemove", this.mousemovelistner);
        });
    }
    updateOffset() {
        this.parentOffset = this.options.grid.getClientRects()[0];
        this.parentOffset.x -= this.options.grid.scrollLeft;
        this.parentOffset.y -= this.options.grid.scrollTop;
    }
    get varName() {
        return this._varName;
    }
    set varName(value) {
        this._varName = value;
    }
    getPrevIndex(index) {
        let rm = this.measurement;
        index--;
        for (; index >= 0 && rm[index].size == 0; index--)
            ;
        return index;
    }
    get measureText() {
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
exports.resizeManage = resizeManage;
