import { Usercontrol } from 'ucbuilder/Usercontrol';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';
import { UcOptions } from 'ucbuilder/enumAndMore';
/**
 *  code filename must same and case sensitive with classname 
 */
import { tabControl } from './tabControl.uc';


export class Designer extends Usercontrol {    
    static get giveMeHug(): string {
        return Usercontrol.giveMeHug;
    }
    
        
    public tpt_itemnode: import('uccontrols/controls/tabcontrol/itemnode.tpt.ts');
    public container1: HTMLUnknownElement;
    public tabHeader: HTMLElement;
    public tabView: HTMLUnknownElement;

    
    constructor(){ super(); }
    initializecomponent(argsLst: IArguments, form: tabControl) {
         //let fargs = argsLst[0];
        //let args = fargs[fargs.length - 1];
        let args = argsLst[argsLst.length - 1] as UcOptions;
        let ucExt = this.ucExtends;
        ucExt.initializecomponent(args);        
        let CONTROLS = ucExt.designer.getAllControls();
        
        /**
         * @type {import ('uccontrols/controls/tabcontrol/itemnode.tpt.ts')} \<itemnode\> 
         **/
        this.tpt_itemnode = intenseGenerator.generateTPT('uccontrols/controls/tabcontrol/itemnode.tpt.ts',{ 
                            parentUc : this, 
                            elementHT : CONTROLS.tpt_itemnode 
                       });
          this.container1 = CONTROLS.container1 as HTMLUnknownElement;
          this.tabHeader = CONTROLS.tabHeader as HTMLElement;
          this.tabView = CONTROLS.tabView as HTMLUnknownElement;

        ucExt.finalizeInit(args);
    }
}