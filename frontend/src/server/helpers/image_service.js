import AWS from 'aws-sdk';
import config from './../config/dashboard_config';
import Promise from 'promise';

AWS.config.loadFromPath('./credentials.json');

var upload_file = function(filename, bodyStream, s3_bucket_name){
    var s3 = new AWS.S3(); 
    return new Promise(function(fulfill, reject){
        s3.createBucket({Bucket: s3_bucket_name}, function() {
            var params = {
                          Bucket: s3_bucket_name,
                          Key: filename, 
                          Body: bodyStream
            };
            s3.putObject(params, function(err, data) {
              if (err)
                  return reject(err);
              else
                  return fulfill(data);
            });
        });
    });
}


export default upload_file;
