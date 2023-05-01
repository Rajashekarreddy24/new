#!/Library/Frameworks/Python.framework/Versions/3.11/bin/python3

import mysql.connector

def createDB(router_ip_address):
    print('---create db-----{}'.format(router_ip_address))
    with open('credentials.txt', 'r') as f:
        for line in f:
            parts = line.strip().split(',')
            if parts[0] == router_ip_address:
                print(parts)
                port, username, password, command, db_host, db_user, db_pass, db_name, db_table  = int(parts[1]),parts[2], parts[3], parts[4], parts[5], parts[6], parts[7], parts[8], parts[9]
                break
        else:
            print(f'No login credentials found for ROUTER IP address {router_ip_address}')
            return 0


    # establish connection to MySQL database
    root_db = mysql.connector.connect(
        host=db_host,
        user=db_user,
        password=db_pass        
    )

    root_cursor = root_db.cursor()

    # Check if the database and table already exist
    root_cursor.execute(f"SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '{db_name}'")
    result = root_cursor.fetchone()
    if result is not None:
        print(f"The '{db_name}' database already exists.")

        # Connect to the logs database
        db = mysql.connector.connect(
            host=db_host,
            user=db_user,
            password=db_pass,
            database=db_name           
        )

        # Create a cursor object to execute SQL queries
        cursor = db.cursor()

        # Check if the table already exists
        cursor.execute(f"SHOW TABLES LIKE '{db_table}'")
        result = cursor.fetchone()
        if result is not None:
            print(f"The '{db_table}' table already exists.")
            cursor.close()
            db.close()
            return 1

        # If the table does not exist, create it
        cursor.execute(f"CREATE TABLE {db_table} (id INT AUTO_INCREMENT PRIMARY KEY, mac_address VARCHAR(26), ip_address VARCHAR(15), dhcp_lease TIMESTAMP, time_stamp TIMESTAMP)")

        # Commit the changes to the database
        db.commit()

        # Close the cursor and database connection
        cursor.close()
        db.close()

        print(f"The '{db_table}' table has been created.")
    else:
        # If the logs database does not exist, create it
        root_cursor.execute(f"CREATE DATABASE {db_name}")
        print(f"The '{db_name}' database has been created.")

        # Connect to the logs database
        db = mysql.connector.connect(
            host=db_host,
            user=db_user,
            password=db_pass,
            database=db_name
        )

        # Create a cursor object to execute SQL queries
        cursor = db.cursor()

        # Create the logs_data table with mac_address, ip_address, and time_stamp columns
        cursor.execute(f"CREATE TABLE {db_table} (id INT AUTO_INCREMENT PRIMARY KEY, mac_address VARCHAR(26), ip_address VARCHAR(15), dhcp_lease TIMESTAMP, time_stamp TIMESTAMP)")

        # Commit the changes to the database
        db.commit()

        # Close the cursor and database connection
        cursor.close()
        db.close()

        print(f"The '{db_name}' database and '{db_table}' table have been created.")
    return 2

