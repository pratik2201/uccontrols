import { Designer } from './winFrame.uc.designer';
import { dragUc } from 'uccontrols/controls/common/draguc';
import { UcStates } from 'ucbuilder/enumAndMore';
export class winFrame extends Designer {

    private _backgroundOpacity: number = 0.500;
    set backgroundOpacity(val: number) { this._backgroundOpacity = val > 1 ? val / 1000 : val }
    get backgroundOpacity(): number { return this._backgroundOpacity; }

    static hasInitedTransperency: boolean = false;

    get allowMove(): boolean { return this.drag.allowMove; }
    set allowMove(val: boolean) { this.drag.allowMove = val; }
    get allowResize(): boolean { return this.drag.allowResize; }
    set allowResize(val: boolean) { this.drag.allowResize = val; }

    designAll(): void {

        let titleHT: HTMLElement = this.ucExtends.wrapperHT;

        let ctrls: HTMLElement[] = [];
        for (let index = 0; index < this.ucExtends.garbageElementsHT.length; index++) {
            const node = this.ucExtends.garbageElementsHT[index] as HTMLElement;
            if (!node.is(titleHT)) {
                ctrls.push(node);
            }
        }
        ctrls.forEach(ctr => {
            this.container1.appendChild(ctr);
        });
        this.ucExtends.stageHT = this.container1;
    }
    get parentUCExt() { return this.ucExtends.PARENT.ucExtends; }
    get parentElementHT() { return this.parentUCExt.wrapperHT; }
    constructor() {
        super();
        this.initializecomponent(arguments, this);
        this.ucExtends.session.autoLoadSession = true;
        this.drag.finalRect = this.SESSION_DATA.rect;
        //this.parentUCExt = this.ucExtends.PARENT.ucExtends;
        //this.parentElementHT = this.parentUCExt.wrapperHT;
        if (this.ucExtends.mode == 'client') {
            this.parentUCExt.Events.loaded.on(() => {
                //setTimeout(() => {
                // debugger;
                let chd = window.getComputedStyle(this.ucExtends.wrapperHT);
                this.parentElementHT.style.width = chd.width;
                this.parentElementHT.style.height = chd.height;
                //console.log(chd.height + ":" + this.parentElementHT.offsetHeight);
                this.SESSION_DATA.rect.width = parseFloat(chd.width);
                this.SESSION_DATA.rect.height = parseFloat(chd.height);
                // })
            });

        }
        this.init();

        this.parentUCExt.Events.activate.on(() => {
            //this.parentElementHT.before(winFrame.transperency);
        });
        this.ucExtends.Events.loadLastSession.on(() => {
            //debugger;
            this.drag.finalRect = this.SESSION_DATA.rect;
            this.loadSession();
        });
        this.drag.Events.onmouseup = (evt) => {
            this.ucExtends.session.onModify();
            return false;
        }
        this.drag.Events.onResizeEnd.on(() => {
            this.ucExtends.session.onModify();
        });



    }

    loadSession(): void {
        let selectRect = this.SESSION_DATA.rect;
        let containerHT = this.drag.containerHT;
        this.ucExtends.windowstate = this.SESSION_DATA.winState;
        this.checkState(this.SESSION_DATA.winState);
    }
    checkState(state: UcStates): void {
        this.SESSION_DATA.winState = state;
        switch (state) {
            case 'dock':
                this.ucExtends.self.setAttribute("win-state", "dock");
                this.SESSION_DATA.oldstyleText = this.parentElementHT.style.cssText;
                Object.assign(this.parentElementHT.style, {
                    position: "static",
                    width: "100%",
                    height: "100%",
                    display: "block",
                });
                this.drag.resizer.cssDisplay("none");
                break;
            case 'normal':
                this.ucExtends.self.setAttribute("win-state", "normal");

                Object.assign(this.parentElementHT.style, {
                    position: "absolute",
                    left: this.SESSION_DATA.rect.left + "px",
                    top: this.SESSION_DATA.rect.top + "px",
                    width: this.SESSION_DATA.rect.width + "px",
                    height: this.SESSION_DATA.rect.height + "px",
                });

                // this.drag.resizer.cssDisplay("block");
                break;
        }
    }
    init(): void {

        this.initEvent();
        this.lbl_title.innerText = this.parentUCExt.wrapperHT.getAttribute("x-caption");

    }
    private drag: dragUc = new dragUc();
    private SESSION_DATA = {
        winState: 'normal' as UcStates,
        oldstyleText: '',
        rect: {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
        }
    }
    initEvent(): void {
        //this.parentUCExt = this.ucExtends.PARENT.ucExtends;
        //this.parentElementHT = this.parentUCExt.wrapperHT;

        // this.container = ResourcesUC.contentHT;

        this.designAll();

        this.drag.init(this.parentElementHT, this.title_panel);
        this.drag.resizer.connect(this);
        this.parentUCExt.Events.captionChanged.on((nval) => {
            this.lbl_title.innerText = nval;
        });
        this.cmd_close.on('mouseup', (event) => {
            this.parentUCExt.close();
        });

    }

}