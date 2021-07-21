
export const checkparsedargv = ()=>{
return stripAppPath(process.argv);
}

function stripAppPath(argv: string[]): string[] | undefined {
	const index = argv.filter((a,i) => i>1);

    if(index){
        return index;
    }
	return undefined;
}
