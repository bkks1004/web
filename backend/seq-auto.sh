#!/bin/bash
sequelize-auto -o "./models" -d my_db -h localhost -u root -p 3306 -x test123 -e mysql --noInitModels;
