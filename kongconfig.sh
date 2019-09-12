curl -i -X POST \
  --url http://ec2-18-191-110-235.us-east-2.compute.amazonaws.com:8001/services/ \
  -d 'name=taxiapi' \
  -d 'url=http://ec2-18-191-110-235.us-east-2.compute.amazonaws.com'

curl -X POST \
  --url http://ec2-18-191-110-235.us-east-2.compute.amazonaws.com:8001/services/taxiapi/routes \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'hosts[]=ec2-18-191-110-235.us-east-2.compute.amazonaws.com'

curl -X POST \
  --url http://ec2-18-191-110-235.us-east-2.compute.amazonaws.com:8001/plugins \
  -d "name=rate-limiting"  \
  -d "config.second=5" \
  -d "config.hour=10000"

curl -i -X POST \
  --url http://ec2-18-191-110-235.us-east-2.compute.amazonaws.com:8001/upstreams \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'name=taxiapi'

curl -i -X POST \
  --url http://ec2-18-191-110-235.us-east-2.compute.amazonaws.com:8001/upstreams/taxiapi/targets \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'target=taxi-api-1:8000'
  -d 'weight=50'

curl -i -X POST \
  --url http://ec2-18-191-110-235.us-east-2.compute.amazonaws.com:8001/upstreams/taxiapi/targets \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'target=taxi-api-2:8000'
  -d 'weight=50'

curl -i -X POST \
  --url http://ec2-18-191-110-235.us-east-2.compute.amazonaws.com:8001/consumers/ \
  -d "username=mobile"

curl -i -X POST \
  --url http://ec2-18-191-110-235.us-east-2.compute.amazonaws.com:8001/consumers/ \
  -d "username=web"

curl -i -X POST \
  --url http://ec2-18-191-110-235.us-east-2.compute.amazonaws.com:8001/consumers/mobile/plugins \
  -d "name=rate-limiting" \
  -d "config.minute=5"

curl -i -X 
  POST http://ec2-18-191-110-235.us-east-2.compute.amazonaws.com:8001/consumers/web/plugins \
  -d "name=rate-limiting" \
  -d "config.minute=5"

curl -i -X POST \
  --url http://ec2-18-191-110-235.us-east-2.compute.amazonaws.com:8001/consumers/web/key-auth/ \
  -d 'key=web'

curl -i -X POST \
  --url http://ec2-18-191-110-235.us-east-2.compute.amazonaws.com:8001/consumers/mobile/key-auth/ \
  -d 'key=mobile'