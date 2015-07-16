from app import app
from app import connection
from app import Exam 
from sseclient import SSEClient
from flask import Response,make_response
import gevent
import gevent.monkey
from gevent.pywsgi import WSGIServer
gevent.monkey.patch_all()
import process
import json
import datetime
from bson.objectid import ObjectId


collection=connection['test4'].users


def event_stream(): 
    messages=SSEClient('https://api.particle.io/v1/devices/events?access_token=6a61e063f79781dddcc39729e77ed76696f23bfc')
    print type(messages) 
    msgGen=process.parse(messages.__iter__())  
    for item in msgGen:
        print item
        # Save to database
        exam=collection.Exam()
        exam['name']=unicode(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
        exam['data']=item
        exam['datestr']=u''
        exam.save()
        print exam['_id']
        yield "data: %s\n\n" % str(exam['_id'])
        #yield "data: {\"data\": %s}\n\n" % str(item)
@app.route('/data_source')
def sse_request():
    return Response(
            event_stream(),
            mimetype='text/event-stream')

@app.route('/')
def page():
    print "main"
    return app.send_static_file('index.html') 
@app.route('/api/list', methods=['GET'])
def list():
    returnDict={'name':[],'data':[],'id':[]}
    print "hello"
    collection=connection['test4'].users
    itemList= collection.Exam.find()

    for item in itemList:
        print str(item['name'])
        print item['data']
        returnDict['name'].append(str(item['name']))
        returnDict['data'].append((item['data']))
        returnDict['id'].append(item._id.__str__())

    return Response(json.dumps(returnDict), mimetype='application/json')
@app.route('/api/del/<id>')
def delete(id):
    collection.remove({"_id":ObjectId(id)})
    print "del"
    return "ok"

@app.route('/api/download/<id>')
def download(id):
    item=collection.find({'_id':ObjectId(id)})
    retStr=str(item[0]['data']) 
    csv=retStr[1:len(retStr)-1]
    print csv
    # We need to modify the response, so the first thing we 
    # need to do is create a response out of the CSV string
    response = make_response(csv)
    # This is the key: Set the right header for the response
    # to be downloaded, instead of just printed on the browser
    response.headers["Content-Disposition"] = "attachment; filename=pulsedata.csv"
    return response


if __name__ == '__main__':
    http_server = WSGIServer(('127.0.0.1', 5000), app)
    http_server.serve_forever()
