from sseclient import SSEClient
import gevent
import gevent.monkey
from gevent.pywsgi import WSGIServer
gevent.monkey.patch_all()
import process




def event_stream(): 
    messages=SSEClient('https://api.particle.io/v1/devices/events?access_token=6a61e063f79781dddcc39729e77ed76696f23bfc')
    print type(messages) 
    print "start"
    msgGen=process.parse(messages.__iter__())  
    for item in msgGen:
        print item
        yield "data: {\"data\": %s}\n\n" % str(item)
@app.route('/my_event_source')
def sse_request():
    return Response(
            event_stream(),
            mimetype='text/event-stream')

@app.route('/')
def page():
    return app.send_static_file('index.html') 

if __name__ == '__main__':
    http_server = WSGIServer(('127.0.0.1', 8000), app)
    http_server.serve_forever()
