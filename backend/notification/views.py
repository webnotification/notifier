from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from notification.models import Client, User, Group, Notification, Permission, \
        PermissionResponse, NotificationResponse, Ask_Permission, Notification_Queue
from django.db.models import Count
from django.db import IntegrityError, DataError
from tasks import push_notification, push_permission_message
import requests
import json
import random
import config
from collections import defaultdict
from datetime import datetime
from dateutil import parser


def index(request):
    return HttpResponse("Yup, Server is running.")

def create_default_groups(client_id):
    percentages = [100, 50, 25, 10]
    record_list = [Group(name=str(percentage)+'% users', percentage=percentage , client_id=client_id) for percentage in percentages]
    Group.objects.bulk_create(record_list)

def save_client(request):
    params = request.GET
    client_id = int(params['client_id'])
    website = params['website']
    try:
        client = Client(id=client_id, website=website)
        client.save()
        create_default_groups(client.id)
        response = {'success': True}
    except Exception as e:
        response = {'error': e}
        return HttpResponse(status=400)
    return JsonResponse(response)

def generate_client_id(request):
    try:
        id = Client.objects.latest('id').id + 1
    except Exception:
        id = 0
    response = {'client_id': id}
    response = JsonResponse(response)
    response["Access-Control-Allow-Origin"] = "*"
    return response

def generate_user_id(request):
    website = request.GET['website']
    try:
        id = User.objects.latest('id').id + 1
    except User.DoesNotExist:
        id = 0
    client_id = Client.objects.filter(website=website)[0].id
    user = User(id=id, client_id=client_id)
    user.save()
    ask_permission = Ask_Permission(user_id=id, ask=False)
    ask_permission.save()
    response = {'user_id': id}
    response = JsonResponse(response)
    response["Access-Control-Allow-Origin"] = "*"
    return response

def generate_group(request):
    params = request.GET
    group_name = params['group_name']
    percentage = int(params['percentage'])
    client_id = params['client_id']
    response = {'success': True}
    try:
        group = Group(name=group_name, client_id=client_id, percentage=percentage)
        group.save()
    except Exception as e:
        response = {'error': str(e.__class__.__name__)}
    return JsonResponse(response)

def delete_group(request):
    params = request.GET
    client_id = params['client_id']
    group_name = params['group_name']
    response = {'success': True}
    try:
        group = Group.objects.filter(name=group_name, client_id=client_id)
        group.delete()
    except Exception as e:
        response = {'error': e.message}
    return JsonResponse(response)

def get_groups(request):
    params = request.GET
    client_id = params['client_id']
    groups = Group.objects.filter(client_id=client_id).values('id', 'name', 'percentage')
    response = {'groups': list(groups)}
    return JsonResponse(response)

def save_push_key(request):
    params = request.POST
    website = params['website']
    user_id = params['user_id']
    endpoint = params['subs']
    if endpoint.startswith('https://android.googleapis.com/gcm/send'):
        endpointParts = endpoint.split('/')
        push_key = endpointParts[len(endpointParts) - 1]
    user = User.objects.filter(id=user_id)[0]
    user.push_key = push_key
    response = {'sucess': True}
    try:
        user.save()
    except DataError as e:
        response = {'error': e.message}
    response = JsonResponse(response)
    response["Access-Control-Allow-Origin"] = "*"
    return response

def get_notification_user_list(client_id, group_id):
    percentage = Group.objects.filter(id=group_id)[0].percentage
    user_list = User.objects.filter(client_id=client_id).exclude(push_key=None).values("id", "push_key")   
    shuffled_user_list = sorted(user_list, key=lambda x: random.random())
    final_user_list = shuffled_user_list[:(len(shuffled_user_list)*percentage)/100]
    return final_user_list

def send_notification(request):
    params = request.POST  
    client_id = params['client_id']
    group_id = params['group_id']
    title = params['title']
    message = params['message']
    target_url = params['target_url']
    notification_date = params['date']
    notification_time = params['time']
    notification = Notification(title=title, message=message, target_url=target_url, client_id=client_id, group_id=group_id)
    notification.save()
    notification_id = notification.id
    user_list = get_notification_user_list(client_id, group_id)
    record_list = [NotificationResponse(user_id=user['id'], notification_id=notification_id) for user in user_list]
    NotificationResponse.objects.bulk_create(record_list)
    if notification_date!='' and notification_time!='':
        notification_eta =  notification_date+' '+notification_time
        datetime_object = parser.parse(notification_eta)
        datetime_object = datetime_object.replace(tzinfo=None) + datetime_object.utcoffset()
    else:
        datetime_object = datetime.now()    
    push_notification.apply_async(args=(user_list, title, message, target_url, notification_id), eta=datetime_object)
    return JsonResponse({'success': True})

