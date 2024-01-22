import { Usercontrol } from 'ucbuilder/Usercontrol';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';
import { UcOptions } from 'ucbuilder/enumAndMore';
/**
 *  code filename must same and case sensitive with classname 
 */
import { singleSplitter } from './singleSplitter.uc';


export class Designer extends Usercontrol {    
    static get giveMeHug(): string {
        return Usercontrol.giveMeHug;
    }
    
    public mainGrid: HTMLUnknownElement;

    
    constructor(){ super(); }
    initializecomponent(argsLst: IArguments, form: singleSplitter) {
         //let fargs = argsLst[0];
        //let args = fargs[fargs.length - 1];
        let args = argsLst[argsLst.length - 1] as UcOptions;
        let ucExt = this.ucExtends;
        ucExt.initializecomponent(args);        
        let CONTROLS = ucExt.designer.getAllControls();
          this.mainGrid = CONTROLS.mainGrid as HTMLUnknownElement;

        ucExt.finalizeInit(args);
    }
}