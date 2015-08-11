"""
process.py
Parses pulse-pressure waveforms relayed from a Spark core over SSE in groups.  
@author: Suyash Kumar
"""
import re
import matplotlib.pyplot as plt
def parse(msgIter):
    """
    Compiles a full N samples (200) from M (4) different messages of 50 samples relayed over SSE push from the 
    spark core. Yields a generator "over" the fully assembled arrays (of N samples). 

    Args:
        msgIter:        A generator over the messages
    Returns:    
        currentData:    yields a generator over fully assembled arrays of data (of N samples) 
    """
    currentData=[] # Data for the current package
    for msgObj in msgIter: 
        dataMatch=re.match(r"{\"data\":\"{(.+)}\".*",msgObj.data) # Try to match data in the incoming message, grab actual data
        currentEvent=msgObj.event # The type of event the current message holds 

        if dataMatch: # If the message is of the data format expected
            if ((currentEvent.strip()=="start")): 
                print "start" # This is the start event, holding the first chunk of data, print "start" to the console 

            # Add this chunk of data:
            currentDataArray=dataMatch.group(1).split(",") # Split captured data portion of message at commas
            currentDataArray=currentDataArray[0:len(currentDataArray)-1] # exclude last element
            currentDataArray=map(int,currentDataArray) # Convert every element in list from str to int
            currentData.extend(currentDataArray) # Append to current package of data
            if (currentEvent.strip()=="dat"):
                print "dat"
            elif (currentEvent.strip()=="end"): # This is the end event holding last chunk of data, yield finished array, print end
                print "end"
                yield currentData
                currentData=[] # Clear currentData for the next set of message processing/storage 
