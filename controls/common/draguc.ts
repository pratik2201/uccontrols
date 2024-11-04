import { CommonEvent } from "ucbuilder/global/commonEvent";
import { Point, Size, Rect } from "ucbuilder/global/drawing/shapes";
import { Usercontrol } from "ucbuilder/Usercontrol";

enum dragMode {
    none = -1,
    move = 0,
    left = 1,
    top = 2,
    right = 3,
    bottom = 4,
    topleft = 5,
    topright = 6,
    bottomleft = 7,
    bottomright = 8,
}

export class dragUc {
    resizer = {
        left: document.createElement("resizer"),
        top: document.createElement("resizer"),
        right: document.createElement("resizer"),
        bottom: document.createElement("resizer"),
        topleft: document.createElement("corner"),
        topright: document.createElement("corner"),
        bottomleft: document.createElement("corner"),
        bottomright: document.createElement("corner"),
        rect: document.createElement("resizer"),
        cssDisplay(val: "block" | "none") {
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
        getResizerAr:(): HTMLElement[] => {
            if (this.allowResize) {
                let res = this.resizer;
                res.left.setAttribute("role","left");
                res.top.setAttribute("role","top");
                res.right.setAttribute("role","right");
                res.bottom.setAttribute("role","bottom");
                res.topleft.setAttribute("role","topleft");
                res.topright.setAttribute("role","topright");
                res.bottomleft.setAttribute("role","bottomleft");
                res.bottomright.setAttribute("role","bottomright");
                res.rect.setAttribute("role", "drawSelection");
                return [res.left, res.top, res.right, res.bottom,
                res.topleft, res.topright,
                res.bottomright, res.bottomleft];
            } else return [];
        },
        connect:(uc: Usercontrol = undefined)=> {
            let res = this.resizer;
            let ucHT = this.containerHT;
            
            if (this.allowResize) { 
                if (uc == undefined) {
                    ucHT.append(res.left, res.top, res.right, res.bottom,
                        res.topleft, res.topright, res.bottomright,
                        res.bottomleft, res.rect);
                } else {
                    ucHT.append(...uc.ucExtends.passElement(
                        [res.left, res.top, res.right, res.bottom, res.topleft,
                        res.topright, res.bottomright,
                        res.bottomleft, res.rect]) as HTMLElement[]);
                }
                
            }
        },
        getMode(ele: HTMLElement): dragMode {
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

    constructor() {

    }
    allowMove: boolean = true;
    allowResize: boolean = true;
    containerHT: HTMLElement = undefined;
    containerStyle: CSSStyleDeclaration = undefined;
    titleHT: HTMLElement[] = [];
    init(containerHT: HTMLElement, ...titleHT: HTMLElement[]) {
        this.containerHT = containerHT;
        this.containerStyle = window.getComputedStyle(this.containerHT);
        this.titleHT.push(...titleHT);
        this.callEvents();
    }
    getMode(ele: HTMLElement): dragMode {
        let index = this.titleHT.findIndex(s => s.contains(ele));
        if (index != -1) return dragMode.move;
        return this.resizer.getMode(ele);
    }
    Events = {
        onmousemove: (evt: MouseEvent) => false,
        onmousedown: (evt: MouseEvent) => false,
        onmouseup: (evt: MouseEvent) => false,
        onResizeStart: new CommonEvent<() => void>(),
        onResizeEnd: new CommonEvent<() => void>(),
        onMoveStart: new CommonEvent<() => void>(),
        onMoveEnd: new CommonEvent<() => void>(),
    };
    finalRect = {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
    }
    callEvents() {
        let _this = this;
        let controlRect = new Rect();
        let selectRect = new Rect();
        let rectStyles = this.resizer.rect.style;
        [...this.resizer.getResizerAr(), ...this.titleHT].on('mousedown', (evt: MouseEvent) => {
            if (!_this.allowMove || _this.Events.onmousedown(evt) === true) return;
            let mode = _this.getMode(evt.target as HTMLElement);
            if (mode != dragMode.none) {
                let real = _this.containerStyle,
                    cntnrPos = new Point(parseFloat(real.left), parseFloat(real.top)),
                    cntnrSize = new Size(parseFloat(real.width), parseFloat(real.height)),
                    downPos = new Point(evt.clientX, evt.clientY);
                controlRect.setBy.style(real);
                selectRect.setBy.rect(controlRect);
                selectRect.size.width -= 5;
                selectRect.size.height -= 5;
                selectRect.location.x = 0;
                selectRect.location.y = 0;
                
                switch (mode) {
                    case dragMode.move: this.Events.onMoveStart.fire(); break;
                    default: this.Events.onResizeStart.fire(); break;
                }
                let target = evt.target;
                document.body.addEventListener('mousemove', drag, false);
                function mouseup_mouseleave_event() {
                    document.body.removeEventListener('mousemove', drag, false);
                    switch (mode) {
                        case dragMode.move: _this.Events.onmouseup(evt); _this.Events.onMoveEnd.fire(); break;
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
                            //let cmpt = window.getComputedStyle(_this.containerHT);
                            //console.log([controlRect.width,Size.getFullWidth(cmpt)]);
                            
                            _this.Events.onResizeEnd.fire();
                            break;
                    }
                    _this.resizer.rect.style.display = "none";
                    mode = dragMode.none;
                }
                document.body.on('mouseup',mouseup_mouseleave_event );
                document.body.on('mouseleave',mouseup_mouseleave_event );
                function drag(evt: MouseEvent) {
                    if (_this.Events.onmousemove(evt) === true) return;
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
                        
                        _this.resizer.rect.setAttribute('style',styleText);
                    }
                };
            }
        });
    }
}