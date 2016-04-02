from __future__ import unicode_literals
from django.db import models
from django.utils import timezone

class Client(models.Model):
    id = models.IntegerField(primary_key=True)
    website = models.CharField(max_length=50, unique=True)

class User(models.Model):
    push_key = models.CharField(max_length=200, blank=True, null=True, unique=True)
    client = models.ForeignKey(Client, on_delete=models.CASCADE)

class Group(models.Model):
    name = models.CharField(max_length=100)
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    percentage = models.IntegerField(default=100)
    class Meta:
        unique_together = ('name', 'client')

class Permission(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(default=timezone.now) 
    group = models.ForeignKey(Group, on_delete=models.CASCADE)

class Ask_Permission(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    ask = models.BooleanField(default=False)
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE, blank=True, null=True)   

class Notification(models.Model):
    title = models.CharField(max_length=50)
    message = models.CharField(max_length=200)
    target_url = models.CharField(max_length=50)
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(default=timezone.now) 
    group = models.ForeignKey(Group, on_delete=models.CASCADE)

class PermissionResponse(models.Model):
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE) 
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    action = models.CharField(max_length=10)
    timestamp = models.DateTimeField(default=timezone.now) 

class NotificationResponse(models.Model):
    notification = models.ForeignKey(Notification, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    action = models.CharField(max_length=10, default='not sent')
    timestamp = models.DateTimeField(default=timezone.now) 

class Notification_Queue(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    notification = models.ForeignKey(Notification, on_delete=models.CASCADE)


    
