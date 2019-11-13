import firebase_admin
from firebase_admin import credentials
from sense_hat import SenseHat
import time

sense = SenseHat()
sense.clear()


# Import database module.
from firebase_admin import db

cred = credentials.Certificate("serviceAccount.json")
firebase_admin.initialize_app(cred,{'databaseURL': 'https://charactergenerator-fc673.firebaseio.com/'})
def my_numbers():
	temp = sense.get_temperature()
	humidity = sense.get_humidity()

	numbers = db.reference('demotica/numbers')
	tempdb = numbers.child('temp')
	tempdb.set(temp)
	humdb = numbers.child('hum')
	humdb.set(humidity)
# Get a database reference to our posts

def my_demotica():
	ref = db.reference('demotica/points')
	snapshot = ref.order_by_key().get()
	for key in snapshot:
		print(key)
		arraypunt = key.split(",");
		x = arraypunt[0];
		y = arraypunt[1];
		color = arraypunt[2];
		if(color == 'green'):
				color = (0, 204, 0)
		elif(color == 'red'):
				color = (204,0,0)
		elif(color == 'orange'):
				color = (153,76,0)
		elif(color == 'yellow'):
				color = (255,255,0)
		elif(color =='darkBlue'):
				color = (0,0,204)
		elif(color =='lightBlue'):
				color = (102,178,255)
		print (color)
		sense.set_pixel(int(x),int(y),color)
			
	my_numbers()
	state = db.reference('demotica/state')
	recentState = state.get()
	while recentState == False:
		recentState = state.get()
	else:
		my_demotica()

# get state
state = db.reference('demotica/state')
recentState = state.get()
print(recentState)
while recentState == False:
	my_numbers()

	recentState = state.get()
else:
	my_demotica()




