#!/Library/Frameworks/Python.framework/Versions/3.11/bin/python3

import re
import mysql.connector
import paramiko
import datetime
import ipaddress
import time
#from termcolor import colored
from datetime import datetime, timedelta, timezone
from prettytable import PrettyTable

def updateDB(router_ip_address):
    print('update db.....')

    with open('credentials.txt', 'r') as f:
        for line in f:
            parts = line.strip().split(',')
            if parts[0] == router_ip_address:
                port, username, password, command, db_host, db_user, db_password, db_database, table_name  = int(parts[1]),parts[2], parts[3], parts[4], parts[5], parts[6], parts[7], parts[8], parts[9]
                break
        else:
            print(f'No login credentials found for ROUTER IP address {router_ip_address}')
            return 0


    # establish connection to MySQL database
    db = mysql.connector.connect(
        host=db_host,
        user=db_user,
        password=db_password,
        database=db_database
    )

    ## create a cursor object to execute SQL queries
    cursor = db.cursor()

    # Create SSH client and connect to device
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(router_ip_address, port=port, username=username, password=password)

    # Do something with the SSH client, e.g. run a command
    stdin, stdout, stderr = client.exec_command(command)
    for line in stdout:
        print(line.strip())

    # Close the SSH client
    client.close()

    # regular expression patterns to extract IP address, MAC address, and timestamp
    ip_pattern = re.compile(r"\b(?:\d{1,3}\.){3}\d{1,3}\b")
    mac_pattern_01 = re.compile(r"[0-9a-fA-F]{4}\.[0-9a-fA-F]{4}\.[0-9a-fA-F]{4}\.[0-9a-fA-F]{2}")
    mac_pattern_02 = re.compile(r"[0-9a-fA-F]{4}\.[0-9a-fA-F]{4}\.[0-9a-fA-F]{4}")
    time_pattern = re.compile(r"\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2}\s+\d{4}\s+\d{1,2}:\d{2}\s+(?:AM|PM)\b")

    # open the input file and read its contents line by line
    #with open("output.txt", "r") as f:
    for line in stdout:
        #ip_match = ip_regex.search(line)
        #mac_match = mac_regex.search(line)
        #for line in f:
        # extract IP address, MAC address, and timestamp from the line
        ip_match = ip_pattern.search(line)
        if ip_match:
            ip_address = ip_match.group()
        else:
            #ip_address = None
            continue

        mac_match_01 = mac_pattern_01.search(line)
        if mac_match_01:
            mac_address = mac_match_01.group()
        else:
            mac_match_02 = mac_pattern_02.search(line) 
            if mac_match_02:
                mac_address = mac_match_02.group()

        time_match = time_pattern.search(line)
        if time_match:
            time_stamp = time_match.group()
            date_obj = datetime.strptime(time_stamp, '%b %d %Y %I:%M %p')
            formatted_date = date_obj.strftime('%Y-%m-%d %H:%M:%S')
            current_time = datetime.now()
            current_time = current_time.strftime('%Y-%m-%d %H:%M:%S')
        else:
            #formatted_date = None
            continue


        sql = "SELECT * FROM {} WHERE ip_address = %s AND mac_address = %s".format(table_name)
        values = (ip_address, mac_address)
        cursor.execute(sql, values)
        existing_rows = cursor.fetchall()

        # insert the data into the database if it doesn't already exist
        if not existing_rows:
            sql = "INSERT INTO {} (ip_address, mac_address, dhcp_lease, time_stamp) VALUES (%s, %s, %s, %s)".format(table_name)
            values = (ip_address, mac_address, formatted_date, current_time)
            cursor.execute(sql, values)

            # commit the changes to the database
            db.commit()
            #print("New log entries added to the database.")
            # fetch the newly added log entries from the database and print them
            cursor.execute("SELECT * FROM {} WHERE ip_address = %s AND mac_address = %s AND dhcp_lease = %s AND time_stamp = %s".format(table_name), values)
            new_data = cursor.fetchall()
            #new_data = []
            #new_data.append([ip_address, mac_address, formatted_date])
        
            if new_data:   
                # display the new log entries in a pretty table format
                table = PrettyTable()
                table.field_names = ["IP Address", "MAC Address", "DHCP Lease", "Time Stamp"]
                for log in new_data:
                    table.add_row([ip_address, mac_address, formatted_date, current_time])
                    print(table) 
            #else:
            #    print("Log file not found.")

            # insert the data into the database
            #sql = "INSERT INTO logs (ip_address, mac_address, time_stamp) VALUES (%s, %s, %s)"
            #values = (ip_address, mac_address, formatted_date)
            #cursor.execute(sql, values)

            # commit the changes to the database
            #db.commit()

