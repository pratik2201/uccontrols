import { Usercontrol } from 'ucbuilder/Usercontrol';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';
import { IUcOptions } from 'ucbuilder/enumAndMore';
import { VariableList } from 'ucbuilder/lib/stylers/StylerRegs';

/**
 *  code filename must same and case sensitive with classname 
 */
import { Splitter } from 'uccontrols/controls/Splitter.uc';


export class Designer extends Usercontrol {    
    /**  uccontrols/controls/Splitter.uc
     *  AUTO RENAMING IS DEPEND ON `_FILE_PATH` SO KEEP YOUR SELF FAR FROM THIS :-)
     */
    private static _FILE_PATH = 'uccontrols/controls/Splitter.uc';//window.atob('dWNjb250cm9scy9jb250cm9scy9TcGxpdHRlci51Yw==');
    public static get FILE_PATH() {
        return Designer._FILE_PATH;
    }
    static get designerToCode(): string {
        return Usercontrol.designerToCode;
    }
    static setCSS_globalVar (varList:VariableList /*key: string, value: string*/): void  {
        intenseGenerator.setCSS_globalVar(varList,this.FILE_PATH);
    }
    static Create(pera: IUcOptions, ...args: any[]): Splitter { 
        /** uccontrols/controls/Splitter.uc */
        return intenseGenerator.generateUC(this.FILE_PATH,Splitter,pera,...args) as Splitter;
    }
    get(id:"") {
        return this.ucExtends.find(`[id="${id}"]`)[0];
    }


    
    public mainContainer: HTMLUnknownElement;

    
    constructor(){ super(); }
    initializecomponent(argsLst: IArguments, form: Splitter) {
        let fargs = Usercontrol.extractArgs(arguments);
        let args = fargs[fargs.length-1] as IUcOptions;
        let ucExt = this.ucExtends;
        
        ucExt.initializecomponent(args);        
        let CONTROLS = ucExt.designer.getAllControls();
        this.mainContainer = CONTROLS.mainContainer as FieldBox;

        ucExt.finalizeInit(args);
        ucExt.session.prepareForAutoLoadIfExist();
        if (args.loadAt) args.loadAt.appendChild(ucExt.wrapperHT);
       
        Usercontrol.assignPropertiesFromDesigner(form);
    }
}