import { UcOptions,TptOptions } from 'ucbuilder/enumAndMore';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';

export const R = {
    controls:{comboBox: {
    load: (pera: UcOptions, ...args: any[]): import('uccontrols/controls/comboBox.uc').comboBox => intenseGenerator.generateUC('uccontrols/controls/comboBox.uc', pera, args) as any,
    get type(): import('uccontrols/controls/comboBox.uc').comboBox { return null as any },
},datagrid: {
    load: (pera: UcOptions, ...args: any[]): import('uccontrols/controls/datagrid.uc').datagrid => intenseGenerator.generateUC('uccontrols/controls/datagrid.uc', pera, args) as any,
    get type(): import('uccontrols/controls/datagrid.uc').datagrid { return null as any },
},LinearList: {
    load: (pera: UcOptions, ...args: any[]): import('uccontrols/controls/LinearList.uc').LinearList => intenseGenerator.generateUC('uccontrols/controls/LinearList.uc', pera, args) as any,
    get type(): import('uccontrols/controls/LinearList.uc').LinearList { return null as any },
},ListView: {
    load: (pera: UcOptions, ...args: any[]): import('uccontrols/controls/ListView.uc').ListView => intenseGenerator.generateUC('uccontrols/controls/ListView.uc', pera, args) as any,
    get type(): import('uccontrols/controls/ListView.uc').ListView { return null as any },
},lv:{ListView: {
    load: (pera: UcOptions, ...args: any[]): import('uccontrols/controls/lv/ListView.uc').ListView => intenseGenerator.generateUC('uccontrols/controls/lv/ListView.uc', pera, args) as any,
    get type(): import('uccontrols/controls/lv/ListView.uc').ListView { return null as any },
},},Menu: {
    load: (pera: UcOptions, ...args: any[]): import('uccontrols/controls/Menu.uc').Menu => intenseGenerator.generateUC('uccontrols/controls/Menu.uc', pera, args) as any,
    get type(): import('uccontrols/controls/Menu.uc').Menu { return null as any },
},MessageBox: {
    load: (pera: UcOptions, ...args: any[]): import('uccontrols/controls/MessageBox.uc').MessageBox => intenseGenerator.generateUC('uccontrols/controls/MessageBox.uc', pera, args) as any,
    get type(): import('uccontrols/controls/MessageBox.uc').MessageBox { return null as any },
},Movable: {
    load: (pera: UcOptions, ...args: any[]): import('uccontrols/controls/Movable.uc').Movable => intenseGenerator.generateUC('uccontrols/controls/Movable.uc', pera, args) as any,
    get type(): import('uccontrols/controls/Movable.uc').Movable { return null as any },
},singleSplitter: {
    load: (pera: UcOptions, ...args: any[]): import('uccontrols/controls/singleSplitter.uc').singleSplitter => intenseGenerator.generateUC('uccontrols/controls/singleSplitter.uc', pera, args) as any,
    get type(): import('uccontrols/controls/singleSplitter.uc').singleSplitter { return null as any },
},Splitter: {
    load: (pera: UcOptions, ...args: any[]): import('uccontrols/controls/Splitter.uc').Splitter => intenseGenerator.generateUC('uccontrols/controls/Splitter.uc', pera, args) as any,
    get type(): import('uccontrols/controls/Splitter.uc').Splitter { return null as any },
},tabControl: {
    load: (pera: UcOptions, ...args: any[]): import('uccontrols/controls/tabControl.uc').tabControl => intenseGenerator.generateUC('uccontrols/controls/tabControl.uc', pera, args) as any,
    get type(): import('uccontrols/controls/tabControl.uc').tabControl { return null as any },
},winFrame: {
    load: (pera: UcOptions, ...args: any[]): import('uccontrols/controls/winFrame.uc').winFrame => intenseGenerator.generateUC('uccontrols/controls/winFrame.uc', pera, args) as any,
    get type(): import('uccontrols/controls/winFrame.uc').winFrame { return null as any },
},},
}