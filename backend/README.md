# notification.backend

## Prerequisites
[RabbitMQ](https://www.rabbitmq.com/download.html)

## Install

```
pip install -r requirements.txt
python manage.py migrate
```


## Usage

```
rabbitmq-server
celery --app=backend.celery:app worker --loglevel=INFO
python manage.py runserver
```
