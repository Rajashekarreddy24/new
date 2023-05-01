from flask import Flask, render_template, request, json, session, Response, url_for
from responses import error_400_message, error_401_message, error_403_message, success_200_message, success_200_message_result
import os, base64, random
from datetime import timedelta, datetime
from os.path import join, dirname, realpath
import time
from datetime import date
from createDB import createDB
from searchDB import updateDB, searchIPAddress, searchMac, searchDuplicates, delete_old_data, search_time_range

app = Flask(__name__)

#SESSION_TYPE = 'filesystem'
#Session(app)


@app.route('/site', methods = ["GET"])
def list_routes():
	output = []
	for rule in app.url_map.iter_rules():
		options = {}
		for arg in rule.arguments:
			options[arg] = "[{0}]".format(arg)

		methods = ','.join(rule.methods)
		url = url_for(rule.endpoint, **options)
		output.append((rule.endpoint, methods, url))
	return json.dumps(output)


@app.route('/bk/updateDB', methods=["POST"])
def bk_updateDB():
	print('---update db-----')
	routerIP = request.form.get('routerIP')
	if createDB(routerIP) > 0:
		updateDB(routerIP)
	return json.dumps(success_200_message('ok'))

@app.route('/bk/searchIP', methods=["POST"])
def bk_searchIP():
	print('---searchIP db-----')
	routerIP = request.form.get('routerIP')
	ipAddress = request.form.get('ipAddress')	
	return json.dumps(searchIPAddress(routerIP, ipAddress))	

@app.route('/bk/searchMAC', methods=["POST"])
def bk_searchMAC():
	print('---searchMAC-----')
	routerIP = request.form.get('routerIP')
	macAddress = request.form.get('macAddress')		
	return json.dumps(searchMac(routerIP, macAddress))

@app.route('/bk/searchDuplicate', methods=["POST"])
def bk_searchDuplicate():
	print('---searchDuplicate-----')
	routerIP = request.form.get('routerIP')	
	return json.dumps(searchDuplicates(routerIP))

@app.route('/bk/cleanUp', methods=["POST"])
def bk_cleanUp():
	print('---cleanUp-----')
	routerIP = request.form.get('routerIP')	
	return json.dumps(delete_old_data(routerIP))

@app.route('/bk/searchDateRange', methods=["POST"])
def bk_searchDateRange():
	print('---searchDateRange-----')
	routerIP = request.form.get('routerIP')	
	startDate = request.form.get('startDate')	
	endDate = request.form.get('endDate')	
	return json.dumps(search_time_range(routerIP, startDate, endDate))

############################   web pages   ############################
@app.route('/test')
def main_register():
	return render_template('test.html')

@app.route('/Portal')
def portal_manage():
	return render_template('manage.html')

@app.route('/Form')
def form_manage():
	return render_template('form.html')

@app.route('/')
def index_page():
	return render_template('index.html')


if __name__ == "__main__":
	app.run(debug=True, host='localhost', port=8080, threaded=True)
	#sockio.run(app, host='localhost', port=8080, debug=True)
	#app.run(debug=True, host='0.0.0.0', port=8080, threaded=True, ssl_context=context)

