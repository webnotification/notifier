from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^save_client$', views.save_client, name='save_client'),
    url(r'^generate_user_id$', views.generate_user_id, name='generate_user_id'),
    url(r'^generate_client_id$', views.generate_client_id, name='generate_client_id'),
    url(r'^generate_group$', views.generate_group, name='generate_group'),
    url(r'^delete_group$', views.delete_group, name='delete_group'),
    url(r'^save_push_key$', views.save_push_key, name='save_push_key'),
    url(r'^send_notification$', views.send_notification, name='send_notification'),
    url(r'^send_permission_message$', views.send_permission_message, name='send_permission_message'),
    url(r'^send_permission_response$', views.send_permission_response, name='send_permission_response'),
    url(r'^send_notification_response$', views.send_notification_response, name='send_notification_response'),
    url(r'^get_notification_analytics$', views.get_notification_analytics, name='get_notification_analytics'),
    url(r'^get_permission_analytics$', views.get_permission_analytics, name='get_permission_analytics'),
    url(r'^get_permission_CTR$', views.get_permission_CTR, name='get_permission_CTR'),
    url(r'^get_notification_CTR$', views.get_notification_CTR, name='get_notification_CTR'),
    url(r'^get_notification_data$', views.get_notification_data, name='get_notification_data'),
    url(r'^get_groups$', views.get_groups, name='get_groups'),
    url(r'^ask_permission$', views.ask_permission, name='ask_permission'),
]
