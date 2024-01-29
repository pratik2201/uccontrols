import { Usercontrol } from 'ucbuilder/Usercontrol';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';
import { UcOptions } from 'ucbuilder/enumAndMore';
/**
 *  code filename must same and case sensitive with classname 
 */
import { comboBox } from './comboBox.uc';


export class Designer extends Usercontrol {    
    static get giveMeHug(): string {
        return Usercontrol.giveMeHug;
    }
    
    public txt_editor: HTMLUnknownElement;
    public cmd_drop: HTMLUnknownElement;
         
   
    public ll_view: import('uccontrols/controls/LinearList.uc').LinearList;

    
    constructor(){ super(); }
    initializecomponent(argsLst: IArguments, form: comboBox) {
         //let fargs = argsLst[0];
        //let args = fargs[fargs.length - 1];
        //let args = argsLst[argsLst.length - 1] as UcOptions;
        let fargs = Usercontrol.extractArgs(arguments);
        let args = fargs[fargs.length-1] as UcOptions;
        let ucExt = this.ucExtends;
        
        ucExt.initializecomponent(args);        
        let CONTROLS = ucExt.designer.getAllControls();
          this.txt_editor = CONTROLS.txt_editor as HTMLUnknownElement;
          this.cmd_drop = CONTROLS.cmd_drop as HTMLUnknownElement;
         
        
       
        this.ll_view = intenseGenerator.generateUC('uccontrols/controls/LinearList.uc.ts',{ 
                            parentUc : this, 
                            mode:args.mode,
                            session:{
                                loadBySession:args.session.loadBySession,
                                uniqueIdentity:"ll_view" , 
                                addNodeToParentSession:true,
                            },                           
                            wrapperHT : CONTROLS.ll_view 
                        }) as any;

        ucExt.finalizeInit(args);
        Usercontrol.assignPropertiesFromDesigner(form);
    }
}