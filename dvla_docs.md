Vehicle Enquiry Service (VES) API Guide

    The VES API OpenAPI 3.0 technical specification can be found here
    It is also available in JSON format

Introduction

The DVLA Vehicle Enquiry Service API is a RESTful service that provides vehicle details of a specified vehicle. It uses the vehicle registration number as input to search and provide details of the vehicle. The response data is provided in JSON format.
Register For VES API

If you would like to register to use this API, please click the button below:

Apply
Request

To consume the API, make an HTTP POST request to the following URL:

https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles
Authentication

Each request you make must be authenticated. To do this you must include a mandatory key value pair in the header of each request that is sent. - The key is x-api-key. - The value will be the API key you have been issued.

No other authentication is required for this API.
Body

Include the Vehicle Registration Number (VRN) that you wish to query in the request body like so:

{ 
  "registrationNumber": "TE57VRN" 
}

    Do not include any spaces or non-alphanumeric characters in the VRN.

Example

Using cURL, a request can be made as follows:

curl -L -X POST 'https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles' \
-H 'x-api-key: REPLACE WITH YOUR API KEY' \
-H 'Content-Type: application/json' \
-d '{"registrationNumber": "TE57VRN"}'

    OWASP security guidelines dictate that sensitive information should not be included in URLs. This reduces the risk of sensitive information being unnecessarily recorded in Web Server logs. The vehicle registration number is deemed sensitive information in accordance with the Information Commissioner’s Office (ICO), so is passed in the body as a POST request.

Response

A successful request should return a JSON response like the one below:

{
  "artEndDate": "2025-02-28",
  "co2Emissions" : 135,
  "colour" : "BLUE",
  "engineCapacity": 2494,
  "fuelType" : "PETROL",
  "make" : "ROVER",
  "markedForExport" : false,
  "monthOfFirstRegistration" : "2004-12",
  "motStatus" : "No details held by DVLA",
  "registrationNumber" : "ABC1234",
  "revenueWeight" : 1640,
  "taxDueDate" : "2007-01-01",
  "taxStatus" : "Untaxed",
  "typeApproval" : "N1",
  "wheelplan" : "NON STANDARD",
  "yearOfManufacture" : 2004,
  "euroStatus": "EURO 6 AD",
  "realDrivingEmissions": "1",
  "dateOfLastV5CIssued": "2016-12-25"
}

Error Responses

Here is a list of the possible error responses you may receive using this API:
Status 	Meaning 	Description
400 	Bad Request 	Bad Request
404 	Not Found 	Vehicle Not Found
500 	Internal Server Error 	Internal Server Error
503 	Service Unavailable 	Service Unavailable

In addition to this, the common errors section gives errors that may be thrown by the surrounding framework.
Examples
Code Examples

A list of code examples can be found here.
Postman Collection

Alternatively, you can use Postman to create and execute requests.

A Postman collection containing examples for the VES API can be downloaded here.
Test Environment

Optionally, access to a test environment can be provided which will allow you to test your integration using several predefined vehicle registration numbers (VRN), including error responses. This will allow you to reliably create scenarios with specific responses from the VES API.

For Example - Using the VRN ‘ER19BAD’ results in a 400 Bad Request
Request

To call the test API, make an HTTP POST request in the same manner as normal but to the following URL:

https://uat.driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles

    Remember to include the authentication header.

Response

If you make a request to the test API with a predetermined VRN that will return an error code, like ‘ER19BAD’, your response should look something like this:

{
  "errors": [
    {
      "status": "400",
      "code": "400",
      "title": "Bad Request",
      "detail": "Invalid format for field - vehicle registration number"
    }
  ]
}

    A full list of test VRNs can be found here.

Usage Plans and Throttling Limits

    Please note - only one API key can be issued per customer/company. Multiple API keys should not be requested as these are not permitted.

We have introduced limits on API usage rates in terms of requests per second. This applies to both individual clients and collective usage for all clients.

    A client’s limit is set based on the usage plan that the client is subscribed to
    As clients access the API at the same time, there is an overall limit on how many requests are allowed per second in order to protect the service

These two scenarios will return an HTTP status code of 429 as specified in the common errors section.
Support