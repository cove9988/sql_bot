# Setup Environment 
1 . install npm

Setup your development environment:
Ensure you have Node.js and npm installed. If not, download and install them from https://nodejs.org/.
```
sudo apt update
sudo apt install nodejs npm
```

Initialize the project and Install necessary dependencies:
You'll need to install the vscode module to interact with VSCode and a SQL beautification library like sql-formatter or pg-query-parser for PostgreSQL/SQL, and prettier for BigQuery.

```
npm init -y

npm install --save vscode
npm install --save sql-formatter  # For PostgreSQL/SQL
npm install --save prettier       # For BigQuery
sudo npm install -g vsce
```
