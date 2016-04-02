import config from './../config/dashboard_config';
import multer from 'multer';
import fs from 'fs';
import upload_file from './../helpers/image_service'


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname+'/../uploads');
  },
  filename: function (req, file, cb) {
    cb(null, req.user.client_id);
  }
});

var multer_upload = multer({ storage: storage }).single('userPhoto');

function upload(req, res, next){
    multer_upload(req, res, function(err){
        if(err)
            console.log(err); 
        else
            upload_to_s3(req, res);
    });
};

function upload_to_s3(req, res){
    if(req.file.size < config.IMAGE_SIZE_THRESHOLD){
        var bodyStream = fs.createReadStream(req.file.path);
        upload_file(req.user.client_id, bodyStream, config.s3_bucket_name).then(function(){
            res.send({success: true});
        }).catch(function(){
            res.send({success: false});
        });
    }
    else{
        res.send({success: false});
    }
};

let stuff = {
    upload: upload
};

export default stuff;
