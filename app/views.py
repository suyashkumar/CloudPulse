"""
views.py
The Flask server behind CloudPulse. Assembles and parses incoming data stream from device. Adds information to database.
On new exam, pushes information to client causing it to request the new exam and display it to the user. Any and all signal processing
will happen here.

@author: Suyash Kumar
"""
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


collection=connection['test4'].users # Define the database collection
def event_stream(): 
    """
    Parses and assembles incoming messages into exams. Adds exams to database, yields a generator over the ids of exams (to be pushed to the client over SSE)
    """
    messages=SSEClient('https://api.particle.io/v1/devices/events?access_token=6a61e063f79781dddcc39729e77ed76696f23bfc') # Get iterator over SSE messages from the device 
    msgGen=process.parse(messages.__iter__()) # Get generator over FULL assembled packages of data from device
    for item in msgGen: # For each full package of data from the device: 
        print item
        # Save this exam data to database
        exam=collection.Exam()
        exam['name']=unicode(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
        exam['data']=item
        exam['datestr']=u''
        exam.save()
        print exam['_id']
        
        yield "data: %s\n\n" % str(exam['_id']) # Yield generator with the unique ID of this exam to the client
        
@app.route('/data_source')
def sse_request():
    """
    Pushes new messages containing database unique ids of new exams to open sockets.  
    """
    return Response(
            event_stream(),
            mimetype='text/event-stream')

@app.route('/')
def page():
    """
    Send index over at route '/' 
    """
    print "main"
    return app.send_static_file('index.html') 

@app.route('/api/list', methods=['GET'])
def list():
    """
    Respond with a list of all exams. Currently also sends exam data, id, and name.
    """
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
    """
    Deletes the exam with id <id> from the database.
    """ 
    collection.remove({"_id":ObjectId(id)})
    print "del"
    return "ok"

@app.route('/api/download/<id>')
def download(id):
    """
    Generates CSV of the exam with id <id> and returns it to client as a file for download. 
    """
    # First make csv string:
    item=collection.find({'_id':ObjectId(id)})
    retStr=str(item[0]['data']) 
    csv=retStr[1:len(retStr)-1] 

    response = make_response(csv) # Add csv string to response 
    response.headers["Content-Disposition"] = "attachment; filename=pulsedata.csv" # Set right headers for response
    return response


if __name__ == '__main__':
    http_server = WSGIServer(('127.0.0.1', 5000), app)
    http_server.serve_forever()
