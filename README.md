# Faceable Middleware

This repository contains the source code for the API middleware service for the `Faceable` project as the submission entry for `Microsoft Garage Hackathon 2020` under the category `Hack for Security of Remote Work` to avoid shoulder surfing.

## Getting Started

### Quick Reference
[`API Docs Link`](https://garagemiddleware.docs.apiary.io/)
### Prerequisites
- [Node.JS](https://nodejs.org/en/) - Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.

### `Setting up Environment`

### 1). Provision all required Azure Cloud Services first
The following are the list of Azure Cloud Services required:
- 1 Azure Storage account (`Storagev2, Hot Tier`) resource
Create these following containers under your Azure storage account and name that container as:
  - events (Container level access)
  - faceartifacts (Private)
  - emailimages (Container level access)
  - hrms (Private)
 
- 1 Azure Cosmos DB (`Core SQL API`) resource
Create the following collections inside this DB.
  - employees
  - assetmanagement
  - wfhrecords
  - events
  - otpauth
  
- 1 Azure Face API resource
- 1 Azure Logic App resource
Download and use `URL_OF_HOSTED_TEMPLATE` template for the Logic App

We will need the keys and URLs of these services to run this source code. Continue with these steps. How they are used are explained below.


#### 2). Create an Azure App Service
Setup an Azure App Service with `Linux` and `NodeJS` environment.

#### 3). Clone this repository
```
$ git clone https://github.com/pourabkarchaudhuri/ms-garage-2020-faceable-middleware.git
$ cd ms-garage-2020-faceable-middleware
````
#### 4). the `config.env` file with the relevant keys from resources created earlier above
`STORAGE_ACCOUNT_URL` example :` https://{STORAGE_ACCOUNT_NAME}.blob.core.windows.net` 

`COSMOS_DB_URL` example : `https://{COSMSOS_DB_ACCOUNT_NAME}.documents.azure.com:443` 

`FACE_API_ENDPOINT` example : `https://{REGION}.api.cognitive.microsoft.com/face/v1.0`

Fill out and tweak the other environment parameters as suited to requirement respectively.

`Keep the JWT settings as is for demo`
#### 5). Running on local:
Under the root directory of the cloned project,
```bash
$ npm install
```
Run in `dev` mode
```bash
$ npm run dev
```
Run in `production` mode
```bash
$ npm start
```
##### Deployement to Azure
* Install the visual studio code extensions for Azure
* Select the extension and Sign in with Azure credentials inside the Visual Studio Code editor
* Select the earlier above provisioned `App Service` Resource and deploy it.

##### API Documentation
[`API Docs Link`](https://garagemiddleware.docs.apiary.io/)

This is what we have used in the Hackathon. In case if deployment is to be done on a Virtual Machine, then please follow the below steps:

##### Azure VM (Windows)

- Download and install the latest version of Node.JS from [here](https://nodejs.org/en/) 
- After installing, open command prompt and type ```node --version```
- You will see output like ```v10.15.3```
- Version might be different in your case.
[Node.JS](https://nodejs.org/en/) - Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.
- Once installed, verify it by checking the installed version using the following command
```bash
$ node –version
$ npm –version
```
##### Azure VM (Linux & Ubuntu)
- Open your terminal or press Ctrl + Alt + T and use the following commands to update and upgrade the package manager
```bash
$ sudo apt-get update
$ sudo apt-get upgrade
```
- Install Python software libraries using the following command
```bash
$ sudo apt-get install python-software-properties
```

- Add Node.js PPA to the system
```bash
$ curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash –
```
Note: Here, we are installing node.js version 10, if you want to install version 11, you can replace setup_10.x with setup_11.x.

- To Install Node.js and NPM to your Ubuntu machine, use the command given below
```bash
sudo apt-get install nodejs
```

- Once installed, verify it by checking the installed version using the following command
```bash
$ node –version
$ npm –version
```

