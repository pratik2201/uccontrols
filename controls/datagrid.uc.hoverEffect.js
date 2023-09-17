const { Rect } = require("@uccontrols:/../ucbuilder/global/drawing/shapes");
const datagrid = require("@uccontrols:/controls/datagrid.uc");
/**
 * @typedef {import ("@uccontrols:/controls/datagrid.uc").datagrid} datagrid
 */
class hoverEffect {
    constructor() { }
    /** @type {Rect}  */
    dgvDomRect = new Rect();
    /**
     * @param {datagrid} main 
     */
    init(main) {
        this.main = main;
        this.main.detail.addEventListener("mouseenter", (e) => {
            this.dgvDomRect.setBy.HTMLEle(this.main.detail);
            this.main.ucExtends.self.addEventListener("mouseover", this.mouseoverlistner);
            this.main.detail.addEventListener("scroll", this.refreshScrollbar);
        });
        this.main.detail.addEventListener("mouseleave", (e) => {
            //console.log('mouseleave');
            this.main.ucExtends.self.removeEventListener("mouseover", this.mouseoverlistner);
            this.main.detail.removeEventListener("scroll", this.refreshScrollbar);
        });

    }
    
    /** @type {HTMLElement}  */
    lastOverCell = undefined;
    /** @param {Event} e  */
    refreshScrollbar = (e) => {
        let scrollBarWidth = this.scrollBarWidth;
        this.main.header.style.marginRight =
        this.main.footer.style.marginRight =  scrollBarWidth+"px";
        this.main.header.scrollLeft =
        this.main.footer.scrollLeft = this.main.detail.scrollLeft;
    }
    get scrollBarWidth(){ return this.main.detail.offsetWidth - this.main.detail.clientWidth; }
    get scrollBarHeight(){ return this.main.detail.offsetHeight - this.main.detail.clientHeight; }
    /** @param {MouseEvent} e  */
    mouseoverlistner = (e) => {
        let cell = this.getCell(document.elementsFromPoint(e.clientX, e.clientY));
        if(cell==this.lastOverCell)return;
        this.lastOverCell = cell;
        this.drawHoverEffect();
    }
    hide(){
        Object.assign(this.main.transHoverVerticalline.style, {'visibility': 'collapse' });
    }
    isShowing = false;
    drawHoverEffect = () => {
        //console.log('here');
        let cell = this.lastOverCell;
        if (cell != undefined) {
            Object.assign(this.main.transHoverVerticalline.style, {
                "left": `${cell.offsetLeft}px`,
                "width": `${cell.offsetWidth}px`,
                "top": `${this.main.detail.scrollTop}px`,
                "height": `${this.dgvDomRect.height-this.scrollBarHeight}px`,
               // 'visibility': 'visible',
            });
        }
        let row = this.getRow(cell);
        if (row != undefined) {
            Object.assign(this.main.transHoverHorizontalline.style, {
                "left": `${this.main.detail.scrollLeft}px`,
                "width": `${this.dgvDomRect.width-this.scrollBarWidth}px`,
                "top": `${row.offsetTop}px`,
                "height": `${row.offsetHeight}px`,
            });
        }
        this.isShowing = false;
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
        if (cell.nodeName.toLowerCase() == this.main.node.rowNodeName.toLowerCase()) return cell;
        else return this.getRow(cell.parentElement);
    }
}
module.exports = { hoverEffect };