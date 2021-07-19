import { isDefined } from "../../platform/checking/types.checking";


export const LocalPaths = {
    ALLUSERSPROFILE : isDefined(process.env.ALLUSERSPROFILE)?process.env.ALLUSERSPROFILE:'',
    APPDATA:isDefined(process.env.APPDATA)? process.env.APPDATA:'',
    USERROOT:isDefined(process.env.HOMEPATH)? process.env.HOMEPATH :'',
    TEMP:isDefined(process.env.TEMP)?process.env.TEMP :'',
    SYSTEMDRIVE:isDefined(process.env.SystemDrive)? process.env.SystemDrive :'',
    LOCALAPPDATA:isDefined(process.env.LOCALAPPDATA)?process.env.LOCALAPPDATA :'',
    TPMCONFIG:'.tpmconfig'

}