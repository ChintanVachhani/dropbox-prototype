let rpc = new (require('./kafkarpc'))();

//make request to kafka
function make_request(queueName, msgPayload, callback){
    console.log('in make request');
    console.log('-->', msgPayload);
	rpc.makeRequest(queueName, msgPayload, function(err, response){

		if(err)
			console.error(err);
		else{
			console.log("response--->", response);
			callback(null, response);
		}
	});
}

exports.make_request = make_request;
