var base_url = 'http://127.0.0.1:8000/notification'; 
//var base_url = 'https://api.flashnotifier.com/notification';
var IMAGE_SIZE_THRESHOLD = 50*1024;

let config = {
        generate_client_id_url: base_url + '/generate_client_id',
        get_groups_url : base_url + '/get_groups',
        save_client_url: base_url + '/save_client',
        generate_group_url : base_url + '/generate_group',
        send_notification_url : base_url + '/send_notification',
        send_permission_url : base_url + '/send_permission_message',
        get_notification_analytics_url : base_url + '/get_notification_analytics',
        get_permission_analytics_url : base_url + '/get_permission_analytics',
        DEFAULT_IMAGE_URL : 'https://s3-ap-southeast-1.amazonaws.com/notificationicons/default_image',
        IMAGE_SIZE_THRESHOLD : IMAGE_SIZE_THRESHOLD,  //in Bytes
        IMAGE_SIZE_ERROR_MSG : 'File size must be less than '+IMAGE_SIZE_THRESHOLD/1024+' Kilobytes',
        NOTIFICATION_IMAGE_BASE_PATH : "https://s3-ap-southeast-1.amazonaws.com/notificationicons.dev/",
        //NOTIFICATION_IMAGE_BASE_PATH : "https://s3-ap-southeast-1.amazonaws.com/notificationicons/",
        s3_bucket_name: 'notificationicons.dev',
        //s3_bucket_name: 'notificationicons.dev',
}

export default config;
