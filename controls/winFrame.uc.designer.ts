import { Usercontrol } from 'ucbuilder/Usercontrol';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';
import { UcOptions } from 'ucbuilder/enumAndMore';
/**
 *  code filename must same and case sensitive with classname 
 */
import { winFrame } from './winFrame.uc';


export class Designer extends Usercontrol {    
    static get giveMeHug(): string {
        return Usercontrol.giveMeHug;
    }
    
    public title_panel: HTMLElement;
    public lbl_title: HTMLElement;
    public cmd_close: HTMLUnknownElement;
    public container1: HTMLUnknownElement;

    
    constructor(){ super(); }
    initializecomponent(argsLst: IArguments, form: winFrame) {
        let fargs = Usercontrol.extractArgs(arguments);
        let args = fargs[fargs.length-1] as UcOptions;
        let ucExt = this.ucExtends;
        
        ucExt.initializecomponent(args);        
        let CONTROLS = ucExt.designer.getAllControls();
          this.title_panel = CONTROLS.title_panel as HTMLElement;
          this.lbl_title = CONTROLS.lbl_title as HTMLElement;
          this.cmd_close = CONTROLS.cmd_close as HTMLUnknownElement;
          this.container1 = CONTROLS.container1 as HTMLUnknownElement;

        ucExt.finalizeInit(args);
        ucExt.session.prepareForAutoLoadIfExist();
        if (args.loadAt) args.loadAt.appendChild(ucExt.wrapperHT);
        ucExt.Events.loaded.fire();
        Usercontrol.assignPropertiesFromDesigner(form);
    }
}