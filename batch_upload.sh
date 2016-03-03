#! /bin/bash

phantomjs getID.js 0 https://angel.co/university-of-california-los-angeles
echo -n "," >> result/0.txt
phantomjs getID.js 1 https://angel.co/ucla-anderson-school-of-management-1
echo -n "," >> result/1.txt
phantomjs getID.js 2 https://angel.co/ucla-school-of-law-1
echo -n "," >> result/2.txt
phantomjs getID.js 3 https://angel.co/ucla-law
echo -n "," >> result/3.txt
phantomjs getID.js 4 https://angel.co/ucla-extension
echo -n "," >> result/4.txt
phantomjs getID.js 5 https://angel.co/ucla-school-of-theater-film-and-television
echo -n "," >> result/5.txt
phantomjs getID.js 6 https://angel.co/ucla-2
echo -n "," >> result/6.txt
phantomjs getID.js 7 https://angel.co/university-of-california-extension-los-angeles
echo -n "," >> result/7.txt
cd result
cat 0.txt 1.txt 2.txt 3.txt 4.txt 5.txt 6.txt 7.txt > result.txt
cd ..
scp -i uclaVCfund-angellist.pem result/result.txt ubuntu@52.32.83.104:~/.
