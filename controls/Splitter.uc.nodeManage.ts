import { splitersGrid } from "uccontrols/controls/Splitter.uc.splitersGrid";
import { intenseGenerator } from "ucbuilder/intenseGenerator.js.js";
import { SpliterType } from 'uccontrols/controls/Splitter.uc.enumAndMore.js';
import { boxHandler } from 'uccontrols/controls/Splitter.uc.boxHandler.js';
import { Splitter } from 'uccontrols/controls/Splitter.uc';

export class nodeManage {
    main: Splitter | undefined;

    init(main: Splitter) {
        this.main = main;
    }

    givePlainNode(splGrid: splitersGrid) {
        let node: HTMLElement = document.createElement('node');
        let view: HTMLElement = document.createElement('view');
        node.appendChild(view);
        this.main.ucExtends.passElement(node);
        let box = new boxHandler();
        node.data('box', box);        
        box.init(splGrid, node, view);
        return {
            node: node,
            view: view,
            box: box
        };
    }

    giveReadyNode(splGrid: splitersGrid) {
        let sadoNode = this.givePlainNode(splGrid);
        let ucs = intenseGenerator.generateUC(this.main.SESSION_DATA.primaryContainer,
                        { parentUc: this.main });
        sadoNode.view.appendChild(ucs.ucExtends.self);
        sadoNode.box.uc = ucs;
        return {
            node: sadoNode.node,
            view: sadoNode.view,
            box: sadoNode.box,
        }
    }

    giveNewGrid(type: SpliterType = 'notdefined'): Splitter {
        let elementHT: HTMLElement = document.createElement('Splitter');
        elementHT.setAttribute("x.SESSION_DATA.type", `=${type}`);
        elementHT.setAttribute("x:generateNode", "false");
        let uc = intenseGenerator.generateUC("uccontrols/controls/Splitter.uc.html", {
            targetElement: elementHT,
            parentUc: this.main
        }) as Splitter;
       
        /*let ms = nodeManage.getMod('uccontrols/controls/Splitter.uc.js').then((v) => {
           
        })*/
        return uc;
    }
    
    
}