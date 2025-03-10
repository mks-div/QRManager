# QRManager

QRManager is a user-friendly application designed for reading and generating QR codes. Built using the Electron framework, it provides a seamless experience for managing QR codes efficiently.

## Prerequisites

Before running the project, ensure you have the following installed:

- **Node.js**: Download and install Node.js from [nodejs.org](https://nodejs.org/en).
 
## Getting Started

Follow these steps to set up and run the QRManager application on your local machine:

### 1. Clone the Repository
Clone the QRManager repository to your local machine using the following command:
```bash
git clone https://github.com/mks-div/QRManager.git
```
### 2. Install dependencies
download packages and libraries to project folder from package.json  with command:
```bash
npm install
```
either do it manually:
- Install electron, framework that allows to make applications:
  ```shell
  npm install electron --save-dev
  ```
- Install electron-packager for building project:
  ```shell
  npm install electron-packager --save-dev
  ```
- Install JsQR library for reading QR codes:
  ```shell
  npm install jsqr --save
  ```
- Install QRCode.js library for creating  QR codes:
  ```shell
  npm install qrcode --save
  ```
### 3. Running application
  run programm with: 
  ```shell
  npm start
  ```
  or build with:
  > exe is build to root/dist/QRManager
  ```shell
  npm run build
  ```
  
