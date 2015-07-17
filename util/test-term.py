import process
from sseclient import SSEClient


if __name__=="__main__":
    messages=SSEClient('https://api.particle.io/v1/devices/events?access_token=6a61e063f79781dddcc39729e77ed76696f23bfc')
    a=process.parse(messages.__iter__())

    for item in a:
        print item
