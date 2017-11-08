let connection = new require('./kafka/Connection');
let user = require('./services/user');
let file = require('./services/file');
let directory = require('./services/directory');

let userConsumer = connection.getConsumer('userTopic');
let fileConsumer = connection.getConsumer('fileTopic');
let directoryConsumer = connection.getConsumer('directoryTopic');
let producer = connection.getProducer();

console.log('server is running');
userConsumer.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    let data = JSON.parse(message.value);
    user.handle_request(data.data, function(err,res){
        console.log('after handle',res);
        let payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});

fileConsumer.on('message', function (message) {
  console.log('message received');
  console.log(JSON.stringify(message.value));
  let data = JSON.parse(message.value);
  file.handle_request(data.data, function(err,res){
    console.log('after handle',res);
    let payloads = [
      { topic: data.replyTo,
        messages:JSON.stringify({
          correlationId:data.correlationId,
          data : res
        }),
        partition : 0
      }
    ];
    producer.send(payloads, function(err, data){
      console.log(data);
    });
    return;
  });
});

directoryConsumer.on('message', function (message) {
  console.log('message received');
  console.log(JSON.stringify(message.value));
  let data = JSON.parse(message.value);
  directory.handle_request(data.data, function(err,res){
    console.log('after handle',res);
    let payloads = [
      { topic: data.replyTo,
        messages:JSON.stringify({
          correlationId:data.correlationId,
          data : res
        }),
        partition : 0
      }
    ];
    producer.send(payloads, function(err, data){
      console.log(data);
    });
    return;
  });
});
