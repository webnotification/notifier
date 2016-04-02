# notification.backend

### Before running django app

##### Run celery
``` bash
celery --app=backend.celery:app worker --loglevel=INFO
```

##### Run rabbitmq
``` bash
rabbitmq-server
```

or

##### Run redis
``` bash
redis-server
```
