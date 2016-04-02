from __future__ import absolute_import
from celery import shared_task
import requests
import config
import json
from notification.models import Ask_Permission, Notification_Queue, NotificationResponse


@shared_task
def push_notification(users, title, message, url, notification_id):
    record_list = [Notification_Queue(user_id=user['id'], notification_id=notification_id) for user in users]
    Notification_Queue.objects.bulk_create(record_list)
    for user in users:
        payload = json.dumps({'registration_ids': [user['push_key']]})
        headers = {
                  'Content-Type': 'application/json',
                  'Authorization': config.GCM_AUTHORIZATION,
                } 
        requests.post(config.GCM_URL, data=payload, headers=headers)
        # delete_notification.apply_async(args=(user['id'], notification_id), countdown = config.NOTIFICATION_TIMEOUT)
    return 'Notifications sent'

@shared_task
def push_permission_message(user_list, permission_id):
    user_list = [user['id'] for user in user_list ]
    ask_permission = Ask_Permission.objects.filter(user_id__in=user_list).update(ask=True, permission_id=permission_id)
    return 'Permission messages sent'

@shared_task
def delete_notification(user_id, notification_id):
    Notification_Queue.objects.filter(notification_id=notification_id, user_id=user_id).delete()
