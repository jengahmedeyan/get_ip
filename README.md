# Get IP

The `@eyanjeng/get_ip` npm package is a lightweight utility that fetches the IP address of the current machine and updates it in an environment variable file. It allows you to easily retrieve the IP address and ensures that it is always up to date. The package scans the network interfaces, retrieves the first non-internal IPv4 address, and updates the specified environment variable in the provided file. It also maintains other existing key-value pairs in the environment variable file, preserving their values. With `@eyanjeng/get_ip`, you can conveniently manage and utilize the IP address in your Node.js application's configuration.

#### Key Features:

- Fetches the IP address of the current machine.
- Updates the IP address in an environment variable file.
- Maintains other key-value pairs in the environment variable file.


## Installation

To install the package, use npm:

```shell
npm install @eyanjeng/get_ip
```

## Usage

```shell
const express = require('express');
const app = express();
require('dotenv').config({ override: true });
const port: string = process.env.PORT || '5000';


const { getIp } = require('@eyanjeng/get_ip');

const startServer = async () => {
  try {
    await getIp();

    app.listen(port, () => {
    return console.log(`Server started at http://${process.env.IP_ADDRESS}:${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
};

startServer();


```
## Configuration
The following configuration options are available for customizing the behavior of the package:

### Environment Variables Configuration
You can configure the package to store the fetched IP address in an environment variable. By default, the package uses the .env file and the IP_ADDRESS variable name.

To customize the environment variables configuration, create a JSON file (e.g., ip_config.json) in the root directory of your project with the following options:

````shell
{
  "envFilePath": ".env.local",
  "envVariableName": "ip_local"
}
````

- `envFilePath` (optional): Specify the path to the environment variables file. If not provided, the package will default to using the .env file in the root directory.

- `envVariableName` (optional): Specify the name of the environment variable that will store the fetched IP address. If not provided, the package will default to using the name **IP_ADDRESS**.
Make sure to include this JSON configuration file `(ip_config.json)` in your project's repository or distribute it along with your package.

`Note`: If the ip_config.json file is missing or cannot be parsed, the package will fallback to the default configuration.

