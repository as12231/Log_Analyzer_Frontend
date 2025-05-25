log_content = """
2025-05-24 10:00:00,001 - INFO - Starting application
2025-05-24 10:01:10,202 - DEBUG - Loaded configuration file
2025-05-24 10:02:15,404 - INFO - User login successful: user_id=123
2025-05-24 10:03:20,607 - WARNING - Disk space running low
2025-05-24 10:04:25,809 - ERROR - Failed to connect to database
2025-05-24 10:05:30,012 - INFO - Retrying database connection
2025-05-24 10:06:35,214 - INFO - Database connection established
2025-05-24 10:07:40,417 - DEBUG - Query executed: SELECT * FROM users
2025-05-24 10:08:45,619 - INFO - User logout: user_id=123
2025-05-24 10:09:50,822 - INFO - Shutting down application
""".strip()

# Save the log content to a file
file_path = "/mnt/data/sample_app.log"
with open(file_path, "w") as f:
    f.write(log_content)
