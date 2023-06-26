"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var os_1 = __importDefault(require("os"));
var dotenv_1 = __importDefault(require("dotenv"));
var fs_1 = __importDefault(require("fs"));
function fetchIPAddress(config) {
    var interfaces = os_1.default.networkInterfaces();
    for (var interfaceName in interfaces) {
        var networkInterface = interfaces[interfaceName];
        var _loop_1 = function (network) {
            if (network.family === 'IPv4' && !network.internal) {
                if (!config.envFilePath) {
                    config.envFilePath = '.env';
                }
                if (!config.envVariableName) {
                    config.envVariableName = 'IP_ADDRESS';
                }
                var envData_1 = fs_1.default.existsSync(config.envFilePath)
                    ? dotenv_1.default.parse(fs_1.default.readFileSync(config.envFilePath))
                    : {};
                if (envData_1[config.envVariableName] !== network.address) {
                    envData_1[config.envVariableName] = network.address;
                    var newEnvContent_1 = '';
                    Object.keys(envData_1).forEach(function (key) {
                        newEnvContent_1 += "".concat(key, "=").concat(envData_1[key], "\n");
                    });
                    fs_1.default.writeFileSync(config.envFilePath, newEnvContent_1);
                }
                return { value: void 0 };
            }
        };
        for (var _i = 0, _a = networkInterface; _i < _a.length; _i++) {
            var network = _a[_i];
            var state_1 = _loop_1(network);
            if (typeof state_1 === "object")
                return state_1.value;
        }
    }
    console.error('Unable to fetch IP address');
}
var userConfigFilePath = 'get_ip_config.json';
var defaultConfig = {
    envFilePath: undefined,
    envVariableName: undefined,
};
var userConfig = defaultConfig;
if (fs_1.default.existsSync(userConfigFilePath)) {
    var fileData = fs_1.default.readFileSync(userConfigFilePath, 'utf8');
    try {
        var parsedConfig = JSON.parse(fileData);
        userConfig = __assign(__assign({}, defaultConfig), parsedConfig);
    }
    catch (error) {
        console.error('Invalid user config file:', error);
    }
}
fetchIPAddress(userConfig);
