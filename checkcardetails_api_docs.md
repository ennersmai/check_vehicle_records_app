
Getting started

All API interfaces are implemented as restful APIs and accessed over https.

To access the API you will need an API key that uniquely identifies the source of the request. You will given an API key which approves your application.

Technical resources

Access the API at https://api.checkcardetails.co.uk
Endpoint

You can use vehicle registration number (VRM) or vehicle identification number (VIN) to call the API.

/vehicledata/{Datapoint}?apikey={API_KEY}&vrm={Registration}

‘Registration’ is the vehicle registration number.

/vehicledata/{Datapoint}?apikey={API_KEY}&vin={VIN}

‘VIN’ is the vehicle identification number.

Examples

Code Examples

    Curl Javascript - Fetch Javascript - JQuery NodeJs - Axios NodeJs - Request PHP - HTTP_Request2 

                                    
var request = require('request');
var options = {
  'method': 'GET',
  'url': 'https://api.checkcardetails.co.uk/vehicledata/{Data_Point}?apikey={API_KEY}&vrm={Registration}',
  'headers': {
  }
};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});

            

                                    


Data Points
vehicleregistration 	DVLA vehicle registration details
ukvehicledata 	Full vehicle data including all vehicle details
Vehiclespecs 	Full vehicle specification data
carhistorycheck 	Full vehicle history check including all vehicle details
mot 	Includes MOT status, summary and full MOT history
mileage 	Full vehicle mileage history
vehicleimage 	Vehicle image data
vehiclevaluation 	Vehicle valuation data

Response codes
Code 	Scenario
200 - OK 	Your request was serviced
404 - Not Found 	Vehicle with the provided parameters was not found
500 - Internal Server Error 	There was an error processing your request
400 - Bad Request 	Test API key limitation: Key value for VRM must contain the letter 'A'
400 - Bad Request 	No API key was provided in the headers
403 - Forbidden 	The api key is missing or invalid
403 - Forbidden 	You are not authorised to access this data point. Please request access on https://api.checkcardetails.co.uk/support/premiumdatarequest or contact support. https://api.checkcardetails.co.uk/support
403 - Forbidden 	You have reached your daily limit. Please contact support to increase your account's daily limit. https://api.checkcardetails.co.uk/support 