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
        this.main.ucExtends.self.addEventListener("mouseenter", (e) => {
            console.log('enter');
            this.dgvDomRect.setBy.HTMLEle(this.main.detail);
            window.addEventListener("mousemove", this.mouseoverlistner);
            this.main.detail.addEventListener("scroll", this.refreshScrollbar);
        });
        this.main.ucExtends.self.addEventListener("mouseleave", (e) => {
            console.log('leave');
            window.removeEventListener("mousemove", this.mouseoverlistner);
            this.main.detail.removeEventListener("scroll", this.refreshScrollbar);
        });
        this.main.resizerTop.addEventListener("mousedown",(e)=>{
            console.log(this.lastOverCell);
        });        
    }

    /** @type {HTMLElement}  */
    lastOverCell = undefined;
    /** @param {Event} e  */
    refreshScrollbar = (e) => {
        let scrollBarWidth = this.main.detail.offsetWidth - this.main.detail.clientWidth;
        this.main.header.style.marginRight =
        this.main.footer.style.marginRight =  scrollBarWidth+"px";
        this.main.header.scrollLeft =
        this.main.footer.scrollLeft = this.main.detail.scrollLeft;
    }
    /** @param {MouseEvent} e  */
    mouseoverlistner = (e) => {
        this.lastOverCell = this.getCell(document.elementsFromPoint(e.clientX, e.clientY));
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
                "left": `${cell.offsetLeft + this.dgvDomRect.left}px`,
                "width": `${cell.offsetWidth}px`,
                "top": `${this.dgvDomRect.top}px`,
                "height": `${this.dgvDomRect.height}px`,
               // 'visibility': 'visible',
            });
        }
        let row = this.getRow(cell);
        if (row != undefined) {
            Object.assign(this.main.transHoverHorizontalline.style, {
                "left": `${this.dgvDomRect.left}px`,
                "width": `${this.dgvDomRect.width}px`,
                "top": `${row.offsetTop + this.dgvDomRect.top - this.main.detail.scrollTop}px`,
                "height": `${row.offsetHeight}px`,
               // 'visibility': 'visible',
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