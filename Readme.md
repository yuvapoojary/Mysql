# Mysql Query
### Query mysql in json syntax 

## API
### Properties
* tables 
* options
* pool
### Methods
* createPool
* registerTable
* getTable

### Example
```js
const mysql = require('mysql-query');
mysql.createPool(...config);

mysql.registerTable(['users', 'orders']);
mysql.registerTable('transactions');

const users = mysql.getTable('users');

users.findOne({});
users.find();
users.insertOne();
users.updateOne();
users.updateMany();
users.count();
users.join();

users.find({ username: 'rock' })
.select('username createdAt')
.skip(10)
.limit(20)
.sort({ username: 1 , createdAt: -1 });

```
