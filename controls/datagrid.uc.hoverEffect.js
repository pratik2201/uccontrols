const { Rect } = require("@uccontrols:/../ucbuilder/global/drawing/shapes");
const datagrid = require("@uccontrols:/controls/datagrid.uc");
/**
 * @typedef {import ("@uccontrols:/controls/datagrid.uc").datagrid} datagrid
 */
class hoverEffect {
    constructor() { }
    nodes = {
        /** @type {HTMLElement}  */
        drawHoverRect: `<trans-hover role="drawHover" x-name="transHoverVerticalline"></trans-hover>`.$(),
        /** @type {HTMLElement}  */
        resizerHoriz: `<resizer role="left" ></resizer>`.$(),
        /** @type {HTMLElement}  */
        resizerVertical: `<resizer role="bottom" ></resizer>`.$(),
        main: () => { return this.main; },
        init() {
            this.drawHoverRect.appendChild(this.resizerHoriz);
            this.drawHoverRect.appendChild(this.resizerVertical);
            this.main().ucExtends.passElement(this.drawHoverRect);
        }
    }

    /**
     * @param {datagrid} main 
     */
    init(main) {
        this.main = main;
        //this.nodes.init();
        this.main.detail.addEventListener("mouseenter", (e) => {            
            this.dgvDomRect.setBy.HTMLEle(this.main.detail);
            this.main.ucExtends.self.addEventListener("mouseover", this.mouseoverlistner);
            this.main.detail.addEventListener("scroll", this.refreshScrollbar);
        });
        this.main.detail.addEventListener("mouseleave", (e) => {
            
            this.main.ucExtends.self.removeEventListener("mouseover", this.mouseoverlistner);
            this.main.detail.removeEventListener("scroll", this.refreshScrollbar);
        });

    }
    /** @type {Rect}  */
    dgvDomRect = new Rect();
    /** @type {HTMLElement}  */
    lastOverCell = undefined;
    /** @param {Event} e  */
    refreshScrollbar = (e) => {
        let scrollBarWidth = this.scrollBarWidth;
        this.main.header.style.marginRight =
            this.main.footer.style.marginRight = scrollBarWidth + "px";
        this.main.header.scrollLeft =
            this.main.footer.scrollLeft = this.main.detail.scrollLeft;
    }
    get scrollBarWidth() { return this.main.detail.offsetWidth - this.main.detail.clientWidth; }
    get scrollBarHeight() { return this.main.detail.offsetHeight - this.main.detail.clientHeight; }
    /** @param {MouseEvent} e  */
    mouseoverlistner = (e) => {
        let cell = this.getCell(document.elementsFromPoint(e.clientX, e.clientY));
        if (cell == this.lastOverCell) return;
        this.lastOverCell = cell;
        this.drawHoverEffect();
    }
    hide() {
        // Object.assign(this.main.transHoverVerticalline.style, { 'visibility': 'collapse' });
    }
    drawHoverEffect = () => {
        //console.log('here');
        /** @type {HTMLElement}  */
        let row = undefined;
        let cell = this.lastOverCell;
        if (cell != undefined) {
            row = this.getRow(cell);
            switch (this.main.gridRsz.fillMode) {
                case 'fill':
                    if (cell.previousElementSibling != null) {
                        Object.assign(this.main.resizerVertical.style, {
                            "left": `${cell.offsetLeft - 3}px`,
                            "width": `${1}px`,
                            "top": `${this.main.detail.scrollTop}px`,
                            "height": `${this.dgvDomRect.height - this.scrollBarHeight}px`,
                            // 'visibility': 'visible',
                        });
                    }
                    if (row != undefined) {
                        Object.assign(this.main.resizerHorizontal.style, {
                            "left": `${this.main.detail.scrollLeft}px`,
                            "width": `${this.dgvDomRect.width - this.scrollBarWidth - 5}px`,
                            "top": `${row.offsetTop - 3}px`,
                            "height": `${1}px`,
                        });
                    }

                    break;
                case 'unfill':
                    Object.assign(this.main.resizerVertical.style, {
                        "left": `${cell.offsetLeft + cell.offsetWidth - 3}px`,
                        "width": `${1}px`,
                        "top": `${this.main.detail.scrollTop}px`,
                        "height": `${this.dgvDomRect.height - this.scrollBarHeight}px`,
                        // 'visibility': 'visible',
                    });

                    if (row != undefined) {
                        Object.assign(this.main.resizerHorizontal.style, {
                            "left": `${this.main.detail.scrollLeft}px`,
                            "width": `${this.dgvDomRect.width - this.scrollBarWidth}px`,
                            "top": `${row.offsetTop + row.offsetHeight - 3}px`,
                            "height": `${1}px`,
                        });
                    }


                    break;
            }
        }
    }

    /**
     * @param {HTMLElement[]} elem 
     * @returns {HTMLElement}
     */
    getCell(elem = []) {
        let lname = this.main.node.cellNodeName.toUpperCase();
        return elem.find(s => s.nodeName == lname);
        /*if (elem == undefined) return undefined;
        if (elem.nodeName.toLowerCase() == this.node.cellNodeName.toLowerCase()) return elem;
        else return this.getCell(elem.parentElement);*/
    }
    /**
     * @param {HTMLElement} cell 
     * @returns {HTMLElement}
     */
    getRow(cell) {
        if (cell == undefined) return undefined;
        return cell.parentElement;
        /*if (cell.nodeName.toLowerCase() == this.main.node.rowNodeName.toLowerCase()) return cell;
        else return this.getRow(cell.parentElement);*/
    }
}
module.exports = { hoverEffect };