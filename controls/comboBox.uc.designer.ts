import { Usercontrol } from 'ucbuilder/Usercontrol';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';
import { UcOptions } from 'ucbuilder/enumAndMore';
import { VariableList } from 'ucbuilder/global/stylerRegs';
import { LinearList } from 'uccontrols/controls/LinearList.uc';

/**
 *  code filename must same and case sensitive with classname 
 */
import { comboBox } from './comboBox.uc';


export class Designer extends Usercontrol {    
    static get giveMeHug(): string {
        return Usercontrol.giveMeHug;
    }
    static setCSS_globalVar (varList:VariableList /*key: string, value: string*/): void  {
        intenseGenerator.setCSS_globalVar(varList,`uccontrols/controls/comboBox.uc`);
    }
    static Create(pera: UcOptions, ...args: any[]): comboBox { 
        /** uccontrols/controls/comboBox.uc */
        return intenseGenerator.generateUC('uccontrols/controls/comboBox.uc',pera,...args) as comboBox;
    }
    
    public txt_editor: HTMLUnknownElement;
    public cmd_drop: HTMLUnknownElement;
         
   
    public ll_view: import('uccontrols/controls/LinearList.uc').LinearList;

    
    constructor(){ super(); }
    initializecomponent(argsLst: IArguments, form: comboBox) {
        let fargs = Usercontrol.extractArgs(arguments);
        let args = fargs[fargs.length-1] as UcOptions;
        let ucExt = this.ucExtends;
        
        ucExt.initializecomponent(args);        
        let CONTROLS = ucExt.designer.getAllControls();
        this.txt_editor = CONTROLS.txt_editor as HTMLUnknownElement;
        this.cmd_drop = CONTROLS.cmd_drop as HTMLUnknownElement;
         
        
       
        this.ll_view = LinearList.Create({ 
                            parentUc : this, 
                            mode:args.mode,
                            session:{
                                loadBySession:args.session.loadBySession,
                                uniqueIdentity:"ll_view" , 
                                addNodeToParentSession:true,
                            },   
                            decisionForTargerElement:'replace',
                            targetElement : CONTROLS.ll_view 
                        });
        this.ll_view.ucExtends.show();

        ucExt.finalizeInit(args);
        ucExt.session.prepareForAutoLoadIfExist();
        if (args.loadAt) args.loadAt.appendChild(ucExt.wrapperHT);
       
        Usercontrol.assignPropertiesFromDesigner(form);
    }
}