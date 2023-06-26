import os from 'os';
import dotenv from 'dotenv';
import fs from 'fs';
import {Config} from "./types";



function fetchIPAddress(config: Config): void {
	const interfaces = os.networkInterfaces();
	for (const interfaceName in interfaces) {
		const networkInterface = interfaces[interfaceName];
		for (const network of networkInterface as os.NetworkInterfaceInfo[]) {
			if (network.family === 'IPv4' && !network.internal) {
				if (!config.envFilePath) {
					config.envFilePath = '.env';
				}

				if (!config.envVariableName) {
					config.envVariableName = 'IP_ADDRESS';
				}

				const envData = fs.existsSync(config.envFilePath)
					? dotenv.parse(fs.readFileSync(config.envFilePath))
					: {};

				if (envData[config.envVariableName] !== network.address) {
					envData[config.envVariableName] = network.address;

					let newEnvContent = '';
					Object.keys(envData).forEach((key) => {
						newEnvContent += `${key}=${envData[key]}\n`;
					});

					fs.writeFileSync(config.envFilePath, newEnvContent);
				}

				return;
			}
		}
	}

	console.error('Unable to fetch IP address');
}

const userConfigFilePath = 'get_ip_config.json';

const defaultConfig: Config = {
	envFilePath: undefined,
	envVariableName: undefined,
};

let userConfig: Config = defaultConfig;
if (fs.existsSync(userConfigFilePath)) {
	const fileData = fs.readFileSync(userConfigFilePath, 'utf8');
	try {
		const parsedConfig = JSON.parse(fileData);
		userConfig = { ...defaultConfig, ...parsedConfig };
	} catch (error) {
		console.error('Invalid user config file:', error);
	}
}

fetchIPAddress(userConfig);

export function getIp(): void {
	fetchIPAddress(userConfig);
}
