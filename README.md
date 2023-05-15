# data-governance-api
This module is a component of the Data Governance system and provides a REST API for interacting with the Data Governance [chaincodes](https://github.com/DataPortsProject/data-governance-smart-contracts). Additionally, it requires the presence of the Data Governance Hyperledger Fabric network.

## Prerequisites

- Node.js (version>=8)
- npm (version>=5)

Clone the repository:

   ```bash
   git clone https://github.com/DataPortsProject/data-governance-api.git
   ```
  
  
Navigate to the project directory:

  ```bash
   cd data-governance-api
  ```

Install the dependencies:

  ```bash
   npm install
  ```

To start the server, use the following command:

  ```bash
   npm start
  ```

The server will start listening on port 9999. You can access the API endpoints the following URL:

  ```bash
    http://localhost:9999
  ```
  
To view the Swagger documentation, navigate to:

 ```bash
   http://localhost:9999/api-docs
 ```
   
Integration with other Dataports components:
 ```bash
   cd /app/SemanticInteroperability
 ```
 
 Replace the URLs in the files dataSourceIDs.js, entities.js, and subscription.js according to your [on-demand-component](https://github.com/DataPortsProject/on-demand-component).

 Replace the URL in the file getIMToken.js according to your Dataports Keycloak deployment.





