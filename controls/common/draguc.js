"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dragUc = void 0;
const commonEvent_1 = require("ucbuilder/global/commonEvent");
const shapes_1 = require("ucbuilder/global/drawing/shapes");
var dragMode;
(function (dragMode) {
    dragMode[dragMode["none"] = -1] = "none";
    dragMode[dragMode["move"] = 0] = "move";
    dragMode[dragMode["left"] = 1] = "left";
    dragMode[dragMode["top"] = 2] = "top";
    dragMode[dragMode["right"] = 3] = "right";
    dragMode[dragMode["bottom"] = 4] = "bottom";
    dragMode[dragMode["topleft"] = 5] = "topleft";
    dragMode[dragMode["topright"] = 6] = "topright";
    dragMode[dragMode["bottomleft"] = 7] = "bottomleft";
    dragMode[dragMode["bottomright"] = 8] = "bottomright";
})(dragMode || (dragMode = {}));
class dragUc {
    constructor() {
        this.resizer = {
            left: document.createElement("resizer"),
            top: document.createElement("resizer"),
            right: document.createElement("resizer"),
            bottom: document.createElement("resizer"),
            topleft: document.createElement("corner"),
            topright: document.createElement("corner"),
            bottomleft: document.createElement("corner"),
            bottomright: document.createElement("corner"),
            rect: document.createElement("resizer"),
            cssDisplay(val) {
                this.top.style.display =
                    this.right.style.display =
                        this.bottom.style.display =
                            this.left.style.display =
                                this.topleft.style.display =
                                    this.topright.style.display =
                                        this.bottomleft.style.display =
                                            this.bottomright.style.display =
                                                this.rect.style.display = val;
            },
            getResizerAr: () => {
                if (this.allowResize) {
                    let res = this.resizer;
                    res.left.setAttribute("role", "left");
                    res.top.setAttribute("role", "top");
                    res.right.setAttribute("role", "right");
                    res.bottom.setAttribute("role", "bottom");
                    res.topleft.setAttribute("role", "topleft");
                    res.topright.setAttribute("role", "topright");
                    res.bottomleft.setAttribute("role", "bottomleft");
                    res.bottomright.setAttribute("role", "bottomright");
                    res.rect.setAttribute("role", "drawSelection");
                    return [res.left, res.top, res.right, res.bottom,
                        res.topleft, res.topright,
                        res.bottomright, res.bottomleft];
                }
                else
                    return [];
            },
            connect: (uc = undefined) => {
                let res = this.resizer;
                let ucHT = this.containerHT;
                if (this.allowResize) {
                    if (uc == undefined) {
                        ucHT.append(res.left, res.top, res.right, res.bottom, res.topleft, res.topright, res.bottomright, res.bottomleft, res.rect);
                    }
                    else {
                        ucHT.append(...uc.ucExtends.passElement([res.left, res.top, res.right, res.bottom, res.topleft,
                            res.topright, res.bottomright,
                            res.bottomleft, res.rect]));
                    }
                }
            },
            getMode(ele) {
                switch (ele.stamp()) {
                    case this.top.stamp(): return dragMode.top;
                    case this.left.stamp(): return dragMode.left;
                    case this.right.stamp(): return dragMode.right;
                    case this.bottom.stamp(): return dragMode.bottom;
                    case this.topleft.stamp(): return dragMode.topleft;
                    case this.topright.stamp(): return dragMode.topright;
                    case this.bottomleft.stamp(): return dragMode.bottomleft;
                    case this.bottomright.stamp(): return dragMode.bottomright;
                    default: return dragMode.none;
                }
            }
        };
        this.allowMove = true;
        this.allowResize = true;
        this.containerHT = undefined;
        this.containerStyle = undefined;
        this.titleHT = [];
        this.Events = {
            onmousemove: (evt) => false,
            onmousedown: (evt) => false,
            onmouseup: (evt) => false,
            onResizeStart: new commonEvent_1.CommonEvent(),
            onResizeEnd: new commonEvent_1.CommonEvent(),
            onMoveStart: new commonEvent_1.CommonEvent(),
            onMoveEnd: new commonEvent_1.CommonEvent(),
        };
        this.finalRect = {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
        };
    }
    init(containerHT, ...titleHT) {
        this.containerHT = containerHT;
        this.containerStyle = window.getComputedStyle(this.containerHT);
        this.titleHT.push(...titleHT);
        this.callEvents();
    }
    getMode(ele) {
        let index = this.titleHT.findIndex(s => s.contains(ele));
        if (index != -1)
            return dragMode.move;
        return this.resizer.getMode(ele);
    }
    callEvents() {
        let _this = this;
        let controlRect = new shapes_1.Rect();
        let selectRect = new shapes_1.Rect();
        let rectStyles = this.resizer.rect.style;
        [...this.resizer.getResizerAr(), ...this.titleHT].on('mousedown', (evt) => {
            if (!_this.allowMove || _this.Events.onmousedown(evt) === true)
                return;
            let mode = _this.getMode(evt.target);
            if (mode != dragMode.none) {
                let real = _this.containerStyle, cntnrPos = new shapes_1.Point(parseFloat(real.left), parseFloat(real.top)), cntnrSize = new shapes_1.Size(parseFloat(real.width), parseFloat(real.height)), downPos = new shapes_1.Point(evt.clientX, evt.clientY);
                controlRect.setBy.style(real);
                selectRect.setBy.rect(controlRect);
                selectRect.size.width -= 5;
                selectRect.size.height -= 5;
                selectRect.location.x = 0;
                selectRect.location.y = 0;
                switch (mode) {
                    case dragMode.move:
                        this.Events.onMoveStart.fire();
                        break;
                    default:
                        this.Events.onResizeStart.fire();
                        break;
                }
                let target = evt.target;
                document.body.addEventListener('mousemove', drag, false);
                function mouseup_mouseleave_event() {
                    document.body.removeEventListener('mousemove', drag, false);
                    switch (mode) {
                        case dragMode.move:
                            _this.Events.onmouseup(evt);
                            _this.Events.onMoveEnd.fire();
                            break;
                        case dragMode.none: break;
                        default:
                            _this.finalRect.left = controlRect.left;
                            _this.finalRect.top = controlRect.top;
                            _this.finalRect.width = controlRect.width;
                            _this.finalRect.height = controlRect.height;
                            _this.containerHT.style.left = controlRect.left + "px";
                            _this.containerHT.style.top = controlRect.top + "px";
                            _this.containerHT.style.width = controlRect.width + "px";
                            _this.containerHT.style.height = controlRect.height + "px";
                            _this.Events.onResizeEnd.fire();
                            break;
                    }
                    _this.resizer.rect.style.display = "none";
                    mode = dragMode.none;
                }
                document.body.on('mouseup', mouseup_mouseleave_event);
                document.body.on('mouseleave', mouseup_mouseleave_event);
                function drag(evt) {
                    if (_this.Events.onmousemove(evt) === true)
                        return;
                    let difx = evt.clientX - downPos.x;
                    let dify = evt.clientY - downPos.y;
                    let drawRect = true;
                    switch (mode) {
                        case dragMode.move:
                            _this.containerHT.style.left = cntnrPos.x + difx + 'px';
                            _this.containerHT.style.top = cntnrPos.y + dify + 'px';
                            _this.finalRect.left = cntnrPos.x + difx;
                            _this.finalRect.top = cntnrPos.y + dify;
                            drawRect = false;
                            break;
                        case dragMode.left:
                            controlRect.left = cntnrPos.x + difx;
                            controlRect.width = cntnrSize.width - difx;
                            selectRect.left = difx;
                            selectRect.width = cntnrSize.width - difx;
                            break;
                        case dragMode.top:
                            controlRect.top = cntnrPos.y + dify;
                            controlRect.height = cntnrSize.height - dify;
                            selectRect.top = dify;
                            selectRect.height = cntnrSize.height - dify;
                            break;
                        case dragMode.bottom:
                            controlRect.height = cntnrSize.height + dify;
                            selectRect.height = cntnrSize.height + dify;
                            break;
                        case dragMode.right:
                            controlRect.width = cntnrSize.width + difx;
                            selectRect.width = cntnrSize.width + difx;
                            break;
                        case dragMode.topleft:
                            controlRect.top = cntnrPos.y + dify;
                            controlRect.left = cntnrPos.x + difx;
                            controlRect.width = cntnrSize.width - difx;
                            controlRect.height = cntnrSize.height - dify;
                            selectRect.top = dify;
                            selectRect.left = difx;
                            selectRect.width = cntnrSize.width - difx;
                            selectRect.height = cntnrSize.height - dify;
                            break;
                        case dragMode.topright:
                            controlRect.top = cntnrPos.y + dify;
                            controlRect.height = cntnrSize.height - dify;
                            controlRect.width = cntnrSize.width + difx;
                            selectRect.top = dify;
                            selectRect.height = cntnrSize.height - dify;
                            selectRect.width = cntnrSize.width + difx;
                            break;
                        case dragMode.bottomleft:
                            controlRect.height = cntnrSize.height + dify;
                            controlRect.left = cntnrPos.x + difx;
                            controlRect.width = cntnrSize.width - difx;
                            selectRect.height = cntnrSize.height + dify;
                            selectRect.left = difx;
                            selectRect.width = cntnrSize.width - difx;
                            break;
                        case dragMode.bottomright:
                            controlRect.height = cntnrSize.height + dify;
                            controlRect.width = cntnrSize.width + difx;
                            selectRect.height = cntnrSize.height + dify;
                            selectRect.width = cntnrSize.width + difx;
                            break;
                    }
                    if (drawRect) {
                        let styleText = `
                            left:${selectRect.left}px;
                            top:${selectRect.top}px;
                            width:${selectRect.width}px;
                            height:${selectRect.height}px;display:block;`;
                        _this.resizer.rect.setAttribute('style', styleText);
                    }
                }
                ;
            }
        });
    }
}
exports.dragUc = dragUc;
