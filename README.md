# data-governance-api
Node.js code implementing an API that exposes the functionality of the smart contracts

## Prerequisites

- Node.js (version>=8)
- npm (version>=5)

Clone the repository:

   ```bash
   git clone https://github.com/DataPortsProject/data-governance-api.git
   ```
  
  
Navigate to the project directory:

  ```bash
   cd your-repo
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
 
 Replace the URLs in the files dataSourceIDs.js, entities.js, and subscription.js according to your [https://github.com/DataPortsProject/on-demand-component]on-demand-component.

 Replace the URL in the file getIMToken.js according to your Dataports Keycloak deployment.





