from app import app
app.env = 'development'
app.secret_key = '12345679hfdsjkl'
app.run(port=5000, host='localhost', debug=True)
