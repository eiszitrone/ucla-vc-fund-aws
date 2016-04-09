#export data on local machine and push to AWS
mongoexport -d angellist-crawler -c startups -o outfile.json
scp -i uclaVCfund-angellist.pem outfile.json ubuntu@52.32.83.104:~/.
