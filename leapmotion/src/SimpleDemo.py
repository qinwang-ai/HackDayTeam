#############################################################
#    Author: Jianfei Yang
#    Usage:    Hand gesture recognition
#############################################################

import sys
sys.path.insert(0, "../lib")
import Leap, thread, time
import socket
from Leap import CircleGesture, KeyTapGesture, ScreenTapGesture, SwipeGesture

class SampleListener(Leap.Listener):
    HOST = '25.0.0.116'
    PORT = 7556
    BUFSIZ = 1024
    ADDR = (HOST, PORT)
    gesture = ''
    
    finger_names = ['Thumb', 'Index', 'Middle', 'Ring', 'Pinky']
    bone_names = ['Metacarpal', 'Proximal', 'Intermediate', 'Distal']
    state_names = ['STATE_INVALID', 'STATE_START', 'STATE_UPDATE', 'STATE_END']
    
    def on_init(self, controller):
        print "Initialized"
    
    def on_connect(self, controller):
        print "Connected"
        
        # Enable gestures
        controller.enable_gesture(Leap.Gesture.TYPE_CIRCLE);
        controller.enable_gesture(Leap.Gesture.TYPE_KEY_TAP);
        controller.enable_gesture(Leap.Gesture.TYPE_SCREEN_TAP);
        controller.enable_gesture(Leap.Gesture.TYPE_SWIPE);
    
    def on_disconnect(self, controller):
        # Note: not dispatched when running in a debugger.
        print "Disconnected"
    
    def on_exit(self, controller):
        print "Exited"
    
    def on_frame(self, controller):
        # Get the most recent frame and report some basic information
        frame = controller.frame()
        
        # Get hands
        for hand in frame.hands:
            
            handType = "Left hand" if hand.is_left else "Right hand"
            
            # Get the hand's normal vector and direction
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
                if (delta[0]<0.5 and delta[1]<0.5 and delta[2]>1 and delta[3]>1 and delta[4]>1):
                    print "One!"
                    gesture = "1"
                elif (delta[0]<0.5 and delta[1]<0.5 and delta[2]<0.5 and delta[3]>1 and delta[4]>1):
                    print "Two!"
                    gesture = "2"
                elif (delta[1]<0.5 and delta[2]<0.5 and delta[3]<0.5 and delta[4]>1):
                    print "Three!"
                    gesture = "3"
                elif (delta[1]<0.5 and delta[2]<0.5 and delta[3]<0.5 and delta[4]<0.5 and SR<100):
                    print "Four!"
                    gesture = "4"
                elif (delta[1]<0.5 and delta[2]<0.5 and delta[3]<0.5 and delta[4]<0.5 and SR>150):
                    print "Five!"
                    gesture = "5"
                else:
                    print "None!"
                    gesture = "0"
            elif (Strength > 0.9 and SR < 60):
                print "Ten!"
                gesture = "10"
            else:
                print "None!"
                gesture = "0"
    
        if frame.hands.is_empty:
            print "None!"
            gesture = "0"

    
    def state_string(self, state):
        if state == Leap.Gesture.STATE_START:
            return "STATE_START"
        
        if state == Leap.Gesture.STATE_UPDATE:
            return "STATE_UPDATE"
        
        if state == Leap.Gesture.STATE_STOP:
            return "STATE_STOP"
        
        if state == Leap.Gesture.STATE_INVALID:
            return "STATE_INVALID"

def main():
    # Create a listener and controller
    listener = SampleListener()
    controller = Leap.Controller()
    
    # Have the listener receive events from the controller
    controller.add_listener(listener)
    
    # Keep this process running until Enter is pressed
    print "Press Enter to quit..."
    try:
        sys.stdin.readline()
    except KeyboardInterrupt:
        pass
    finally:
        controller.remove_listener(listener)


if __name__ == "__main__":
    main()
