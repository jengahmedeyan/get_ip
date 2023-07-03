
import os from 'os';
import dotenv from 'dotenv';
import fs from 'fs';
import { Config } from './types';

async function getIPAddress(): Promise<string> {
	const interfaces = os.networkInterfaces();

	for (const interfaceName in interfaces) {
		const networkInterface = interfaces[interfaceName];

		for (const network of networkInterface as os.NetworkInterfaceInfo[]) {
			if (network.family === 'IPv4' && !network.internal) {
				return network.address;
			}
		}
	}

	throw new Error('Unable to fetch IP address');
}

async function updateEnvironmentVariables(ipAddress: string, config: Config): Promise<void> {
	if (!config.envFilePath) {
		config.envFilePath = '.env';
	}

	if (!config.envVariableName) {
		config.envVariableName = 'IP_ADDRESS';
	}

	const envData = fs.existsSync(config.envFilePath)
		? dotenv.parse(fs.readFileSync(config.envFilePath))
		: {};

	if (envData[config.envVariableName] !== ipAddress) {
		envData[config.envVariableName] = ipAddress;

		let newEnvContent = '';
		Object.keys(envData).forEach((key) => {
			newEnvContent += `${key}=${envData[key]}\n`;
		});

		fs.writeFileSync(config.envFilePath, newEnvContent);
	}
}

const userConfigFilePath = 'ip_config.json';
const defaultConfig: Config = {
	envFilePath: undefined,
	envVariableName: undefined,
};
let userConfig: Config = defaultConfig;

if (fs.existsSync(userConfigFilePath)) {
	try {
		const fileData = fs.readFileSync(userConfigFilePath, 'utf8');
		const parsedConfig = JSON.parse(fileData);
		userConfig = { ...defaultConfig, ...parsedConfig };
	} catch (error) {
		console.error('Error reading or parsing user config file:', error);
	}
}

export async function getIp(): Promise<string> {
	try {
		const ipAddress = await getIPAddress();
		await updateEnvironmentVariables(ipAddress, userConfig);
		process.env.IP_ADDRESS = ipAddress;
		dotenv.config();
		return ipAddress;
	} catch (error) {
		console.error('Error fetching or updating IP address:', error);
		throw error;
	}
}
