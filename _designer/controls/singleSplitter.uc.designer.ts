import { Usercontrol } from 'ucbuilder/Usercontrol';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';
import { UcOptions } from 'ucbuilder/enumAndMore';
import { VariableList } from 'ucbuilder/lib/stylers/StylerRegs';

/**
 *  code filename must same and case sensitive with classname 
 */
import { singleSplitter } from 'uccontrols/controls/singleSplitter.uc';


export class Designer extends Usercontrol {    
    /**  uccontrols/controls/singleSplitter.uc
     *  AUTO RENAMING IS DEPEND ON `_FILE_PATH` SO KEEP YOUR SELF FAR FROM THIS :-)
     */
    private static _FILE_PATH = 'uccontrols/controls/singleSplitter.uc';//window.atob('dWNjb250cm9scy9jb250cm9scy9zaW5nbGVTcGxpdHRlci51Yw==');
    public static get FILE_PATH() {
        return Designer._FILE_PATH;
    }
    static get designerToCode(): string {
        return Usercontrol.designerToCode;
    }
    static setCSS_globalVar (varList:VariableList /*key: string, value: string*/): void  {
        intenseGenerator.setCSS_globalVar(varList,this.FILE_PATH);
    }
    static Create(pera: UcOptions, ...args: any[]): singleSplitter { 
        /** uccontrols/controls/singleSplitter.uc */
        return intenseGenerator.generateUC(this.FILE_PATH,pera,...args) as singleSplitter;
    }
    get(id:"") {
        return this.ucExtends.find(`[id="${id}"]`)[0];
    }


    
    public mainGrid: HTMLUnknownElement;

    
    constructor(){ super(); }
    initializecomponent(argsLst: IArguments, form: singleSplitter) {
        let fargs = Usercontrol.extractArgs(arguments);
        let args = fargs[fargs.length-1] as UcOptions;
        let ucExt = this.ucExtends;
        
        ucExt.initializecomponent(args);        
        let CONTROLS = ucExt.designer.getAllControls();
        this.mainGrid = CONTROLS.mainGrid as FieldBox;

        ucExt.finalizeInit(args);
        ucExt.session.prepareForAutoLoadIfExist();
        if (args.loadAt) args.loadAt.appendChild(ucExt.wrapperHT);
       
        Usercontrol.assignPropertiesFromDesigner(form);
    }
}