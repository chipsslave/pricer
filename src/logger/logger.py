import datetime


def logger(msg1, msg2, msg3, msg4):
    with open('logs.txt', 'a') as file:
        file.write("\n###########################################################################################\n")
        file.write("----  " + str(datetime.datetime.utcnow()) + "  ----" + "\n")
        file.write("---- Currently evaluating Item: ----\n")
        file.write(msg1 + "\n")
        file.write("---- Database Item: ----\n")
        file.write(msg2 + "\n")
        file.write("---- Last Price Item: ----\n")
        file.write(msg3 + "\n")
        file.write("---- New Price Item: ----\n")
        file.write(msg4 + "\n")