def delete_old_data(routerIP):
    with open('credentials.txt', 'r') as f:
        for line in f:
            parts = line.strip().split(',')
            if parts[0] == routerIP:
                port, username, password, command, db_host, db_user, db_password, db_database, table_name  = int(parts[1]),parts[2], parts[3], parts[4], parts[5], parts[6], parts[7], parts[8], parts[9]
                break
        else:
            print(f'No login credentials found for ROUTER IP address {routerIP}')
            return []


    # establish connection to MySQL database
    db = mysql.connector.connect(
        host=db_host,
        user=db_user,
        password=db_password,
        database=db_database
    )

    ## create a cursor object to execute SQL queries
    cursor = db.cursor()    

    # calculate the timestamp for 6 months ago
    six_months_ago = datetime.now() - timedelta(days=180)
    formatted_date = six_months_ago.strftime('%Y-%m-%d %H:%M:%S')

    # construct the SQL query to delete old entries
    sql = "DELETE FROM {} WHERE time_stamp < %s".format(table_name)
    values = (formatted_date,)

    # execute the query
    cursor.execute(sql, values)
    db.commit()

    # print the number of deleted rows
    print("\n{} rows deleted.\n".format(cursor.rowcount))

    # close the database connection
    cursor.close()
    db.close()


def is_valid_mac_address(mac_address):
    pattern = re.compile("^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$")
    return pattern.match(mac_address) is not None


def search_ip(routerIP, ip_address):
    with open('credentials.txt', 'r') as f:
        for line in f:
            parts = line.strip().split(',')
            if parts[0] == routerIP:
                port, username, password, command, db_host, db_user, db_password, db_database, table_name  = int(parts[1]),parts[2], parts[3], parts[4], parts[5], parts[6], parts[7], parts[8], parts[9]
                break
        else:
            print(f'No login credentials found for ROUTER IP address {routerIP}')
            return []


    # establish connection to MySQL database
    db = mysql.connector.connect(
        host=db_host,
        user=db_user,
        password=db_password,
        database=db_database
    )

    ## create a cursor object to execute SQL queries
    cursor = db.cursor()
    # execute SQL query to search for the given IP address
    sql = "SELECT * FROM {} WHERE ip_address = %s".format(table_name)
    values = (ip_address,)
    cursor.execute(sql, values)

    # fetch all the rows that match the IP address    
    row_headers = [x[0] for x in cursor.description]  # this will extract row headers
    rv = cursor.fetchall()
    json_data = []
    for row in rv:
        result = []
        for item in row:
            if type(item) is datetime: item = item.astimezone(timezone.utc)
            elif item == '0000-00-00 00:00:00': item = ''
            result.append(item)
        json_data.append(dict(zip(row_headers, result)))
    cursor.close()
    db.close()
    return json_data



def searchDuplicates(routerIP):
    with open('credentials.txt', 'r') as f:
        for line in f:
            parts = line.strip().split(',')
            if parts[0] == routerIP:
                port, username, password, command, db_host, db_user, db_password, db_database, table_name  = int(parts[1]),parts[2], parts[3], parts[4], parts[5], parts[6], parts[7], parts[8], parts[9]
                break
        else:
            print(f'No login credentials found for ROUTER IP address {routerIP}')
            return []


    # establish connection to MySQL database
    db = mysql.connector.connect(
        host=db_host,
        user=db_user,
        password=db_password,
        database=db_database
    )

    ## create a cursor object to execute SQL queries
    cursor = db.cursor()
    # execute SQL query to search for duplicate IP and MAC addresses
    sql = "SELECT ip_address, mac_address, COUNT(*) AS count FROM {} GROUP BY ip_address, mac_address HAVING count > 1".format(table_name)
    cursor.execute(sql)

    # fetch all the rows that match the IP address    
    row_headers = [x[0] for x in cursor.description]  # this will extract row headers
    rv = cursor.fetchall()
    json_data = []
    for row in rv:
        result = []
        for item in row:
            if type(item) is datetime: item = item.astimezone(timezone.utc)
            elif item == '0000-00-00 00:00:00': item = ''
            result.append(item)
        json_data.append(dict(zip(row_headers, result)))
    cursor.close()
    db.close()
    return json_data


def search_ip_buffer(ip_address, rows):
    # filter rows by IP address
    ip_address_str = str(ip_address)
    filtered_rows = [row for row in rows if str(row[0]) == ip_address_str]

    # print the filtered rows in tabular form using prettytable
    if filtered_rows:
        table = PrettyTable()
        table.field_names = ["IP Address", "MAC Address", "DHCP Lease", "Time Stamp"]
        for row in filtered_rows:
            table.add_row(row)
        print(f"Data found for IP address {ip_address}:")
        print(table)
    else:
        print(f"No data found for IP address {ip_address}.")