def get_notification_data(request):
    params = request.GET
    user_id = params['user_id']
    try:
        notification_id = Notification_Queue.objects.filter(user_id=user_id)[0].notification_id
        notification = Notification.objects.get(id=notification_id)
        client_id = User.objects.get(id=user_id).client_id
        notification_data = {
                            'notification_id': notification_id,
                            'title': notification.title,
                            'message': notification.message,
                            'target_url': notification.target_url,
                            'image': config.NOTIFICATION_IMAGE_BASE_PATH + str(client_id)
                }
        Notification_Queue.objects.filter(notification_id=notification_id, user_id=user_id).delete()
        response = JsonResponse(notification_data)
    except IndexError:
        response = JsonResponse({'error': 'No message in queue'})
    response["Access-Control-Allow-Origin"] = "*"
    return response

def get_permission_user_list(client_id, group_id):
    percentage = Group.objects.filter(id=group_id)[0].percentage
    user_list = User.objects.filter(client_id=client_id, push_key=None).values("id")   
    shuffled_user_list = sorted(user_list, key=lambda x: random.random())
    final_user_list = shuffled_user_list[:(len(shuffled_user_list)*percentage)/100]
    return final_user_list

def send_permission_message(request):
    params = request.POST
    group_id = params['group_id']
    client_id = params['client_id']
    permission = Permission(client_id=client_id, group_id=group_id)
    permission.save()
    permission_id = permission.id
    user_list = get_permission_user_list(client_id, group_id)
    push_permission_message.delay(user_list, permission_id) 
    return JsonResponse({'success': True})

def ask_permission(request):
    params = request.GET
    user_id = params['user_id']
    ask_permission = Ask_Permission.objects.get(user_id=user_id)
    permission_data = {
                'ask': ask_permission.ask,
                'permission_id': ask_permission.permission_id
            }
    response  = JsonResponse(permission_data)
    response["Access-Control-Allow-Origin"] = "*"
    return response
    
def send_permission_response(request):
    params = request.POST
    user_id = params['user_id']
    permission_id = params['permission_id']
    action = params['action']
    try:
        permissionresponse = PermissionResponse(user_id=user_id, permission_id=permission_id, action=action)
        permissionresponse.save()
        response = {'success': True}
    except IntegrityError:
        response = {'error': 'Permission already set'}
    except Exception as e:
        response = {'error': e}
    response = JsonResponse(response)
    response["Access-Control-Allow-Origin"] = "*"
    return response

def send_notification_response(request):
    params = request.GET
    user_id = params['user_id']
    notification_id = params['notification_id']
    action = params['action']
    try:
        notificationresponse = NotificationResponse.objects.filter(user_id=user_id, notification_id=notification_id)[0]
        notificationresponse.action = action
        notificationresponse.save()
        response = {'success': True}
    except Exception as e:
        response = {'error': e.message}
    response = JsonResponse(response)
    response["Access-Control-Allow-Origin"] = "*"
    return response

def get_permission_CTR(request):
    params = request.GET
    permission_id = params['permission_id']
    permission_CTR = PermissionResponse.objects.filter(permission_id=permission_id).values('action').annotate(count=Count('action'))
    response = {'result': list(permission_CTR)}
    return JsonResponse(response)
   
def get_notification_CTR(request):
    params = request.GET
    notification_id = params['notification_id']
    notification_CTR = NotificationResponse.objects.filter(notification_id=notification_id).values('action').annotate(count=Count('action'))
    response = {'result': list(notification_CTR)}
    return JsonResponse(response)

def get_permission_analytics(request):
    params = request.GET
    client_id = params['client_id']
    permissions = Permission.objects.filter(client_id=client_id).values('id', 'timestamp', 'group__name', 'permissionresponse__action').annotate(Count('permissionresponse__action'))
    data = defaultdict(dict)
    for permission in permissions:
        data[permission['id']].update({
                        'timestamp': permission['timestamp'],
                        'group': permission['group__name'],
                        'accept': data[permission['id']].get('accept', 0),
                        'reject': data[permission['id']].get('reject', 0),
                        'None': data[permission['id']].get('None', 0),
                        str(permission['permissionresponse__action']): permission['permissionresponse__action__count'] 
                })
    data_list = data.values()
    response = JsonResponse({'permissions': data_list})
    return response

def get_notification_analytics(request):
    params = request.GET
    client_id = params['client_id']
    notifications = Notification.objects.filter(client_id=client_id).values('id', 'title', 'message', 'target_url', 'timestamp', 'group__name', 'notificationresponse__action').annotate(Count('notificationresponse__action'))
    data = defaultdict(dict)
    for notification in notifications:
        data[notification['id']].update({
                        'message': notification['message'],
                        'title': notification['title'],
                        'target_url': notification['target_url'],
                        'timestamp': notification['timestamp'],
                        'group': notification['group__name'],
                        'accept': data[notification['id']].get('accept', 0),
                        'reject': data[notification['id']].get('reject', 0),
                        'None': data[notification['id']].get('None', 0),
                        str(notification['notificationresponse__action']): notification['notificationresponse__action__count'] 
                })
    data_list = data.values()
    response = JsonResponse({'notifications': data_list})
    return response

