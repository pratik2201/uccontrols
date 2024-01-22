import { Usercontrol } from 'ucbuilder/Usercontrol';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';
import { UcOptions } from 'ucbuilder/enumAndMore';
/**
 *  code filename must same and case sensitive with classname 
 */
import { Movable } from './Movable.uc';


export class Designer extends Usercontrol {    
    static get giveMeHug(): string {
        return Usercontrol.giveMeHug;
    }
    
    public dragme: HTMLUnknownElement;
    public title_panel: HTMLElement;
    public lbl_title: HTMLElement;
    public cmd_close: HTMLUnknownElement;
    public container1: HTMLUnknownElement;

    
    constructor(){ super(); }
    initializecomponent(argsLst: IArguments, form: Movable) {
         //let fargs = argsLst[0];
        //let args = fargs[fargs.length - 1];
        let args = argsLst[argsLst.length - 1] as UcOptions;
        let ucExt = this.ucExtends;
        ucExt.initializecomponent(args);        
        let CONTROLS = ucExt.designer.getAllControls();
          this.dragme = CONTROLS.dragme as HTMLUnknownElement;
          this.title_panel = CONTROLS.title_panel as HTMLElement;
          this.lbl_title = CONTROLS.lbl_title as HTMLElement;
          this.cmd_close = CONTROLS.cmd_close as HTMLUnknownElement;
          this.container1 = CONTROLS.container1 as HTMLUnknownElement;

        ucExt.finalizeInit(args);
    }
}