import { Usercontrol } from 'ucbuilder/Usercontrol';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';
import { UcOptions } from 'ucbuilder/enumAndMore';
import { VariableList } from 'ucbuilder/global/stylers/StylerRegs';
import { LinearList } from 'uccontrols/controls/LinearList.uc';

/**
 *  code filename must same and case sensitive with classname 
 */
import { comboBox } from 'uccontrols/controls/comboBox.uc';


export class Designer extends Usercontrol {    
    /**  uccontrols/controls/comboBox.uc
     *  AUTO RENAMING IS DEPEND ON `_FILE_PATH` SO KEEP YOUR SELF FAR FROM THIS :-)
     */
    private static _FILE_PATH = 'uccontrols/controls/comboBox.uc';//window.atob('dWNjb250cm9scy9jb250cm9scy9jb21ib0JveC51Yw==');
    public static get FILE_PATH() {
        return Designer._FILE_PATH;
    }
    static get designerToCode(): string {
        return Usercontrol.designerToCode;
    }
    static setCSS_globalVar (varList:VariableList /*key: string, value: string*/): void  {
        intenseGenerator.setCSS_globalVar(varList,this.FILE_PATH);
    }
    static Create(pera: UcOptions, ...args: any[]): comboBox { 
        /** uccontrols/controls/comboBox.uc */
        return intenseGenerator.generateUC(this.FILE_PATH,pera,...args) as comboBox;
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
                            accessName:"ll_view" , 
                            session:{
                                loadBySession:args.session.loadBySession,
                                uniqueIdentity:"ll_view" , 
                                addNodeToParentSession:true,
                            },   
                            decisionForTargerElement:'replace',
                            targetElement : CONTROLS.ll_view 
                        });
            this.ll_view.ucExtends.show();
            this.ll_view.ucExtends.visibility = 'inherit';

        ucExt.finalizeInit(args);
        ucExt.session.prepareForAutoLoadIfExist();
        if (args.loadAt) args.loadAt.appendChild(ucExt.wrapperHT);
       
        Usercontrol.assignPropertiesFromDesigner(form);
    }
}