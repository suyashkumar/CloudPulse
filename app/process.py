"""
process.py
Parses pulse-pressure waveforms relayed from a Spark core in groups.
"""
import re
import matplotlib.pyplot as plt
def parse(msgIter):
    currentData=[] # Data for the current package
    for msgObj in msgIter:
        
        dataMatch=re.match(r"{\"data\":\"{(.+)}\".*",msgObj.data) # Try to match data 
       
        currentEvent=msgObj.event
        #print currentEvent
        if ((currentEvent.strip()=="start")):

            print "start" 


        elif (currentEvent.strip()=="end"):
            print "end"
            currentDataArray=dataMatch.group(1).split(",")
            currentDataArray=currentDataArray[0:len(currentDataArray)-1]
            currentDataArray=map(int,currentDataArray) # Convert every element in list from str to int
            currentData.extend(currentDataArray)

            yield currentData
            currentData=[]
        if dataMatch: 
            print "dat"
            currentDataArray=dataMatch.group(1).split(",")
            currentDataArray=currentDataArray[0:len(currentDataArray)-1]
            currentDataArray=map(int,currentDataArray) # Convert every element in list from str to int
            currentData.extend(currentDataArray)
            

    

def plotData(dataDict):
    for key in dataDict:
        data=dataDict[key]
        plt.plot(data)
        plt.show()

if __name__=="__main__":
    dataDict=parse("datacapture/sample1.dat") 
    plotData(dataDict)
