import mongoose from 'mongoose';
import config from './../config/dashboard_config';
import request from 'request';
import fs from 'fs';
import upload_file from './../helpers/image_service'; 

let User = mongoose.model('User');

var createOne = function(req, res, next){
    request({url: config.generate_client_id_url}, function (error, response, body) {
        if (!error && response.statusCode == 200)
            registerUser(req, res, body);
        else
            res.status(400).json({status: 'error', result: error});
    });
}

var registerUser = function(req, res, body){
    var data = {
        client_id: JSON.parse(body).client_id,
        username: req.body.username,
        website: req.body.website,
        is_verified: true,
        created_at: (new Date()).toISOString()
    };
    var password = req.body.password;
    var save_client_params = {'client_id': data.client_id,
                              'website': data.website            
                            };
    saveUserInDb(password, res, save_client_params, data);
}

var saveUserInDb = function(password, res, save_client_params, data){
    request({url: config.save_client_url, qs: save_client_params}, function (error, response, body) {
        if (!error && response.statusCode == 200){
            saveUserInFrontEndDb(data, password, res);
            uploadDefaultImage(data.client_id);
        }
        else
            res.status(400).json({status: 'error', result: error});
    });
}

var uploadDefaultImage = function(client_id){
    client_id = client_id.toString();
    var f = request(config.DEFAULT_IMAGE_URL).pipe(fs.createWriteStream('default_image'));
    f.on('finish', function(){
        var bodyStream = fs.createReadStream('default_image');
        upload_file(client_id, bodyStream, config.s3_bucket_name).then(function(){
            console.log('DefaultImage uploaded.');
        }).catch(function(e){
            console.log('Error uploading DefaultImage');
            console.log(e);
        });
    });
}

var saveUserInFrontEndDb = function(data, password, res){
    User.register(data, password, function(err){
        if (err)
            res.status(400).json({status: 'error', result: err});
        else
            res.json({status: 'OK', registered: true, result: data});
    });
}

var getUserDetails = function(req, res, next){
  if (req.isAuthenticated())
    res.json({ status: 'ok' , result: req.user});
  else
    res.sendStatus(403);
}

var getUserImage = function(req, res, next){
  if (req.isAuthenticated()){
    let image = config.NOTIFICATION_IMAGE_BASE_PATH + req.user.client_id;
    res.json({ status: 'ok' , result: image});
  }
  else
    res.sendStatus(403);
}


export default {
  create: createOne,
  details: getUserDetails,
  image: getUserImage
}
