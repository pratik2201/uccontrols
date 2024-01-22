import { Usercontrol } from 'ucbuilder/Usercontrol';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';
import { UcOptions } from 'ucbuilder/enumAndMore';
/**
 *  code filename must same and case sensitive with classname 
 */
import { Pager } from './Pager.uc';


export class Designer extends Usercontrol {    
    static get giveMeHug(): string {
        return Usercontrol.giveMeHug;
    }
    
    public cmd_prev: HTMLUnknownElement;
    public container1: HTMLTableElement;
    public cmd_next: HTMLUnknownElement;

    
    constructor(){ super(); }
    initializecomponent(argsLst: IArguments, form: Pager) {
         //let fargs = argsLst[0];
        //let args = fargs[fargs.length - 1];
        let args = argsLst[argsLst.length - 1] as UcOptions;
        let ucExt = this.ucExtends;
        ucExt.initializecomponent(args);        
        let CONTROLS = ucExt.designer.getAllControls();
          this.cmd_prev = CONTROLS.cmd_prev as HTMLUnknownElement;
          this.container1 = CONTROLS.container1 as HTMLTableElement;
          this.cmd_next = CONTROLS.cmd_next as HTMLUnknownElement;

        ucExt.finalizeInit(args);
    }
}