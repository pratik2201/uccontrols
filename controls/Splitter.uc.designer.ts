import { Usercontrol } from 'ucbuilder/Usercontrol';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';
import { UcOptions } from 'ucbuilder/enumAndMore';
/**
 *  code filename must same and case sensitive with classname 
 */
import { Splitter } from './Splitter.uc';


export class Designer extends Usercontrol {    
    static get giveMeHug(): string {
        return Usercontrol.giveMeHug;
    }
    
    public mainContainer: HTMLUnknownElement;

    
    constructor(){ super(); }
    initializecomponent(argsLst: IArguments, form: Splitter) {
         //let fargs = argsLst[0];
        //let args = fargs[fargs.length - 1];
        //let args = argsLst[argsLst.length - 1] as UcOptions;
        let fargs = Usercontrol.extractArgs(arguments);
        let args = fargs[fargs.length-1] as UcOptions;
        let ucExt = this.ucExtends;
        
        ucExt.initializecomponent(args);        
        let CONTROLS = ucExt.designer.getAllControls();
          this.mainContainer = CONTROLS.mainContainer as HTMLUnknownElement;

        ucExt.finalizeInit(args);
        Usercontrol.assignPropertiesFromDesigner(form);
    }
}