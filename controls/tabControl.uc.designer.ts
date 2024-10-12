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
    
        
    public tpt_itemnode: import('uccontrols/controls/tabControl/itemNode.tpt').itemNode;
    public container1: HTMLUnknownElement;
    public tabHeader: HTMLElement;
    public tabView: HTMLUnknownElement;

    
    constructor(){ super(); }
    initializecomponent(argsLst: IArguments, form: tabControl) {
        let fargs = Usercontrol.extractArgs(arguments);
        let args = fargs[fargs.length-1] as UcOptions;
        let ucExt = this.ucExtends;
        
        ucExt.initializecomponent(args);        
        let CONTROLS = ucExt.designer.getAllControls();
        
        
        this.tpt_itemnode = intenseGenerator.generateTPT('uccontrols/controls/tabControl/itemNode.tpt.ts',{ 
                            parentUc : this, 
                            elementHT : CONTROLS.tpt_itemnode 
                       }) as any;
          this.container1 = CONTROLS.container1 as HTMLUnknownElement;
          this.tabHeader = CONTROLS.tabHeader as HTMLElement;
          this.tabView = CONTROLS.tabView as HTMLUnknownElement;

        ucExt.finalizeInit(args);
        Usercontrol.assignPropertiesFromDesigner(form);
    }
}