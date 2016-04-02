import request from 'request';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import config from './../config/dashboard_config';
import PermissionPage from './../../client/dashboard/components/PermissionPage/PermissionPage';


function send(req, res, next){
    let params = req.body;
    params['client_id'] = req.user.client_id;
    request.post(
        config.send_permission_url,
        { form: params },
        function (error, response, body) {
            if (!error && response.statusCode == 200)
                res.send(body);
            else
                res.send({success: false});
        }
    );
}

let stuff = {
    send: send
};

export default stuff;
