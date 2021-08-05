import * as fs from 'fs-extra';
import * as path from 'path';
import denodeify from 'denodeify';
import { LocalPaths } from '../../base/env/path.env';
import { IStore } from './store';
import { Publisher } from '../../base/models/store.model';
import { readcomposition } from '../../tempelating/actions/package/packageService.action';
import * as _read from 'read';
import { read } from '../node/node.platform';
import { validateName } from '../checking/credential.checking';
import { showSuccess } from '../log/logger.platform';


const readFile = denodeify<string, string, string>(fs.readFile);
const writeFile = denodeify<string, string, object, void>(fs.writeFile as any);
const storePath = path.join(LocalPaths.HOMEDRIVE, LocalPaths.USERROOT, LocalPaths.TPMCONFIG, '.template');



export function load(): Promise<IStore> {
	return readFile(storePath, 'utf8')
		.catch<string>(err => (err.code !== 'ENOENT' ? Promise.reject(err) : Promise.resolve('{}')))
		.then<IStore>(rawStore => {
			try {
				return Promise.resolve(JSON.parse(rawStore));
			} catch (e) {
				return Promise.reject(`Error parsing store: ${storePath}`);
			}
		})
		.then(store => {
			store.publishers = store.publishers || [];
			return Promise.resolve(store);
		});
}

function save(store: IStore): Promise<IStore> {
	return writeFile(storePath, JSON.stringify(store), { mode: '0600' }).then(() => store);
}

function addPublisherToStore(store: IStore, publisher: Publisher): Promise<Publisher> {
	store.publishers = [...store.publishers.filter(p => p.name !== publisher.name), publisher];
	return save(store).then(() => publisher);
}

function removePublisherFromStore(store: IStore, publisherName: string): Promise<any> {
	store.publishers = store.publishers.filter(p => p.name !== publisherName);
	return save(store);
}

export async function verifyPat(pat: string, publisherName?: string): Promise<void> {
	if (!pat) {
		throw new Error('The Personal Access Token is mandatory.');
	}

	if (!publisherName) {
		try {
			publisherName = (await readcomposition()).publisher;
		} catch (error) {
			throw new Error(
				`Can not read the publisher's name. Either supply it as an argument or run vsce from the extension folder. Additional information:\n\n${error}`
			);
		}
	}

	// try {
	// 	// If the caller of the `getRoleAssignments` API has any of the roles
	// 	// (Creator, Owner, Contributor, Reader) on the publisher, we get a 200,
	// 	// otherwise we get a 403.
	// 	const api = await getSecurityRolesAPI(pat);
	// 	await api.getRoleAssignments('gallery.publisher', publisherName);
	// } catch (error) {
	// 	throw new Error('The Personal Access Token verification has failed. Additional information:\n\n' + error);
	// }

	console.log(`The Personal Access Token verification succeeded for the publisher '${publisherName}'.`);
}

async function requestToken(store: IStore, publisherName: string): Promise<Publisher> {
	const token = await read(`Personal Access Token for publisher '${publisherName}':`, { silent: true, replace: '*' });

	await verifyPat(token, publisherName);
	const updatestore = await resetCurrentPublisher();
	return await addPublisherToStore(updatestore, { name: publisherName, current: true, token: token });
}

export function getPublisher(publisherName: string): Promise<Publisher> {

	validateName(publisherName)
	return load().then(store => {
		const publisher = store.publishers.filter(p => p.name === publisherName)[0];
		return publisher ? Promise.resolve(publisher) : requestToken(store, publisherName);
	});
}

export function loginPublisher(publisherName: string): Promise<Publisher> {
	validateName(publisherName);

	return load()
		.then<IStore>(store => {
			const publisher = store.publishers.filter(p => p.name === publisherName)[0];

			if (publisher) {
				console.log(`Publisher '${publisherName}' is already known`);
				return read('Do you want to overwrite its token? [y/N] ').then(answer =>
					/^y$/i.test(answer) ? store : Promise.reject('Aborted')
				);
			}

			return Promise.resolve(store);
		})
		.then(store => requestToken(store, publisherName));
}

export function logoutPublisher(publisherName: string): Promise<any> {
	validateName(publisherName);

	return load().then(store => {
		const publisher = store.publishers.filter(p => p.name === publisherName)[0];

		if (!publisher) {
			return Promise.reject(`Unknown publisher '${publisherName}'`);
		}

		return removePublisherFromStore(store, publisherName);
	});
}

export function deletePublisher(publisherName: string): Promise<any> {
	return getPublisher(publisherName).then(() => {
		return read(`This will FOREVER delete '${publisherName}'! Are you sure? [y/N] `)
			.then(answer => (/^y$/i.test(answer) ? null : Promise.reject('Aborted')))
			.then(() => load().then(store => removePublisherFromStore(store, publisherName)))
			.then(() => showSuccess(`Deleted publisher '${publisherName}'.`));
	});
}

export function listPublishers(): Promise<void> {
	return load()
		.then(store => store.publishers)
		.then(publishers => publishers.forEach(p => console.log(p.name)));
}

export  function resetCurrentPublisher(): Promise<IStore> {
	return load()
		.then(async store => {
			store.publishers.forEach(p => {
				p.current = false
			});
			
			return save(store);
		});
	// .then(publishers => publishers.forEach(p => {
	// 	p.current = false
	// }));
}

// export function upadtePackagePublished(name:string) {

// 	return load()
// 	       .then(async st =>{
// 			  const publisher = st.publishers.filter(pu=>pu.current)

// 		   })
	
// }