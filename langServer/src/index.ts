import { createConnection, createServer, createTypeScriptProject, loadTsdkByPath } from '@volar/language-server/node';
import { create as createTypeScriptServices } from 'volar-service-typescript';
import { ovsLanguagePlugin } from './languagePlugin';
import {LogUtil} from "./logutil";

function getLocalTsdkPath() {
	let tsdkPath = "C:\\Users\\qinkaiyuan\\AppData\\Roaming\\npm\\node_modules\\typescript\\lib";
	return tsdkPath.replace(/\\/g, '/');
}

LogUtil.log('getLocalTsdkPath')

const tsdkPath = getLocalTsdkPath();

const connection = createConnection();
const server = createServer(connection);

connection.listen();

connection.onInitialize(params => {
	const tsdk = loadTsdkByPath(tsdkPath, params.locale);
	return server.initialize(
		params,
		createTypeScriptProject(tsdk.typescript, tsdk.diagnosticMessages, () => ({
			languagePlugins: [ovsLanguagePlugin],
		})),
		[
			...createTypeScriptServices(tsdk.typescript),
		],
	)
});

connection.onInitialized(server.initialized);

connection.onShutdown(server.shutdown);
