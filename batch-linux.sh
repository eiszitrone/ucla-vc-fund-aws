#! /bin/bash

sudo phantomjs getID.js 0 https://angel.co/university-of-california-los-angeles
sudo bash -c 'echo -n "," >> result/0.txt'
sudo phantomjs getID.js 1 https://angel.co/ucla-anderson-school-of-management-1
sudo bash -c 'echo -n "," >> result/1.txt'
sudo phantomjs getID.js 2 https://angel.co/ucla-school-of-law-1
sudo bash -c 'echo -n "," >> result/2.txt'
sudo phantomjs getID.js 3 https://angel.co/ucla-law
sudo bash -c 'echo -n "," >> result/3.txt'
sudo phantomjs getID.js 4 https://angel.co/ucla-extension
sudo bash -c 'echo -n "," >> result/4.txt'
sudo phantomjs getID.js 5 https://angel.co/ucla-school-of-theater-film-and-television
sudo bash -c 'echo -n "," >> result/5.txt'
sudo phantomjs getID.js 6 https://angel.co/ucla-2
sudo bash -c 'echo -n "," >> result/6.txt'
sudo phantomjs getID.js 7 https://angel.co/university-of-california-extension-los-angeles
sudo bash -c 'echo -n "," >> result/7.txt'
cd result
sudo bash -c 'cat 0.txt 1.txt 2.txt 3.txt 4.txt 5.txt 6.txt 7.txt > result.txt'