def search_mac_buffer(mac_address, rows):
    # filter rows by MAC address
    mac_address_str = str(mac_address)
    filtered_rows = [row for row in rows if str(row[0]) == mac_address_str]

    # print the filtered rows in tabular form using prettytable
    if filtered_rows:
        table = PrettyTable()
        table.field_names = ["MAC Address", "IP Address", "DHCP Lease"]
        for row in filtered_rows:
            table.add_row(row)
        print(f"Data found for MAC address {mac_address_str}:")
        print(table)
    else:
        print(f"No data found for MAC address {mac_address}.")

def search_time_range(routerIP, start_date, end_date):
    try:        
        datetime.strptime(start_date, "%Y-%m-%d")
        datetime.strptime(end_date, "%Y-%m-%d")
    except ValueError:
        #print(colored("Please enter a date in the format YYYY-MM-DD.", attrs=["blink"]))
        print("\nPlease enter a date in the format YYYY-MM-DD.\n")
        return -1, []
    with open('credentials.txt', 'r') as f:
        for line in f:
            parts = line.strip().split(',')
            if parts[0] == routerIP:
                port, username, password, command, db_host, db_user, db_password, db_database, table_name  = int(parts[1]),parts[2], parts[3], parts[4], parts[5], parts[6], parts[7], parts[8], parts[9]
                break
        else:
            print(f'No login credentials found for ROUTER IP address {routerIP}')
            return -2, []


    # establish connection to MySQL database
    db = mysql.connector.connect(
        host=db_host,
        user=db_user,
        password=db_password,
        database=db_database
    )

    ## create a cursor object to execute SQL queries
    cursor = db.cursor()
    json_data = []    
    # execute SQL query to search for IP addresses within the given date range
    sql = "SELECT DISTINCT(ip_address), mac_address, dhcp_lease , time_stamp FROM {} WHERE dhcp_lease BETWEEN %s AND %s".format(table_name)
    values = (start_date, end_date)
    cursor.execute(sql, values) 

    row_headers = [x[0] for x in cursor.description]  # this will extract row headers
    rv = cursor.fetchall()
    for row in rv:
        result = []
        for item in row:
            if type(item) is datetime: item = item.astimezone(timezone.utc)
            elif item == '0000-00-00 00:00:00': item = ''
            result.append(item)
        json_data.append(dict(zip(row_headers, result)))        

    
            
def searchIPAddress(routerIP, ip_address):
    if not ip_address:
        print("Please enter an IP address.")
        return []
    # check if the input is a valid IPv4 or IPv6 address
    is_valid_ip = False
    if re.match(r'^(\d{1,3}\.){3}\d{1,3}$', ip_address):
        try:
            ipaddress.IPv4Address(ip_address)
            is_valid_ip = True
        except ipaddress.AddressValueError:
            pass
    elif re.match(r'^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$', ip_address):
        try:
            ipaddress.IPv6Address(ip_address)
            is_valid_ip = True
        except ipaddress.AddressValueError:
            pass
    # search for the IP address in the buffer if it's valid
    if is_valid_ip:        
        return search_ip(routerIP, ip_address)
    else:
        return []

def searchMac(routerIP, mac_address):
    json_data = []
    with open('credentials.txt', 'r') as f:
        for line in f:
            parts = line.strip().split(',')
            if parts[0] == routerIP:
                port, username, password, command, db_host, db_user, db_password, db_database, table_name  = int(parts[1]),parts[2], parts[3], parts[4], parts[5], parts[6], parts[7], parts[8], parts[9]
                break
        else:
            print(f'No login credentials found for ROUTER IP address {routerIP}')
            return json_data

    # establish connection to MySQL database
    db = mysql.connector.connect(
        host=db_host,
        user=db_user,
        password=db_password,
        database=db_database
    )

    ## create a cursor object to execute SQL queries
    cursor = db.cursor()
    # execute SQL query to search for the given IP address
    sql = "SELECT * FROM {} logs WHERE mac_address = %s".format(table_name)
    values = (mac_address,)
    cursor.execute(sql, values)

    # fetch all the rows that match the IP address    
    row_headers = [x[0] for x in cursor.description]  # this will extract row headers
    rv = cursor.fetchall()
    
    for row in rv:
        result = []
        for item in row:
            if type(item) is datetime: item = item.astimezone(timezone.utc)
            elif item == '0000-00-00 00:00:00': item = ''
            result.append(item)
        json_data.append(dict(zip(row_headers, result)))
    cursor.close()
    db.close()
    return json_data   
