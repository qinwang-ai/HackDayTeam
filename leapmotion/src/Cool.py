#-*-coding:utf-8-*-
import sys
sys.path.insert(0, "../lib")
import Leap, thread, time
import socket
from Leap import CircleGesture, KeyTapGesture, ScreenTapGesture, SwipeGesture

PLAYER = 'A_'
HOST = '25.0.0.120'
PORT = 7556
BUFSIZE = 1024
ADDR = (HOST, PORT)

client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client.connect(ADDR)

def Init(controller):
	controller.enable_gesture(Leap.Gesture.TYPE_CIRCLE)
	controller.enable_gesture(Leap.Gesture.TYPE_SWIPE)
	controller.enable_gesture(Leap.Gesture.TYPE_KEY_TAP)
	controller.enable_gesture(Leap.Gesture.TYPE_SCREEN_TAP)

	controller.config.set("Gesture.KeyTap.MinDownVelocity", 30.0)
	controller.config.set("Gesture.Swipe.MinVelocity", 500)

	controller.config.set("Gesture.Circle.MinRadius", 5.0)
	controller.config.set("Gesture.Circle.MinArc", 1)
	controller.config.save()


#####################################################

controller = Leap.Controller()

# Initialize
Init(controller)

# Required Variable
counter = 0
circleNum = 0
keyTapNum = 0
initHei = 0
label = 0
maxV = 0
maxZ = 0
maxX = 0
strenNum = 0
stren0 = 0
di = [0,0]
ifstart = 0


while True:
	label = []

	counter = counter + 1
	frame = controller.frame()

	tools = frame.tools

	hands = frame.hands
	if not hands.is_empty:
		if hand.grab_strength == 1:
			strenNum += 1
		elif hand.grab_strength == 0:
			stren0 += 1
	handNum = len(hands)
	hand = hands[0]
	velx = hand.palm_velocity[0]
	velocity = hand.palm_velocity[1]
	velz = hand.palm_velocity[2]

	dix = hand.palm_normal[1]
	if dix > 0.92:
		di[0] = 1
	if dix < -0.92:
		di[1] = 1

	if handNum == 1 and velocity < maxV:
		maxV = velocity
	if handNum == 1 and velz < maxZ:
		maxZ = velz
	if handNum == 1 and maxX < velx:
		maxX = velx

	for gesture in frame.gestures():
		if gesture.type is Leap.Gesture.TYPE_CIRCLE:
			circleNum += 1
		elif gesture.type is Leap.Gesture.TYPE_KEY_TAP:
			keyTapNum += 1

	if (counter == 30000):
		if (circleNum > 1):
			label.append(1)
		if stren0 > 27000:
			label.append(3)
		if (maxV < -100):
			if (dix < -0.8):
				label.append(2)
			else:
				label.append(4)
		if (maxX > 200):
			label.append(5)
		#label.append(6)
		if di == '0000':
			label.append(7)
		if (keyTapNum > 1):
			label.append(8)
		if handNum > 1:
			label.append(9)
		if maxZ < -200:
			label.append(10)

		for hand in frame.hands:
			normal = hand.palm_normal
			direction = hand.direction
			SR = hand.sphere_radius
			delta = []

			# Get arm bone
			arm = hand.arm

			# Get fingers
			Strength = hand.grab_strength
			for finger in hand.fingers:
				delta.append(finger.direction[2] - direction[2])

			# Classfication

			if (Strength < 0.01):
				if (ifstart == 0 and delta[0]<0.5 and delta[1]<0.5 and delta[2]>1 and delta[3]>1 and delta[4]<0.5):
					ifstart = 1
					label.append(100)
					print "start"
				if (delta[0]<0.5 and delta[1]<0.5 and delta[2]>1 and delta[3]>1 and delta[4]>1):
					label.append(11)
				elif (delta[0]<0.5 and delta[1]<0.5 and delta[2]<0.5 and delta[3]>1 and delta[4]>1):
					label.append(12)
				elif (delta[1]<0.5 and delta[2]<0.5 and delta[3]<0.5 and delta[4]>1):
					label.append(13)
				elif (delta[1]<0.5 and delta[2]<0.5 and delta[3]<0.5 and delta[4]<0.5 and SR<100):
					label.append(14)
				elif (delta[1]<0.5 and delta[2]<0.5 and delta[3]<0.5 and delta[4]<0.5 and SR>150):
					label.append(15)

		# Send
		if ifstart == 1:
			senddata = 'start'
			ifstart = 2
		else:
			senddata = ''
			senddata = senddata + PLAYER
			for item in label:
				senddata = senddata + str(item)
				if item != label[-1]:
					senddata = senddata + ','
		if len(label)!=0:
			print senddata
			client.send(senddata)
			client.recv(1024)

		print '**********'
		circleNum = 0
		keyTapNum = 0
		counter = 0
		maxV = 0
		maxZ = 0
		maxX = 0
		strenNum = 0
		stren0 = 0
		di = [0,0]
		del label [:]

client.close()