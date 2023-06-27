# Get IP

get_ip is a utility that fetches the IP address of your connected device and stores it in an environment variable. It provides a simple and convenient way to automate the retrieval and updating of the IP address in your application.

## Installation

To install the package, use npm:

```shell
npm install @eyanjeng/get_ip
```

## Usage

```shell
import { getIp } from '@eyanjeng/get_ip';

getIp();
```
## Configuration
You can specify the path to your env file and also the variable name.

```shell
{
  "envFilePath": ".env",
  "envVariableName": "IP_LOCAL"
}

```


