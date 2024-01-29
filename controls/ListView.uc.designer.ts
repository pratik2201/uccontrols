import { Usercontrol } from 'ucbuilder/Usercontrol';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';
import { UcOptions } from 'ucbuilder/enumAndMore';
/**
 *  code filename must same and case sensitive with classname 
 */
import { ListView } from './ListView.uc';


export class Designer extends Usercontrol {    
    static get giveMeHug(): string {
        return Usercontrol.giveMeHug;
    }
    
    public begin_scroll_text: HTMLElement;
    public scroller1: HTMLUnknownElement;
    public ll_view: HTMLUnknownElement;
    public end_scroll_text: HTMLElement;
    public hscrollbar1: HTMLUnknownElement;
    public vscrollbar1: HTMLUnknownElement;

    
    constructor(){ super(); }
    initializecomponent(argsLst: IArguments, form: ListView) {
         //let fargs = argsLst[0];
        //let args = fargs[fargs.length - 1];
        //let args = argsLst[argsLst.length - 1] as UcOptions;
        let fargs = Usercontrol.extractArgs(arguments);
        let args = fargs[fargs.length-1] as UcOptions;
        let ucExt = this.ucExtends;
        
        ucExt.initializecomponent(args);        
        let CONTROLS = ucExt.designer.getAllControls();
          this.begin_scroll_text = CONTROLS.begin_scroll_text as HTMLElement;
          this.scroller1 = CONTROLS.scroller1 as HTMLUnknownElement;
          this.ll_view = CONTROLS.ll_view as HTMLUnknownElement;
          this.end_scroll_text = CONTROLS.end_scroll_text as HTMLElement;
          this.hscrollbar1 = CONTROLS.hscrollbar1 as HTMLUnknownElement;
          this.vscrollbar1 = CONTROLS.vscrollbar1 as HTMLUnknownElement;

        ucExt.finalizeInit(args);
        Usercontrol.assignPropertiesFromDesigner(form);
    }
}