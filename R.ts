import { UcOptions } from 'ucbuilder/enumAndMore';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';

export const R = {
    controls:{comboBox: {
    load: (pera: UcOptions, ...args: any[]): import('uccontrols/controls/comboBox.uc').comboBox => intenseGenerator.generateUC('uccontrols/controls/comboBox.uc', pera, args) as any,
},datagrid: {
    load: (pera: UcOptions, ...args: any[]): import('uccontrols/controls/datagrid.uc').datagrid => intenseGenerator.generateUC('uccontrols/controls/datagrid.uc', pera, args) as any,
},LinearList: {
    load: (pera: UcOptions, ...args: any[]): import('uccontrols/controls/LinearList.uc').LinearList => intenseGenerator.generateUC('uccontrols/controls/LinearList.uc', pera, args) as any,
},ListView: {
    load: (pera: UcOptions, ...args: any[]): import('uccontrols/controls/ListView.uc').ListView => intenseGenerator.generateUC('uccontrols/controls/ListView.uc', pera, args) as any,
},Menu: {
    load: (pera: UcOptions, ...args: any[]): import('uccontrols/controls/Menu.uc').Menu => intenseGenerator.generateUC('uccontrols/controls/Menu.uc', pera, args) as any,
},MessageBox: {
    load: (pera: UcOptions, ...args: any[]): import('uccontrols/controls/MessageBox.uc').MessageBox => intenseGenerator.generateUC('uccontrols/controls/MessageBox.uc', pera, args) as any,
},Movable: {
    load: (pera: UcOptions, ...args: any[]): import('uccontrols/controls/Movable.uc').Movable => intenseGenerator.generateUC('uccontrols/controls/Movable.uc', pera, args) as any,
},singleSplitter: {
    load: (pera: UcOptions, ...args: any[]): import('uccontrols/controls/singleSplitter.uc').singleSplitter => intenseGenerator.generateUC('uccontrols/controls/singleSplitter.uc', pera, args) as any,
},Splitter: {
    load: (pera: UcOptions, ...args: any[]): import('uccontrols/controls/Splitter.uc').Splitter => intenseGenerator.generateUC('uccontrols/controls/Splitter.uc', pera, args) as any,
},tabControl: {
    load: (pera: UcOptions, ...args: any[]): import('uccontrols/controls/tabControl.uc').tabControl => intenseGenerator.generateUC('uccontrols/controls/tabControl.uc', pera, args) as any,
},winFrame: {
    load: (pera: UcOptions, ...args: any[]): import('uccontrols/controls/winFrame.uc').winFrame => intenseGenerator.generateUC('uccontrols/controls/winFrame.uc', pera, args) as any,
},},
}